# 📧 Backend Email Setup Guide

## Overview
Your attendance system now uses a **Node.js backend** instead of EmailJS. This means:
- ✅ Automatic email sending after check-in/out
- ✅ No EmailJS formalities
- ✅ Simple configuration
- ✅ Full control over email design

---

## 🚀 QUICK START (5 minutes)

### Step 1: Get Gmail App Password

1. Go to **Google Account**: https://myaccount.google.com
2. Click **Security** on the left menu
3. Enable **2-Factor Authentication** (if not already enabled)
4. Then go back to **Security** → **App passwords**
5. Select **Mail** and **Windows Computer**
6. Copy the **16-character password** shown
7. Save it safely

### Step 2: Update .env File

Open **`.env`** and update:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxxxxxxxxxxxxxx
PORT=3000
```

Replace:
- `your-email@gmail.com` → Your Gmail address
- `xxxxxxxxxxxxxxxx` → The 16-char App Password you got in Step 1

### Step 3: Install Backend Dependencies

Open PowerShell in your project folder and run:

```powershell
npm install
```

This installs:
- `express` - Web server
- `nodemailer` - Email sender
- `cors` - Allow requests from frontend
- `dotenv` - Load environment variables

### Step 4: Start the Backend Server

```powershell
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║  📧 Attendance Email Server Started!   ║
╚════════════════════════════════════════╝
🚀 Server running on: http://localhost:3000
📧 Frontend: http://localhost:3000/index.html
🔌 API: http://localhost:3000/api/send-email
```

### Step 5: Open the System

Open your browser and go to:
```
http://localhost:3000/index.html
```

### Step 6: Test It

1. Select an employee
2. Click **Check In**
3. Check your email inbox - you should receive an email automatically!

---

## 🔄 How It Works

```
Browser (Frontend)
    ↓
    └→ Check In / Check Out clicked
         ↓
         └→ JavaScript sends request to backend
              ↓
              └→ Node.js Server (http://localhost:3000)
                   ↓
                   └→ Nodemailer sends email via Gmail
                        ↓
                        └→ Email arrives in inbox ✅
```

---

## 📧 What Email Gets Sent

```
From: Your Gmail address
To: info@craftedclipz.in (or custom email in CONFIG)

Subject: 🔔 Attendance Alert - CHECK IN (or CHECK OUT)

Body:
- Employee Name
- Action (Check In / Check Out)
- Date & Time
- Phone Number
- Location Coordinates
- Distance from Office
```

---

## ⚙️ Customization

### Change Recipient Email
Edit **`script.js`**, find `CONFIG` section:

```javascript
const CONFIG = {
    notificationEmail: 'your-email@gmail.com', // Change this
    // ...
};
```

### Change Email Subject/Design
Edit **`server.js`**, find the `emailContent` section and modify the HTML template.

### Deploy to Production

```javascript
// In script.js, change the API URL:
const apiUrl = 'https://your-domain.com/api/send-email';
```

Then deploy using:
- **Heroku** (free tier removed, use Railway)
- **Railway.app** ($5/month tier)
- **Render** (free tier available)
- **AWS Lightsail** (cheaper option)

---

## 🐛 Troubleshooting

### ❌ "Backend server not running"
- Make sure terminal shows ✅ "Email server is running"
- Run `npm start` again
- Check that port 3000 is not blocked

### ❌ "Gmail App Password Error"
- Verify you copied all 16 characters correctly
- Make sure 2FA is enabled on your Gmail account
- Delete and regenerate a new App Password

### ❌ "Email not sending"
1. Open browser console (F12)
2. Check for error messages
3. Verify `.env` file has correct Gmail + password
4. Check Gmail inbox spam folder

### ❌ "npm install fails"
- Make sure Node.js is installed: `node --version`
- Run: `npm install --save express nodemailer cors dotenv`

---

## 📝 Email Configuration Variables

In **script.js**, modify these in the `CONFIG` section:

```javascript
notificationPhone: '+917418167906',      // Phone number in email
notificationEmail: 'info@craftedclipz.in', // Where to send
```

---

## ✅ Verification

Once set up, verify everything works:

1. ✅ Backend running: Open http://localhost:3000/api/status
2. ✅ Frontend loads: Open http://localhost:3000/index.html
3. ✅ Check in/out works: Select employee → Click button → Check email

---

## 🔒 Security Notes

- **Never commit `.env` file to git** (already in .gitignore)
- **Don't share your App Password** - it's like a PIN for your Gmail
- **Create a separate Gmail account** for the system if possible
- **In production, use environment variables** on your server

---

## 📞 Next Steps

1. Get your Gmail App Password
2. Update `.env` file
3. Run `npm install`
4. Run `npm start`
5. Open http://localhost:3000/index.html
6. Test with check-in/out

**That's it! Email will now send automatically.** 🎉

---

Need help? Check the console (F12) for error messages and troubleshoot using the guide above.
