# 💸 Ritchie Invest Dashboard (React) 💸

Administrative web interface for managing learning content of Ritchie Invest (chapters, lessons, and gamified
multiple‑choice modules). Built with React + TypeScript and served as a static SPA (Vite build, Nginx container).

> Scope: Content & structure management (chapters → lessons → MCQ game modules) and basic authenticated access. No
> end‑user learning experience here (handled by other apps).

---

## 🧭 Table of Contents

- [Tech Stack](#-tech-stack)
- [Environment Variables](#-environment-variables)
- [Getting Started (Local)](#-getting-started-local)
- [Troubleshooting](#-troubleshooting)
- [Authors](#-authors)

---

## 💻 Tech Stack

- Framework: React 19
- Language: TypeScript 5
- Bundler / Dev Server: Vite 6
- Styling: Tailwind CSS 4 (via `@tailwindcss/vite` plugin)
- Forms & Validation: `react-hook-form` + `zod`
- Data Fetching / Caching: TanStack Query 5
- Tables: TanStack Table 8
- Routing: React Router 7
- UI Primitives: Radix UI components
- Charts: Recharts
- Drag & Drop: DnD Kit
- Notifications: Sonner
- Auth (frontend): sessionStorage access token + refresh via `fetch` with `credentials: 'include'`
- Package Manager: pnpm (Node >= 22.16.0)

---

## 🚀 Getting Started (Local)

1. Clone the repository:

```bash
git clone <repo-url>
cd ritchie-invest-admin
``` 

2. Install dependencies:

```bash
pnpm install
```

3. Copy environment template:

```bash
cp .env.example .env

# Edit values as needed
```

4. Start dev server:

```bash
pnpm dev
```

5. Access at http://localhost:5173

---

## 🔧 Environment Variables

Defined in `.env.example` (copy to `.env`).

| Name                | Required            | Purpose                                                                            | Default (fallback in code) |
|---------------------|---------------------|------------------------------------------------------------------------------------|----------------------------|
| `VITE_API_BASE_URL` | Yes (for non-local) | Base URL of the backend API (protocol added if missing; trailing slashes trimmed). | `http://localhost:3000`    |

---

## 🐛 Troubleshooting

| Symptom                  | Hint                                                                                           |
|--------------------------|------------------------------------------------------------------------------------------------|
| 401 loops then redirect  | Backend refresh endpoint failing or cookies blocked (check CORS + `credentials`).              |
| Empty lists after create | Ensure backend returns either raw array or wrapped array as expected.                          |
| Wrong API base URL       | Confirm `VITE_API_BASE_URL` (watch for missing protocol; code auto-adds `https://` if absent). |

---

## 👤 Authors

- Maxence BREUILLES ([@MisterAzix](https://github.com/MisterAzix))
- Benoît FAVRIE ([@benoitfvr](https://github.com/benoitfvr))
- Doriane FARAU ([@DFarau](https://github.com/DFarau))
- Charles LAMBRET ([@CharlesLambret](https://github.com/CharlesLambret))
- Antonin CHARPENTIER ([@toutouff](https://github.com/toutouff))

