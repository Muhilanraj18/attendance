# 📧 EmailJS Automatic Email Setup

This system now uses **EmailJS** to send automatic emails when employees check in or check out. No backend server needed!

---

## ✅ Quick Setup (5 minutes)

### Step 1: Create EmailJS Account

1. Go to **[EmailJS.com](https://www.emailjs.com/)** 
2. Click **Sign Up** and create a free account
3. Verify your email

### Step 2: Create Gmail Service

1. In EmailJS dashboard, click **Email Services** on the left
2. Click **Add Service**
3. Select **Gmail**
4. Click **Connect Gmail**
5. Grant permission to your Gmail account (use the account you want to send from)
6. Click **Create Service** — you'll get a **Service ID** (looks like `service_xxxxxxx`)
7. Save it

### Step 3: Create Email Template

1. Click **Email Templates** on the left
2. Click **Create New Template**
3. Name it: `Attendance Alert`
4. Use this template content:

```
Subject: 🔔 Attendance Alert - {{action}}

Hello,

Employee {{employee_name}} has {{action}}.

Date: {{date}}
Time: {{time}}
Phone: {{phone}}
Email: {{email}}
Location: {{location}}
Distance from Office: {{distance}}

This is an automated notification from the Attendance System.

Best regards,
Attendance System
```

5. Click **Save** — you'll get a **Template ID** (looks like `template_xxxxxxx`)

### Step 4: Update Configuration

Open **script.js** and find the `CONFIG` section (around line 10):

```javascript
const CONFIG = {
    notificationEmail: 'info@craftedclipz.in',  // Where to send emails
    emailjs: {
        serviceId: 'service_YOUR_SERVICE_ID_HERE',    // Replace this
        templateId: 'template_YOUR_TEMPLATE_ID_HERE', // Replace this  
        publicKey: 'YOUR_PUBLIC_KEY_HERE'             // Replace this
    },
    // ... rest of config
};
```

Replace with your actual IDs:
- **serviceId**: From Step 2
- **templateId**: From Step 3
- **publicKey**: From Step 5 below

### Step 5: Get Your Public Key

1. In EmailJS dashboard, click **Account** on the left
2. Copy the **Public Key** (top of the page)
3. Paste it into the config above

### Step 6: Test It

1. Open the app in browser: `http://localhost:3000/index.html` or open `index.html` directly
2. Select an employee
3. Click **Check In**
4. Check the email inbox — you should receive an attendance alert email ✅

---

## 🔄 How It Works

```
Browser (Frontend)
    ↓
    └→ Employee clicks "Check In" or "Check Out"
         ↓
         └→ JavaScript sends data to EmailJS
              ↓
              └→ EmailJS connects to Gmail using your service
                   ↓
                   └→ Email sent to {{email}} immediately ✅
```

**No backend server needed!** Everything happens in the browser.

---

## ⚙️ Configuration Reference

| Setting | Where to Find | Example |
|---------|---------------|---------|
| `serviceId` | EmailJS → Email Services | `service_46oqxif` |
| `templateId` | EmailJS → Email Templates | `template_fnkqy1l` |
| `publicKey` | EmailJS → Account | `kLSpBWg3gj_fdFDZV` |
| `notificationEmail` | Where inbox goes to | `info@craftedclipz.in` |

### Example Config

```javascript
const CONFIG = {
    notificationPhone: '+917418167906',
    notificationEmail: 'info@craftedclipz.in',  // This is where emails are sent
    emailjs: {
        serviceId: 'service_46oqxif',           // Gmail service you created
        templateId: 'template_fnkqy1l',         // Email template
        publicKey: 'kLSpBWg3gj_fdFDZV'          // Your public key
    },
    // ... other config
};
```

---

## 🐛 Troubleshooting

### ❌ "EmailJS not loaded"
- Make sure the EmailJS library script is in `index.html`
- Check browser console (F12) for errors

### ❌ "Email not sending"
1. Check browser console (F12)
2. Verify `serviceId` and `templateId` are correct in config
3. Make sure Gmail service is connected in EmailJS dashboard
4. Check that template variable names match (use **{{variable_name}}** exactly)

### ❌ "Invalid Service ID"
- Go to EmailJS dashboard → Email Services
- Copy the exact `service_xxx` ID
- Paste into config again

### ❌ "Template not found"
- Go to EmailJS dashboard → Email Templates
- Copy the exact `template_xxx` ID
- Make sure template is published

### ❌ Still not working?
1. Open browser console: Press **F12**
2. Go to **Console** tab
3. Try to Check In again
4. Look for red error messages
5. Copy the error message and troubleshoot based on it

---

## ✅ Verification Checklist

- [ ] EmailJS account created
- [ ] Gmail service connected (you have a `service_id`)
- [ ] Email template created (you have a `template_id`)
- [ ] Public key added to config
- [ ] EmailJS script loaded in HTML
- [ ] Config updated in script.js
- [ ] Browser console shows "✅ EmailJS initialized"
- [ ] Check In button triggers email
- [ ] Email received in inbox

---

## 📝 Email Variables

These variables will be auto-filled in your email template:

| Variable | Example Value |
|----------|---------------|
| `{{employee_name}}` | SUTHA KT |
| `{{action}}` | CHECK IN |
| `{{date}}` | April 3, 2026 |
| `{{time}}` | 10:30:45 AM |
| `{{phone}}` | +917418167906 |
| `{{email}}` | info@craftedclipz.in |
| `{{location}}` | 8.1848938, 77.3947 |
| `{{distance}}` | 12.50m |

---

## 🎉 That's it!

Once configured, automatic emails will send on every check-in and check-out. 

**No backend needed. No configuration files. Just configure once and it works!**

Need help? Check the console (F12) or revisit the troubleshooting section above.
