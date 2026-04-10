// ============================================
// ATTENDANCE SYSTEM - STATIC HOST SERVER
// Email notifications are handled directly by EmailJS in the browser.
// ============================================

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        message: 'Attendance app is running in EmailJS mode',
        status: 'ready'
    });
});

app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════╗');
    console.log('║  📧 Attendance App Started!            ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`📧 Frontend: http://localhost:${PORT}/index.html`);
    console.log('✅ EmailJS is handled entirely in the browser');
    console.log('');
});
