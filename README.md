# SpeakTech MVP

AI-powered educational platform for middle school students to practice spoken English in tech scenarios with Techy.

## Stack

- Next.js (App Router) + React + TypeScript + TailwindCSS
- Clerk authentication (email/password + Google)
- Prisma + PostgreSQL
- OpenAI for conversation + Realtime token setup
- ElevenLabs for text-to-speech

## Features in this MVP

- Authentication and protected app routes
- Three conversation scenarios
- Session-based AI conversation turns
- Friendly feedback in `Wrong / Better / Why` format
- Tech Vocabulary Match mini game
- Progress dashboard with sessions, mistakes, vocabulary, and game completion

## Quick start

1. Copy `.env.example` to `.env.local` and fill keys.
2. Install dependencies:
   - `npm install` (or your configured Node package manager)
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Run migrations:
   - `npm run prisma:migrate`
5. Seed scenarios and vocabulary:
   - `npm run prisma:seed`
6. Start dev server:
   - `npm run dev`

## Deployment (Vercel)

- Deploy project to Vercel.
- Set environment variables from `.env.example`.
- Run Prisma migrations during deployment pipeline.
- Use managed Postgres (Neon/Supabase/RDS).
