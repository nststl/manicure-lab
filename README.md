# 💅 Manicure Lab

CRM для манікюрного салону: клієнти, записи, календар. Fullstack: React + Node.js + MongoDB.

## Структура

```
manicure-lab/
├── booking-service/    # Backend (Express + Mongoose)
├── manicure-frontend/  # Frontend (React + Vite)
└── docker-compose.yml  # MongoDB (опційно)
```

## Запуск локально

### 1. MongoDB

Потрібна база на `localhost:27017` (у тебе вже є `manicure-lab` з колекціями `clients`, `appointments`).

Або через Docker Desktop:

```bash
docker compose up -d
```

### 2. Backend

```bash
cd booking-service
cp .env.example .env
npm install
npm run dev
```

Сервер: http://localhost:3001

### 3. Frontend

```bash
cd manicure-frontend
npm install
npm run dev
```

Сайт: http://localhost:5173

## Функції

- 👤 CRUD клієнтів + пошук
- 📅 CRUD записів + фільтр за статусом і датою
- 📆 Календар по днях
- 🏠 Dashboard (сьогодні, найближчі записи)
- При видаленні клієнта — видаляються його записи

## Deploy (наступний крок)

### Backend → [Render](https://render.com)

1. New **Web Service**, root: `booking-service`
2. Build: `npm install`, Start: `npm start`
3. Env:
   - `MONGODB_URI` — MongoDB Atlas connection string
   - `FRONTEND_URL` — URL Vercel (наприклад `https://your-app.vercel.app`)

### Frontend → [Vercel](https://vercel.com)

1. Root: `manicure-frontend`
2. Env: `VITE_API_BASE_URL=https://YOUR-API.onrender.com/api`

## Для курсової

- **БД:** MongoDB (`manicure-lab`)
- **API:** REST (`/api/clients`, `/api/appointments`)
- **Архітектура:** client-server, JSON, async/await
- **Стек:** React, Express, Mongoose, Vite

## Тест API

Файл `test.http` — запити для REST Client / IntelliJ HTTP.
