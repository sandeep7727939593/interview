/**
 * Seed script — bulk-loads interview questions into MongoDB.
 *
 * Usage:
 *   node scripts/seed.mjs            # insert seed questions (skips duplicates)
 *   node scripts/seed.mjs --fresh    # wipe the collection first, then insert
 *
 * Reads MONGODB_URI from .env.local / .env.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// ── Load env (.env.local then .env) without extra deps ──────────────
function loadEnv(file) {
  const p = path.join(root, file);
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith("#")) continue;
    let val = m[2].trim().replace(/^["']|["']$/g, "");
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}
loadEnv(".env.local");
loadEnv(".env");

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("✖ MONGODB_URI not set (.env.local). Aborting.");
  process.exit(1);
}

// ── Question model (matches app/models/Question.js) ─────────────────
const QuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "react" },
  },
  { timestamps: true }
);
const Question =
  mongoose.models.Question || mongoose.model("Question", QuestionSchema);

// ── Collect seed data ───────────────────────────────────────────────
const SEED_DIR = process.env.SEED_DIR || path.join(root, "scripts", "seed-data");
const CATEGORIES = [
  "react", "javascript", "nodejs", "nestjs",
  "typescript", "python", "nextjs", "ai", "aws",
];

function readSeed() {
  const all = [];
  for (const cat of CATEGORIES) {
    const file = path.join(SEED_DIR, `seed-${cat}.json`);
    if (!fs.existsSync(file)) {
      console.warn(`  ! skipping missing file: seed-${cat}.json`);
      continue;
    }
    const items = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const it of items) {
      if (it?.question && it?.answer) {
        all.push({ question: it.question, answer: it.answer, category: it.category || cat });
      }
    }
    console.log(`  • seed-${cat}.json → ${items.length}`);
  }
  return all;
}

async function main() {
  const fresh = process.argv.includes("--fresh");
  console.log(`\nConnecting to MongoDB…`);
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });

  const data = readSeed();
  console.log(`\nTotal seed questions: ${data.length}`);

  if (fresh) {
    const del = await Question.deleteMany({});
    console.log(`Wiped existing collection (${del.deletedCount} removed).`);
  }

  // Skip questions that already exist (idempotent by question text)
  const existing = new Set(
    (await Question.find({}, { question: 1 }).lean()).map((q) => q.question)
  );
  const toInsert = data.filter((q) => !existing.has(q.question));

  if (toInsert.length === 0) {
    console.log("Nothing new to insert — all questions already present.");
  } else {
    await Question.insertMany(toInsert, { ordered: false });
    console.log(`Inserted ${toInsert.length} new questions (skipped ${data.length - toInsert.length} duplicates).`);
  }

  // Per-category summary
  console.log("\nCounts by category:");
  for (const cat of CATEGORIES) {
    const n = await Question.countDocuments({ category: cat });
    console.log(`  ${cat.padEnd(12)} ${n}`);
  }
  const total = await Question.countDocuments();
  console.log(`  ${"TOTAL".padEnd(12)} ${total}`);

  await mongoose.disconnect();
  console.log("\n✓ Done.");
}

main().catch((err) => {
  console.error("✖ Seed failed:", err);
  process.exit(1);
});
