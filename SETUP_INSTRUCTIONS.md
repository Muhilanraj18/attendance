# 🚀 Quick Setup Instructions

## Step-by-Step Setup (5 minutes)

### ⚡ Step 1: Configure Office Location (2 minutes)

1. Open `script.js`
2. Find lines 9-13 (OFFICE_LOCATION)
3. Get your office coordinates:
   - Go to [Google Maps](https://www.google.com/maps)
   - Right-click on your office location
   - Click the coordinates that appear (e.g., "11.0168, 76.9558")
   - Copy them
4. Replace in code:
   ```javascript
   const OFFICE_LOCATION = {
       latitude: 11.0168,    // ← Your latitude
       longitude: 76.9558,   // ← Your longitude
       radius: 5
   };
   ```

---

### 📧 Step 2: Setup EmailJS (3 minutes)

#### A. Create Account
1. Visit: [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **Sign Up**
3. Enter email and password
4. Verify email

#### B. Add Email Service
1. Dashboard → **Email Services** → **Add New Service**
2. Choose **Gmail** (or your provider)
3. Click **Connect Account**
4. Authorize access
5. **Copy the Service ID** (e.g., `service_abc123`)

#### C. Create Email Template
1. Dashboard → **Email Templates** → **Create New Template**
2. Template Name: `Attendance Alert`
3. Copy this template:

```
Subject: Attendance {{action}} - {{employee_name}}

ATTENDANCE NOTIFICATION
━━━━━━━━━━━━━━━━━━━━━

Employee: {{employee_name}}
Action: {{action}}
Date: {{date}}
Time: {{time}}

Location Details:
• Distance from Office: {{distance}} meters
• Status: {{status}}
• GPS: {{location_lat}}, {{location_lng}}

━━━━━━━━━━━━━━━━━━━━━
Automated Attendance System
```

4. Save and **copy the Template ID** (e.g., `template_xyz789`)

#### D. Get Public Key
1. Dashboard → **Account** → **General**
2. Find **Public Key**
3. Copy it (e.g., `AbcD3fGhIjKlMnOpQr`)

#### E. Update Code
Open `script.js`, find lines 16-20, and paste your credentials:

```javascript
const EMAILJS_CONFIG = {
    serviceID: 'service_abc123',      // ← Paste Service ID
    templateID: 'template_xyz789',    // ← Paste Template ID
    publicKey: 'AbcD3fGhIjKlMnOpQr'   // ← Paste Public Key
};
```

---

### ☁️ Step 2.5: Enable Cross-Device Data Sync (Firebase)

Use this if you want attendance entered on one phone/laptop to appear on all other devices.

1. Create a Firebase project: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Open **Build > Realtime Database**
3. Click **Create Database** and choose your region
4. Start in test mode (for quick setup)
5. Go to **Rules** and use:

```json
{
    "rules": {
        ".read": true,
        ".write": true
    }
}
```

6. Copy your database URL. Example:

```text
https://your-project-id-default-rtdb.asia-southeast1.firebasedatabase.app
```

7. Open `script.js` and update `CONFIG.firebase.databaseUrl`:

```javascript
firebase: {
        databaseUrl: 'https://your-project-id-default-rtdb.asia-southeast1.firebasedatabase.app',
        attendancePath: 'attendanceData',
        notificationPath: 'notificationLog'
}
```

8. Deploy/update on GitHub Pages.

Result:
- Attendance is saved locally and to cloud.
- Other devices auto-sync every 15 seconds.
- If cloud is unavailable, local storage still works.

---

### 🌐 Step 3: Run the Application

#### Option A: Using Live Server (Recommended)
1. Install [Visual Studio Code](https://code.visualstudio.com/)
2. Install "Live Server" extension
3. Right-click `index.html`
4. Click **Open with Live Server**
5. Browser opens automatically at `http://127.0.0.1:5500`

#### Option B: Using Python
```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

#### Option C: Using Node.js
```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server

# Then open: http://localhost:8080
```

#### ⚠️ Important:
- **Must use HTTPS or localhost** (http://localhost or http://127.0.0.1)
- Geolocation API doesn't work with `file://` protocol
- Don't just double-click the HTML file

---

### 📍 Step 4: Grant Location Permission

1. When browser asks for location access, click **Allow**
2. If blocked:
   - Chrome: Click 🔒 (lock icon) in address bar → Site settings → Location → Allow
   - Firefox: Click 🔒 → Permissions → Location → Allow
   - Safari: Preferences → Websites → Location → Allow

---

### ✅ Step 5: Test Everything

#### Test 1: Location Tracking
- [ ] Green banner appears: "Inside office area"
- [ ] Distance shows in meters
- [ ] Try moving around (distance updates)

#### Test 2: Employee Selection
- [ ] Select "John Doe" from dropdown
- [ ] Buttons should enable (if time & location OK)

#### Test 3: Check-In
- [ ] Change system time to 9:00 AM (for testing)
- [ ] Ensure you're within 5m radius
- [ ] Click **CHECK IN**
- [ ] Success message appears
- [ ] Record appears in table

#### Test 4: Email
- [ ] Check your email inbox
- [ ] Should receive attendance notification
- [ ] Verify all details are correct

#### Test 5: Check-Out
- [ ] Change system time to 5:30 PM
- [ ] Click **CHECK OUT**
- [ ] Success message appears
- [ ] Table updates with OUT time

#### Test 6: Export
- [ ] Click **Export CSV**
- [ ] File downloads
- [ ] Click **Export Excel**
- [ ] File downloads

---

## 🎯 Testing Outside Office

To test geo-fencing:

### Method 1: Change Office Coordinates (Temporary)
```javascript
// In script.js, temporarily set office location to your current location
const OFFICE_LOCATION = {
    latitude: YOUR_CURRENT_LATITUDE,
    longitude: YOUR_CURRENT_LONGITUDE,
    radius: 5
};
```

### Method 2: Increase Radius (Testing Only)
```javascript
// Temporarily increase radius to 1000 meters for testing
const OFFICE_LOCATION = {
    latitude: 11.0168,
    longitude: 76.9558,
    radius: 1000  // ← Increase for testing
};
```

**Remember to revert before actual use!**

---

## 🐛 Troubleshooting

### Problem: "Checking location..." forever
**Solution:**
- Grant location permission
- Ensure HTTPS or localhost
- Check browser console for errors
- Try different browser

### Problem: Buttons stay disabled
**Solution:**
- Select employee first
- Check time (8:30-10 AM for IN, 5-7 PM for OUT)
- Verify location is within 5m
- Refresh page

### Problem: Email not received
**Solution:**
- Verify EmailJS credentials
- Check spam folder
- Check EmailJS dashboard quota
- Verify internet connection
- Check browser console for errors

### Problem: Location shows "Outside" but you're inside
**Solution:**
- GPS accuracy ±5-10m (normal)
- Try moving to window/outdoors
- Wait 30 seconds for GPS to stabilize
- Check if coordinates are correct

### Problem: Export not working
**Solution:**
- Ensure records exist
- Check browser console
- Try different browser
- Verify SheetJS library loaded

---

## 📊 Viewing Stored Data

Want to see stored attendance data?

1. Open Browser DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Expand **Local Storage**
4. Click your domain (e.g., `http://localhost:8000`)
5. Look for `attendanceRecords` key
6. Click to view JSON data

---

## 🔄 Reset Everything

To start fresh:

```javascript
// In browser console (F12), type:
localStorage.clear()
location.reload()
```

Or:
1. DevTools (F12) → Application → Local Storage
2. Right-click → Clear
3. Refresh page

---

## 📱 Mobile Testing

1. Ensure computer and phone on same WiFi
2. Find computer's local IP:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig`
3. On phone browser, visit: `http://YOUR_IP:8000`
4. Grant location permission
5. Test attendance

---

## ✨ You're All Set!

The system is now ready to use. Here's what you can do:

- ✅ Mark attendance with geo-fencing
- ✅ Receive email notifications
- ✅ View attendance reports
- ✅ Filter by timeline (daily/weekly/monthly/yearly)
- ✅ Export to CSV/Excel
- ✅ Track multiple employees

---

## 🎓 Next Steps

1. **Customize Employees**: Edit employee names in `index.html` (lines 35-37)
2. **Adjust Time Restrictions**: Modify in `script.js` (lines 22-25)
3. **Change Radius**: Update in `script.js` (line 13)
4. **Customize UI**: Edit colors in `styles.css`

---

## 📞 Need Help?

Check these in order:
1. Browser Console (F12) - shows detailed errors
2. `README.md` - comprehensive documentation
3. EmailJS documentation - for email issues
4. Stack Overflow - for technical problems

---

**Happy Attendance Tracking! 🎉**
