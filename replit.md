# Campus Pathway - Educational Consultancy Website

## Overview
Campus Pathway is an educational consultancy website that helps students find the right college and course. The site was originally a WordPress site and has been converted to a static site running on Replit with a Node.js/Express backend for form handling.

## Project Structure
```
/
├── campuspathway.in/          # Static WordPress site files
│   ├── index.html             # Main homepage
│   ├── wp-content/            # WordPress content (plugins, themes, uploads)
│   └── wp-includes/           # WordPress core JS and CSS
├── public/                    # Custom assets
│   ├── css/custom-theme.css   # Custom color scheme and styling
│   ├── js/form-handler.js     # Form submission handler
│   └── images/logo.svg        # Custom Campus Pathway logo
├── attached_assets/           # Stock images and generated assets
├── server.js                  # Express server with form API
├── package.json               # Node.js dependencies
└── replit.md                  # This file
```

## Technology Stack
- **Frontend**: Static HTML/CSS/JS (WordPress export)
- **Server**: Node.js with Express.js
- **Database**: PostgreSQL (Replit managed)
- **Email**: Nodemailer (SMTP configuration required)
- **Port**: 5000

## Brand Colors
- **Primary (Navy Blue)**: #0D1B2A - Used for main buttons and headers
- **Secondary (Golden Yellow)**: #F4D35E - Used for accents and highlights
- **Accent (Coral)**: #EE6C4D - Used for hover states
- **Background (Light)**: #F8F9FA - Page backgrounds
- **Text**: #1B263B - Primary text color

## Features
1. **Contact Form** - Collects name, phone, city, and course interest
2. **Database Storage** - All form submissions stored in PostgreSQL
3. **Email Notifications** - Ready for SMTP configuration
4. **Responsive Design** - Works on desktop and mobile
5. **Smooth Animations** - Scroll and hover animations

## Database Schema
```sql
CREATE TABLE form_submissions (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  contact_number VARCHAR(50) NOT NULL,
  city VARCHAR(255),
  interested_course VARCHAR(255),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  email_sent BOOLEAN DEFAULT FALSE
);
```

## API Endpoints
- `POST /api/submit-form` - Submit contact form data
  - Request body: `{ fullName, contactNumber, city, interestedCourse, message }`
  - Response: `{ success, message, submissionId, emailSent }`

## Email Configuration
To enable email notifications, configure these environment variables:
- `SMTP_HOST` - SMTP server hostname
- `SMTP_PORT` - SMTP port (usually 587 for TLS)
- `SMTP_USER` - SMTP username/email
- `SMTP_PASS` - SMTP password/app password
- `ADMIN_EMAIL` - Email to receive form notifications

## Recent Changes
- **Dec 5, 2025**: Complete website transformation
  - Created custom SVG logo with Campus Pathway branding
  - Applied new color scheme (Navy Blue + Golden Yellow)
  - Fixed all CORS issues by localizing external URLs
  - Set up PostgreSQL database for form submissions
  - Implemented backend API with email notification support
  - Added custom form handler with validation
  - Replaced missing images with stock photos
  - Added smooth animations and hover effects
  - Configured deployment settings

## Running the Project
The project runs automatically via the configured workflow:
```bash
npm start
```

## Deployment
Configured as an autoscale deployment suitable for the website.

## User Preferences
- Use Navy Blue (#0D1B2A) and Golden Yellow (#F4D35E) color scheme
- Professional, clean design aesthetic
- Form submissions must be stored in database AND sent via email
- WhatsApp integration visible (917992455004)
