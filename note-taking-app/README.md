# Collaborative Note-Taking System

A full-stack web application for collaborative note-taking and knowledge management, similar to Notion/Google Keep but simplified. Built with React, Node.js, Express, and MongoDB.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Role-Based Access Control](#role-based-access-control)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

### System Architecture

This application follows a **3-tier architecture**:

1. **Frontend (React)**: User interface and client-side logic
2. **Backend (Node.js/Express)**: API server and business logic
3. **Database (MongoDB)**: Data storage

### How Components Work Together

```
User Browser
    ↓
React Frontend (Port 3000)
    ↓ HTTP Requests
Express Backend API (Port 5000)
    ↓
MongoDB Database
```

### Data Flow

1. **User Action** → React component captures user interaction
2. **API Call** → Frontend makes HTTP request to backend
3. **Authentication** → Backend verifies JWT token
4. **Authorization** → Backend checks user roles/permissions
5. **Database Query** → Backend queries MongoDB
6. **Response** → Backend sends JSON response
7. **UI Update** → Frontend updates the display

---

## 📁 Project Structure

```
note-taking-app/
├── backend/                    # Backend server code
│   ├── models/                 # MongoDB models (database schemas)
│   │   ├── User.js
│   │   ├── Note.js
│   │   ├── Notebook.js
│   │   ├── Tag.js
│   │   ├── Comment.js
│   │   ├── Attachment.js
│   │   └── Group.js
│   ├── controllers/            # Business logic handlers
│   │   ├── authController.js
│   │   ├── noteController.js
│   │   ├── notebookController.js
│   │   ├── tagController.js
│   │   ├── commentController.js
│   │   ├── attachmentController.js
│   │   └── groupController.js
│   ├── routes/                 # API route definitions
│   │   ├── auth.js
│   │   ├── notes.js
│   │   ├── notebooks.js
│   │   ├── tags.js
│   │   ├── comments.js
│   │   ├── attachments.js
│   │   └── groups.js
│   ├── middleware/             # Custom middleware
│   │   └── auth.js             # Authentication & authorization
│   ├── server.js               # Main server file
│   ├── package.json            # Backend dependencies
│   └── .env.example            # Environment variables template
│
├── frontend/                   # React frontend code
│   ├── public/                 # Static files
│   │   └── index.html
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   └── Navbar.js
│   │   ├── pages/              # Page components
│   │   │   ├── LoginPage.js
│   │   │   ├── SignupPage.js
│   │   │   ├── Dashboard.js
│   │   │   ├── NotebookView.js
│   │   │   ├── NoteEditor.js
│   │   │   └── GroupManagement.js
│   │   ├── utils/              # Utility functions
│   │   │   └── api.js           # API call functions
│   │   ├── App.js              # Main app component
│   │   ├── index.js            # Entry point
│   │   └── index.css           # Global styles
│   └── package.json            # Frontend dependencies
│
└── README.md                   # This file
```

---

## ✨ Features

### Authentication
- ✅ User registration (signup)
- ✅ User login
- ✅ JWT-based authentication
- ✅ Protected routes

### Notes Management
- ✅ Create, read, update, delete notes
- ✅ Rich text content
- ✅ Note types (text, markdown, todo, code)
- ✅ Tag notes
- ✅ Connect notes to notebooks
- ✅ Link notes to other notes

### Notebooks
- ✅ Create and manage notebooks
- ✅ Nested notebooks (parent-child relationship)
- ✅ Organize notes in notebooks
- ✅ View all notes in a notebook

### Tags
- ✅ Create tags
- ✅ Add tags to notes
- ✅ Filter notes by tags
- ✅ Many-to-many relationship with notes

### Comments
- ✅ Add comments to notes
- ✅ View all comments on a note
- ✅ Delete own comments (or as Editor/Admin)

### Groups
- ✅ Create groups (Lead Editor/Admin only)
- ✅ Add members to groups
- ✅ Assign notebook access to groups
- ✅ Manage group permissions

### Role-Based Access Control
- ✅ **Admin**: Full access to everything
- ✅ **Lead Editor**: Manage groups and notebooks
- ✅ **Editor**: Create and edit notes
- ✅ **Contributor**: Add notes and comments

---

## 🛠️ Tech Stack

### Frontend
- **React 18**: UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **CSS**: Styling (no framework, clean and readable)

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing

---

## 📦 Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MongoDB** (v4.4 or higher)
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
   - Verify installation: `mongod --version`

3. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

4. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

---

## 🚀 Installation & Setup

### Step 1: Clone or Navigate to Project

```bash
cd /Users/hasin/note-taking-app
```

### Step 2: Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Create environment file
cp .env.example .env
```

### Step 3: Configure Backend Environment

Edit `backend/.env` file:

```env
# MongoDB Connection String
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/note-taking-app

# For MongoDB Atlas (cloud), use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/note-taking-app

# JWT Secret Key (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port
PORT=5000
```

**Important**: 
- Replace `your-super-secret-jwt-key-change-this-in-production` with a strong random string
- If using MongoDB Atlas, replace the connection string with your actual credentials

### Step 4: Set Up Frontend

Open a new terminal window:

```bash
# Navigate to frontend directory
cd /Users/hasin/note-taking-app/frontend

# Install frontend dependencies
npm install
```

### Step 5: Start MongoDB (if using local MongoDB)

```bash
# On macOS/Linux:
mongod

# On Windows:
# MongoDB should start automatically as a service
# Or run: net start MongoDB
```

**Note**: If using MongoDB Atlas (cloud), skip this step.

---

## ▶️ Running the Application

### Start Backend Server

```bash
# Navigate to backend directory
cd /Users/hasin/note-taking-app/backend

# Start the server
npm start

# Or for development with auto-reload:
npm run dev
```

You should see:
```
✅ Connected to MongoDB successfully
🚀 Server is running on port 5000
📍 API available at http://localhost:5000/api
```

### Start Frontend Development Server

Open a **new terminal window**:

```bash
# Navigate to frontend directory
cd /Users/hasin/note-taking-app/frontend

# Start the React app
npm start
```

The browser should automatically open to `http://localhost:3000`

**Note**: Keep both terminals open - one for backend, one for frontend.

---

## 🌐 Accessing the Application

1. **Frontend**: http://localhost:3000
2. **Backend API**: http://localhost:5000/api
3. **Health Check**: http://localhost:5000/api/health

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Notes
- `GET /api/notes` - Get all notes (with optional filters)
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/:id/tags` - Add tag to note

### Notebooks
- `GET /api/notebooks` - Get all notebooks
- `GET /api/notebooks/:id` - Get single notebook
- `POST /api/notebooks` - Create new notebook
- `PUT /api/notebooks/:id` - Update notebook
- `DELETE /api/notebooks/:id` - Delete notebook
- `POST /api/notebooks/:id/notes` - Add note to notebook

### Tags
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create new tag
- `DELETE /api/tags/:id` - Delete tag

### Comments
- `GET /api/comments?note_id=...` - Get comments for a note
- `POST /api/comments` - Create comment
- `DELETE /api/comments/:id` - Delete comment

### Groups
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get single group
- `POST /api/groups` - Create new group (Lead Editor/Admin only)
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `POST /api/groups/:id/members` - Add member to group

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get single user

---

## 🗄️ Database Schema

### User Model
```javascript
{
  user_id: String (unique),
  user_name: String (unique),
  first_name: String,
  last_name: String,
  email: String (unique),
  phone: [String],  // Array (multivalued)
  institution: String,
  password: String (hashed),
  roles: [String]   // ['Admin', 'Lead Editor', 'Editor', 'Contributor']
}
```

### Note Model
```javascript
{
  note_id: String (unique),
  UID: ObjectId (ref: User),
  title: String,
  content: String,
  type: String,  // 'text', 'markdown', 'todo', 'code'
  creation_time: Date,
  tags: [ObjectId] (ref: Tag),
  notebooks: [ObjectId] (ref: Notebook),
  connected_notes: [ObjectId] (ref: Note),
  attachments: [ObjectId] (ref: Attachment),
  comments: [ObjectId] (ref: Comment),
  view_type: String,  // 'public', 'private', 'shared'
  posted_time: Date
}
```

### Notebook Model
```javascript
{
  notebook_ID: String (unique),
  notebook_name: String,
  parent_notebook: ObjectId (ref: Notebook),  // For nested notebooks
  owner: ObjectId (ref: User),
  notes: [ObjectId] (ref: Note),
  accessible_groups: [ObjectId] (ref: Group)
}
```

### Tag Model
```javascript
{
  tag_id: String (unique),
  tag_name: String (unique, lowercase),
  notes: [ObjectId] (ref: Note)
}
```

### Comment Model (Weak Entity)
```javascript
{
  comment_id: String,  // Partial key
  user: ObjectId (ref: User),
  note: ObjectId (ref: Note),
  comment_text: String,
  comment_time: Date,
  attachments: [ObjectId] (ref: Attachment)
}
```

### Group Model (Weak Entity)
```javascript
{
  group_id: String,  // Partial key
  group_name: String,
  lead_editor: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  accessible_notebooks: [ObjectId] (ref: Notebook),
  attachments: [ObjectId] (ref: Attachment)
}
```

### Attachment Model (Weak Entity)
```javascript
{
  attachment_ID: String,  // Partial key
  file_name: String,
  file_type: String,
  URL: String,
  file_size: Number,
  parent_type: String,  // 'Note', 'Comment', or 'Group'
  parent_id: ObjectId
}
```

---

## 🔐 Role-Based Access Control

### Admin
- ✅ Full access to all features
- ✅ Can view all users
- ✅ Can manage all groups
- ✅ Can edit/delete any note or notebook

### Lead Editor
- ✅ Can create and manage groups
- ✅ Can manage notebooks (create, edit, delete)
- ✅ Can create and edit notes
- ✅ Can add comments

### Editor
- ✅ Can create and edit notes
- ✅ Can delete own notes
- ✅ Can add comments
- ✅ Can delete own comments

### Contributor
- ✅ Can create notes
- ✅ Can add comments
- ✅ Can view notebooks and notes (if shared)

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `MongoDB connection error`
- **Solution**: 
  - Make sure MongoDB is running: `mongod`
  - Check your `MONGODB_URI` in `.env` file
  - For MongoDB Atlas, verify your connection string and network access

**Problem**: `Port 5000 already in use`
- **Solution**: 
  - Change `PORT` in `backend/.env` to a different port (e.g., 5001)
  - Update `API_BASE_URL` in `frontend/src/utils/api.js` to match

**Problem**: `JWT_SECRET is missing`
- **Solution**: Make sure `.env` file exists and has `JWT_SECRET` set

### Frontend Issues

**Problem**: `Cannot connect to API`
- **Solution**: 
  - Make sure backend is running on port 5000
  - Check `API_BASE_URL` in `frontend/src/utils/api.js`
  - Check browser console for CORS errors

**Problem**: `npm install fails`
- **Solution**: 
  - Delete `node_modules` folder and `package-lock.json`
  - Run `npm install` again
  - Make sure you have Node.js v14 or higher

**Problem**: `Page shows blank screen`
- **Solution**: 
  - Check browser console for errors
  - Make sure backend is running
  - Verify API connection in Network tab

### Common Issues

**Problem**: `Authentication fails`
- **Solution**: 
  - Clear browser localStorage: `localStorage.clear()` in browser console
  - Try logging in again
  - Check backend logs for errors

**Problem**: `Database queries fail`
- **Solution**: 
  - Verify MongoDB is running
  - Check database connection string
  - Look at backend console for error messages

---

## 📝 Usage Guide

### Creating Your First Account

1. Go to http://localhost:3000
2. Click "Sign up here" or navigate to `/signup`
3. Fill in the form:
   - Username
   - First Name, Last Name
   - Email
   - Password (min 6 characters)
4. Click "Sign Up"
5. You'll be automatically logged in and redirected to the dashboard

### Creating a Notebook

1. On the Dashboard, click "+ Create New Notebook"
2. Enter a notebook name
3. Click "Create"
4. The notebook will appear in your notebooks list

### Creating a Note

1. Click on a notebook to open it
2. Click "+ Create New Note"
3. Enter a title
4. Click "Create"
5. Click on the note to edit it
6. Add content, tags, and save

### Adding Tags

1. Open a note
2. Click "+ Add Tag"
3. Enter tag name (or select existing tag)
4. Tag will appear on the note

### Adding Comments

1. Open a note
2. Scroll to "Comments" section
3. Type your comment
4. Click "Add Comment"

### Creating Groups (Lead Editor/Admin only)

1. Navigate to "Groups" in the navbar
2. Click "+ Create New Group"
3. Enter group name
4. Select members
5. Select notebooks for group access
6. Click "Create Group"

---

## 🎓 Learning Resources

### Understanding the Code

- **Models**: Define database structure (like a blueprint)
- **Controllers**: Handle business logic (what happens when API is called)
- **Routes**: Define API endpoints (URLs that can be accessed)
- **Middleware**: Functions that run before routes (like authentication check)
- **Components**: Reusable UI pieces in React
- **Pages**: Full page components
- **API Utils**: Functions to call backend API

### Key Concepts

1. **JWT Authentication**: Token-based authentication that doesn't require server-side sessions
2. **Mongoose**: Library that makes MongoDB easier to use with Node.js
3. **React Hooks**: `useState`, `useEffect` - manage component state and side effects
4. **React Router**: Handles navigation between pages
5. **Axios**: Makes HTTP requests to the backend API

---

## 📄 License

This project is for educational purposes.

---

## 🤝 Contributing

This is a learning project. Feel free to:
- Add new features
- Improve existing code
- Fix bugs
- Enhance documentation

---

## 📧 Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Review error messages in browser console and backend terminal
3. Verify all prerequisites are installed correctly
4. Make sure both backend and frontend servers are running

---

**Happy Coding! 🚀**

