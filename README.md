# Task Management System
A full stack MERN Task Management System developed during my Software Development Internship at DevelopersHub Corporation.

## Features
- Add Tasks
- View Tasks
- Update Tasks
- Delete Tasks
- Search Tasks
- Filter Tasks by Status
- Dashboard Statistics
- Dark Mode
- MongoDB Database Integration
- Responsive Bootstrap UI

## Tech Stack
### Frontend
- React.js
- Bootstrap
- Axios
### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
### Tools
- Git & GitHub
- Postman
- VS Code

## Project Structure
```bash
Task-Management-System/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── components/
│   └── services/
│
└── README.md
```
## Installation
### Clone Repository
```bash
git clone https://github.com/zoyarasool/task-management-system.git
```
## Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on:
```bash
http://localhost:5000
```
## Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on:
```bash
http://localhost:3000
```
---
## Environment Variables
Create a `.env` file inside backend folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```
---
## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

---
## Internship Learning Outcomes
Through this project, I learned:
- MERN Stack Fundamentals
- REST API Development
- MongoDB Integration
- Frontend & Backend Integration
- CRUD Operations
- React State Management
- GitHub Version Control
- Bootstrap UI Styling

---
## Author
Zoya Rasool

GitHub: https://github.com/zoyarasool
