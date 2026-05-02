# ResuAI — AI-Powered Resume Analyzer

> Transform your resume into a career catalyst with AI-driven insights, ATS optimization, and personalized coaching.

---

## ✨ Features

- **ATS Score Analysis** — Check how well your resume passes Applicant Tracking Systems
- **Keyword Gap Analysis** — Identify missing keywords based on job descriptions
- **Achievement-Focused Rewrites** — Transform plain duties into impactful bullet points
- **Interview Prep** — Get likely interview questions based on your resume
- **Smart Career Coaching** — Personalized tips based on your experience level
- **Resume Upload History** — View all past analyses on your profile
- **Secure Authentication** — JWT-based login and registration with Supabase Auth

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Backend | Supabase (PostgreSQL + Auth) |
| Edge Functions | Deno (Supabase Edge Functions) |
| AI Model | Google Gemini (via Lovable AI Gateway) |
| State Management | TanStack Query |

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── analysis/         # Analysis result components
│   ├── ui/               # shadcn/ui components
│   ├── NavLink.tsx
│   ├── ProtectedRoute.tsx
│   └── ResumeInput.tsx
├── hooks/
│   └── useAuth.tsx       # Auth context and hooks
├── pages/
│   ├── Index.tsx         # Home page
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Profile.tsx       # User profile + resume history
supabase/
└── functions/
    ├── analyze-resume/   # AI analysis edge function
    └── parse-resume/     # PDF parsing edge function
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Gemini AI API key

### Installation

```bash
# Clone the repo
git clone https://github.com/Devarsh-soni-git/ResuAI.git

# Navigate into the project
cd ResuAI

# Install dependencies
npm install

# Start the dev server
npm run dev
```

### Environment Variables

Create a `.env` file at the root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### Supabase Setup

Run this SQL in your Supabase SQL Editor:

```sql
create table public.resume_uploads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  resume_text text not null,
  job_description text,
  analysis jsonb,
  created_at timestamp with time zone default now()
);

alter table public.resume_uploads enable row level security;

create policy "Users can only access their own uploads"
on public.resume_uploads for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

---

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- JWT-based authentication via Supabase Auth
- Environment variables for all sensitive keys
- Edge functions handle AI processing server-side

---

## 📦 Deployment

This project can be deployed on:
- **Vercel** — `npm run build` then deploy `/dist`
- **Netlify** — connect repo and set build command to `npm run build`
- **Lovable** — push changes and deploy directly

---

## 👨‍💻 Author

**Devarsh Soni**
- GitHub: [@Devarsh-soni-git](https://github.com/Devarsh-soni-git)


---


