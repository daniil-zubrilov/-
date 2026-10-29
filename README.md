# Фитнес-дневник

Веб-приложение для учёта тренировок: упражнения, подходы, веса, история прогресса.

## Стек
- Backend: Python 3.12, Django 5, DRF, SimpleJWT, PostgreSQL 16
- Frontend: React 18, Vite, React Router, axios
- Деплой: Docker Compose

## Запуск

1. Скопируй `.env.example` в `.env` и поменяй секреты:
   cp .env.example .env

2. Подними контейнеры:
   docker compose up --build

3. Открой http://localhost

## API
- POST /api/auth/register/ — регистрация
- POST /api/auth/token/ — получить JWT
- POST /api/auth/token/refresh/ — обновить JWT
- GET/POST /api/workouts/ — список/создание тренировок
- GET/PUT/DELETE /api/workouts/{id}/ — карточка/правка/удаление# -
