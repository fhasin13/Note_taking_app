# ✅ Setup Checklist - Follow This Step by Step

Print this out or keep it open while you set up!

---

## 📋 Pre-Setup Checklist

Before you start, make sure you have:

- [ ] **Node.js installed** (Check: Open terminal, type `node --version`)
- [ ] **npm installed** (Check: Type `npm --version`)
- [ ] **MongoDB installed OR MongoDB Atlas account** (Check: Type `mongod --version` OR go to mongodb.com/cloud/atlas)
- [ ] **Project folder exists** at `/Users/hasin/note-taking-app`

---

## 🚀 Setup Steps

### Step 1: Install Backend Dependencies
- [ ] Open Terminal
- [ ] Type: `cd /Users/hasin/note-taking-app/backend`
- [ ] Type: `npm install`
- [ ] Wait for it to finish (1-2 minutes)
- [ ] ✅ Should see "added X packages" at the end

### Step 2: Install Frontend Dependencies
- [ ] In Terminal, type: `cd ../frontend`
- [ ] Type: `npm install`
- [ ] Wait for it to finish (2-3 minutes)
- [ ] ✅ Should see "added X packages" at the end

### Step 3: Create .env File
- [ ] Type: `cd ../backend`
- [ ] Type: `cp .env.example .env` (Mac) OR `copy .env.example .env` (Windows)
- [ ] Open the `.env` file in a text editor
- [ ] Update `MONGODB_URI` (see instructions below)
- [ ] Update `JWT_SECRET` to any random string
- [ ] Save the file

**MongoDB URI Options:**

**Option A - Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/note-taking-app
```

**Option B - MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/note-taking-app
```
(Replace with your actual Atlas connection string)

### Step 4: Start MongoDB (If Using Local)
- [ ] Open a NEW Terminal window
- [ ] Type: `mongod`
- [ ] ✅ Should see "waiting for connections on port 27017"
- [ ] **Keep this terminal open!**

**If using MongoDB Atlas, skip this step!**

### Step 5: Start Backend Server
- [ ] Open a NEW Terminal window
- [ ] Type: `cd /Users/hasin/note-taking-app/backend`
- [ ] Type: `npm start`
- [ ] ✅ Should see:
  - "✅ Connected to MongoDB successfully"
  - "🚀 Server is running on port 5000"
- [ ] **Keep this terminal open!**

### Step 6: Start Frontend
- [ ] Open a NEW Terminal window
- [ ] Type: `cd /Users/hasin/note-taking-app/frontend`
- [ ] Type: `npm start`
- [ ] ✅ Browser should open to http://localhost:3000
- [ ] ✅ Should see login page

### Step 7: Create Account
- [ ] Click "Sign up here"
- [ ] Fill in the form
- [ ] Click "Sign Up"
- [ ] ✅ Should see Dashboard page

---

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ MongoDB terminal shows "waiting for connections"
2. ✅ Backend terminal shows "Server is running on port 5000"
3. ✅ Frontend terminal shows "Compiled successfully"
4. ✅ Browser shows the login page
5. ✅ You can create an account and see the dashboard

---

## 🐛 If Something Goes Wrong

**Backend won't start?**
- Check MongoDB is running
- Check `.env` file exists and has correct values
- Look for error messages in terminal

**Frontend won't start?**
- Check backend is running first
- Check for error messages
- Try closing and reopening terminal

**Can't connect to database?**
- Verify MongoDB is running (if local)
- Check MongoDB URI in `.env` is correct
- For Atlas: Check your IP is whitelisted

---

## 📞 Quick Commands Reference

**Check Node.js:**
```bash
node --version
```

**Check npm:**
```bash
npm --version
```

**Check MongoDB:**
```bash
mongod --version
```

**Start Backend:**
```bash
cd /Users/hasin/note-taking-app/backend
npm start
```

**Start Frontend:**
```bash
cd /Users/hasin/note-taking-app/frontend
npm start
```

**Stop any process:**
Press `Ctrl + C` in the terminal

---

## 📚 Need More Help?

1. Read `BEGINNER_GUIDE.md` for detailed explanations
2. Read `README.md` for full documentation
3. Check error messages - they usually tell you what's wrong
4. Google the error message if you're stuck

---

**You can do this! Take it one step at a time. 💪**

