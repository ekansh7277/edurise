# Campus Pathway - Static WordPress Site

## Overview
This is a static export of the Campus Pathway WordPress website. It has been set up to run on Replit using a simple Express.js server to serve the static HTML, CSS, JavaScript, and media files.

## Project Structure
- `campuspathway.in/` - Main directory containing the static WordPress site
  - `index.html` - Main homepage
  - `wp-content/` - WordPress content including plugins, themes, and uploads
  - `wp-includes/` - WordPress core JavaScript and CSS files
- `fonts.googleapis.com/` - Google Fonts CSS files
- `fonts.gstatic.com/` - Google Fonts font files
- `server.js` - Express server to serve static files
- `package.json` - Node.js dependencies

## Technology Stack
- **Frontend**: Static HTML/CSS/JS (WordPress export)
- **Server**: Node.js with Express.js
- **Port**: 5000 (configured for Replit webview)

## Setup Notes
- The server is configured to run on `0.0.0.0:5000` to work with Replit's webview proxy
- Cache headers are set to `no-cache` to ensure updates are visible immediately
- All WordPress plugin assets (Elementor, WooCommerce, etc.) are included as static files

## Recent Changes
- **Dec 5, 2025**: Initial setup for Replit environment
  - Created Express.js server to serve static files
  - Configured workflow to run on port 5000
  - Added cache control headers for better development experience
  - Set up deployment configuration

## Running the Project
The project runs automatically via the configured workflow. To manually start:
```bash
npm start
```

## Deployment
Configured as an autoscale deployment suitable for static websites.
