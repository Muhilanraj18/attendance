# 📱 WhatsApp & Email Notification Setup Guide

Your attendance system **already has** notification features built-in! When employees check in/out, notifications are automatically sent to:
- **WhatsApp**: +91 7418 167 906
- **Email**: info@craftedclipz.in

## ✅ What's Already Working

The system logs notifications to the browser console and shows confirmation messages. To enable **actual** WhatsApp and Email delivery, follow the setup below:

---

## 📧 EMAIL SETUP (Using EmailJS - FREE)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a **FREE** account
3. Verify your email

### Step 2: Create Email Service
1. Go to **Email Services** → Add New Service
2. Choose **Gmail** (or your preferred email provider)
3. Connect your email account (info@craftedclipz.in)
4. Copy the **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template
1. Go to **Email Templates** → Create New Template
2. Use this template:

```
Subject: Attendance Alert - {{action}}

Employee: {{employee_name}}
Action: {{action}}
Date: {{date}}
Time: {{time}}
Location: {{location}}
Distance from office: {{distance}}

This is an automated notification from the Attendance System.
```

3. Copy the **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Public Key
1. Go to **Account** → **General**
2. Copy your **Public Key** (e.g., `abcdefg123456`)

### Step 5: Update script.js
Open `script.js` and replace these values around line 12-15:

```javascript
emailjs: {
    serviceId: 'service_abc123',      // Replace with YOUR Service ID
    templateId: 'template_xyz789',    // Replace with YOUR Template ID
    publicKey: 'abcdefg123456'        // Replace with YOUR Public Key
}
```

✅ **Email notifications will now work!**

---

## 📱 WHATSAPP SETUP (3 Options)

### ⭐ OPTION 1: CallMeBot (EASIEST - FREE)

#### Step 1: Register Your Number
1. Add **+34 644 49 06 27** to your contacts (save as "CallMeBot")
2. Send this message to that number on WhatsApp:
   ```
   I allow callmebot to send me messages
   ```
3. You'll receive an **API Key** like: `123456`

#### Step 2: Update script.js
Replace line 23 with your API key:

```javascript
callMeBotApiKey: '123456'  // Replace with the key you received
```

#### Step 3: Enable CallMeBot in script.js
Find the `sendWhatsApp` function (around line 270) and change:

```javascript
// Option 1: Twilio WhatsApp API (Recommended for production)
// sendWhatsAppViaTwilio(message);

// Option 2: CallMeBot API (Free alternative - uncomment to use)
sendWhatsAppViaCallMeBot(message);
```

✅ **WhatsApp notifications will now work for FREE!**

---

### OPTION 2: Twilio WhatsApp API (PAID - Most Reliable)

#### Step 1: Create Twilio Account
1. Go to [https://www.twilio.com/](https://www.twilio.com/)
2. Sign up (free trial available)
3. Verify your phone number

#### Step 2: Set Up WhatsApp Sandbox
1. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Follow instructions to connect your WhatsApp
3. Note your **Twilio WhatsApp Number**

#### Step 3: Get Credentials
1. Go to **Account** → **Account Info**
2. Copy **Account SID** (e.g., `AC123abc456def`)
3. Copy **Auth Token** (e.g., `abc123def456`)

#### Step 4: Update script.js
Replace lines 18-20:

```javascript
twilioAccountSid: 'AC123abc456def',           // Your Account SID
twilioAuthToken: 'abc123def456',              // Your Auth Token
twilioWhatsAppNumber: 'whatsapp:+14155238886' // Keep this default
```

✅ **Professional WhatsApp notifications!**

---

### OPTION 3: WhatsApp Web Link (NO SETUP - Manual)

This option doesn't auto-send but opens WhatsApp with a pre-filled message.

#### Enable in script.js
Find the `sendWhatsApp` function and use:

```javascript
sendWhatsAppViaWebURL(message);
```

This will open WhatsApp Web with the message ready to send (user clicks send manually).

---

## 🧪 TEST YOUR SETUP

After configuring, test the notifications:

1. Open the attendance page
2. Select an employee
3. Click **Check In**
4. Watch for:
   - ✅ Browser notification confirmation
   - 📧 Email arrives at info@craftedclipz.in
   - 📱 WhatsApp message to +91 7418 167 906

### Debug Console
Press **F12** → **Console** to see notification logs:
```
📱 SENDING NOTIFICATION
==================================================
Type: CHECK-IN
Employee: Babu hussian
Time: 2:30:45 PM
📱 Sending WhatsApp to: +917418167906
✉️ Sending Email to: info@craftedclipz.in
==================================================
```

---

## 📋 NOTIFICATION CONTENT

Each notification includes:
- **Employee Name**
- **Action** (Check-In or Check-Out)
- **Date & Time**
- **GPS Location** (coordinates)
- **Distance from Office** (in meters)

---

## 🆓 RECOMMENDED SETUP (FREE)

For a completely free solution:

1. **Email**: Use EmailJS (FREE tier - 200 emails/month)
2. **WhatsApp**: Use CallMeBot (FREE - unlimited messages)

This gives you automatic notifications without any cost!

---

## ⚠️ IMPORTANT NOTES

1. **EmailJS Free Tier**: 200 emails/month
2. **CallMeBot**: Free but may have delays (1-2 seconds)
3. **Twilio**: Paid but most reliable for production
4. **Browser Console**: Always check F12 console for debug info

---

## 🛠️ QUICK START (5 Minutes)

1. **EmailJS Setup**: 3 minutes
   - Sign up → Add service → Create template → Copy keys

2. **CallMeBot Setup**: 2 minutes
   - Add contact → Send message → Get API key

3. **Update script.js**: 1 minute
   - Paste your keys in CONFIG section

4. **Test**: 30 seconds
   - Check in → Verify notifications

---

## 🆘 TROUBLESHOOTING

### Email Not Sending?
- Check EmailJS console for errors
- Verify Service ID, Template ID, and Public Key
- Check browser console (F12) for error messages

### WhatsApp Not Sending?
- **CallMeBot**: Make sure you sent the registration message
- **Twilio**: Verify Account SID and Auth Token
- Check if phone number format is correct (+917418167906)

### Still Not Working?
- Open browser console (F12)
- Look for error messages in red
- Check that you're connected to internet
- Try in a different browser (Chrome recommended)

---

## 📞 SUPPORT

If you need help setting up:
1. Check browser console for errors
2. Verify all API keys are correct
3. Test with a simple check-in
4. Review the notification logs

The system is ready to send notifications - just add your API keys! 🚀
