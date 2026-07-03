# TaskFlow — Full-Stack Todo App

A full-stack task management app with **JWT authentication** and **MongoDB** persistence.
Built to demonstrate end-to-end skills: REST API design, database modeling, auth, and a working frontend that consumes it.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT (JSON Web Tokens) + bcrypt password hashing
- **Frontend:** HTML, CSS, Vanilla JavaScript (Fetch API)

## Features
- User registration & login with hashed passwords
- JWT-protected routes — each user only sees their own todos
- Full CRUD: create, read, update (toggle complete / edit), delete todos
- Priority levels (low / medium / high)
- Filter by All / Active / Completed
- Persistent login via localStorage token

## Project Structure
```
todo-fullstack-app/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Todo.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── todos.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── index.html
    ├── style.css
    └── app.js
```

## Setup Instructions

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
```
Edit `.env` and add:
- Your MongoDB connection string (get a free one from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- A random JWT secret string

Then start the server:
```bash
npm run dev     # with nodemon
# or
npm start
```
Server runs at `http://localhost:5000`

### 2. Frontend
Just open `frontend/index.html` in your browser (e.g. with the VS Code "Live Server" extension), or serve it with any static server.

Make sure `API_BASE` in `frontend/app.js` matches your backend URL.

## API Endpoints

| Method | Endpoint             | Description              | Auth Required |
|--------|-----------------------|---------------------------|----------------|
| POST   | /api/auth/register    | Register new user         | No             |
| POST   | /api/auth/login       | Login user                | No             |
| GET    | /api/todos             | Get all todos for user    | Yes            |
| POST   | /api/todos             | Create a new todo         | Yes            |
| PUT    | /api/todos/:id         | Update a todo             | Yes            |
| DELETE | /api/todos/:id         | Delete a todo             | Yes            |

## Deployment Suggestions
- **Backend:** Render, Railway, or Cyclic (free tiers available)
- **Database:** MongoDB Atlas (free M0 cluster)
- **Frontend:** Vercel or Netlify

## What This Project Demonstrates
- RESTful API design with proper HTTP methods & status codes
- Secure authentication (password hashing, JWT tokens, protected routes)
- MongoDB schema design with relationships (Todo references User)
- Clean separation of concerns (models / routes / middleware)
- Frontend-backend integration via fetch API


