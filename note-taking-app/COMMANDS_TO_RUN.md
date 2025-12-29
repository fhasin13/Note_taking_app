# 🖥️ Exact Commands to Run (Copy & Paste)

Copy these commands **one at a time** into your terminal and press Enter.

---

## Step 1: Check What You Have

```bash
node --version
```
**Expected:** Should show a version number like `v18.17.0` or `v20.5.0`

```bash
npm --version
```
**Expected:** Should show a version number like `9.8.0` or `10.1.0`

**If either fails:** Install Node.js from https://nodejs.org/

---

## Step 2: Go to Project Folder

```bash
cd /Users/hasin/note-taking-app
```

---

## Step 3: Install Backend Dependencies

```bash
cd backend
```

```bash
npm install
```
**Wait 1-2 minutes** - You'll see lots of text scrolling. This is normal!

---

## Step 4: Install Frontend Dependencies

```bash
cd ../frontend
```

```bash
npm install
```
**Wait 2-3 minutes** - This downloads React and all its dependencies.

---

## Step 5: Create .env File

```bash
cd ../backend
```

**On Mac:**
```bash
cp .env.example .env
```

**On Windows:**
```bash
copy .env.example .env
```

**Now edit the .env file:**

**On Mac:**
```bash
open -e .env
```

**On Windows:**
```bash
notepad .env
```

**In the .env file, make sure you have:**

**For Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/note-taking-app
JWT_SECRET=my-secret-key-12345
PORT=5000
```

**For MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/note-taking-app
JWT_SECRET=my-secret-key-12345
PORT=5000
```

**Save the file!**

---

## Step 6: Start MongoDB (If Using Local MongoDB)

**Open a NEW Terminal window** and run:

```bash
mongod
```

**Keep this terminal open!** You should see: `waiting for connections on port 27017`

**If using MongoDB Atlas, skip this step!**

---

## Step 7: Start Backend Server

**Open a NEW Terminal window** and run:

```bash
cd /Users/hasin/note-taking-app/backend
```

```bash
npm start
```

**Keep this terminal open!** You should see:
- ✅ Connected to MongoDB successfully
- 🚀 Server is running on port 5000

---

## Step 8: Start Frontend

**Open a NEW Terminal window** and run:

```bash
cd /Users/hasin/note-taking-app/frontend
```

```bash
npm start
```

**Your browser should open automatically** to http://localhost:3000

**Keep this terminal open!**

---

## Step 9: Test It!

1. You should see a login page
2. Click "Sign up here"
3. Fill in the form
4. Click "Sign Up"
5. You should see the Dashboard!

---

## 🎉 Success!

If you see the dashboard, **everything is working!**

---

## 🐛 Troubleshooting

### If backend won't start:

**Check MongoDB is running:**
```bash
mongod --version
```

**Check .env file exists:**
```bash
cd /Users/hasin/note-taking-app/backend
ls -la .env
```

**Try again:**
```bash
npm start
```

### If frontend won't start:

**Make sure backend is running first!**

**Check if port 3000 is free:**
- Close any other React apps
- Try again: `npm start`

### If you see "Cannot connect to MongoDB":

**For local MongoDB:**
- Make sure `mongod` is running in a terminal
- Check your `.env` file has: `MONGODB_URI=mongodb://localhost:27017/note-taking-app`

**For MongoDB Atlas:**
- Check your connection string is correct
- Make sure your IP is whitelisted in Atlas dashboard
- Make sure you replaced `<password>` with your actual password

---

## 📝 Quick Reference

**Start Backend:**
```bash
cd /Users/hasin/note-taking-app/backend && npm start
```

**Start Frontend:**
```bash
cd /Users/hasin/note-taking-app/frontend && npm start
```

**Start MongoDB (local):**
```bash
mongod
```

**Stop any process:**
Press `Ctrl + C`

---

**That's it! Follow these commands in order and you'll be up and running! 🚀**

