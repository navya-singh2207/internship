# Backend Developer Assignment Project

This repository contains a complete implementation of the internship assignment:
- Secure REST APIs with JWT authentication and role-based access control
- CRUD APIs for tasks
- API versioning (`/api/v1`)
- Validation + centralized error handling
- Swagger API documentation
- React frontend to test all APIs

## Tech Stack

- **Backend:** Node.js, Express, Prisma, PostgreSQL, JWT, bcrypt, express-validator, Swagger
- **Frontend:** React + Vite, Axios, React Router

## Project Structure

- `backend/` - Versioned REST API and database layer
- `frontend/` - UI for register/login and task CRUD

## Backend Setup

1. Go to backend:
   - `cd backend`
2. Install dependencies:
   - `npm install`
3. Create `.env`:
   - `PORT=5001`
   - `DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/tasks_db"`
   - `JWT_SECRET="your_super_secret_key"`
4. Run migrations:
   - `npx prisma migrate dev --name init`
5. Start backend:
   - `npm run dev`

Backend runs on `http://localhost:5001`.

## Frontend Setup

1. Go to frontend:
   - `cd frontend`
2. Install dependencies:
   - `npm install`
3. Create `.env`:
   - `VITE_API_URL=http://localhost:5001/api/v1`
4. Start frontend:
   - `npm run dev`

Frontend runs on `http://localhost:5173`.

## API Documentation

- Swagger UI: `http://localhost:5001/api-docs`
- Collection file: `backend/postman_collection.json`

## Implemented Features (Assignment Checklist)

- User registration and login with hashed passwords and JWT
- Role-based access (USER / ADMIN)
- Task CRUD APIs
- Protected routes with JWT middleware
- API versioning (`/api/v1`)
- Input validation and centralized error responses
- PostgreSQL schema with Prisma migrations
- Frontend pages for auth, protected dashboard, and task operations
- Error/success feedback from API responses

## Example Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/tasks`
- `GET /api/v1/tasks/:id`
- `POST /api/v1/tasks`
- `PUT /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id` (admin only)

## Scalability Note

This codebase is organized by modules (`controllers`, `routes`, `middleware`, `models`) so new domains can be added without touching existing flows. For larger traffic, the next steps are:
- Add Redis caching for task list reads
- Add request logging and centralized log aggregation
- Deploy stateless API instances behind a load balancer
- Split auth and task modules into separate services when domain growth demands it
