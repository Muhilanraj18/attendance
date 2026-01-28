# 📍 How to Set Office Location (5 Meter Geo-Fence)

## ✅ Now Configured: 5 Meter Radius

The system is now set to **strict 5-meter geo-fencing**. Attendance will ONLY work when you are physically within 5 meters of the office location.

---

## 🎯 How It Works:

1. **Grant Location Permission** → Browser gets your GPS coordinates
2. **System Calculates Distance** → Using Haversine formula
3. **Within 5 meters?**
   - ✅ **YES** → Buttons ENABLED, attendance works
   - ❌ **NO** → Buttons DISABLED, shows "Outside office area"

---

## 📍 Step 1: Get Your Office Coordinates

### Method 1: Google Maps (Recommended)
1. Go to [Google Maps](https://www.google.com/maps)
2. Search for your office address
3. **Right-click** on your office building
4. Click on the **coordinates** (first option in menu)
   - Example: `11.0168, 76.9558`
5. Coordinates are now copied!

### Method 2: Your Current Location
1. Open `index.html` in browser
2. Allow location permission
3. Press **F12** (open Console)
4. Look for message like:
   ```
   Inside/Outside office area (XXXXm)
   ```
5. Type in console:
   ```javascript
   console.log('My coordinates:', currentPosition);
   ```
6. Copy the latitude and longitude values

### Method 3: Mobile Phone
1. Open Google Maps on your phone
2. Stand at your office entrance
3. Tap on the **blue dot** (your location)
4. Coordinates show at bottom
5. Tap to copy

---

## 🔧 Step 2: Update the Code

Open `script.js` and find lines 6-10:

**Change this:**
```javascript
const OFFICE_LOCATION = {
    latitude: 11.0168,    // ← CHANGE THIS
    longitude: 76.9558,   // ← CHANGE THIS
    radius: 5
};
```

**To your office coordinates:**
```javascript
const OFFICE_LOCATION = {
    latitude: 13.0827,    // ← Your office latitude
    longitude: 80.2707,   // ← Your office longitude
    radius: 5             // Keep at 5 meters
};
```

**Example Coordinates for Different Cities:**
```javascript
// Chennai
latitude: 13.0827, longitude: 80.2707

// Mumbai
latitude: 19.0760, longitude: 72.8777

// Delhi
latitude: 28.7041, longitude: 77.1025

// Bangalore
latitude: 12.9716, longitude: 77.5946

// Hyderabad
latitude: 17.3850, longitude: 78.4867
```

---

## ⚙️ Step 3: Save and Test

1. **Save** `script.js`
2. **Refresh** browser (F5)
3. **Allow** location permission
4. **Wait 5 seconds** for GPS to stabilize
5. **Check status banner:**
   - 🟢 Green = Inside (buttons enabled)
   - 🔴 Red = Outside (buttons disabled)
6. **Distance shows** in real-time

---

## 🧪 Testing the 5-Meter Geo-Fence

### Test 1: Inside Office
1. Stand **inside your office** (where you set coordinates)
2. Open `index.html`
3. Grant location permission
4. Should see: **"Inside office area (X.XXm)"** in GREEN
5. Select employee
6. Buttons should be **ENABLED** ✅

### Test 2: Outside Office
1. Walk **10 meters away** from office
2. Refresh page or wait for update
3. Should see: **"Outside office area (XXm)"** in RED
4. Buttons should be **DISABLED** ❌
5. Try clicking - error message appears

### Test 3: Distance Display
- Watch the **"Distance: X.XX m"** value
- Walk around - it updates in real-time
- When distance > 5m = buttons disable
- When distance ≤ 5m = buttons enable

---

## 📊 Understanding GPS Accuracy

### Typical Accuracy:
- **Outdoors (clear sky)**: ±3-5 meters ✅ (Best)
- **Near windows**: ±5-10 meters ⚠️ (Good)
- **Inside building**: ±10-50 meters ❌ (Poor)
- **Basement/underground**: May not work ❌

### Accuracy Factors:
✅ **Good Accuracy:**
- Clear sky view
- Multiple satellites visible
- Outdoors
- Good weather
- Modern device

❌ **Poor Accuracy:**
- Inside buildings
- Bad weather
- Tall buildings nearby
- Old device
- Few satellites

### Recommendation:
- Set office coordinates at **main entrance** or **near window**
- Test from that exact spot first
- If GPS accuracy is ±10m, consider increasing radius to 15m

---

## 🔍 Troubleshooting Geo-Fence Issues

### Issue 1: Always Shows "Outside" Even When Inside
**Possible causes:**
1. **Wrong coordinates** - Double-check your office lat/long
2. **Poor GPS signal** - Move near window
3. **GPS not stabilized** - Wait 30 seconds
4. **Wrong location set** - Verify in Google Maps

**Solution:**
```javascript
// In browser console (F12), check:
console.log('Office:', OFFICE_LOCATION);
console.log('My location:', currentPosition);
console.log('Distance:', distanceFromOffice);
```

### Issue 2: Distance Jumps Around
**This is normal!** GPS accuracy varies.
- Typical variation: ±5-10 meters
- Solution: Wait 30 seconds for GPS to stabilize
- Or increase radius to 10-15 meters

### Issue 3: Location Permission Denied
**Solution:**
1. Click 🔒 (lock icon) in browser address bar
2. Go to **Site Settings**
3. Find **Location**
4. Change to **Allow**
5. Refresh page

---

## 🎯 Advanced: Adjust Radius

If 5 meters is too strict (due to GPS accuracy), you can adjust:

```javascript
const OFFICE_LOCATION = {
    latitude: 13.0827,
    longitude: 80.2707,
    radius: 10  // ← Increase to 10-15 meters if needed
};
```

**Recommended Radius:**
- **5 meters**: High security, requires very accurate GPS
- **10 meters**: Balanced (recommended for most offices)
- **15 meters**: More lenient, accounts for GPS errors
- **25 meters**: Large office buildings

---

## ✅ Final Checklist

Before using the system:

- [ ] Got office coordinates from Google Maps
- [ ] Updated `script.js` with correct latitude/longitude
- [ ] Set radius (5-15 meters recommended)
- [ ] Saved the file
- [ ] Refreshed browser (F5)
- [ ] Granted location permission
- [ ] Waited 30 seconds for GPS to stabilize
- [ ] Verified green "Inside office area" message
- [ ] Tested from inside office - buttons enabled
- [ ] Tested from outside office - buttons disabled
- [ ] Distance display shows correct value

---

## 📱 Testing Workflow

**Daily Use:**
1. Arrive at office
2. Open attendance system
3. Wait for location to load (5-10 seconds)
4. Check status banner is GREEN
5. Select your name
6. Click CHECK IN
7. Done! ✅

**End of Day:**
1. Open attendance system
2. Wait for location confirmation
3. Click CHECK OUT
4. Done! ✅

---

## 🔒 Security Note

The 5-meter geo-fence ensures attendance can ONLY be marked when physically present at office. No remote marking possible!

**What blocks remote attendance:**
- ✅ GPS distance check (within 5m)
- ✅ Real-time location tracking
- ✅ No manual override
- ✅ Automatic button disable when outside

---

## 💡 Pro Tips

1. **Test coordinates first**: Stand at office, check if "Inside" shows
2. **Bookmark the page**: Quick access on mobile
3. **Use WiFi + GPS**: Better accuracy than GPS alone
4. **Wait for GPS**: Don't rush, let it stabilize
5. **Clear view**: Near windows = better accuracy

---

**Your geo-fencing is now active! 🎉**

Location permission → Within 5 meters → Attendance works!
