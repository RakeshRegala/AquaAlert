# 🚀 Complete Gmail Setup Instructions

## ⚠️ **CRITICAL: Get Your Gmail App Password First!**

**You CANNOT use your regular Gmail password!** You need to generate a special App Password.

### Step 1: Generate Gmail App Password

1. **Go to your Google Account**: https://myaccount.google.com/
2. **Navigate to Security** → **2-Step Verification** (enable if not already)
3. **Scroll down to "App passwords"**
4. **Click "Generate"** and select **"Mail"** as the app
5. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

### Step 2: Create Environment Files

Create a `.env` file in the **root directory** of your project:

```env
# Gmail Configuration
VITE_GMAIL_USER=rakeshregala3@gmail.com
VITE_GMAIL_APP_PASSWORD=your-16-character-app-password-here
VITE_GOVERNMENT_EMAIL=rakeshregala3@gmail.com
VITE_GOVERNMENT_NAME=Rakesh

# Supabase Configuration
VITE_SUPABASE_URL=https://pxnexbjbqofjacmkackh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4bmV4YmpicW9mamFjbWthY2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzgyMjMsImV4cCI6MjA3MzYxNDIyM30.y2FW_shUpXrw2W4Uqg_iCIzpSXhj5X61SPX3guafe1Q
```

Create a `.env` file in the **server directory**:

```env
# Gmail Configuration for Server
GMAIL_USER=rakeshregala3@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password-here
PORT=3001
```

### Step 3: Install Server Dependencies

```bash
cd server
npm install
```

### Step 4: Start the Email Server

```bash
cd server
npm start
```

You should see:
```
Email API server running on port 3001
Health check: http://localhost:3001/api/health
```

### Step 5: Start the Frontend

In a new terminal:
```bash
npm run dev
```

### Step 6: Test the Setup

1. **Open** http://localhost:8080
2. **Login** as a government user
3. **Go to** Government Dashboard → Email Settings
4. **Click "Send Test"** with your email address
5. **Check your Gmail inbox** for the test email!

## 🎯 **How It Works**

1. **Frontend** (React app) detects new alerts
2. **Frontend** sends alert data to **Email API** (Node.js server)
3. **Email API** uses nodemailer to send real Gmail emails
4. **You receive** beautifully formatted alert emails in your Gmail inbox!

## 🔧 **Troubleshooting**

### If emails don't send:
1. **Check server logs** for error messages
2. **Verify App Password** is correct (16 characters, no spaces)
3. **Ensure 2-Step Verification** is enabled on Gmail
4. **Check firewall** - port 3001 should be accessible

### If you get authentication errors:
1. **Double-check** the App Password
2. **Make sure** you're using the App Password, not your regular password
3. **Verify** 2-Step Verification is enabled

## 📧 **Email Features**

- **Real Gmail delivery** to your inbox
- **Beautiful HTML formatting** with severity colors
- **Alert details** including location, message, and timestamp
- **Direct dashboard links** for quick access
- **Professional styling** that works on all devices

## 🚀 **Production Deployment**

For production, you'll need to:
1. **Deploy the server** to a cloud service (Heroku, Railway, etc.)
2. **Update the API URL** in the frontend
3. **Set environment variables** on your hosting platform
4. **Use a production domain** for the dashboard links

---

**Ready to test?** Follow these steps and you'll have real Gmail notifications working! 🎉



