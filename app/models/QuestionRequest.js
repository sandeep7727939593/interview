import mongoose from "mongoose";

// A user-submitted request for the admin to add a question to the bank.
// Often pre-filled with an AI (Grok) generated answer.
const QuestionRequestSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, default: "" },
    category: { type: String, default: "general" },
    status: { type: String, default: "pending" }, // pending | approved | rejected
    source: { type: String, default: "user" }, // user | ai
  },
  { timestamps: true }
);

export default mongoose.models.QuestionRequest ||
  mongoose.model("QuestionRequest", QuestionRequestSchema);
