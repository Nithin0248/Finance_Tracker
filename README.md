# 💰 FinTrack: Personal Finance Tracker

A full-stack web app to record income and expenses, filter them, and see where your money goes, with charts, summary cards and CSV export.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4-6DB33F?logo=springboot&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

**Live demo:** https://finance-tracker-hacker-74e1.vercel.app
**Backend API:** https://finance-tracker-w71e.onrender.com

> The backend runs on a free Render instance that sleeps when idle. The first request after a break can take 30 to 60 seconds.

---

## Table of contents
1. [Introduction](#1-introduction)
2. [Research](#2-research)
3. [Tech stack and the reason](#3-tech-stack-and-the-reason)
4. [Libraries used](#4-libraries-used)
5. [Functionality with screenshots](#5-functionality-with-screenshots)
6. [Project structure](#6-project-structure)
7. [API reference](#7-api-reference)
8. [Run it locally](#8-run-it-locally)
9. [Deployment](#9-deployment)
10. [Conclusion](#10-conclusion)

---

## 1. Introduction

Most people have no clear picture of where their money goes each month. Spreadsheets work, but they are slow to update and hard to read at a glance. **FinTrack** solves this with a simple, secure web app:

- Create an account and log in securely.
- Add every income and expense in a few seconds.
- See totals, a category breakdown and a monthly trend immediately.
- Filter by type, category and date range.
- Export everything to CSV for backup or for an accountant.

### Key features
| Area | What it does |
|---|---|
| Authentication | Register and login with JWT, protected routes, automatic logout when the token expires |
| Transactions | Add income or expense with category, amount, date and note. Delete with instant UI update |
| Dashboard | Greeting, summary cards (income, expenses, balance), recent transactions |
| Charts | Pie chart of expenses by category, bar chart of monthly income against expenses |
| Filters | By type, category and date range. Cards and charts update instantly |
| Export | Download all transactions as a CSV file |
| UX | Toast notifications, loading spinner, validation on client and server, mobile-friendly layout |
| Security | BCrypt password hashing, per-user data isolation, secrets kept in environment variables |

---

## 2. Research

Before writing code I worked out the problem, the users, and the design choices.

### 2.1 Problem statement
A user needs a fast way to record money in and out, and a clear view of spending habits, without installing anything. The data must be private to each user.

### 2.2 Requirements (use cases)
| # | Use case | Why it matters |
|---|---|---|
| 1 | Register and login | Every user needs private data, so authentication comes first |
| 2 | Add income or expense | The core create operation of the app |
| 3 | View charts and summary | Turns raw records into insight |
| 4 | Delete a transaction | Fix mistakes. Needs UI and database to stay in sync |
| 5 | Filter by category or date | Analyse a specific period or category |
| 6 | Transaction history | Review past records, newest first |
| 7 | Mobile access | People record expenses on the go |
| 8 | Logout and secure routes | Protect sensitive data |
| 9 | Export to CSV (bonus) | Backup, and file generation from the backend |

### 2.3 Design decisions I compared
| Decision | Options considered | Chosen | Reason |
|---|---|---|---|
| Authentication | Server sessions, JWT, Clerk/Auth0 | **JWT** | Stateless, so it scales and works well when frontend and backend are hosted separately. Building it myself teaches how it really works |
| Database | MySQL/PostgreSQL, MongoDB | **MongoDB Atlas** | A transaction is one self-contained document, there are few relations, and Atlas has a free hosted tier |
| Charts | Chart.js, Recharts | **Recharts** | Built for React components, responsive containers out of the box |
| State management | Redux, Context API | **Context API** | Only the login state is shared globally, so Redux would be overkill |
| Styling | Plain CSS, Bootstrap, Tailwind | **Tailwind CSS** | Utility classes make responsive design (`sm:`, `md:`, `lg:`) quick |
| Formatting dates and money | moment.js, Intl API | **Intl API** | Built into the browser, so no extra dependency |
| Hosting | Vercel + Render, Railway | **Vercel + Render** | Free tiers, GitHub integration, Docker support on Render |

### 2.4 Security research
| Risk | How the app handles it |
|---|---|
| Stolen database | Passwords are stored as BCrypt hashes, never as plain text |
| One user reading another's data | The user identity comes from the verified JWT, and every query filters by the owner |
| Forged tokens | Tokens are signed with a secret key and checked on every request |
| Bad input | Server-side validation with Bean Validation, plus client-side checks |
| Cross-origin abuse | CORS allows only the configured frontend origins |
| Leaked secrets | Database URL, JWT secret and allowed origins live in environment variables |
| Spreadsheet formula injection | The CSV export neutralises cells starting with `=`, `+`, `-` or `@` |
| Money rounding errors | Amounts use `BigDecimal`, stored as Decimal128 |

### 2.5 Architecture

```
┌────────────────────┐   HTTPS + JSON + Bearer JWT   ┌──────────────────────┐        ┌───────────────┐
│  React (Vercel)    │ ────────────────────────────▶ │  Spring Boot (Render)│ ─────▶ │ MongoDB Atlas │
│  Tailwind, Recharts│ ◀──────────────────────────── │  REST API + Security │ ◀───── │               │
└────────────────────┘                               └──────────────────────┘        └───────────────┘
```

**Backend layers:** `Controller` (HTTP) → `Service` (business rules) → `Repository` (database), with `DTO` classes defining what goes in and out.

**Login flow:**
1. User sends email and password to `POST /api/auth/login`.
2. Server checks the password against the BCrypt hash.
3. Server creates a JWT (`header.payload.signature`) containing the email and an expiry time.
4. React stores the token and an Axios interceptor adds `Authorization: Bearer <token>` to every request.
5. `JwtAuthFilter` verifies the token on each request and sets the current user.
6. Controllers read the user from the security context, never from the request body.

**Data model**

`users`: `id`, `name`, `email` (unique), `password` (BCrypt hash)

`transactions`: `id`, `userEmail`, `type` (INCOME or EXPENSE), `category`, `amount` (Decimal128), `note`, `date`, with an index on `userEmail` and `date`.

---

## 3. Tech stack and the reason

| Layer | Technology | Why this choice |
|---|---|---|
| Frontend | **React 19** | Component-based UI, and state updates redraw only what changed |
| Build tool | **Vite** | Very fast dev server and builds |
| Styling | **Tailwind CSS 4** | Utility-first, responsive without writing separate CSS files |
| Backend | **Spring Boot 4 (Java 17)** | Production-ready REST framework with auto-configuration and a mature security module |
| Security | **Spring Security + JWT** | Stateless authentication and route protection |
| Database | **MongoDB Atlas** | Document model fits a transaction, hosted and free to start |
| Charts | **Recharts** | React-native chart components |
| Containers | **Docker** | The backend builds and runs the same way everywhere, including on Render |
| Hosting | **Vercel** (frontend), **Render** (backend) | Free tiers with automatic deploys from GitHub |

---

## 4. Libraries used

### Frontend (`client/`)
| Library | What it does | Where it is used |
|---|---|---|
| `react`, `react-dom` | UI components and rendering | The whole app |
| `react-router-dom` | Client-side routing between `/login`, `/register`, `/dashboard` | `App.jsx`, `ProtectedRoute.jsx` |
| `axios` | HTTP client with interceptors (attach token, handle expiry) | `api.js` |
| `recharts` | Pie and bar charts | `CategoryPieChart.jsx`, `MonthlyBarChart.jsx` |
| `react-hot-toast` | Success and error notifications | `main.jsx`, `Dashboard.jsx`, `AuthForm.jsx` |
| `tailwindcss`, `@tailwindcss/vite` | Utility-first styling | Every component |
| `vite`, `@vitejs/plugin-react` | Dev server and production build | `vite.config.js` |
| Browser `Intl` API | Currency (₹, en-IN) and date formatting | `utils/format.js` |

### Backend (`server/`)
| Library | What it does | Where it is used |
|---|---|---|
| `spring-boot-starter-webmvc` | REST controllers and JSON | `controller/` |
| `spring-boot-starter-security` | Authentication, authorisation, CORS, BCrypt | `security/` |
| `spring-boot-starter-data-mongodb` | Repositories and document mapping | `model/`, `repository/` |
| `spring-boot-starter-validation` | `@NotNull`, `@DecimalMin`, `@Size`, `@Email` on request DTOs | `dto/` |
| `jjwt` (api, impl, jackson) | Create, sign and verify JWTs | `security/JwtUtil.java` |

---

## 5. Functionality with screenshots

> Screenshots live in `docs/screenshots/`. Replace each placeholder with your own capture.

### 5.1 Register and login
![Login and register screens](docs/screenshots/01-auth.png)

- A new user registers with name, email and a password of at least 6 characters. An existing user logs in with email and password.
- Errors (wrong password, email already registered, server unreachable) appear inline on the form.
- **Behind the scenes:** the server hashes the password with BCrypt and returns a signed JWT. React stores it and every later request carries it.

### 5.2 Dashboard overview
![Dashboard overview](docs/screenshots/02-dashboard.png)

- A greeting with the user's name, three summary cards (**Total income**, **Total expenses**, **Balance**), charts, and the transaction list.
- The balance card turns red when expenses exceed income.
- Unauthenticated visitors are redirected to the login page by `ProtectedRoute`.

### 5.3 Add a transaction
![Add transaction form](docs/screenshots/03-add-transaction.png)

- Choose **Expense** or **Income**, pick a category (the list changes with the type), enter the amount, date and an optional note.
- Client-side validation checks the amount and date before sending. The server validates again.
- **Behind the scenes:** `POST /api/transactions` stores the record against the logged-in user. The new row, the cards and the charts update immediately without reloading.

### 5.4 Filters
![Filters](docs/screenshots/04-filters.png)

- Filter by type, category and a from/to date range. A **Clear filters** link appears when any filter is active.
- Cards, charts and the list all react to the filter at the same time.
- **Behind the scenes:** transactions are loaded once and filtered in the browser with `useMemo`, so there is no extra API call.

### 5.5 Charts
![Pie and bar charts](docs/screenshots/05-charts.png)

- **Pie chart:** expenses grouped by category, so you can see which category costs the most.
- **Bar chart:** income against expenses for the last six months.
- Hovering shows exact amounts formatted as currency.

### 5.6 Transaction list, delete and CSV export
![Transaction list and export](docs/screenshots/06-list-export.png)

- Newest first, with colour-coded amounts (green for income, red for expense). The list shows 10 at a time with a **Show more** button.
- **Delete** removes the row instantly (optimistic update). If the server fails, the row is restored and an error toast appears.
- **Export CSV** downloads all of the user's transactions as `transactions.csv`.

### 5.7 Responsive layout
![Mobile layout](docs/screenshots/07-mobile.png)

- On phones the summary cards stack, the add form moves above the charts, and the charts resize to the screen.
- On tablets and desktops the layout becomes a multi-column grid using Tailwind's `sm:`, `md:` and `lg:` breakpoints.

### 5.8 Feedback and validation
![Toast notifications](docs/screenshots/08-toasts.png)

- Toast notifications confirm every action (added, deleted, welcome back) and explain failures.
- A loading spinner shows while data is fetched.
- Server errors always come back as `{"error": "..."}`, so the UI can show a clear message.

---

## 6. Project structure

```
finance-tracker/
├── client/                         # React frontend
│   ├── src/
│   │   ├── main.jsx                # Router, AuthProvider, Toaster
│   │   ├── App.jsx                 # Routes
│   │   ├── ProtectedRoute.jsx      # Redirects to /login without a token
│   │   ├── api.js                  # Axios instance + interceptors
│   │   ├── context/AuthContext.jsx # login, register, logout, user state
│   │   ├── pages/                  # Login, Register, Dashboard
│   │   ├── components/             # AuthForm, Navbar, StatCard(s), Filters,
│   │   │                           # TransactionForm, TransactionList, charts
│   │   └── utils/                  # format.js, stats.js, categories.js
│   ├── vercel.json                 # SPA rewrite so refresh works
│   └── .env.example                # VITE_API_URL
└── server/                         # Spring Boot backend
    ├── src/main/java/com/nithin/finance_tracker/
    │   ├── controller/             # AuthController, TransactionController
    │   ├── service/                # TransactionService
    │   ├── repository/             # UserRepository, TransactionRepository
    │   ├── model/                  # User, Transaction
    │   ├── dto/                    # Request and response records
    │   ├── security/               # JwtUtil, JwtAuthFilter, SecurityConfig
    │   └── exception/              # GlobalExceptionHandler
    ├── src/main/resources/application.properties.example
    └── Dockerfile
```

---

## 7. API reference

| Method | Path | Auth | Description | Success |
|---|---|---|---|---|
| POST | `/api/auth/register` | No | Create account, returns token | 200 |
| POST | `/api/auth/login` | No | Returns token | 200 |
| GET | `/api/transactions` | Yes | List your transactions, newest first | 200 |
| POST | `/api/transactions` | Yes | Add a transaction | 201 |
| DELETE | `/api/transactions/{id}` | Yes | Delete one of your transactions | 204 |
| GET | `/api/transactions/export` | Yes | Download all as CSV | 200 |

Errors use one format: `{"error": "message"}`. Common codes: `400` invalid input, `401` missing or invalid token or wrong credentials, `404` transaction not found, `409` email already registered.

**Example**
```http
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{ "type": "EXPENSE", "category": "Food", "amount": 250.00, "note": "Lunch", "date": "2026-11-05" }
```

---

## 8. Run it locally

**Requirements:** Java 17, Node 18 or newer, and a MongoDB Atlas connection string.

### Backend
```bash
cd server
cp src/main/resources/application.properties.example src/main/resources/application.properties
```
Provide the values either by editing that file or with environment variables:

| Variable | Meaning |
|---|---|
| `MONGODB_URI` | Atlas connection string, with the database name before the `?`, e.g. `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/financeTracker?appName=Cluster0` |
| `JWT_SECRET` | Random string of at least 32 characters |
| `CORS_ORIGINS` | Frontend origin, default `http://localhost:5173` |

```bash
./mvnw spring-boot:run        # Windows: mvnw spring-boot:run
```
The API starts at `http://localhost:8080`.

### Frontend
```bash
cd client
cp .env.example .env          # VITE_API_URL=http://localhost:8080/api
npm install
npm run dev                   # http://localhost:5173
```

---

## 9. Deployment

1. **MongoDB Atlas:** create a free cluster and a database user (letters and numbers in the password avoid URL-encoding problems). Under Network Access allow `0.0.0.0/0`, because Render's IP addresses change.
2. **Backend on Render:** New Web Service, root directory `server`, runtime Docker. Set `MONGODB_URI`, `JWT_SECRET` and `CORS_ORIGINS`.
3. **Frontend on Vercel:** import the repo, root directory `client`, framework Vite. Set `VITE_API_URL` to `https://<your-service>.onrender.com/api`, then deploy.
4. **Connect them:** set `CORS_ORIGINS` on Render to the exact Vercel URL (`https`, no trailing slash) and let it redeploy.

**Lessons from deploying**
- A CORS `403` on the preflight request means the Vercel URL and `CORS_ORIGINS` do not match exactly.
- `bad auth : authentication failed` in the Render logs means the password inside `MONGODB_URI` is wrong.
- `VITE_API_URL` is baked in at build time, so redeploy the frontend after changing it.

---

## 10. Conclusion

FinTrack is a complete, deployed full-stack application: a React single-page app talking to a secured Spring Boot REST API, backed by MongoDB Atlas, with real authentication, per-user data isolation, charts and CSV export.

**What I learned**
- How JWT authentication works end to end: signing, the `Authorization` header, and a filter that verifies every request.
- Structuring a backend in layers (controller, service, repository, DTO) and returning consistent errors.
- Why CORS exists and how to configure it for local and production origins.
- Keeping secrets out of Git by using environment variables, and deploying a Dockerised backend.
- Building a responsive React UI with derived state, optimistic updates and reusable components.
- Debugging production issues by reading logs instead of guessing.

**Known limitations**
- The token is kept in `localStorage`. httpOnly cookies would be safer against XSS.
- There are no refresh tokens, so users log in again when the token expires (24 hours).
- Filtering and paging happen in the browser. Very large histories need server-side pagination.
- There are no automated tests yet.

**Future improvements**
- Edit transactions and set monthly budgets per category.
- Recurring transactions and spending alerts.
- Refresh tokens with httpOnly cookies.
- Server-side pagination and MongoDB aggregation for the charts.
- Unit and integration tests (JUnit and MockMvc, React Testing Library) with a GitHub Actions pipeline.

---

## Author

**Yeripilli Nithin**
GitHub: [Nithin0248](https://github.com/Nithin0248) · LinkedIn: [yeripilli-nithin](https://www.linkedin.com/in/yeripilli-nithin-956907261/)
