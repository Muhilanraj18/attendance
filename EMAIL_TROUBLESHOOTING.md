# 🔧 Email Not Working? Troubleshooting Guide

## 🧪 Step 1: Test Email Function

I've created a test page for you! Open this file in your browser:
```
test-email.html
```

This will:
1. Check if EmailJS is loaded
2. Send a test email
3. Show detailed error messages if something fails

---

## ✅ Common Issues & Solutions

### Issue 1: Template Variable Mismatch

**Your EmailJS template MUST have these exact variable names:**

```
{{employee_name}}
{{action}}
{{date}}
{{time}}
{{phone}}
{{email}}
{{location}}
{{distance}}
```

**To Fix:**
1. Go to EmailJS dashboard
2. Open your template: `template_fnkqy1l`
3. Make sure ALL variable names match exactly (case-sensitive!)
4. Example template:

```
Subject: 🔔 Attendance Alert - {{action}}

Employee Name: {{employee_name}}
Action: {{action}}
Date: {{date}}
Time: {{time}}

Location Details:
📍 Coordinates: {{location}}
📏 Distance from office: {{distance}}

Phone: {{phone}}
Email: {{email}}

---
This is an automated notification from the Attendance Management System.
```

---

### Issue 2: Email Service Not Connected

**Check your EmailJS service:**
1. Go to EmailJS → Email Services
2. Your service `service_46oqxif` should show as "Connected"
3. If not connected:
   - Click "Reconnect"
   - Sign in with your Gmail account
   - Allow EmailJS permissions

---

### Issue 3: Incorrect "From" Email

**EmailJS needs to know which email to send FROM:**
1. Go to EmailJS → Email Services
2. Click on `service_46oqxif`
3. Make sure it's connected to your Gmail account
4. The "From" email should be the Gmail you signed in with

---

### Issue 4: Template Not Saved Properly

**Verify your template:**
1. Go to EmailJS → Email Templates
2. Open `template_fnkqy1l`
3. Click "Test it" button
4. Fill in test values for each variable
5. Send test → Check if you receive it

---

### Issue 5: Browser Console Errors

**Check for errors:**
1. Open your attendance page
2. Press **F12** (Developer Tools)
3. Go to **Console** tab
4. Try to check in
5. Look for RED error messages

**Common errors:**

❌ `emailjs is not defined` 
→ EmailJS library not loaded, check internet connection

❌ `Service ID not found`
→ Wrong Service ID, verify: `service_46oqxif`

❌ `Template ID not found`
→ Wrong Template ID, verify: `template_fnkqy1l`

❌ `Public key invalid`
→ Wrong Public Key, verify: `kLSpBWg3gj_fdFDZV`

❌ `Failed to send email`
→ Check EmailJS dashboard for quota/account issues

---

## 🔍 Debug Checklist

Run through this checklist:

### In EmailJS Dashboard:
- [ ] Account is verified (check email)
- [ ] Email service `service_46oqxif` exists
- [ ] Email service shows as "Connected"
- [ ] Template `template_fnkqy1l` exists
- [ ] Template has all 8 variables: employee_name, action, date, time, phone, email, location, distance
- [ ] Template test sends successfully
- [ ] Not exceeded free tier limit (200 emails/month)

### In Your Code:
- [ ] `script.js` has correct Service ID
- [ ] `script.js` has correct Template ID  
- [ ] `script.js` has correct Public Key
- [ ] EmailJS SDK loads in `index.html` (line 12)
- [ ] No JavaScript errors in console

### When Testing:
- [ ] Internet connection is working
- [ ] Location permission is granted
- [ ] Within 50m of office location
- [ ] Employee is selected
- [ ] Check-in button is clicked
- [ ] Wait 30-60 seconds for email
- [ ] Check spam/junk folder

---

## 🧪 Quick Test Steps

1. **Open test-email.html in browser**
   ```
   Right-click → Open with → Chrome/Edge
   ```

2. **Click "Check EmailJS Status"**
   - Should show: "✅ EmailJS library loaded successfully!"
   - If error, check internet connection

3. **Click "Send Test Email"**
   - Should show: "✅ Email Sent Successfully!"
   - If error, read the error message carefully

4. **Check inbox at info@craftedclipz.in**
   - Wait 1-2 minutes
   - Check spam folder
   - Look for subject: "🔔 Attendance Alert - TEST CHECK-IN"

5. **Check browser console (F12)**
   - Look for "✅ SUCCESS!" message
   - Or "❌ FAILED!" with error details

---

## 📧 Expected Email Content

You should receive an email like this:

```
From: [Your Gmail connected to EmailJS]
To: info@craftedclipz.in
Subject: 🔔 Attendance Alert - CHECK-IN

Employee Name: Babu hussian
Action: CHECK-IN
Date: February 1, 2026
Time: 2:30:45 PM

Location Details:
📍 Coordinates: 8.1848938, 77.3947
📏 Distance from office: 25.43m

Phone: +917418167906
Email: info@craftedclipz.in

---
This is an automated notification from the Attendance Management System.
```

---

## 🆘 Still Not Working?

If emails still don't arrive after testing:

1. **Verify EmailJS Account Status**
   - Log into EmailJS dashboard
   - Check if account needs verification
   - Check if you've exceeded free tier (200 emails/month)

2. **Try a Different Template**
   - Create a new simple template in EmailJS
   - Test with just 2-3 variables first
   - Then add more variables once working

3. **Check Gmail Account**
   - Make sure the Gmail connected to EmailJS is active
   - Check if Gmail is blocking EmailJS (check Gmail settings)
   - Try disconnecting and reconnecting the service

4. **Browser Console Logs**
   - Share the console errors/logs
   - Look for specific error messages
   - Check Network tab (F12 → Network) for failed requests

---

## 💡 Alternative: Direct Email Link

If EmailJS continues to fail, we can use a mailto link as backup:
- Opens default email client
- User clicks send manually
- No API setup needed

Let me know if you want to implement this as a fallback option!

---

## ✅ Next Steps

1. **Open test-email.html** and run both tests
2. **Check browser console** (F12) for errors
3. **Verify EmailJS dashboard** settings
4. **Report back** what error messages you see

I'll help you fix the specific issue once we identify it! 🚀
