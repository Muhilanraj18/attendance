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

// DOM Elements
const employeeSelect = document.getElementById('employeeSelect');
const currentDateSpan = document.getElementById('currentDate');
const currentTimeSpan = document.getElementById('currentTime');
const btnCheckIn = document.getElementById('btnCheckIn');
const btnCheckOut = document.getElementById('btnCheckOut');
const messageBox = document.getElementById('messageBox');
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
    
    // Display notification message on screen instead of alert
    showNotificationMessage(notifMsg, 'success');
    
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

function showNotificationMessage(text, type = 'info') {
    messageBox.innerHTML = text.replace(/\n/g, '<br>');
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = 'block';
    messageBox.style.whiteSpace = 'pre-line';
    messageBox.style.padding = '20px';
    messageBox.style.fontSize = '16px';
    messageBox.style.lineHeight = '1.8';
    
    setTimeout(() => {
        messageBox.style.display = '';
        messageBox.className = 'message-box';
    }, 8000);
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
    
    // Enable both buttons - allow multiple check-ins/outs
    btnCheckIn.disabled = false;
    btnCheckOut.disabled = false;
}

function checkIn() {
    if (!currentUser) {
        showMessage('Please select your name first', 'error');
        return;
    }
    
    const now = getCurrentDateTime();
    
    const attendanceRecord = {
        employeeId: currentUser,
        date: getDateString(now),
        time: now.toISOString(),
        type: 'CHECK IN',
        status: getAttendanceStatus(now.toISOString()),
        location: userLocation,
        distance: locationDistance
    };
    
    // Save as new entry with timestamp
    const data = getAttendanceData();
    const key = `${currentUser}_${now.getTime()}`;
    data[key] = attendanceRecord;
    saveAttendanceData(data);
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
    
    const attendanceRecord = {
        employeeId: currentUser,
        date: getDateString(now),
        time: now.toISOString(),
        type: 'CHECK OUT',
        status: 'Present',
        location: userLocation,
        distance: locationDistance
    };
    
    // Save as new entry with timestamp
    const data = getAttendanceData();
    const key = `${currentUser}_${now.getTime()}`;
    data[key] = attendanceRecord;
    saveAttendanceData(data);
    simulateNotification('check-out', currentUser, now.toISOString());
    loadTodayAttendance();
    showMessage('✓ Check-Out Successful!', 'success');
}

// ============================================
// ADMIN PANEL
// ============================================



// ============================================
// TABLE RENDERING
// ============================================

let currentFilter = 'daily';
const attendanceTableBody = document.getElementById('attendanceTableBody');
const summaryBabu = document.getElementById('summaryBabu');

function renderAttendanceTable() {
    const allRecords = getAllAttendanceRecords();
    const filtered = filterByTimeline(allRecords, currentFilter);
    
    if (filtered.length === 0) {
        attendanceTableBody.innerHTML = '<tr><td colspan="5" class="no-data">No attendance records found</td></tr>';
        return;
    }
    
    // Sort by time descending (newest first)
    filtered.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    attendanceTableBody.innerHTML = filtered.map(record => {
        const time = formatTime(new Date(record.time));
        const type = record.type || 'CHECK IN';
        const status = record.status || 'Present';
        const typeClass = type === 'CHECK IN' ? 'status-present' : 'status-out';
        
        return `
            <tr>
                <td>${record.employeeId}</td>
                <td>${formatDate(new Date(record.date))}</td>
                <td>${time}</td>
                <td><span class="${typeClass}">${type}</span></td>
                <td><span class="status-${status.toLowerCase().replace(' ', '-')}">${status}</span></td>
            </tr>
        `;
    }).join('');;
    
    // Update summary - count total check-ins
    const babuRecords = allRecords.filter(r => r.employeeId === 'Babu hussian' && r.type === 'CHECK IN');
    if (summaryBabu) summaryBabu.textContent = `${babuRecords.length} check-ins`;
}

function filterByTimeline(records, timeline) {
    const now = getCurrentDateTime();
    const today = getDateString(now);
    
    switch(timeline) {
        case 'daily':
            return records.filter(r => r.date === today);
        
        case 'weekly':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return records.filter(r => new Date(r.date) >= weekAgo);
        
        case 'monthly':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return records.filter(r => new Date(r.date) >= monthAgo);
        
        case 'yearly':
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            return records.filter(r => new Date(r.date) >= yearAgo);
        
        default:
            return records;
    }
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            renderAttendanceTable();
        });
    });
}

function exportToExcel() {
    const allRecords = getAllAttendanceRecords();
    const filtered = filterByTimeline(allRecords, currentFilter);
    
    if (filtered.length === 0) {
        showMessage('No data to export', 'error');
        return;
    }
    
    const data = filtered.map(record => ({
        'Employee': record.employeeId,
        'Date': record.date,
        'Time': formatTime(new Date(record.time)),
        'Type': record.type || 'CHECK IN',
        'Status': record.status || 'Present'
    }));
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, `attendance_${currentFilter}_${getDateString(getCurrentDateTime())}.xlsx`);
    showMessage('✅ Excel file exported successfully!', 'success');
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
    if (btnCheckIn) {
        btnCheckIn.addEventListener('click', function() {
            checkIn();
            setTimeout(renderAttendanceTable, 500);
        });
    }
    if (btnCheckOut) {
        btnCheckOut.addEventListener('click', function() {
            checkOut();
            setTimeout(renderAttendanceTable, 500);
        });
    }
    
    // Setup filter buttons
    setupFilterButtons();
    
    // Export button
    const btnExportExcel = document.getElementById('btnExportExcel');
    if (btnExportExcel) btnExportExcel.addEventListener('click', exportToExcel);
    
    // Initial table render
    renderAttendanceTable();
    
    console.log('✅ All event listeners attached');
    console.log('📌 Data stored in: Browser LocalStorage');
    console.log('📌 Notifications to: ' + CONFIG.notificationPhone + ' & ' + CONFIG.notificationEmail);
});
