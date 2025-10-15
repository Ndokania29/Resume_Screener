# Smart Resume Screener

Lightweight ATS-like system that parses resumes (PDF/Text), extracts skills, and matches candidates against job descriptions using an LLM (Gemini). Includes a production-ready Node.js backend and a React (Vite) frontend.

## Features
- Multi-tenant: segregates data by `companyId`
- Role-based access: `hr` / `admin`
- Auth (JWT): signup, login
- Jobs CRUD: create, list, get, delete
- Resume upload: PDF (buffer) or text, structured parsing, LLM scoring
- Frontend dashboard: login, signup, jobs, resume upload, resume list with ATS score

## Tech
- Backend: Node.js, Express, MongoDB, JWT, Multer, pdf-parse, Gemini API
- Frontend: React 19 + Vite, React Router

## Setup
1) Prereqs: Node 18+, MongoDB, Gemini API key

2) Backend env `.env` (in `backend/`):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart_resume
JWT_SECRET=supersecret
GEMINI_API_KEY=your_gemini_key
```

3) Install and run
```
cd backend && npm install && npm run start
cd ../frontend && npm install && npm run dev
```

Vite dev server proxies `/api` to `http://localhost:5000`.

## API Endpoints
- Auth
  - POST `/api/auth/signup` { name, email, password, role, companyId }
  - POST `/api/auth/login` { email, password } -> { token, user }
- Jobs (protected hr/admin)
  - POST `/api/jobs` { title, description, skills[] }
  - GET `/api/jobs`
  - GET `/api/jobs/:id`
  - DELETE `/api/jobs/:id`
- Resumes (protected hr/admin)
  - POST `/api/resumes/upload` (multipart: `resumePdf`) or JSON `{ jobId, email, resumeText }`
  - GET `/api/resumes/job/:jobId`
  - GET `/api/resumes/:resumeId`
  - GET `/api/resumes/download/:resumeId`

Authorization header: `Bearer <token>`

## LLM Prompt (Gemini)
The scorer sends resume and job description with strict JSON schema request. See `backend/src/utils/llmScorer.js`.

## Demo Login
- HR: email `hr@example.com`, password `123456` (create via Signup page)

## Notes
- PDF extraction accepts Buffer for multer uploads.
- `candidateName` is derived from parsed text or email prefix if missing.
- `jobId` can be provided via body, query, or params in upload route.

