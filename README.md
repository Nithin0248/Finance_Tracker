# 💰 FinTrack – Personal Finance Tracker

A full-stack app to record income and expenses, filter them, and see where your money goes.

**Live demo:**finance-tracker-hacker-74e1.vercel.app· **API:**https://finance-tracker-w71e.onrender.com

## Screenshots
_Add 2–3 screenshots here (login, dashboard on desktop, dashboard on mobile)._

## Features
- Register / login with JWT authentication, protected routes, auto-logout on expired token
- Add income and expenses (category, amount, date, note) with validation on both client and server
- Delete transactions with instant (optimistic) UI updates and rollback on failure
- Filter by type, category and date range; cards and charts update instantly
- Summary cards: total income, total expenses, balance
- Pie chart (expenses by category) and bar chart (monthly income vs expense)
- Export all transactions as CSV
- Toast notifications, loading spinner, responsive layout (mobile, tablet, desktop)

## Tech stack
| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS 4, React Router, Axios, Recharts, react-hot-toast |
| Backend | Spring Boot 4, Spring Security, JWT (jjwt), Spring Data MongoDB, Bean Validation |
| Database | MongoDB Atlas |
| Hosting | Vercel (frontend), Render (backend) |

## Architecture
```
React (Vercel)  --HTTPS + JSON + Bearer JWT-->  Spring Boot API (Render)  -->  MongoDB Atlas
```
Backend layers: `controller` (HTTP) → `service` (business rules) → `repository` (database).
Every transaction stores the owner's email taken from the JWT, and every query filters by it,
so users can only ever read or delete their own data.

## API
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | no | Create account, returns token |
| POST | `/api/auth/login` | no | Returns token |
| GET | `/api/transactions` | yes | List your transactions (newest first) |
| POST | `/api/transactions` | yes | Add a transaction |
| DELETE | `/api/transactions/{id}` | yes | Delete one of your transactions |
| GET | `/api/transactions/export` | yes | Download CSV |

## Run locally
**Backend** (needs Java 17 and a MongoDB Atlas URI)
```bash
cd server
cp src/main/resources/application.properties.example src/main/resources/application.properties
# edit MongoDB URI + jwt.secret, then:
./mvnw spring-boot:run
```
**Frontend**
```bash
cd client
cp .env.example .env
npm install
npm run dev        # http://localhost:5173
```

## Deployment

### 1. Database – MongoDB Atlas
Create a free M0 cluster, a database user, and under *Network Access* allow `0.0.0.0/0`
(Render's IP addresses change). Copy the connection string.

### 2. Backend – Render
1. Push the repo to GitHub.
2. Render → **New → Web Service** → pick the repo, set **Root Directory** to `server`, **Runtime** to **Docker**.
3. Add environment variables:

| Name | Value |
|---|---|
| `MONGODB_URI` | your Atlas connection string |
| `JWT_SECRET` | a long random string (32+ chars), e.g. `openssl rand -base64 48` |
| `CORS_ORIGINS` | your Vercel URL, e.g. `https://fintrack.vercel.app` (comma-separate several) |

4. Deploy. Test: `https://<your-service>.onrender.com/api/transactions` should return `401`.
Free Render services sleep when idle, so the first request can take ~30–60 s.

### 3. Frontend – Vercel
1. Vercel → **Add New → Project** → pick the repo, set **Root Directory** to `client`.
2. Framework preset: Vite. Add the environment variable
   `VITE_API_URL = https://<your-service>.onrender.com/api`
3. Deploy. `vercel.json` makes page refreshes on `/dashboard` work.
4. Go back to Render and make sure `CORS_ORIGINS` exactly matches the Vercel URL (no trailing slash), then redeploy.

## Security notes
- Passwords are hashed with BCrypt; never stored in plain text.
- Secrets live in environment variables, not in Git (`application.properties` and `.env` are git-ignored).
- CSV export neutralises spreadsheet formula injection.
- The JWT is kept in `localStorage` for simplicity; for a production app consider httpOnly cookies.

## Possible next steps
Edit transactions, budgets per category, recurring transactions, server-side pagination, unit/integration tests.
