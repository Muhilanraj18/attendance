// ============================================
// EMPLOYEE ATTENDANCE SYSTEM
// Pure Frontend Implementation with LocalStorage
// ============================================

// Configuration
const CONFIG = {
    checkInWindow: { start: '00:00', end: '23:59' },  // Allow check-in anytime
    checkOutWindow: { start: '00:00', end: '23:59' }, // Allow check-out anytime
    notificationPhone: '+917418167906',
    notificationEmail: 'info@craftedclipz.in',
    officeLocation: { lat: 8.1848089, lng: 77.3948716 } // Office coordinates
};

// Global State
let currentUser = null;
let userLocation = null;
let locationDistance = null;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const adminScreen = document.getElementById('adminScreen');
const employeeIdInput = document.getElementById('employeeId');
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');
const employeeNameSpan = document.getElementById('employeeName');
const currentDateSpan = document.getElementById('currentDate');
const currentTimeSpan = document.getElementById('currentTime');
const attendanceStatusSpan = document.getElementById('attendanceStatus');
const btnCheckIn = document.getElementById('btnCheckIn');
const btnCheckOut = document.getElementById('btnCheckOut');
const checkInTimeSpan = document.getElementById('checkInTime');
const checkOutTimeSpan = document.getElementById('checkOutTime');
const workingHoursSpan = document.getElementById('workingHours');
const messageBox = document.getElementById('messageBox');
const btnAdminView = document.getElementById('btnAdminView');
const btnBackToDashboard = document.getElementById('btnBackToDashboard');
const loginError = document.getElementById('loginError');
const recordsTableBody = document.getElementById('recordsTableBody');
const filterEmployee = document.getElementById('filterEmployee');
const filterDate = document.getElementById('filterDate');
const btnClearFilters = document.getElementById('btnClearFilters');
const locationStatusSpan = document.getElementById('locationStatus');

// Initialize date/time immediately
if (currentDateSpan && currentTimeSpan) {
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

// ============================================
// LOCATION FUNCTIONS
// ============================================

function getLocation() {
    if (locationStatusSpan) locationStatusSpan.textContent = '📍 Detecting...';
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                calculateDistance();
                if (locationStatusSpan) {
                    locationStatusSpan.textContent = `✅ ${locationDistance ? locationDistance.toFixed(0) + 'm from office' : 'Located'}`;
                }
                console.log('✅ Location captured:', userLocation);
            },
            (error) => {
                console.warn('⚠️ Location access denied:', error.message);
                if (locationStatusSpan) locationStatusSpan.textContent = '⚠️ Location denied';
                userLocation = null;
                locationDistance = null;
            }
        );
    } else {
        console.warn('⚠️ Geolocation not supported');
        if (locationStatusSpan) locationStatusSpan.textContent = '❌ Not supported';
    }
}

function calculateDistance() {
    if (!userLocation) return;
    
    const R = 6371e3; // Earth radius in meters
    const φ1 = CONFIG.officeLocation.lat * Math.PI / 180;
    const φ2 = userLocation.lat * Math.PI / 180;
    const Δφ = (userLocation.lat - CONFIG.officeLocation.lat) * Math.PI / 180;
    const Δλ = (userLocation.lng - CONFIG.officeLocation.lng) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    locationDistance = R * c;
    console.log(`📍 Distance from office: ${locationDistance.toFixed(2)}m`);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getCurrentDateTime() {
    return new Date();
}

function formatDate(date) {
    return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatTime(date) {
    return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
    });
}

function getTimeString(date) {
    return date.toTimeString().substring(0, 5);
}

function getDateString(date) {
    return date.toISOString().split('T')[0];
}

function isTimeInWindow(currentTime, windowStart, windowEnd) {
    return currentTime >= windowStart && currentTime <= windowEnd;
}

function calculateWorkingHours(checkInTime, checkOutTime) {
    const diff = new Date(checkOutTime) - new Date(checkInTime);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes, total: diff };
}

function getAttendanceStatus(checkInTime) {
    const checkIn = new Date(checkInTime);
    const timeStr = getTimeString(checkIn);
    
    if (timeStr <= CONFIG.checkInWindow.end) {
        return 'Present';
    } else if (timeStr <= '12:00') {
        return 'Late';
    } else {
        return 'Half Day';
    }
}

// ============================================
// LOCALSTORAGE FUNCTIONS
// ============================================

function getAttendanceData() {
    const data = localStorage.getItem('attendanceData');
    return data ? JSON.parse(data) : {};
}

function saveAttendanceData(data) {
    localStorage.setItem('attendanceData', JSON.stringify(data));
}

function getTodayKey(employeeId) {
    const today = getDateString(getCurrentDateTime());
    return `${employeeId}_${today}`;
}

function getTodayAttendance(employeeId) {
    const data = getAttendanceData();
    const key = getTodayKey(employeeId);
    return data[key] || null;
}

function saveAttendance(employeeId, attendanceRecord) {
    const data = getAttendanceData();
    const key = getTodayKey(employeeId);
    data[key] = attendanceRecord;
    saveAttendanceData(data);
}

function getAllAttendanceRecords() {
    const data = getAttendanceData();
    return Object.entries(data).map(([key, value]) => ({
        key,
        ...value
    }));
}

// ============================================
// NOTIFICATION SIMULATION
// ============================================

function simulateNotification(type, employeeId, time) {
    // This simulates automatic background notification
    // In a real system, this would be handled by a backend server
    
    const message = {
        type: type,
        employee: employeeId,
        time: time,
        phone: CONFIG.notificationPhone,
        email: CONFIG.notificationEmail,
        location: userLocation
    };
    
    console.log('📱 AUTOMATIC NOTIFICATION TRIGGERED (Simulated)');
    console.log('='.repeat(50));
    console.log(`Type: ${type.toUpperCase()}`);
    console.log(`Employee: ${employeeId}`);
    console.log(`Time: ${formatTime(new Date(time))}`);
    console.log(`Location: ${userLocation ? `${userLocation.lat}, ${userLocation.lng}` : 'N/A'}`);
    console.log(`Distance from office: ${locationDistance ? locationDistance.toFixed(2) + 'm' : 'N/A'}`);
    console.log(`\n📲 SMS sent to: ${CONFIG.notificationPhone}`);
    console.log(`✉️ Email sent to: ${CONFIG.notificationEmail}`);
    console.log('='.repeat(50));
    
    // Show visible notification to user
    const notifMsg = `✅ NOTIFICATION SENT!\n📲 SMS: ${CONFIG.notificationPhone}\n✉️ Email: ${CONFIG.notificationEmail}\n📍 Location: ${locationDistance ? locationDistance.toFixed(0) + 'm from office' : 'Captured'}`;
    alert(notifMsg);
    
    // Store notification log
    const notifications = JSON.parse(localStorage.getItem('notificationLog') || '[]');
    notifications.push({
        ...message,
        timestamp: new Date().toISOString(),
        status: 'sent'
    });
    localStorage.setItem('notificationLog', JSON.stringify(notifications));
    
    return message;
}

// ============================================
// MESSAGE DISPLAY
// ============================================

function showMessage(text, type = 'info') {
    messageBox.textContent = text;
    messageBox.className = `message-box ${type}`;
    
    setTimeout(() => {
        messageBox.className = 'message-box';
    }, 5000);
}

function showLoginError(text) {
    loginError.textContent = text;
    loginError.style.display = 'block';
    
    setTimeout(() => {
        loginError.style.display = 'none';
    }, 3000);
}

// ============================================
// TIME UPDATE
// ============================================

function updateDateTime() {
    const now = getCurrentDateTime();
    if (currentDateSpan) currentDateSpan.textContent = formatDate(now);
    if (currentTimeSpan) currentTimeSpan.textContent = formatTime(now);
}

// ============================================
// LOGIN SYSTEM
// ============================================

function login(employeeId) {
    if (!employeeId || employeeId.trim() === '') {
        showLoginError('Please enter Employee ID or Name');
        return false;
    }
    
    currentUser = employeeId.trim();
    employeeNameSpan.textContent = currentUser;
    
    // Switch screens
    loginScreen.classList.remove('active');
    dashboardScreen.classList.add('active');
    
    // Start location tracking
    getLocation();
    
    // Load today's attendance
    loadTodayAttendance();
    updateDateTime();
    
    return true;
}

function logout() {
    currentUser = null;
    employeeIdInput.value = '';
    dashboardScreen.classList.remove('active');
    adminScreen.classList.remove('active');
    loginScreen.classList.add('active');
}

// ============================================
// ATTENDANCE FUNCTIONS
// ============================================

function loadTodayAttendance() {
    const attendance = getTodayAttendance(currentUser);
    
    if (attendance) {
        // Already checked in
        checkInTimeSpan.textContent = formatTime(new Date(attendance.checkInTime));
        
        if (attendance.checkOutTime) {
            // Already checked out
            checkOutTimeSpan.textContent = formatTime(new Date(attendance.checkOutTime));
            const { hours, minutes } = calculateWorkingHours(attendance.checkInTime, attendance.checkOutTime);
            workingHoursSpan.textContent = `${hours}h ${minutes}m`;
            attendanceStatusSpan.textContent = attendance.status;
            attendanceStatusSpan.className = `value status-${attendance.status.toLowerCase().replace(' ', '-')}`;
            
            btnCheckIn.disabled = true;
            btnCheckOut.disabled = true;
            showMessage('You have already completed attendance for today', 'info');
        } else {
            // Checked in, not checked out
            btnCheckIn.disabled = true;
            btnCheckOut.disabled = false;
            attendanceStatusSpan.textContent = 'Checked In';
            attendanceStatusSpan.className = 'value status-present';
        }
    } else {
        // No attendance today
        btnCheckIn.disabled = false;
        btnCheckOut.disabled = true;
        attendanceStatusSpan.textContent = 'Not Marked';
        attendanceStatusSpan.className = 'value status-pending';
    }
}

function checkIn() {
    const now = getCurrentDateTime();
    const currentTime = getTimeString(now);
    
    // Check if already checked in
    const existing = getTodayAttendance(currentUser);
    if (existing) {
        showMessage('You have already checked in today', 'error');
        return;
    }
    
    // Check time window
    if (!isTimeInWindow(currentTime, CONFIG.checkInWindow.start, CONFIG.checkInWindow.end)) {
        showMessage(`Check-in is only allowed between ${CONFIG.checkInWindow.start} and ${CONFIG.checkInWindow.end}`, 'error');
        return;
    }
    
    // Save attendance
    const attendanceRecord = {
        employeeId: currentUser,
        date: getDateString(now),
        checkInTime: now.toISOString(),
        checkOutTime: null,
        status: getAttendanceStatus(now.toISOString()),
        workingHours: null,
        location: userLocation,
        distance: locationDistance
    };
    
    saveAttendance(currentUser, attendanceRecord);
    
    // Simulate automatic notification
    simulateNotification('check-in', currentUser, now.toISOString());
    
    // Update UI
    loadTodayAttendance();
    showMessage('✓ Check-In Successful! Notification sent automatically.', 'success');
}

function checkOut() {
    const now = getCurrentDateTime();
    const currentTime = getTimeString(now);
    
    // Check if checked in
    const existing = getTodayAttendance(currentUser);
    if (!existing) {
        showMessage('You must check in before checking out', 'error');
        return;
    }
    
    if (existing.checkOutTime) {
        showMessage('You have already checked out today', 'error');
        return;
    }
    
    // Check time window
    if (!isTimeInWindow(currentTime, CONFIG.checkOutWindow.start, CONFIG.checkOutWindow.end)) {
        showMessage(`Check-out is only allowed between ${CONFIG.checkOutWindow.start} and ${CONFIG.checkOutWindow.end}`, 'error');
        return;
    }
    
    // Update attendance
    const { hours, minutes } = calculateWorkingHours(existing.checkInTime, now.toISOString());
    existing.checkOutTime = now.toISOString();
    existing.workingHours = `${hours}h ${minutes}m`;
    
    saveAttendance(currentUser, existing);
    
    // Simulate automatic notification
    simulateNotification('check-out', currentUser, now.toISOString());
    
    // Update UI
    loadTodayAttendance();
    showMessage('✓ Check-Out Successful! Notification sent automatically.', 'success');
}

// ============================================
// ADMIN PANEL
// ============================================

function showAdminPanel() {
    dashboardScreen.classList.remove('active');
    adminScreen.classList.add('active');
    populateEmployeeFilter();
    loadAllRecords();
}

function backToDashboard() {
    adminScreen.classList.remove('active');
    dashboardScreen.classList.add('active');
    loadTodayAttendance();
}

function populateEmployeeFilter() {
    const records = getAllAttendanceRecords();
    const employees = [...new Set(records.map(r => r.employeeId))];
    
    filterEmployee.innerHTML = '<option value="all">All Employees</option>';
    employees.forEach(emp => {
        const option = document.createElement('option');
        option.value = emp;
        option.textContent = emp;
        filterEmployee.appendChild(option);
    });
}

function loadAllRecords() {
    const records = getAllAttendanceRecords();
    const selectedEmployee = filterEmployee.value;
    const selectedDate = filterDate.value;
    
    // Apply filters
    let filteredRecords = records;
    
    if (selectedEmployee !== 'all') {
        filteredRecords = filteredRecords.filter(r => r.employeeId === selectedEmployee);
    }
    
    if (selectedDate) {
        filteredRecords = filteredRecords.filter(r => r.date === selectedDate);
    }
    
    // Sort by date descending
    filteredRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Render table
    if (filteredRecords.length === 0) {
        recordsTableBody.innerHTML = '<tr><td colspan="6" class="no-records">No records found</td></tr>';
        return;
    }
    
    recordsTableBody.innerHTML = filteredRecords.map(record => {
        const checkIn = formatTime(new Date(record.checkInTime));
        const checkOut = record.checkOutTime ? formatTime(new Date(record.checkOutTime)) : '--';
        const hours = record.workingHours || '--';
        const statusClass = record.status.toLowerCase().replace(' ', '-');
        
        return `
            <tr>
                <td>${record.employeeId}</td>
                <td>${new Date(record.date).toLocaleDateString('en-IN')}</td>
                <td>${checkIn}</td>
                <td>${checkOut}</td>
                <td>${hours}</td>
                <td><span class="status-badge ${statusClass}">${record.status}</span></td>
            </tr>
        `;
    }).join('');
}

function clearFilters() {
    filterEmployee.value = 'all';
    filterDate.value = '';
    loadAllRecords();
}

// ============================================
// EVENT LISTENERS
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Loaded');
    
    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            console.log('Login button clicked');
            login(employeeIdInput.value);
        });
    } else {
        console.error('❌ Login button not found!');
    }

    if (employeeIdInput) {
        employeeIdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('Enter key pressed');
                login(employeeIdInput.value);
            }
        });
    } else {
        console.error('❌ Employee input not found!');
    }

    if (btnLogout) btnLogout.addEventListener('click', logout);
    if (btnCheckIn) btnCheckIn.addEventListener('click', checkIn);
    if (btnCheckOut) btnCheckOut.addEventListener('click', checkOut);
    if (btnAdminView) btnAdminView.addEventListener('click', showAdminPanel);
    if (btnBackToDashboard) btnBackToDashboard.addEventListener('click', backToDashboard);
    if (filterEmployee) filterEmployee.addEventListener('change', loadAllRecords);
    if (filterDate) filterDate.addEventListener('change', loadAllRecords);
    if (btnClearFilters) btnClearFilters.addEventListener('click', clearFilters);
    
    console.log('✅ All event listeners attached');
});

// ============================================
// INITIALIZATION
// ============================================

console.log('%c🎯 Employee Attendance System Initialized', 'color: #4F46E5; font-size: 16px; font-weight: bold;');
console.log('%c📌 IMPORTANT: Automatic Notifications are SIMULATED', 'color: #F59E0B; font-size: 14px;');
console.log('%cIn a production environment with a backend server:', 'color: #6B7280;');
console.log('  • SMS notifications would be sent via Twilio/AWS SNS');
console.log('  • Email notifications would be sent via SendGrid/AWS SES');
console.log('  • These would trigger automatically without user interaction');
console.log('%cCheck browser console for notification simulation logs', 'color: #10B981; font-size: 12px;');
function initializeEmailJS() {
    // Skip if not configured
    if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
        console.log('EmailJS not configured - attendance will work without email notifications');
        return;
    }
    
    try {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('EmailJS initialized successfully');
    } catch (error) {
        console.error('EmailJS initialization failed:', error);
        console.log('Attendance will work without email notifications');
    }
}

// ===========================
// GEOLOCATION & DISTANCE CALCULATION
// ===========================

/**
 * Start tracking user's location continuously
 */
function startLocationTracking() {
    if (!navigator.geolocation) {
        updateLocationStatus('error', '❌', 'Geolocation not supported by browser');
        disableAttendanceButtons();
        return;
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
        handleLocationSuccess,
        handleLocationError,
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    // Watch position continuously
    navigator.geolocation.watchPosition(
        handleLocationSuccess,
        handleLocationError,
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

/**
 * Handle successful location retrieval
 */
function handleLocationSuccess(position) {
    currentPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };

    // Calculate distance from office
    distanceFromOffice = calculateDistance(
        currentPosition.latitude,
        currentPosition.longitude,
        OFFICE_LOCATION.latitude,
        OFFICE_LOCATION.longitude
    );

    // Update distance display
    elements.distanceDisplay.textContent = `${distanceFromOffice.toFixed(2)} m`;

    // Check if inside office radius
    isInsideOffice = distanceFromOffice <= OFFICE_LOCATION.radius;

    if (isInsideOffice) {
        updateLocationStatus('inside', '✅', `Inside office area (${distanceFromOffice.toFixed(2)}m)`);
    } else {
        updateLocationStatus('outside', '⛔', `Outside office area (${distanceFromOffice.toFixed(2)}m away)`);
    }

    updateButtonStates();
}

/**
 * Handle location retrieval error
 */
function handleLocationError(error) {
    let errorMessage = '';
    
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access.';
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
        case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        default:
            errorMessage = 'Unknown error occurred.';
    }

    updateLocationStatus('error', '❌', errorMessage);
    disableAttendanceButtons();
    console.error('Geolocation error:', error);
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

/**
 * Update location status banner
 */
function updateLocationStatus(status, icon, text) {
    elements.locationStatus.className = `status-banner ${status}`;
    elements.statusIcon.textContent = icon;
    elements.statusText.textContent = text;
}

// ===========================
// TIME & DATE FUNCTIONS
// ===========================

/**
 * Start the real-time clock
 */
function startClock() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

/**
 * Update date and time display
 */
function updateDateTime() {
    const now = new Date();
    
    // Format date
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    elements.currentDate.textContent = now.toLocaleDateString('en-US', dateOptions);
    
    // Format time
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    elements.currentTime.textContent = now.toLocaleTimeString('en-US', timeOptions);
}

/**
 * Get current date in YYYY-MM-DD format
 */
function getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

/**
 * Get current time in HH:MM:SS format
 */
function getCurrentTime() {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
}

/**
 * Check if current time is within allowed time range
 */
function isTimeAllowed(type) {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM
    
    const restriction = TIME_RESTRICTIONS[type];
    return currentTime >= restriction.start && currentTime <= restriction.end;
}

// ===========================
// ATTENDANCE LOGIC
// ===========================

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Employee selection change
    elements.employeeSelect.addEventListener('change', updateButtonStates);
    
    // Check-in button
    elements.btnCheckIn.addEventListener('click', handleCheckIn);
    
    // Check-out button
    elements.btnCheckOut.addEventListener('click', handleCheckOut);
    
    // Filter buttons
    elements.filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            elements.filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            loadAttendanceData();
        });
    });
    
    // Export buttons
    elements.btnExportCSV.addEventListener('click', exportToCSV);
    elements.btnExportExcel.addEventListener('click', exportToExcel);
    
    // Backup and Restore buttons
    const btnBackupData = document.getElementById('btnBackupData');
    const btnRestoreData = document.getElementById('btnRestoreData');
    const fileRestore = document.getElementById('fileRestore');
    
    if (btnBackupData) {
        btnBackupData.addEventListener('click', backupAttendanceData);
    }
    
    if (btnRestoreData) {
        btnRestoreData.addEventListener('click', () => fileRestore.click());
    }
    
    if (fileRestore) {
        fileRestore.addEventListener('change', restoreAttendanceData);
    }
}

/**
 * Update button states based on conditions
 */
async function updateButtonStates() {
    const employee = elements.employeeSelect.value;
    
    if (!employee) {
        disableAttendanceButtons();
        return;
    }

    // Check if employee has already checked in today
    const todayRecord = await getTodayRecordFromDB(employee);
    
    // Check IN button conditions
    const canCheckIn = isInsideOffice && 
                       isTimeAllowed('checkIn') && 
                       !todayRecord;
    
    elements.btnCheckIn.disabled = !canCheckIn;
    
    // Check OUT button conditions
    const canCheckOut = isInsideOffice && 
                        isTimeAllowed('checkOut') && 
                        todayRecord && 
                        !todayRecord.outTime;
    
    elements.btnCheckOut.disabled = !canCheckOut;
}

/**
 * Disable all attendance buttons
 */
function disableAttendanceButtons() {
    elements.btnCheckIn.disabled = true;
    elements.btnCheckOut.disabled = true;
}

/**
 * Handle Check-In
 */
async function handleCheckIn() {
    const employee = elements.employeeSelect.value;
    
    if (!employee) {
        showMessage('Please select an employee', 'error');
        return;
    }

    if (!isInsideOffice) {
        showMessage('You are outside office location. Cannot mark attendance.', 'error');
        return;
    }

    if (!isTimeAllowed('checkIn')) {
        showMessage('Check-in is only allowed between 8:30 AM - 10:00 AM', 'error');
        return;
    }

    const todayRecord = await getTodayRecordFromDB(employee);
    if (todayRecord) {
        showMessage('You have already checked in today', 'error');
        return;
    }

    // Create attendance record
    const record = {
        employee: employee,
        date: getCurrentDate(),
        inTime: getCurrentTime(),
        outTime: null,
        distance: distanceFromOffice.toFixed(2),
        status: 'Inside'
    };

    // Save to database
    await saveAttendanceRecordToDB(record);
    
    // Send email notification
    sendEmailNotification(employee, 'IN', record);
    
    // Update UI
    showMessage(`✅ Check-in successful for ${employee} - Data saved to database`, 'success');
    await loadAttendanceData();
    updateButtonStates();
}

/**
 * Handle Check-Out
 */
async function handleCheckOut() {
    const employee = elements.employeeSelect.value;
    
    if (!employee) {
        showMessage('Please select an employee', 'error');
        return;
    }

    if (!isInsideOffice) {
        showMessage('You are outside office location. Cannot mark attendance.', 'error');
        return;
    }

    if (!isTimeAllowed('checkOut')) {
        showMessage('Check-out is only allowed between 5:00 PM - 7:00 PM', 'error');
        return;
    }

    const todayRecord = await getTodayRecordFromDB(employee);
    if (!todayRecord) {
        showMessage('Please check-in first', 'error');
        return;
    }

    if (todayRecord.outTime) {
        showMessage('You have already checked out today', 'error');
        return;
    }

    // Update record with check-out time
    todayRecord.outTime = getCurrentTime();
    await updateAttendanceRecordInDB(todayRecord);
    
    // Send email notification
    sendEmailNotification(employee, 'OUT', todayRecord);
    
    // Update UI
    showMessage(`✅ Check-out successful for ${employee} - Data saved to database`, 'success');
    await loadAttendanceData();
    updateButtonStates();
}

// ===========================
// DATA STORAGE (LocalStorage)
// ===========================

/**
 * Save attendance record to localStorage with backup
 */
function saveAttendanceRecord(record) {
    try {
        const records = getAttendanceRecords();
        records.push(record);
        const jsonData = JSON.stringify(records);
        
        // Save to main storage
        localStorage.setItem('attendanceRecords', jsonData);
        
        // Create backup copy
        localStorage.setItem('attendanceRecords_backup', jsonData);
        
        // Save timestamp of last save
        localStorage.setItem('attendanceRecords_lastSave', new Date().toISOString());
        
        console.log('✅ Attendance record saved successfully');
        console.log('Total records:', records.length);
    } catch (error) {
        console.error('❌ Failed to save attendance record:', error);
        alert('Error saving attendance! Please check storage permissions.');
    }
}

/**
 * Update existing attendance record with backup
 */
function updateAttendanceRecord(updatedRecord) {
    try {
        const records = getAttendanceRecords();
        const index = records.findIndex(r => 
            r.employee === updatedRecord.employee && 
            r.date === updatedRecord.date
        );
        
        if (index !== -1) {
            records[index] = updatedRecord;
            const jsonData = JSON.stringify(records);
            
            // Save to main storage
            localStorage.setItem('attendanceRecords', jsonData);
            
            // Create backup copy
            localStorage.setItem('attendanceRecords_backup', jsonData);
            
            // Save timestamp
            localStorage.setItem('attendanceRecords_lastSave', new Date().toISOString());
            
            console.log('✅ Attendance record updated successfully');
        }
    } catch (error) {
        console.error('❌ Failed to update attendance record:', error);
        alert('Error updating attendance! Please check storage permissions.');
    }
}

/**
 * Get all attendance records from localStorage with recovery
 */
function getAttendanceRecords() {
    try {
        // Try to get main records
        let records = localStorage.getItem('attendanceRecords');
        
        if (records) {
            return JSON.parse(records);
        }
        
        // If main is empty, try backup
        console.log('⚠️ Main storage empty, checking backup...');
        const backup = localStorage.getItem('attendanceRecords_backup');
        
        if (backup) {
            console.log('✅ Restored from backup!');
            // Restore backup to main
            localStorage.setItem('attendanceRecords', backup);
            return JSON.parse(backup);
        }
        
        // No records found
        console.log('ℹ️ No attendance records found (new system)');
        return [];
        
    } catch (error) {
        console.error('❌ Error reading attendance records:', error);
        
        // Try backup as last resort
        try {
            const backup = localStorage.getItem('attendanceRecords_backup');
            if (backup) {
                console.log('✅ Recovered from backup after error');
                return JSON.parse(backup);
            }
        } catch (backupError) {
            console.error('❌ Backup also failed:', backupError);
        }
        
        return [];
    }
}

/**
 * Get today's record for specific employee
 */
function getTodayRecord(employee) {
    const records = getAttendanceRecords();
    const today = getCurrentDate();
    return records.find(r => r.employee === employee && r.date === today);
}

/**
 * Filter records based on timeline
 */
function filterRecordsByTimeline(records, timeline) {
    const now = new Date();
    
    switch(timeline) {
        case 'daily':
            return records.filter(r => r.date === getCurrentDate());
        
        case 'weekly':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return records.filter(r => new Date(r.date) >= weekAgo);
        
        case 'monthly':
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            return records.filter(r => new Date(r.date) >= monthAgo);
        
        case 'yearly':
            const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            return records.filter(r => new Date(r.date) >= yearAgo);
        
        default:
            return records;
    }
}

// ===========================
// EMAIL NOTIFICATION
// ===========================

/**
 * Send email notification using EmailJS
 */
function sendEmailNotification(employee, action, record) {
    // Check if EmailJS is configured
    if (EMAILJS_CONFIG.serviceID === 'YOUR_SERVICE_ID' || 
        EMAILJS_CONFIG.templateID === 'YOUR_TEMPLATE_ID' ||
        EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
        console.log('EmailJS not configured. Skipping email notification.');
        console.log('Attendance marked successfully without email.');
        return;
    }

    try {
        const emailParams = {
            employee_name: employee,
            action: action,
            date: record.date,
            time: action === 'IN' ? record.inTime : record.outTime,
            distance: record.distance,
            status: record.status,
            location_lat: currentPosition ? currentPosition.latitude.toFixed(6) : 'N/A',
            location_lng: currentPosition ? currentPosition.longitude.toFixed(6) : 'N/A'
        };

        // Send email via EmailJS
        emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID,
            emailParams
        )
        .then((response) => {
            console.log('Email sent successfully:', response);
        })
        .catch((error) => {
            console.error('Email sending failed:', error);
            // Don't show error to user as attendance is already marked
        });
    } catch (error) {
        console.error('Email notification error:', error);
    }
}

// ===========================
// UI DISPLAY FUNCTIONS
// ===========================

/**
 * Show message to user
 */
function showMessage(message, type) {
    elements.messageBox.textContent = message;
    elements.messageBox.className = `message-box show ${type}`;
    
    setTimeout(() => {
        elements.messageBox.classList.remove('show');
    }, 5000);
}

/**
 * Load and display attendance data
 */
async function loadAttendanceData() {
    const allRecords = await getAttendanceRecordsFromDB();
    const filteredRecords = filterRecordsByTimeline(allRecords, currentFilter);
    
    // Update table
    if (filteredRecords.length === 0) {
        elements.attendanceTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="no-data">No attendance records found for ${currentFilter} view</td>
            </tr>
        `;
    } else {
        elements.attendanceTableBody.innerHTML = filteredRecords
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(record => `
                <tr>
                    <td>${record.employee}</td>
                    <td>${formatDate(record.date)}</td>
                    <td>${record.inTime || '--'}</td>
                    <td>${record.outTime || '--'}</td>
                    <td>${record.distance}</td>
                    <td class="status-${record.status.toLowerCase()}">${record.status}</td>
                </tr>
            `).join('');
    }
    
    // Update summary
    updateSummary(allRecords);
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

/**
 * Update attendance summary
 */
function updateSummary(records) {
    // Count unique dates for each employee
    const johnDays = new Set(records.filter(r => r.employee === 'John Doe').map(r => r.date)).size;
    const janeDays = new Set(records.filter(r => r.employee === 'Jane Smith').map(r => r.date)).size;
    
    elements.summaryJohn.textContent = `${johnDays} days`;
    elements.summaryJane.textContent = `${janeDays} days`;
}

// ===========================
// EXPORT FUNCTIONS
// ===========================

/**
 * Export to CSV
 */
async function exportToCSV() {
    const allRecords = await getAttendanceRecordsFromDB();
    const filteredRecords = filterRecordsByTimeline(allRecords, currentFilter);
    
    if (filteredRecords.length === 0) {
        showMessage('No data to export', 'error');
        return;
    }

    // Create CSV content
    let csv = 'Employee,Date,IN Time,OUT Time,Distance (m),Status\n';
    
    filteredRecords.forEach(record => {
        csv += `${record.employee},${record.date},${record.inTime || '--'},${record.outTime || '--'},${record.distance},${record.status}\n`;
    });

    // Download CSV
    downloadFile(csv, `attendance_${currentFilter}_${getCurrentDate()}.csv`, 'text/csv');
    showMessage('CSV exported successfully', 'success');
}

/**
 * Export to Excel using SheetJS
 */
async function exportToExcel() {
    const allRecords = await getAttendanceRecordsFromDB();
    const filteredRecords = filterRecordsByTimeline(allRecords, currentFilter);
    
    if (filteredRecords.length === 0) {
        showMessage('No data to export', 'error');
        return;
    }

    // Prepare data for Excel
    const data = filteredRecords.map(record => ({
        'Employee': record.employee,
        'Date': record.date,
        'IN Time': record.inTime || '--',
        'OUT Time': record.outTime || '--',
        'Distance (m)': record.distance,
        'Status': record.status
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');

    // Generate Excel file and download
    XLSX.writeFile(wb, `attendance_${currentFilter}_${getCurrentDate()}.xlsx`);
    showMessage('Excel exported successfully', 'success');
}

/**
 * Download file helper
 */
function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ===========================
// BACKUP & RESTORE FUNCTIONS
// ===========================

/**
 * Backup all attendance data to a JSON file
 */
function backupAttendanceData() {
    try {
        const allRecords = getAttendanceRecords();
        
        if (allRecords.length === 0) {
            showMessage('No data to backup', 'error');
            return;
        }

        const backupData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            totalRecords: allRecords.length,
            records: allRecords
        };

        const jsonString = JSON.stringify(backupData, null, 2);
        const filename = `attendance_backup_${getCurrentDate()}_${Date.now()}.json`;
        
        downloadFile(jsonString, filename, 'application/json');
        
        showMessage(`✅ Backup created successfully! (${allRecords.length} records)`, 'success');
        console.log('📦 Backup created:', filename);
    } catch (error) {
        console.error('❌ Backup failed:', error);
        showMessage('Backup failed! Check console for details.', 'error');
    }
}

/**
 * Restore attendance data from a JSON backup file
 */
function restoreAttendanceData(event) {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }

    if (!file.name.endsWith('.json')) {
        showMessage('Please select a valid JSON backup file', 'error');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const backupData = JSON.parse(e.target.result);
            
            // Validate backup data structure
            if (!backupData.records || !Array.isArray(backupData.records)) {
                throw new Error('Invalid backup file format');
            }

            // Ask for confirmation
            const currentRecords = getAttendanceRecords();
            const message = `Restore backup?\n\n` +
                          `Current records: ${currentRecords.length}\n` +
                          `Backup records: ${backupData.records.length}\n` +
                          `Backup date: ${new Date(backupData.exportDate).toLocaleString()}\n\n` +
                          `This will ADD backup records to existing data.`;
            
            if (!confirm(message)) {
                showMessage('Restore cancelled', 'info');
                return;
            }

            // Merge records (avoid duplicates)
            const existingRecords = getAttendanceRecords();
            const newRecords = backupData.records;
            
            // Create a Set of existing record keys
            const existingKeys = new Set(
                existingRecords.map(r => `${r.employee}_${r.date}`)
            );
            
            // Add only non-duplicate records
            let addedCount = 0;
            newRecords.forEach(record => {
                const key = `${record.employee}_${record.date}`;
                if (!existingKeys.has(key)) {
                    existingRecords.push(record);
                    addedCount++;
                }
            });

            // Save merged data
            const jsonData = JSON.stringify(existingRecords);
            localStorage.setItem('attendanceRecords', jsonData);
            localStorage.setItem('attendanceRecords_backup', jsonData);
            localStorage.setItem('attendanceRecords_lastSave', new Date().toISOString());

            showMessage(`✅ Restored ${addedCount} new records! (${existingRecords.length} total)`, 'success');
            console.log('📥 Data restored successfully');
            
            // Reload the display
            loadAttendanceData();
            
        } catch (error) {
            console.error('❌ Restore failed:', error);
            showMessage('Restore failed! Invalid backup file.', 'error');
        }
    };
    
    reader.onerror = function() {
        showMessage('Failed to read backup file', 'error');
    };
    
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

// ===========================
// CONSOLE LOG FOR DEBUGGING
// ===========================
console.log('Attendance Management System Loaded');
console.log('Office Location:', OFFICE_LOCATION);
console.log('Time Restrictions:', TIME_RESTRICTIONS);
