# 📱 Task Management App - Full-Stack Learning Project

> Building a complete mobile task management application while learning React Native + Node.js

## 🎯 Project Overview

A full-stack mobile app built from scratch to learn modern application development. This project focuses on understanding both frontend (React Native) and backend (Node.js/Express) development.

 **Status** : 🚧 In Active Development

 **Learning Method** : #Learning in Public

---

## 🏗️ Architecture

```
┌─────────────────┐
│  React Native   │  ← Frontend (Mobile App)
│   + Expo        │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│   Express.js    │  ← Backend (API Server)
│   + Node.js     │
└─────────────────┘
```

---

## 📁 Project Structure

```
task-management-app/
├── frontend/          # React Native + Expo mobile app
├── backend/           # Node.js + Express API
├── docs/              # Learning journal & documentation
├── scripts/           # Helper utilities
└── README.md          # This file
```

### Detailed Structure

* **`frontend/`** - React Native mobile application
  * `app/` - Screen components (Expo Router)
  * `components/` - Reusable UI components
  * `assets/` - Images, fonts, icons
* **`backend/`** - Express.js REST API
  * `src/routes/` - API endpoint definitions
  * `src/middleware/` - Custom middleware (validation, etc.)
  * `src/controllers/` - Business logic
  * `src/server.js` - Main server file
* **`docs/`** - Learning documentation
  * `logs/backend/` - Backend learning logs
  * `logs/frontend/` - Frontend learning logs
  * `social/` - Social media posts archive
  * `.claude/` - AI assistant configuration

---

## 🚀 Quick Start

### Prerequisites

* Node.js v16+ ([Download](https://nodejs.org/))
* npm or yarn
* Expo CLI: `npm install -g expo-cli`
* Git

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd task-management-app

# Install all dependencies
npm install
npm run install:all

# OR install individually
npm run frontend:install
npm run backend:install
```

### Running the App

```bash
# Option 1: Run both frontend and backend together
npm run dev

# Option 2: Run separately (in different terminals)

# Terminal 1: Start backend
npm run backend
# Backend runs on http://localhost:3000

# Terminal 2: Start frontend
npm run frontend
# Expo dev server starts
```

### Testing the Backend

```bash
# Make sure backend is running
npm run backend

# Test in browser or use curl/Postman
curl http://localhost:3000
curl http://localhost:3000/api/tasks
```

---

## 🎓 Learning Scope

### Backend (Current Focus)

* ✅ Express.js server setup
* ✅ RESTful API routing
* ✅ Request/Response handling
* ✅ Middleware (validation, error handling)
* ✅ CRUD operations
* 🔄 Router organization

 **Not Yet Included** : Authentication, Database, Advanced features

### Frontend (Parallel Learning)

* ✅ React Native fundamentals
* ✅ Expo framework
* 🔄 Component architecture
* 🔄 Navigation
* 🔄 API integration
* 🔄 State management

---

## 📡 API Documentation

### Base URL

```
http://localhost:3000
```

### Endpoints

#### Health Check

```http
GET /health
```

Response: `{ status: "OK", timestamp: "..." }`

#### Get All Tasks

```http
GET /api/tasks
```

Response: `{ success: true, data: [...] }`

#### Create Task

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Task title",
  "description": "Task description"
}
```

#### Get Single Task

```http
GET /api/tasks/:id
```

#### Update Task

```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Updated title",
  "completed": true
}
```

#### Delete Task

```http
DELETE /api/tasks/:id
```

---

## 📚 Learning Journal

This project includes a comprehensive learning documentation system:

### Daily Logs

Track daily progress separately for backend and frontend:

* `docs/logs/backend/daily/YYYY-MM-DD.md`
* `docs/logs/frontend/daily/YYYY-MM-DD.md`

### Weekly Summaries

Reflect on weekly progress:

* `docs/logs/backend/weekly/week-YYYY-WXX.md`
* `docs/logs/frontend/weekly/week-YYYY-WXX.md`

### Using the Learning Journal

```bash
# At end of your coding session
npm run log

# Choose what you worked on:
# 1. Backend (Node.js/Express)
# 2. Frontend (React Native)
# 3. Both (Full-Stack)

# Claude will generate:
# - Complete daily log
# - Social media posts
# - Reflection questions
```

---

## 🌐 Learning in Public

Following along? Connect with me:

* **Twitter/X** : [Your Handle]
* **LinkedIn** : [Your Profile]
* **Dev.to** : [Your Profile]

 **Hashtags** : `#100DaysOfCode` `#ReactNative` `#NodeJS` `#LearningInPublic`

---

## 🎯 Current Goals

 **This Week** :

* [ ] Backend: Organize routes into separate files
* [ ] Backend: Add validation middleware
* [ ] Frontend: Build task list screen
* [ ] Frontend: Connect to backend API

 **Next Sprint** :

* [ ] Add task filtering
* [ ] Implement task categories
* [ ] Add due dates

---

## 🛠️ Development Commands

### Root Commands

```bash
npm run dev              # Run both frontend & backend
npm run frontend         # Run React Native app
npm run backend          # Run Express API
npm run log              # Create learning journal entry
npm run install:all      # Install all dependencies
```

### Backend Commands

```bash
cd backend
npm start               # Production mode
npm run dev             # Development mode (nodemon)
```

### Frontend Commands

```bash
cd frontend
npm start               # Start Expo dev server
npm run android         # Run on Android
npm run ios             # Run on iOS
npm run web             # Run in browser
```

---

## 🤝 Contributing

This is a personal learning project, but suggestions are welcome!

If you're also learning:

* Feel free to fork and follow along
* Share your own journey
* Open issues with questions or suggestions

---

## 📄 License

MIT License - Free to use for learning purposes

---

## 🙏 Acknowledgments

* React Native & Node.js communities
* Everyone learning in public

---

**Built with ❤️ while learning in public**
