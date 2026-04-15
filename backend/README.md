# Backend API

## Setup

1. Install packages:
   - `npm install`
2. Create `.env`:
   - `PORT=5001`
   - `DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/tasks_db"`
   - `JWT_SECRET="your_super_secret_key"`
3. Run migrations:
   - `npx prisma migrate dev --name init`
4. Start server:
   - `npm run dev`

## API Base URL

- `http://localhost:5001/api/v1`

## Docs

- Swagger: `http://localhost:5001/api-docs`

## Key Routes

- `POST /auth/register`
- `POST /auth/login`
- `GET /tasks`
- `GET /tasks/:id`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id` (ADMIN)
