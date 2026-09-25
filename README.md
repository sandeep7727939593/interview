# InterviewWithJangir

A focused interview-preparation platform built with Next.js. It provides a topic-based question bank with concise, code-backed answers for modern software engineering interviews, plus an AI-powered CV analyzer for personalized preparation.

## Features

- 500+ interview questions across 9 technology tracks
- Topic-wise preparation for React, JavaScript, Node.js, NestJS, TypeScript, Python, Next.js, AI/ML, and AWS
- Dedicated question routes such as `/questions/all` and `/questions/<topic>`
- AI-powered CV analyzer
- Responsive UI for desktop, tablet, and mobile
- Light/dark theme support
- MongoDB-backed question storage with Mongoose
- Seed scripts for initial and fresh database loading
- Admin question management support

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 |
| UI | React 19 |
| Language | TypeScript |
| Database | MongoDB |
| ODM | Mongoose 9 |
| Styling | Tailwind CSS 4 + custom CSS |
| Icons | Lucide React |
| PDF processing | unpdf |
| Linting | ESLint 9 |
| Deployment support | Vercel / Netlify |

## Interview Tracks

| Topic | Configured Questions |
| --- | ---: |
| React | 60 |
| JavaScript | 60 |
| Node.js | 60 |
| NestJS | 60 |
| TypeScript | 55 |
| Python | 55 |
| Next.js | 50 |
| AI / ML | 50 |
| AWS | 50 |
| **Total configured** | **500** |

These counts come from the current application configuration. The database may contain a different number depending on the current seed data.

## Topics Covered

- **React** — components, hooks, rendering, and performance
- **JavaScript** — closures, async programming, prototypes, and the event loop
- **Node.js** — APIs, streams, the event loop, and scaling
- **NestJS** — modules, dependency injection, guards, and microservices
- **TypeScript** — types, generics, and utility types
- **Python** — OOP, generators, async programming, and the GIL
- **Next.js** — App Router, SSR/SSG, and server actions
- **AI / ML** — ML, LLMs, RAG, and transformers
- **AWS** — EC2, S3, Lambda, IAM, and VPC

## AI CV Analyzer

The landing page includes a `CvAnalyzer` component designed to analyze a resume and generate a tailored interview-preparation plan based on the candidate's experience.

Keep AI/provider credentials in secure environment variables or runtime configuration.

## Database & Seeding

Questions are stored in MongoDB through Mongoose.

Seed data is organized by category under `scripts/seed-data/`:

```text
seed-react.json
seed-javascript.json
seed-nodejs.json
seed-nestjs.json
seed-typescript.json
seed-python.json
seed-nextjs.json
seed-ai.json
seed-aws.json
```

The seed script loads `MONGODB_URI`, reads the category files, validates records, skips existing questions by question text, supports a fresh reset mode, prints category/total counts, and disconnects from MongoDB.

## Project Structure

```text
.
├── app/
│   ├── components/
│   ├── routes and application code
│   └── page.tsx
├── scripts/
│   ├── seed.mjs
│   └── seed-data/
├── public/
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm, pnpm, yarn, or Bun
- MongoDB

### Clone

```bash
git clone https://github.com/sandeep7727939593/interview.git
cd interview
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create `.env.local`:

```env
MONGODB_URI=your-mongodb-connection-string
```

Do not commit secrets.

### Start development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Insert seed questions and skip existing questions |
| `npm run seed:fresh` | Clear the question collection and reload seed data |

> **Warning:** `npm run seed:fresh` deletes existing documents from the question collection used by the seed script.

## Routes

```text
/questions/all
/questions/react
/questions/javascript
/questions/nodejs
/questions/nestjs
/questions/typescript
/questions/python
/questions/nextjs
/questions/ai
/questions/aws
```

## UI & UX

The application includes animated technology highlights, question statistics, topic cards, an FAQ accordion, responsive layouts, theme switching, clear practice actions, and Lucide-based icons.

## Deployment

### Vercel

Deploy as a Next.js application and configure the required production environment variables in the Vercel project settings.

### Netlify

The project includes `@netlify/plugin-nextjs` for Netlify deployment support.

Configure MongoDB and AI/CV-related environment variables securely in production.

## Security Notes

- Never commit `.env.local` or credentials.
- Use a restricted MongoDB user in production.
- Store secrets in your hosting provider's environment-variable system.
- Review admin authentication and authorization before exposing content-management functionality publicly.

## Project Status

InterviewWithJangir contains a multi-topic interview question bank, MongoDB-backed question storage, seed utilities, responsive UI, theme support, and an AI CV-analysis workflow.

## Future Improvements

- User progress tracking
- Bookmarks and saved questions
- Mock interview mode
- Difficulty filtering
- Personalized study plans
- Interview analytics
- Automated tests and CI
- Expanded AI-assisted workflows

## Author

**Sandeep Kumar Jangir**

GitHub: https://github.com/sandeep7727939593

## License

No explicit open-source license is currently documented in this repository. Applicable copyright remains with the repository owner unless a license is added.
