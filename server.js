const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS form_submissions (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        contact_number VARCHAR(20) NOT NULL,
        city VARCHAR(100),
        interested_course VARCHAR(100),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        email_sent BOOLEAN DEFAULT FALSE
      )
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDatabase();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.use(express.static('.', {
  setHeaders: (res, filePath) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
}));

app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'campuspathway.in', 'index.html'));
});

app.post('/api/submit-form', async (req, res) => {
  try {
    const { fullName, contactNumber, city, interestedCourse, message } = req.body;

    if (!fullName || !contactNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Full name and contact number are required' 
      });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(contactNumber.replace(/\D/g, '').slice(-10))) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid 10-digit phone number' 
      });
    }

    const result = await pool.query(
      `INSERT INTO form_submissions (full_name, contact_number, city, interested_course, message) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [fullName, contactNumber, city || null, interestedCourse || null, message || null]
    );

    const submissionId = result.rows[0].id;
    let emailSent = false;

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        await transporter.sendMail({
          from: `"Campus Pathway" <${process.env.SMTP_USER}>`,
          to: adminEmail,
          subject: `New Callback Request - ${fullName}`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
              <div style="background: linear-gradient(135deg, #0D1B2A, #1B263B); padding: 30px; border-radius: 12px 12px 0 0;">
                <h1 style="color: #F4D35E; margin: 0; font-size: 24px;">Campus Pathway</h1>
                <p style="color: #ffffff; margin: 8px 0 0 0; opacity: 0.9;">New Callback Request</p>
              </div>
              <div style="background: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                <h2 style="color: #0D1B2A; margin-top: 0;">Student Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; width: 140px;">Full Name:</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #0D1B2A; font-weight: 600;">${fullName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Contact Number:</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #0D1B2A; font-weight: 600;">${contactNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">City:</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #0D1B2A;">${city || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Interested Course:</td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #0D1B2A;">${interestedCourse || 'Not selected'}</td>
                  </tr>
                  ${message ? `
                  <tr>
                    <td style="padding: 12px 0; color: #666; vertical-align: top;">Message:</td>
                    <td style="padding: 12px 0; color: #0D1B2A;">${message}</td>
                  </tr>
                  ` : ''}
                </table>
                <div style="margin-top: 25px; padding: 15px; background: #f0f4f8; border-radius: 8px;">
                  <p style="margin: 0; color: #666; font-size: 13px;">
                    Submission ID: #${submissionId}<br>
                    Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </p>
                </div>
              </div>
            </div>
          `
        });
        emailSent = true;
        await pool.query('UPDATE form_submissions SET email_sent = TRUE WHERE id = $1', [submissionId]);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    }

    res.json({ 
      success: true, 
      message: 'Thanks! Our team will contact you soon.',
      submissionId,
      emailSent
    });

  } catch (error) {
    console.error('Form submission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Something went wrong. Please try again later.' 
    });
  }
});

app.get('/api/submissions', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM form_submissions ORDER BY created_at DESC LIMIT 100'
    );
    res.json({ success: true, submissions: result.rows });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ success: false, message: 'Error fetching submissions' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
  console.log('Campus Pathway - Ready to serve');
});
