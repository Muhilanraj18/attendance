# 📧� Notification Setup Guide

## Current Configuration
- **WhatsApp**: +917418167906
- **Email**: info@craftedclipz.in

---

## 📧 EMAIL SETUP (EmailJS - FREE)

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up (free account - 200 emails/month)
3. Verify your email

### Step 2: Add Email Service
1. Dashboard → **Email Services** → **Add New Service**
2. Choose **Gmail** (recommended)
3. Connect your email: info@craftedclipz.in
4. Copy the **Service ID** (example: service_abc1234)

### Step 3: Create Email Template
1. Dashboard → **Email Templates** → **Create New Template**
2. Template content:

```
Subject: Attendance Alert - {{action}}

Employee: {{employee_name}}
Action: {{action}}
Date: {{date}}
Time: {{time}}
Phone: {{phone}}
Email: {{email}}
Location: {{location}}
Distance: {{distance}}

Automated Attendance Notification
```

3. Save and copy the **Template ID** (example: template_xyz5678)

### Step 4: Get Public Key
1. Dashboard → **Account** → **General**
2. Copy your **Public Key** (example: AbC123XyZ456)

### Step 5: Update script.js
Open `script.js` and update lines 9-13:

```javascript
emailjs: {
    serviceId: 'service_abc1234',    // Your Service ID
    templateId: 'template_xyz5678',  // Your Template ID
    publicKey: 'AbC123XyZ456'        // Your Public Key
}
```

✅ **Email notifications are now active!**

---

## 💬 WHATSAPP SETUP

### Option 1: CallMeBot API (FREE - Easiest)

#### Step 1: Register Phone Number
1. Save this number in your contacts: **+34 644 44 96 29**
2. Send this WhatsApp message to that number: **I allow callmebot to send me messages**
3. Wait for reply with your API key (usually instant)

#### Step 2: Update script.js
Open `script.js` and update around line 18:

```javascript
whatsapp: {
    callMeBotApiKey: 'YOUR_API_KEY_FROM_STEP_1' // Paste the API key you received
}
```

#### Step 3: Enable CallMeBot in script.js
Find line ~240 and uncomment this line:

```javascript
// Comment out this line:
sendWhatsAppViaTwilio(message);

// Uncomment this line:
sendWhatsAppViaCallMeBot(message);
```

✅ **WhatsApp notifications are now active!**

---

### Option 2: Twilio WhatsApp API (Professional)

#### Step 1: Create Twilio Account
1. Go to https://www.twilio.com/try-twilio
2. Sign up (free trial with $15 credit)
3. Verify your phone number

#### Step 2: Set Up WhatsApp Sandbox
1. Console → Messaging → Try it out → Send a WhatsApp message
2. Follow instructions to connect your WhatsApp
3. Send the code shown to the Twilio WhatsApp number

#### Step 3: Get Credentials
1. Dashboard → Account Info
2. Copy **Account SID**
3. Copy **Auth Token**
4. WhatsApp number: **whatsapp:+14155238886** (Twilio sandbox)

#### Step 4: Update script.js
Open `script.js` and update around line 14:

```javascript
whatsapp: {
    twilioAccountSid: 'YOUR_ACCOUNT_SID',
    twilioAuthToken: 'YOUR_AUTH_TOKEN',
    twilioWhatsAppNumber: 'whatsapp:+14155238886'
}
```

✅ **Twilio WhatsApp is now active!**

---

## 🧪 Testing

1. Open `index.html`
2. Select "Babu hussian"
3. Click **CHECK IN**
4. Check:
   - ✅ Email received at info@craftedclipz.in
   - ✅ WhatsApp received at +917418167906
   - ✅ Console shows "Email sent successfully!"
   - ✅ Console shows "WhatsApp message sent successfully!"

---

## 🔧 Troubleshooting

### Email Not Received?
- Check EmailJS dashboard quota (200/month limit)
- Check spam folder
- Verify Service ID, Template ID, and Public Key are correct
- Check browser console for errors (F12)

### WhatsApp Not Received?
**CallMeBot:**
- Make sure you sent the registration message correctly
- Check if you got the API key reply
- Verify phone number format: +917418167906 (with + sign)
- Try sending the registration message again

**Twilio:**
- Verify Account SID and Auth Token are correct
- Check if WhatsApp sandbox is active
- Ensure your number is added to sandbox
- Check Twilio dashboard for error logs

### Console Errors?
- Press F12 to open Developer Tools
- Go to Console tab
- Look for red error messages
- Common issues:
  - "EmailJS not loaded" → Check if EmailJS script is in index.html
  - "CallMeBot not configured" → Set up API key
  - "Network error" → Check internet connection

---

## 💰 Cost & Limits

### EmailJS (Free Plan)
- ✅ 200 emails per month
- ✅ No credit card required
- 💵 Paid plans from $9/month for more emails

### CallMeBot (Free)
- ✅ Completely FREE forever
- ✅ No limits on messages
- ✅ No credit card required
- ⚠️ May be slower than Twilio
- ⚠️ Sometimes unreliable

### Twilio WhatsApp (Trial/Paid)
- ✅ $15 free trial credit
- 💵 After trial: ~$0.005 per message
- ✅ Very reliable
- ✅ Professional features

---

## 🎯 Recommended Setup

**For Testing:**
- Use CallMeBot (free, no signup)

**For Production:**
- Use Twilio (reliable, professional)

---

## ✅ Quick Checklist

Before using notifications:
- [ ] EmailJS account created
- [ ] Email service connected
- [ ] Email template created
- [ ] EmailJS credentials updated in script.js
- [ ] CallMeBot registered OR Twilio setup
- [ ] WhatsApp API key/credentials updated in script.js
- [ ] Tested CHECK IN notification
- [ ] Tested CHECK OUT notification
- [ ] Email received successfully
- [ ] WhatsApp received successfully

---

**Once configured, every check-in/out will automatically send email AND WhatsApp!** 📧💬

