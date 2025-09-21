# 🚀 Quick Setup for Real-Time Gmail Alerts

## **Step 1: Get Gmail App Password**

1. **Go to**: https://myaccount.google.com/apppasswords
2. **Generate** a new App Password for "Mail"
3. **Copy** the 16-character password (like: `abcd efgh ijkl mnop`)

## **Step 2: Create Environment Files**

### **Create `server/.env`:**
```env
GMAIL_USER=rakeshregala3@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password-here
GOVERNMENT_EMAIL=rakeshregala3@gmail.com
GOVERNMENT_NAME=Rakesh
PORT=3001
```

### **Create `.env` (in project root):**
```env
VITE_GMAIL_USER=rakeshregala3@gmail.com
VITE_GMAIL_APP_PASSWORD=your-16-character-app-password-here
VITE_GOVERNMENT_EMAIL=rakeshregala3@gmail.com
VITE_GOVERNMENT_NAME=Rakesh
```

## **Step 3: Start the Real-Time Email Server**

```bash
cd server
node real-time-alerts.js
```

You should see:
```
🚀 Real-time Email API server running on port 3001
📧 Gmail configured: YES
🔍 Starting real-time alert monitoring...
✅ Real-time monitoring started
```

## **Step 4: Start the Frontend**

In a new terminal:
```bash
npm run dev
```

## **Step 5: Test Real-Time Alerts**

1. **Open** http://localhost:8080
2. **Login** as government user
3. **Create a new alert** (or wait for one to be created)
4. **Check your Gmail inbox** - you should receive the alert immediately!

## **🎯 What This Does**

- **Monitors** your Supabase database for new alerts in real-time
- **Automatically sends** Gmail emails when new alerts are created
- **Beautiful HTML emails** with severity colors and all details
- **Works instantly** - no manual refresh needed

## **🔧 Troubleshooting**

### If emails don't send:
1. **Check** the App Password is correct (16 characters)
2. **Verify** 2-Step Verification is enabled
3. **Check** server console for error messages

### If real-time monitoring doesn't work:
1. **Check** Supabase connection
2. **Verify** database permissions
3. **Look** for connection errors in console

---

**Ready to test?** Follow these steps and you'll have real-time Gmail alerts! 🎉
