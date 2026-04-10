// ============================================
// EMPLOYEE ATTENDANCE SYSTEM
// Simple No-Login Version with LocalStorage
// ============================================

// Configuration
const CONFIG = {
    notificationPhone: '+917418167906',
    notificationEmail: 'info@craftedclipz.in',
    useEmailJs: false,
    notifyViaWhatsApp: true,
    enforceLocation: false, // Disabled for testing: allow check-in/check-out from any location
    officeLocation: { lat: 8.1848938, lng: 77.3947 }, // Kottavilai Rd, Nagercoil - Required location for check-in/out
    allowedRadius: 50, // Maximum distance in meters from office location
    emailjs: {
        serviceId: 'service_jcjlyfl',  // EmailJS Service ID
        templateId: 'template_6t1ogix', // EmailJS Template ID
        publicKey: 'Pf1GrPHz8A3CXVZW0'    // EmailJS Public Key
    },
    firebase: {
        databaseUrl: 'https://attendance-system-3e84f-default-rtdb.firebaseio.com/',
        attendancePath: 'attendanceData',
        notificationPath: 'notificationLog'
    }
};

// Global State
let currentUser = null;
let userLocation = null;
let locationDistance = null;
let attendanceCache = {};
let emailJsLoadPromise = null;

// DOM Elements
const employeeSelect = document.getElementById('employeeSelect');
const currentDateSpan = document.getElementById('currentDate');
const currentTimeSpan = document.getElementById('currentTime');
const btnCheckIn = document.getElementById('btnCheckIn');
const btnCheckOut = document.getElementById('btnCheckOut');
const messageBox = document.getElementById('messageBox');
const locationStatusSpan = document.getElementById('locationStatus');

const EMAILJS_CDN_URLS = [
    'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/index.min.js',
    'https://unpkg.com/@emailjs/browser@4/dist/email.min.js'
];

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

function isLocationEnforced() {
    return CONFIG.enforceLocation === true;
}

// ============================================
// LOCALSTORAGE FUNCTIONS
// ============================================

function getLocalAttendanceData() {
    const data = localStorage.getItem('attendanceData');
    return data ? JSON.parse(data) : {};
}

function saveLocalAttendanceData(data) {
    localStorage.setItem('attendanceData', JSON.stringify(data));
}

function isCloudStorageConfigured() {
    return !!(CONFIG.firebase.databaseUrl && CONFIG.firebase.databaseUrl.trim() !== '');
}

function getCloudAttendanceBaseUrl() {
    const cleanBase = CONFIG.firebase.databaseUrl.replace(/\/$/, '');
    return `${cleanBase}/${CONFIG.firebase.attendancePath}`;
}

async function fetchCloudAttendanceData() {
    if (!isCloudStorageConfigured()) {
        return null;
    }

    try {
        const response = await fetch(`${getCloudAttendanceBaseUrl()}.json`);
        if (!response.ok) {
            throw new Error(`Cloud fetch failed (${response.status})`);
        }

        const remoteData = await response.json();
        return remoteData || {};
    } catch (error) {
        console.warn('⚠️ Cloud attendance read failed. Using local data.', error.message || error);
        return null;
    }
}

async function saveCloudAttendanceRecord(key, record) {
    if (!isCloudStorageConfigured()) {
        return;
    }

    try {
        const response = await fetch(`${getCloudAttendanceBaseUrl()}/${encodeURIComponent(key)}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(record)
        });

        if (!response.ok) {
            throw new Error(`Cloud save failed (${response.status})`);
        }
    } catch (error) {
        console.warn('⚠️ Cloud attendance save failed. Saved locally only.', error.message || error);
    }
}

async function clearCloudAttendanceData() {
    if (!isCloudStorageConfigured()) {
        return;
    }

    try {
        const cleanBase = CONFIG.firebase.databaseUrl.replace(/\/$/, '');
        await Promise.all([
            fetch(`${cleanBase}/${CONFIG.firebase.attendancePath}.json`, { method: 'DELETE' }),
            fetch(`${cleanBase}/${CONFIG.firebase.notificationPath}.json`, { method: 'DELETE' })
        ]);
    } catch (error) {
        console.warn('⚠️ Cloud clear failed:', error.message || error);
    }
}

async function hydrateAttendanceCache() {
    const localData = getLocalAttendanceData();
    attendanceCache = localData;

    const cloudData = await fetchCloudAttendanceData();
    if (cloudData) {
        attendanceCache = cloudData;
        saveLocalAttendanceData(attendanceCache);
        console.log('☁️ Attendance loaded from cloud storage');
    } else {
        console.log('💾 Attendance loaded from local storage');
    }
}

async function refreshAttendanceFromCloud() {
    if (!isCloudStorageConfigured()) {
        return;
    }

    const cloudData = await fetchCloudAttendanceData();
    if (!cloudData) {
        return;
    }

    const localHash = JSON.stringify(attendanceCache);
    const cloudHash = JSON.stringify(cloudData);

    if (localHash !== cloudHash) {
        attendanceCache = cloudData;
        saveLocalAttendanceData(attendanceCache);
        renderAttendanceTable();
        console.log('☁️ Synced latest attendance from cloud');
    }
}

function getAttendanceData() {
    return attendanceCache;
}

async function saveAttendanceData(data, key, record) {
    attendanceCache = data;
    saveLocalAttendanceData(attendanceCache);

    if (key && record) {
        await saveCloudAttendanceRecord(key, record);
    }
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

    return new Promise((resolve) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    calculateDistance();
                    if (locationStatusSpan) {
                        if (locationDistance !== null) {
                            if (locationDistance <= CONFIG.allowedRadius) {
                                locationStatusSpan.textContent = `✅ ${locationDistance.toFixed(0)}m from office (Within range)`;
                                locationStatusSpan.style.backgroundColor = '#d4edda';
                                locationStatusSpan.style.color = '#155724';
                            } else {
                                locationStatusSpan.textContent = `⚠️ ${locationDistance.toFixed(0)}m from office (Outside ${CONFIG.allowedRadius}m range)`;
                                locationStatusSpan.style.backgroundColor = '#fff3cd';
                                locationStatusSpan.style.color = '#856404';
                            }
                        } else {
                            locationStatusSpan.textContent = '✅ Located';
                        }
                    }
                    console.log('✅ Location captured:', userLocation);
                    resolve(userLocation);
                },
                (error) => {
                    console.warn('⚠️ Location access denied:', error.message);
                    if (locationStatusSpan) {
                        locationStatusSpan.textContent = '⚠️ Location denied';
                        locationStatusSpan.style.backgroundColor = '#f8d7da';
                        locationStatusSpan.style.color = '#721c24';
                    }
                    userLocation = null;
                    locationDistance = null;
                    resolve(null);
                }
            );
        } else {
            console.warn('⚠️ Geolocation not supported');
            if (locationStatusSpan) {
                locationStatusSpan.textContent = '❌ Not supported';
                locationStatusSpan.style.backgroundColor = '#f8d7da';
                locationStatusSpan.style.color = '#721c24';
            }
            resolve(null);
        }
    });
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
    
    // Debug logging
    console.log('📍 LOCATION DEBUG:');
    console.log('   Office Location:', CONFIG.officeLocation);
    console.log('   Your Location:', userLocation);
    console.log(`   Distance from office: ${locationDistance.toFixed(2)}m`);
    console.log(`   Allowed radius: ${CONFIG.allowedRadius}m`);
    console.log(`   Status: ${locationDistance <= CONFIG.allowedRadius ? '✅ WITHIN RANGE' : '❌ OUT OF RANGE'}`);
}

// ============================================
// NOTIFICATION SIMULATION
// ============================================

function simulateNotification(type, employeeId, time, options = {}) {
    const { sendWhatsAppMessage = true } = options;
    const message = {
        type: type,
        employee: employeeId,
        time: time,
        phone: CONFIG.notificationPhone,
        email: CONFIG.notificationEmail,
        location: userLocation
    };
    
    console.log('📱 SENDING NOTIFICATION');
    console.log('='.repeat(50));
    console.log(`Type: ${type.toUpperCase()}`);
    console.log(`Employee: ${employeeId}`);
    console.log(`Time: ${formatTime(new Date(time))}`);
    console.log(`✉️ Sending Email to: ${CONFIG.notificationEmail}`);
    console.log('='.repeat(50));
    
    // Send Email via EmailJS
    sendEmail(type, employeeId, time)
        .then((emailResult) => {
            const emailLine = emailResult.success
                ? `✉️ Email: Sent to ${CONFIG.notificationEmail}`
                : `✉️ Email: Failed (${emailResult.message})`;

            const notifMsg = `✅ NOTIFICATION PROCESSED!\n${emailLine}\n📍 ${locationDistance ? locationDistance.toFixed(0) + 'm from office' : 'Location captured'}`;
            showNotificationMessage(notifMsg, emailResult.success ? 'success' : 'error');

            const notifications = JSON.parse(localStorage.getItem('notificationLog') || '[]');
            notifications.push({
                ...message,
                timestamp: new Date().toISOString(),
                status: emailResult.success ? 'sent' : 'email_failed',
                emailStatus: emailResult
            });
            localStorage.setItem('notificationLog', JSON.stringify(notifications));
        })
        .catch((error) => {
            console.error('❌ Unexpected notification error:', error);
            showNotificationMessage('❌ Notification failed unexpectedly. Check browser console for details.', 'error');
        });

    if (CONFIG.notifyViaWhatsApp && sendWhatsAppMessage) {
        sendWhatsApp(type, employeeId, time);
    }
    
    return message;
}

// ============================================
// EMAIL SENDING (EmailJS)
// ============================================

function ensureEmailJsLoaded() {
    if (window.emailjs) {
        return Promise.resolve(window.emailjs);
    }

    if (emailJsLoadPromise) {
        return emailJsLoadPromise;
    }

    emailJsLoadPromise = new Promise((resolve, reject) => {
        let index = 0;

        const tryNextCdn = () => {
            if (index >= EMAILJS_CDN_URLS.length) {
                reject(new Error('Failed to load EmailJS library from all CDN sources'));
                return;
            }

            const script = document.createElement('script');
            script.src = EMAILJS_CDN_URLS[index];
            script.async = true;

            script.onload = () => {
                if (window.emailjs) {
                    resolve(window.emailjs);
                } else {
                    index += 1;
                    tryNextCdn();
                }
            };

            script.onerror = () => {
                index += 1;
                tryNextCdn();
            };

            document.head.appendChild(script);
        };

        tryNextCdn();
    });

    return emailJsLoadPromise.catch((error) => {
        // Allow retry in future interactions if network conditions change.
        emailJsLoadPromise = null;
        throw error;
    });
}

async function sendEmailViaBackend(emailData) {
    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        let payload = null;
        try {
            payload = await response.json();
        } catch (jsonError) {
            payload = null;
        }

        if (!response.ok || !payload || payload.success !== true) {
            const serverMessage = payload && payload.message ? payload.message : `HTTP ${response.status}`;
            throw new Error(serverMessage);
        }

        return {
            success: true,
            message: payload.message || 'Email sent successfully via server'
        };
    } catch (error) {
        return {
            success: false,
            message: 'Email service unavailable (CDN and backend failed)',
            error: error && error.message ? error.message : String(error)
        };
    }
}

function sendEmail(type, employeeId, time) {
    const emailData = {
        employee_name: employeeId,
        action: type.toUpperCase(),
        date: formatDate(new Date(time)),
        time: formatTime(new Date(time)),
        phone: CONFIG.notificationPhone,
        email: CONFIG.notificationEmail,
        location: userLocation ? `${userLocation.lat}, ${userLocation.lng}` : 'N/A',
        distance: locationDistance ? `${locationDistance.toFixed(2)}m` : 'N/A'
    };

    console.log('📧 Attempting to send email via EmailJS...');
    console.log('📧 Email data:', emailData);

    if (!CONFIG.useEmailJs) {
        console.log('📧 Using backend email API mode (EmailJS disabled)');
        return sendEmailViaBackend(emailData);
    }

    return ensureEmailJsLoaded()
        .then((emailjsClient) => {
            emailjsClient.init(CONFIG.emailjs.publicKey);
            return emailjsClient.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, emailData);
        })
        .then(() => {
            console.log('✅ Email sent successfully!');
            console.log('📬 Email delivered to:', CONFIG.notificationEmail);
            return {
                success: true,
                message: 'Email sent successfully'
            };
        })
        .catch(async (error) => {
            const errMsg = error && error.message ? error.message : String(error);
            console.error('❌ EmailJS send failed. Falling back to backend API.');
            console.error('❌ EmailJS error:', errMsg);

            const fallbackResult = await sendEmailViaBackend(emailData);
            if (fallbackResult.success) {
                console.log('✅ Email sent successfully via backend fallback');
                return fallbackResult;
            }

            return {
                success: false,
                message: 'Email delivery failed. Check internet/CDN access or backend server status.',
                error: `${errMsg} | Backend: ${fallbackResult.error || fallbackResult.message}`
            };
        });
}

// ============================================
// WHATSAPP SENDING
// ============================================

function sendWhatsApp(type, employeeId, time) {
    const message = `*Attendance Alert*\n\nEmployee: ${employeeId}\nAction: ${type.toUpperCase()}\nDate: ${formatDate(new Date(time))}\nTime: ${formatTime(new Date(time))}\nLocation: ${userLocation ? `${userLocation.lat}, ${userLocation.lng}` : 'N/A'}\nDistance: ${locationDistance ? `${locationDistance.toFixed(2)}m from office` : 'N/A'}`;
    
    // Use WhatsApp Web URL (NO API NEEDED - Opens WhatsApp)
    sendWhatsAppViaWebURL(message);
}

// Method 3: WhatsApp Web URL (Opens WhatsApp - requires user click)
function sendWhatsAppViaWebURL(message) {
    const phone = CONFIG.notificationPhone.replace('+', '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    // This will open WhatsApp in a new tab (requires user interaction)
    console.log('💬 Opening WhatsApp Web:', url);
    window.open(url, '_blank');
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

    // Request location from a user gesture to avoid quiet permission prompts.
    getLocation();
    
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

async function checkIn() {
    if (!currentUser) {
        showMessage('Please select your name first', 'error');
        return;
    }
    
    if (!userLocation) {
        await getLocation();
    }

    if (isLocationEnforced()) {
        // Check if location is available
        if (!userLocation) {
            showMessage('❌ Location not detected. Please enable location services and refresh the page.', 'error');
            return;
        }

        // Check if user is within allowed radius
        if (locationDistance > CONFIG.allowedRadius) {
            showMessage(`❌ You are ${locationDistance.toFixed(0)}m away from office. You must be within ${CONFIG.allowedRadius}m to check in.`, 'error');
            return;
        }
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

    // Open WhatsApp from the direct click flow so popup blockers do not block it.
    if (CONFIG.notifyViaWhatsApp) {
        sendWhatsApp('check-in', currentUser, now.toISOString());
    }
    
    // Save as new entry with timestamp
    const data = getAttendanceData();
    const key = `${currentUser}_${now.getTime()}`;
    data[key] = attendanceRecord;
    
    console.log('💾 Saving check-in record:', { key, attendanceRecord });
    await saveAttendanceData(data, key, attendanceRecord);
    console.log('✅ Check-in saved. Current cache:', attendanceCache);
    
    simulateNotification('check-in', currentUser, now.toISOString(), { sendWhatsAppMessage: false });
    
    // Force render table refresh after a short delay
    setTimeout(() => {
        console.log('🔄 Rendering table after check-in...');
        renderAttendanceTable();
    }, 1000);
    
    showMessage('✓ Check-In Successful!', 'success');
}

async function checkOut() {
    if (!currentUser) {
        showMessage('Please select your name first', 'error');
        return;
    }
    
    if (!userLocation) {
        await getLocation();
    }

    if (isLocationEnforced()) {
        // Check if location is available
        if (!userLocation) {
            showMessage('❌ Location not detected. Please enable location services and refresh the page.', 'error');
            return;
        }

        // Check if user is within allowed radius
        if (locationDistance > CONFIG.allowedRadius) {
            showMessage(`❌ You are ${locationDistance.toFixed(0)}m away from office. You must be within ${CONFIG.allowedRadius}m to check out.`, 'error');
            return;
        }
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

    // Open WhatsApp from the direct click flow so popup blockers do not block it.
    if (CONFIG.notifyViaWhatsApp) {
        sendWhatsApp('check-out', currentUser, now.toISOString());
    }
    
    // Save as new entry with timestamp
    const data = getAttendanceData();
    const key = `${currentUser}_${now.getTime()}`;
    data[key] = attendanceRecord;
    
    console.log('💾 Saving check-out record:', { key, attendanceRecord });
    await saveAttendanceData(data, key, attendanceRecord);
    console.log('✅ Check-out saved. Current cache:', attendanceCache);
    
    simulateNotification('check-out', currentUser, now.toISOString(), { sendWhatsAppMessage: false });
    
    // Force render table refresh after a short delay
    setTimeout(() => {
        console.log('🔄 Rendering table after check-out...');
        renderAttendanceTable();
    }, 1000);
    
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
    if (!attendanceTableBody) {
        console.warn('⚠️ Attendance table element not found');
        return;
    }
    
    // Always reload from localStorage to ensure fresh data
    attendanceCache = getLocalAttendanceData();
    console.log('🔄 Reloaded cache from localStorage:', attendanceCache);
    
    const allRecords = getAllAttendanceRecords();
    console.log('📊 All attendance records:', allRecords);
    const filtered = filterByTimeline(allRecords, currentFilter);
    console.log('📊 Filtered records (', currentFilter, '):', filtered);
    
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

async function clearAllData() {
    // Step 1: Ask for password
    const password = prompt('🔐 Enter password to clear all data:');
    
    // Check if user cancelled
    if (password === null) {
        showMessage('❌ Data deletion cancelled', 'info');
        return;
    }
    
    // Verify password
    if (password !== 'cc@123') {
        showMessage('❌ Incorrect password! Access denied.', 'error');
        console.log('❌ Failed password attempt');
        return;
    }
    
    // Step 2: Ask for confirmation before deleting
    const confirmation = confirm('⚠️ WARNING: This will permanently delete ALL attendance records!\n\nAre you sure you want to continue?');
    
    if (!confirmation) {
        showMessage('❌ Data deletion cancelled', 'info');
        return;
    }
    
    // Step 3: Double confirmation for safety
    const doubleConfirm = confirm('🚨 FINAL CONFIRMATION\n\nThis action CANNOT be undone!\n\nClick OK to DELETE ALL DATA or Cancel to abort.');
    
    if (!doubleConfirm) {
        showMessage('❌ Data deletion cancelled', 'info');
        return;
    }
    
    try {
        // Clear all attendance data
        localStorage.removeItem('attendanceData');
        
        // Clear notification log
        localStorage.removeItem('notificationLog');
        
        // Clear any other stored data
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('attendance') || key.includes('employee')) {
                localStorage.removeItem(key);
            }
        });
        
        // Reset UI
        attendanceCache = {};
        await clearCloudAttendanceData();
        renderAttendanceTable();
        
        // Show success message
        showMessage('✅ All attendance data has been cleared successfully!', 'success');
        
        console.log('🗑️ All data cleared from LocalStorage');
        
        // Reload the page after 2 seconds to refresh everything
        setTimeout(() => {
            location.reload();
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error clearing data:', error);
        showMessage('❌ Error clearing data. Please try again.', 'error');
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ System Initialized');

    // Initialize EmailJS
    if (CONFIG.useEmailJs) {
        ensureEmailJsLoaded()
            .then((emailjsClient) => {
                emailjsClient.init(CONFIG.emailjs.publicKey);
                console.log('✅ EmailJS initialized with key:', CONFIG.emailjs.publicKey);
            })
            .catch((error) => {
                console.warn('⚠️ EmailJS library not loaded from CDN. Backend email fallback will be used if available.');
                console.warn('⚠️ EmailJS load error:', error && error.message ? error.message : error);
            });
    } else {
        console.log('✅ Backend email mode enabled (EmailJS disabled)');
    }
    
    // Start date/time update
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Wait for user action to request location permission.
    if (locationStatusSpan) {
        locationStatusSpan.textContent = '📍 Select employee or tap Check-In/Out to detect location';
    }
    
    // Employee selection
    if (employeeSelect) {
        employeeSelect.addEventListener('change', selectEmployee);
    }
    
    // Check-in/out buttons
    if (btnCheckIn) {
        btnCheckIn.addEventListener('click', async function() {
            await checkIn();
            renderAttendanceTable();
        });
    }
    if (btnCheckOut) {
        btnCheckOut.addEventListener('click', async function() {
            await checkOut();
            renderAttendanceTable();
        });
    }
    
    // Setup filter buttons
    setupFilterButtons();
    
    // Export button
    const btnExportExcel = document.getElementById('btnExportExcel');
    if (btnExportExcel) btnExportExcel.addEventListener('click', exportToExcel);
    
    // Clear data button
    const btnClearData = document.getElementById('btnClearData');
    if (btnClearData) {
        btnClearData.addEventListener('click', async function() {
            await clearAllData();
        });
    }
    
    // Initial table render
    hydrateAttendanceCache().then(() => {
        renderAttendanceTable();
    });

    // Keep devices in sync by polling cloud storage.
    if (isCloudStorageConfigured()) {
        setInterval(refreshAttendanceFromCloud, 15000);
    }
    
    console.log('✅ All event listeners attached');
    console.log('📌 Data storage: LocalStorage + Optional Firebase Realtime DB');
    console.log('📌 Notifications to Email: ' + CONFIG.notificationEmail);
});
