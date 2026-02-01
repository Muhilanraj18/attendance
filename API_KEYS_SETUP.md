# 🔑 API Keys Configuration

## ✅ What You Need

After getting your API keys from EmailJS and CallMeBot, update these lines in `script.js`:

---

## 📝 Find and Replace in script.js

Open `script.js` and find **lines 12-25** (the CONFIG section):

### 📧 EmailJS Configuration (Lines 13-15)

**FIND THIS:**
```javascript
    emailjs: {
        serviceId: 'service_xxxxxxx',  // Replace with your EmailJS Service ID
        templateId: 'template_xxxxxxx', // Replace with your EmailJS Template ID
        publicKey: 'YOUR_PUBLIC_KEY'    // Replace with your EmailJS Public Key
    },
```

**REPLACE WITH** (use YOUR actual keys):
```javascript
    emailjs: {
        serviceId: 'service_abc1234',     // ← Paste YOUR Service ID here
        templateId: 'template_xyz789',    // ← Paste YOUR Template ID here
        publicKey: 'abcXYZ123456'         // ← Paste YOUR Public Key here
    },
```

---

### 📱 CallMeBot Configuration (Line 24)

**FIND THIS:**
```javascript
        callMeBotApiKey: 'YOUR_CALLMEBOT_API_KEY' // Get from calling bot
```

**REPLACE WITH** (use YOUR actual key):
```javascript
        callMeBotApiKey: '123456'  // ← Paste YOUR CallMeBot API key here
```

---

## 🔧 Enable CallMeBot

After adding the API key, you need to enable CallMeBot function.

Find line **~270** in script.js (in the `sendWhatsApp` function):

**FIND THIS:**
```javascript
function sendWhatsApp(type, employeeId, time) {
    const message = `*Attendance Alert*\n\nEmployee: ${employeeId}\nAction: ${type.toUpperCase()}\nDate: ${formatDate(new Date(time))}\nTime: ${formatTime(new Date(time))}\nLocation: ${userLocation ? `${userLocation.lat}, ${userLocation.lng}` : 'N/A'}\nDistance: ${locationDistance ? `${locationDistance.toFixed(2)}m from office` : 'N/A'}`;
    
    // Option 1: Twilio WhatsApp API (Recommended for production)
    sendWhatsAppViaTwilio(message);
    
    // Option 2: CallMeBot API (Free alternative - uncomment to use)
    // sendWhatsAppViaCallMeBot(message);
}
```

**CHANGE TO:**
```javascript
function sendWhatsApp(type, employeeId, time) {
    const message = `*Attendance Alert*\n\nEmployee: ${employeeId}\nAction: ${type.toUpperCase()}\nDate: ${formatDate(new Date(time))}\nTime: ${formatTime(new Date(time))}\nLocation: ${userLocation ? `${userLocation.lat}, ${userLocation.lng}` : 'N/A'}\nDistance: ${locationDistance ? `${locationDistance.toFixed(2)}m from office` : 'N/A'}`;
    
    // Option 1: Twilio WhatsApp API (Recommended for production)
    // sendWhatsAppViaTwilio(message);
    
    // Option 2: CallMeBot API (Free alternative - uncomment to use)
    sendWhatsAppViaCallMeBot(message);  // ← Remove the // to enable this
}
```

**Notice:** Comment out line with `sendWhatsAppViaTwilio` and uncomment `sendWhatsAppViaCallMeBot`

---

## 🎯 Example with Real Keys

Here's what it looks like with example keys:

```javascript
const CONFIG = {
    notificationPhone: '+917418167906',
    notificationEmail: 'info@craftedclipz.in',
    officeLocation: { lat: 8.1848938, lng: 77.3947 },
    allowedRadius: 50,
    emailjs: {
        serviceId: 'service_m8k3j2p',      // ✅ Real Service ID
        templateId: 'template_9x7k2n1',    // ✅ Real Template ID
        publicKey: 'vK9mP3xR2nQ5tY8w'      // ✅ Real Public Key
    },
    whatsapp: {
        twilioAccountSid: 'YOUR_TWILIO_ACCOUNT_SID',
        twilioAuthToken: 'YOUR_TWILIO_AUTH_TOKEN',
        twilioWhatsAppNumber: 'whatsapp:+14155238886',
        
        callMeBotApiKey: '654321'           // ✅ Real CallMeBot API Key
    }
};
```

---

## ⚠️ Important Notes

### For CallMeBot:
1. **The phone number +91 7418 167 906 must also register** with CallMeBot
2. Each phone that receives messages needs its own registration
3. The API key links to the receiving phone number

### Steps for +91 7418 167 906:
1. From phone +91 7418 167 906, add +34 644 49 06 27 to contacts
2. Send: "I allow callmebot to send me messages"
3. Receive API key for that specific number
4. Use that API key in the code

### For EmailJS:
1. Free tier: 200 emails/month
2. Make sure template variables match (employee_name, action, date, time, location, distance)
3. Test in EmailJS dashboard first

---

## 🧪 Test After Setup

1. **Save** script.js
2. **Refresh** the attendance page
3. **Check in** as an employee
4. **Check:**
   - Browser console (F12) - Should show "✅ Email sent successfully!"
   - Your email (info@craftedclipz.in) - Should receive email
   - WhatsApp (+91 7418 167 906) - Should receive message

---

## 🆘 Troubleshooting

### Email not sending?
- Open browser console (F12)
- Look for EmailJS errors
- Verify all three keys are correct
- Test in EmailJS dashboard first

### WhatsApp not sending?
- Make sure CallMeBot registration is complete
- Check API key is correct (just numbers)
- Verify the receiving phone registered with CallMeBot
- Check console for error messages

### Console shows success but nothing received?
- **Email**: Check spam folder
- **WhatsApp**: Make sure receiving phone completed registration
- Wait 1-2 minutes (services may have delay)

---

## 📞 Quick Reference

| Service | What You Need | Where to Get It |
|---------|--------------|-----------------|
| EmailJS | Service ID | Email Services page |
| EmailJS | Template ID | Email Templates page |
| EmailJS | Public Key | Account → General |
| CallMeBot | API Key | WhatsApp message to +34 644 49 06 27 |

---

## ✅ Checklist

- [ ] Got EmailJS Service ID
- [ ] Got EmailJS Template ID  
- [ ] Got EmailJS Public Key
- [ ] Updated script.js lines 13-15
- [ ] Got CallMeBot API Key for +91 7418 167 906
- [ ] Updated script.js line 24
- [ ] Enabled CallMeBot in sendWhatsApp function
- [ ] Saved script.js
- [ ] Tested with a check-in
- [ ] Received email at info@craftedclipz.in
- [ ] Received WhatsApp at +91 7418 167 906

🎉 **Done! Notifications are now live!**
