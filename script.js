// ============================================
// EMPLOYEE ATTENDANCE SYSTEM
// Simple No-Login Version with LocalStorage
// ============================================

// Configuration
const CONFIG = {
    notificationPhone: '+917418167906',
    notificationEmail: 'info@craftedclipz.in',
    officeLocation: { lat: 8.1848089, lng: 77.3948716 }
};

// Global State
let currentUser = null;
let userLocation = null;
let locationDistance = null;

// Clear old data from localStorage
console.log('🗑️ Clearing old attendance data...');
localStorage.removeItem('attendanceData');
localStorage.removeItem('notificationLog');
localStorage.removeItem('attendanceRecords');
localStorage.removeItem('attendanceRecords_lastSave');
localStorage.removeItem('attendanceRecords_backup');
console.log('✅ Old data cleared - Fresh start!');

// DOM Elements
const dashboardScreen = document.getElementById('dashboardScreen');
const adminScreen = document.getElementById('adminScreen');
const employeeSelect = document.getElementById('employeeSelect');
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
const recordsTableBody = document.getElementById('recordsTableBody');
const filterEmployee = document.getElementById('filterEmployee');
const filterDate = document.getElementById('filterDate');
const btnClearFilters = document.getElementById('btnClearFilters');
const locationStatusSpan = document.getElementById('locationStatus');

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

function calculateWorkingHours(checkInTime, checkOutTime) {
    const diff = new Date(checkOutTime) - new Date(checkInTime);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes, total: diff };
}

function getAttendanceStatus(checkInTime) {
    const checkIn = new Date(checkInTime);
    const timeStr = getTimeString(checkIn);
    
    if (timeStr <= '10:00') {
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
    
    const R = 6371e3;
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
// NOTIFICATION SIMULATION
// ============================================

function simulateNotification(type, employeeId, time) {
    const message = {
        type: type,
        employee: employeeId,
        time: time,
        phone: CONFIG.notificationPhone,
        email: CONFIG.notificationEmail,
        location: userLocation
    };
    
    console.log('📱 AUTOMATIC NOTIFICATION TRIGGERED');
    console.log('='.repeat(50));
    console.log(`Type: ${type.toUpperCase()}`);
    console.log(`Employee: ${employeeId}`);
    console.log(`Time: ${formatTime(new Date(time))}`);
    console.log(`Location: ${userLocation ? `${userLocation.lat}, ${userLocation.lng}` : 'N/A'}`);
    console.log(`Distance: ${locationDistance ? locationDistance.toFixed(2) + 'm' : 'N/A'}`);
    console.log(`\n📲 SMS sent to: ${CONFIG.notificationPhone}`);
    console.log(`✉️ Email sent to: ${CONFIG.notificationEmail}`);
    console.log('='.repeat(50));
    
    const notifMsg = `✅ NOTIFICATION SENT!\n📲 SMS: ${CONFIG.notificationPhone}\n✉️ Email: ${CONFIG.notificationEmail}\n📍 ${locationDistance ? locationDistance.toFixed(0) + 'm from office' : 'Location captured'}`;
    alert(notifMsg);
    
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

// ============================================
// TIME UPDATE
// ============================================

function updateDateTime() {
    const now = getCurrentDateTime();
    if (currentDateSpan) currentDateSpan.textContent = formatDate(now);
    if (currentTimeSpan) currentTimeSpan.textContent = formatTime(now);
}

// ============================================
// EMPLOYEE SELECTION
// ============================================

function selectEmployee() {
    const selectedName = employeeSelect.value;
    
    if (!selectedName || selectedName === '') {
        showMessage('Please select your name from the dropdown', 'error');
        btnCheckIn.disabled = true;
        btnCheckOut.disabled = true;
        currentUser = null;
        return;
    }
    
    currentUser = selectedName;
    console.log('✅ Employee selected:', currentUser);
    showMessage(`Welcome, ${currentUser}!`, 'success');
    
    loadTodayAttendance();
}

// ============================================
// ATTENDANCE FUNCTIONS
// ============================================

function loadTodayAttendance() {
    if (!currentUser) {
        btnCheckIn.disabled = true;
        btnCheckOut.disabled = true;
        return;
    }
    
    const attendance = getTodayAttendance(currentUser);
    
    if (attendance) {
        checkInTimeSpan.textContent = formatTime(new Date(attendance.checkInTime));
        
        if (attendance.checkOutTime) {
            checkOutTimeSpan.textContent = formatTime(new Date(attendance.checkOutTime));
            const { hours, minutes } = calculateWorkingHours(attendance.checkInTime, attendance.checkOutTime);
            workingHoursSpan.textContent = `${hours}h ${minutes}m`;
            attendanceStatusSpan.textContent = attendance.status;
            attendanceStatusSpan.className = `value status-${attendance.status.toLowerCase().replace(' ', '-')}`;
            
            btnCheckIn.disabled = true;
            btnCheckOut.disabled = true;
            showMessage('You have completed attendance for today', 'info');
        } else {
            btnCheckIn.disabled = true;
            btnCheckOut.disabled = false;
            attendanceStatusSpan.textContent = 'Checked In';
            attendanceStatusSpan.className = 'value status-present';
        }
    } else {
        btnCheckIn.disabled = false;
        btnCheckOut.disabled = true;
        checkInTimeSpan.textContent = '--:--';
        checkOutTimeSpan.textContent = '--:--';
        workingHoursSpan.textContent = '0h 0m';
        attendanceStatusSpan.textContent = 'Not Marked';
        attendanceStatusSpan.className = 'value status-pending';
    }
}

function checkIn() {
    if (!currentUser) {
        showMessage('Please select your name first', 'error');
        return;
    }
    
    const now = getCurrentDateTime();
    const existing = getTodayAttendance(currentUser);
    
    if (existing) {
        showMessage('You have already checked in today', 'error');
        return;
    }
    
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
    simulateNotification('check-in', currentUser, now.toISOString());
    loadTodayAttendance();
    showMessage('✓ Check-In Successful!', 'success');
}

function checkOut() {
    if (!currentUser) {
        showMessage('Please select your name first', 'error');
        return;
    }
    
    const now = getCurrentDateTime();
    const existing = getTodayAttendance(currentUser);
    
    if (!existing) {
        showMessage('You must check in before checking out', 'error');
        return;
    }
    
    if (existing.checkOutTime) {
        showMessage('You have already checked out today', 'error');
        return;
    }
    
    const { hours, minutes } = calculateWorkingHours(existing.checkInTime, now.toISOString());
    existing.checkOutTime = now.toISOString();
    existing.workingHours = `${hours}h ${minutes}m`;
    
    saveAttendance(currentUser, existing);
    simulateNotification('check-out', currentUser, now.toISOString());
    loadTodayAttendance();
    showMessage('✓ Check-Out Successful!', 'success');
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
    if (currentUser) loadTodayAttendance();
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
    const selectedEmployee = filterEmployee ? filterEmployee.value : 'all';
    const selectedDate = filterDate ? filterDate.value : '';
    
    let filteredRecords = records;
    
    if (selectedEmployee && selectedEmployee !== 'all') {
        filteredRecords = filteredRecords.filter(r => r.employeeId === selectedEmployee);
    }
    
    if (selectedDate) {
        filteredRecords = filteredRecords.filter(r => r.date === selectedDate);
    }
    
    filteredRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    
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
    if (filterEmployee) filterEmployee.value = 'all';
    if (filterDate) filterDate.value = '';
    loadAllRecords();
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ System Initialized');
    
    // Start date/time update
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Start location tracking
    getLocation();
    
    // Employee selection
    if (employeeSelect) {
        employeeSelect.addEventListener('change', selectEmployee);
    }
    
    // Check-in/out buttons
    if (btnCheckIn) btnCheckIn.addEventListener('click', checkIn);
    if (btnCheckOut) btnCheckOut.addEventListener('click', checkOut);
    
    // Admin panel
    if (btnAdminView) btnAdminView.addEventListener('click', showAdminPanel);
    if (btnBackToDashboard) btnBackToDashboard.addEventListener('click', backToDashboard);
    if (filterEmployee) filterEmployee.addEventListener('change', loadAllRecords);
    if (filterDate) filterDate.addEventListener('change', loadAllRecords);
    if (btnClearFilters) btnClearFilters.addEventListener('click', clearFilters);
    
    console.log('✅ All event listeners attached');
    console.log('📌 Data stored in: Browser LocalStorage');
    console.log('📌 Notifications to: ' + CONFIG.notificationPhone + ' & ' + CONFIG.notificationEmail);
});
