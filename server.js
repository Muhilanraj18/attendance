// ============================================
// ATTENDANCE SYSTEM - EMAIL BACKEND SERVER
// Node.js + Express + SendGrid
// ============================================

const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// ============================================
// EMAIL CONFIGURATION (SendGrid)
// ============================================

// Initialize SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const REQUIRED_EMAIL = 'info@craftedclipz.in';
const SENDER_EMAIL = REQUIRED_EMAIL;

if (SENDGRID_API_KEY) {
    sgMail.setApiKey(SENDGRID_API_KEY);
    console.log('✅ SendGrid email service is ready to send emails');
} else {
    console.error('❌ Email configuration error: SENDGRID_API_KEY not found in .env file');
}

// ============================================
// API ENDPOINT: Send Email
// ============================================

app.post('/api/send-email', async (req, res) => {
    try {
        if (!SENDGRID_API_KEY) {
            return res.status(500).json({
                success: false,
                message: 'SendGrid API key not configured. Add SENDGRID_API_KEY to .env file'
            });
        }

        const { 
            employee_name, 
            action, 
            date, 
            time, 
            email,
            phone = 'N/A',
            location = 'N/A',
            distance = 'N/A'
        } = req.body;

        // Always notify the official attendance inbox.
        const recipientEmail = REQUIRED_EMAIL;

        // Validate required fields
        if (!employee_name || !action || !date || !time) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Create email content
        const emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; border-radius: 10px;">
                
                <h2 style="color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 10px;">🔔 Attendance Alert</h2>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Employee Name:</strong> ${employee_name}</p>
                    <p><strong>Action:</strong> <span style="background: #667eea; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold;">${action}</span></p>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Time:</strong> ${time}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                </div>

                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #667eea; margin-top: 0;">📍 Location Details</h3>
                    <p><strong>Coordinates:</strong> ${location}</p>
                    <p><strong>Distance from Office:</strong> ${distance}</p>
                </div>

                <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
                    <p style="margin: 0; color: #333;">This is an automated notification from the <strong>Employee Attendance System</strong>.</p>
                </div>

            </div>
        `;

        // Send email via SendGrid
        const msg = {
            to: recipientEmail,
            from: SENDER_EMAIL,
            subject: `🔔 Attendance Alert - ${action.toUpperCase()}`,
            html: emailContent
        };

        const result = await sgMail.send(msg);

        console.log(`✅ Email sent to ${recipientEmail}`);
        console.log(`   Employee: ${employee_name}`);
        console.log(`   Action: ${action}`);

        res.json({
            success: true,
            message: `Email sent successfully to ${recipientEmail}`,
            messageId: result[0].headers['x-message-id']
        });

    } catch (error) {
        const statusCode = error?.code || error?.response?.statusCode || 'unknown';
        const responseBody = error?.response?.body ? JSON.stringify(error.response.body) : 'no response body';

        console.error('❌ Email sending error:', error.message);
        console.error('❌ SendGrid status:', statusCode);
        console.error('❌ SendGrid response:', responseBody);

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to send email',
            details: responseBody
        });
    }
});

// ============================================
// TEST ENDPOINT: Verify Server is Running
// ============================================

app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        message: 'Email server is running',
        status: 'ready'
    });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════╗');
    console.log('║  📧 Attendance Email Server Started!   ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`📧 Frontend: http://localhost:${PORT}/index.html`);
    console.log(`🔌 API: http://localhost:${PORT}/api/send-email`);
    console.log(`📮 Recipient inbox: ${REQUIRED_EMAIL}`);
    console.log(`📤 Sender email: ${SENDER_EMAIL}`);
    console.log('');
});
