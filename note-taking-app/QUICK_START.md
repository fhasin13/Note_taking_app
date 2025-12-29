# Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Configure Backend

Create `backend/.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/note-taking-app
JWT_SECRET=my-secret-key-12345
PORT=5000
```

### Step 3: Start MongoDB

```bash
# Make sure MongoDB is running
mongod
```

### Step 4: Start Backend

```bash
cd backend
npm start
```

You should see: `🚀 Server is running on port 5000`

### Step 5: Start Frontend

Open a **new terminal**:
```bash
cd frontend
npm start
```

Browser will open at http://localhost:3000

### Step 6: Create Account

1. Click "Sign up here"
2. Fill in the form
3. Click "Sign Up"
4. You're in! 🎉

---

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the code - it's well-commented for beginners
- Try creating notebooks, notes, and tags
- Test the role-based access control

---

## ⚠️ Common Issues

**Backend won't start?**
- Check if MongoDB is running
- Verify `.env` file exists

**Frontend can't connect?**
- Make sure backend is running on port 5000
- Check browser console for errors

**Need help?**
- See Troubleshooting section in README.md

