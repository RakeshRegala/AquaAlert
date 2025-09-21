# 🏥 AquaAlert - Smart Community Health Monitor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green.svg)](https://supabase.com/)

## 🎯 Project Purpose

*AquaAlert* is a comprehensive community health monitoring system designed to revolutionize public health management by enabling real-time tracking of water quality, health reports, and automated alert generation for government authorities.

### 🌍 Why AquaAlert?

In many communities, especially in rural and semi-urban areas, there's a critical need for:
- *Early Detection* of water-borne diseases and health issues
- *Real-time Monitoring* of water quality parameters
- *Automated Alerts* to government authorities for immediate action
- *Community Engagement* in health reporting and monitoring
- *Data-driven Decision Making* for public health policies

### 🎯 Target Users

- *🏘 Community Members*: Report health symptoms and water-related concerns
- *👩‍⚕ ASHA Workers*: Submit detailed health reports and water quality test results  
- *🏛 Government Authorities*: Monitor alerts, view reports, and receive real-time email notifications

### 🚀 Key Benefits

- *Real-time Health Monitoring*: Instant detection of health issues and water quality problems
- *Automated Alert System*: Government authorities receive immediate notifications via email
- *Multi-role Platform*: Different interfaces optimized for each user type
- *Data Analytics*: Comprehensive reporting and analytics for informed decision-making
- *Mobile-friendly*: Accessible on all devices for field workers

## 🏗 System Architecture

### Frontend (React + TypeScript)
- *Framework*: React 18 with TypeScript
- *Build Tool*: Vite
- *UI Library*: Radix UI components with Tailwind CSS
- *State Management*: React Query for server state
- *Authentication*: Supabase Auth
- *Routing*: React Router DOM

### Backend Services
- *Database*: Supabase (PostgreSQL)
- *Email Service*: Node.js Express server with Nodemailer
- *Real-time*: Supabase real-time subscriptions
- *Authentication*: Supabase Auth with Row Level Security (RLS)

### Key Technologies
- *Frontend*: React, TypeScript, Tailwind CSS, Radix UI
- *Backend*: Node.js, Express, Supabase
- *Email*: Nodemailer with Gmail SMTP
- *Database*: PostgreSQL with Supabase
- *Deployment*: Vite for frontend, Node.js for backend

## 🎯 Core Features

### 1. Multi-Role Authentication System
- *Community Members*: Basic health symptom reporting
- *ASHA Workers*: Comprehensive health and water quality reporting
- *Government Authorities*: Full system access with document verification

### 2. Health Monitoring
- *Symptom Reporting*: Community members can report health symptoms
- *Patient Records*: ASHA workers can create detailed patient health reports
- *Location Tracking*: All reports include location information
- *Water Source Tracking*: Links health issues to water sources

### 3. Water Quality Management
- *Test Results*: ASHA workers can submit water quality measurements
- *Parameters Tracked*:
  - pH levels (safe range: 6.5-8.5)
  - Turbidity (safe: <5 NTU)
  - Contamination levels (safe: <0.5)
- *Automatic Alerts*: System generates alerts for dangerous readings

### 4. Real-Time Alert System
- *Automatic Detection*: Alerts triggered by dangerous water readings
- *Severity Levels*: Low, Medium, High priority alerts
- *Email Notifications*: Real-time Gmail notifications to government authorities
- *Dashboard Monitoring*: Live alert updates in government dashboard

### 5. Document Management
- *Government Verification*: Document upload during registration
- *File Storage*: Supabase storage for verification documents
- *Supported Formats*: PDF, JPG, PNG, DOC, DOCX

## 📊 Database Schema

### Core Tables

#### profiles
- User profile information linked to Supabase auth
- Roles: community, asha, government
- Name, phone number, and role assignment

#### health_reports
- Patient health information
- Symptoms, location, water source
- Reporter tracking and timestamps

#### water_readings
- Water quality test results
- pH, turbidity, contamination levels
- Location and reporter information

#### alerts
- System-generated alerts
- Severity levels and alert messages
- Location and trigger information

### Security Features
- *Row Level Security (RLS)*: Database-level access control
- *Role-based Access*: Different permissions for each user role
- *Secure Functions*: Database functions for role checking

## 🚀 Getting Started

### 📋 Prerequisites

Before you begin, ensure you have the following installed:
- *Node.js* (version 18.0 or higher) - [Download here](https://nodejs.org/)
- *npm* (comes with Node.js)
- *Git* - [Download here](https://git-scm.com/)
- *Gmail Account* with 2-Factor Authentication enabled
- *Supabase Account* - [Sign up here](https://supabase.com/)

### 📥 Step 1: Clone the Repository

bash
# Clone the repository
git clone https://github.com/RakeshRegala/AquaAlert.git

# Navigate to the project directory
cd AquaAlert

# Verify you're in the correct directory
ls -la


### 📦 Step 2: Install Dependencies

bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install

# Return to root directory
cd ..


### 🔧 Step 3: Environment Configuration

#### 3.1 Create Frontend Environment File

Create a .env file in the root directory:

bash
# Create .env file
touch .env


Add the following content to .env:

env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Gmail Configuration (for email notifications)
VITE_GMAIL_USER=your-gmail@gmail.com
VITE_GMAIL_APP_PASSWORD=your-16-character-app-password

# Government Authority Configuration
VITE_GOVERNMENT_EMAIL=government@example.com
VITE_GOVERNMENT_NAME=Government Authority


#### 3.2 Create Server Environment File

Create a .env file in the server directory:

bash
# Navigate to server directory
cd server

# Create .env file
touch .env


Add the following content to server/.env:

env
# Gmail Configuration for Server
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password

# Government Authority Configuration
GOVERNMENT_EMAIL=government@example.com
GOVERNMENT_NAME=Government Authority

# Server Configuration
PORT=3001

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key


### 📧 Step 4: Gmail Setup (Critical Step)

#### 4.1 Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click *2-Step Verification*
3. Follow the setup process to enable 2FA

#### 4.2 Generate App Password
1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select *Mail* as the app
3. Click *Generate*
4. *Copy the 16-character password* (it looks like: abcd efgh ijkl mnop)
5. *Important*: Use this password in your .env files, NOT your regular Gmail password

### 🗄 Step 5: Database Setup

#### 5.1 Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click *New Project*
3. Choose your organization
4. Enter project details:
   - *Name*: AquaAlert
   - *Database Password*: Create a strong password
   - *Region*: Choose closest to your location
5. Click *Create new project*

#### 5.2 Get Supabase Credentials
1. In your Supabase project dashboard, go to *Settings* → *API*
2. Copy the *Project URL* and *anon public* key
3. Update your .env files with these values

#### 5.3 Run Database Migrations
1. In Supabase dashboard, go to *SQL Editor*
2. Copy the contents from supabase/migrations/20250916161952_9a35e65c-155a-431d-bf54-ecf4cf852ac9.sql
3. Paste and run the SQL script
4. This will create all necessary tables and security policies

#### 5.4 Set Up File Storage
1. In Supabase dashboard, go to *Storage*
2. Click *Create a new bucket*
3. Name: government-documents
4. Make it *Public*
5. Click *Create bucket*

### 🚀 Step 6: Start the Application

#### 6.1 Start the Email Server
bash
# Navigate to server directory
cd server

# Start the email server
npm start


You should see:

🚀 Real-time Email API server running on port 3001
📧 Gmail configured: YES
🔍 Starting real-time alert monitoring...
✅ Real-time monitoring started


#### 6.2 Start the Frontend (New Terminal)
bash
# Open a new terminal window
# Navigate to project root
cd AquaAlert

# Start the development server
npm run dev


You should see:

  VITE v5.4.19  ready in 500 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose


### ✅ Step 7: Verify Installation

#### 7.1 Test the Application
1. Open your browser and go to http://localhost:8080
2. You should see the AquaAlert login page
3. Try creating a test account with any role

#### 7.2 Test Email Functionality
1. Create a government account
2. Go to the Government Dashboard
3. Click *Settings* in Email Notifications
4. Enter your email and click *Send Test*
5. Check your Gmail inbox for the test email

### 🔧 Step 8: Troubleshooting

#### Common Issues and Solutions

*❌ "Email service not configured" error*
- Check that Gmail App Password is correct (16 characters)
- Verify 2-Factor Authentication is enabled
- Restart both servers after updating .env files

*❌ "Authentication failed" error*
- Ensure you're using App Password, not regular Gmail password
- Check Supabase credentials are correct
- Verify Supabase project is active

*❌ Database connection errors*
- Check Supabase URL and API key
- Ensure database migrations were run successfully
- Verify RLS policies are enabled

*❌ Port already in use*
- Change PORT in server/.env to a different number (e.g., 3002)
- Kill any processes using port 3001: lsof -ti:3001 | xargs kill -9

### 📱 Step 9: Mobile Testing

The application is mobile-responsive. Test on different devices:
- *Desktop*: Full functionality
- *Tablet*: Optimized layout
- *Mobile*: Touch-friendly interface for field workers

## 👥 User Roles & Features

### 🏘 Community Members
*Purpose*: Enable community members to report health symptoms and access health information.

*Features*:
- *Health Status Overview*: View current community health status
- *Symptom Reporting*: Submit health symptoms with location details
- *Water Source Tracking*: Report water sources used
- *Health Education*: Access safety tips and prevention measures
- *Real-time Updates*: View current alert status

*How to Use*:
1. Sign up as "Community/Public" user
2. Report symptoms through the simple form
3. View health education content
4. Monitor community health status

### 👩‍⚕ ASHA Workers
*Purpose*: Enable healthcare workers to submit detailed health reports and water quality tests.

*Features*:
- *Daily Statistics Dashboard*: Track daily reports, tests, patients, and alerts
- *Patient Health Reports*: Submit detailed patient information and symptoms
- *Water Quality Testing*: Record pH, turbidity, and contamination levels
- *Automatic Alert Generation*: System creates alerts for dangerous readings
- *Location Tracking*: All reports include precise location information

*How to Use*:
1. Sign up as "ASHA Worker"
2. Use the Health Reports tab to submit patient information
3. Use the Water Testing tab to record water quality measurements
4. Monitor daily statistics and generated alerts

*Water Quality Thresholds*:
- *pH*: Safe range 6.5-8.5 (alerts for <6.5 or >8.5)
- *Turbidity*: Safe <5 NTU (alerts for >5)
- *Contamination*: Safe <0.5 (alerts for >0.5)

### 🏛 Government Authorities
*Purpose*: Provide comprehensive monitoring and alert management for government officials.

*Features*:
- *Document Verification*: Upload verification documents during registration
- *Real-time Alert Monitoring*: Live updates on new alerts
- *Email Notifications*: Instant Gmail notifications for new alerts
- *Risk Assessment*: Community health risk level analysis
- *Data Analytics*: Comprehensive reporting and statistics
- *Test Alert Creation*: Create test alerts to verify system functionality

*How to Use*:
1. Sign up as "Government Authority" (requires document upload)
2. Access the comprehensive dashboard
3. Monitor real-time alerts and reports
4. Configure email notification settings
5. View analytics and risk assessments

*Email Notification Features*:
- *Real-time Alerts*: Instant notifications for new alerts
- *Beautiful Templates*: Professional HTML email design
- *Severity-based Styling*: Different colors for alert levels
- *Test Functionality*: Send test emails to verify setup

## 🔧 API Endpoints

### Email Service API (server/)

#### POST /api/send-alert
Send alert notification email
json
{
  "alertId": "uuid",
  "location": "string",
  "message": "string",
  "severity": "low|medium|high",
  "createdAt": "ISO string",
  "governmentEmail": "string",
  "governmentName": "string"
}


#### POST /api/send-test-email
Send test email
json
{
  "to": "email@example.com"
}


#### GET /api/health
Health check endpoint

## 🔐 Security Features

### Authentication & Authorization
- *Supabase Auth*: Secure user authentication
- *Role-based Access*: Different permissions per user role
- *JWT Tokens*: Secure session management
- *Document Verification*: Government role requires document upload

### Data Protection
- *Row Level Security*: Database-level access control
- *Environment Variables*: Sensitive data in environment files
- *HTTPS*: Secure communication (in production)
- *Input Validation*: Form validation and sanitization

## 📧 Email Notification System

### Features
- *Real-time Alerts*: Instant email notifications for new alerts
- *Beautiful Templates*: HTML email templates with severity colors
- *Gmail Integration*: Uses Gmail SMTP for reliable delivery
- *Test Functionality*: Test email sending capability

### Email Template
- *Severity-based Colors*: Different colors for alert levels
- *Professional Design*: Clean, responsive email layout
- *Alert Details*: Complete alert information
- *Dashboard Links*: Direct links to government dashboard

## 🚀 Production Deployment

### 🌐 Frontend Deployment (Vercel/Netlify)

#### Option 1: Vercel Deployment
1. *Build the application*:
   bash
   npm run build
   

2. *Deploy to Vercel*:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click *New Project*
   - Import your Git repository
   - Set build command: npm run build
   - Set output directory: dist

3. *Configure Environment Variables*:
   - Go to Project Settings → Environment Variables
   - Add all variables from your .env file (without VITE_ prefix for server-side)

#### Option 2: Netlify Deployment
1. *Build the application*:
   bash
   npm run build
   

2. *Deploy to Netlify*:
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Drag and drop your dist folder
   - Or connect your Git repository

3. *Configure Environment Variables*:
   - Go to Site Settings → Environment Variables
   - Add all variables from your .env file

### 🖥 Backend Deployment (Railway/Heroku)

#### Option 1: Railway Deployment
1. *Prepare for deployment*:
   bash
   cd server
   # Ensure package.json has start script
   

2. *Deploy to Railway*:
   - Go to [Railway Dashboard](https://railway.app/)
   - Click *New Project*
   - Connect your Git repository
   - Select the server folder

3. *Configure Environment Variables*:
   - Go to Variables tab
   - Add all variables from server/.env

#### Option 2: Heroku Deployment
1. *Create Heroku app*:
   bash
   heroku create aquaalert-api
   

2. *Set environment variables*:
   bash
   heroku config:set GMAIL_USER=your-gmail@gmail.com
   heroku config:set GMAIL_APP_PASSWORD=your-app-password
   heroku config:set GOVERNMENT_EMAIL=government@example.com
   heroku config:set GOVERNMENT_NAME="Government Authority"
   heroku config:set PORT=3001
   

3. *Deploy*:
   bash
   git subtree push --prefix server heroku main
   

### 🗄 Database Configuration

#### Production Supabase Setup
1. *Create Production Project*:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create a new project for production
   - Choose appropriate region and plan

2. *Run Migrations*:
   - Copy SQL from supabase/migrations/ files
   - Run in Supabase SQL Editor

3. *Configure RLS Policies*:
   - Ensure all Row Level Security policies are enabled
   - Test with production data

4. *Set Up Storage*:
   - Create government-documents bucket
   - Configure appropriate permissions

### 🔧 Production Checklist

#### Before Going Live:
- [ ] *Environment Variables*: All production credentials set
- [ ] *Gmail Setup*: App password configured and tested
- [ ] *Database*: Production Supabase project configured
- [ ] *Email Testing*: Test emails working in production
- [ ] *SSL/HTTPS*: Secure connections enabled
- [ ] *Domain*: Custom domain configured (optional)
- [ ] *Monitoring*: Error tracking and logging set up
- [ ] *Backup*: Database backup strategy implemented

#### Post-Deployment Testing:
1. *Test User Registration*: All three user roles
2. *Test Email Notifications*: Send test alerts
3. *Test Real-time Features*: Create alerts and verify notifications
4. *Test Mobile Responsiveness*: Check on different devices
5. *Test Performance*: Load testing with multiple users

### 📊 Monitoring & Maintenance

#### Health Checks
- *Frontend*: Monitor uptime and performance
- *Backend*: Check email server status
- *Database*: Monitor Supabase metrics
- *Email*: Track delivery rates and failures

#### Regular Maintenance
- *Security Updates*: Keep dependencies updated
- *Database Cleanup*: Archive old data periodically
- *Email Monitoring*: Check Gmail quotas and limits
- *User Feedback*: Monitor and address user issues

## 🧪 Testing & Quality Assurance

### 🧪 Test Files Included

The project includes comprehensive test files for all major functionality:

#### Email Testing
bash
# Test email functionality
node test-email.js

*What it tests*: Gmail SMTP connection, email template generation, delivery confirmation

#### Alert System Testing
bash
# Test alert creation
node test-alert-creation.js

# Test ASHA alert generation
node test-asha-alert.js

*What it tests*: Alert creation, severity levels, automatic email notifications

#### Real-time Monitoring
bash
# Test real-time features
node test-realtime-monitoring.js

*What it tests*: Supabase real-time subscriptions, live updates, database triggers

#### User Management
bash
# Create test user accounts
node create-test-users.js

# Check user data
node check-users.js

*What it tests*: User registration, role assignment, profile creation

#### Alert Verification
bash
# Check alert data
node check-alerts.js

*What it tests*: Alert storage, retrieval, and data integrity

### 🔍 Manual Testing Checklist

#### Authentication Testing
- [ ] *User Registration*: Test all three roles (Community, ASHA, Government)
- [ ] *Document Upload*: Test government document verification
- [ ] *Login/Logout*: Test authentication flow
- [ ] *Role-based Access*: Verify different permissions

#### Feature Testing
- [ ] *Health Reports*: Submit and view health reports
- [ ] *Water Testing*: Record water quality measurements
- [ ] *Alert Generation*: Test automatic alert creation
- [ ] *Email Notifications*: Verify email delivery
- [ ] *Real-time Updates*: Test live dashboard updates

#### Cross-browser Testing
- [ ] *Chrome*: Full functionality
- [ ] *Firefox*: Cross-browser compatibility
- [ ] *Safari*: Mobile and desktop
- [ ] *Edge*: Windows compatibility

#### Mobile Testing
- [ ] *iOS Safari*: Touch interface
- [ ] *Android Chrome*: Mobile responsiveness
- [ ] *Tablet*: Medium screen optimization

### 🚨 Error Handling Testing

#### Network Issues
- [ ] *Offline Mode*: Graceful degradation
- [ ] *Slow Connection*: Loading states
- [ ] *API Failures*: Error messages

#### Data Validation
- [ ] *Invalid Input*: Form validation
- [ ] *Missing Fields*: Required field checks
- [ ] *File Upload*: Document validation

### 📊 Performance Testing

#### Load Testing
bash
# Test with multiple concurrent users
# Use tools like Apache Bench or Artillery


#### Database Performance
- [ ] *Query Optimization*: Check slow queries
- [ ] *Index Usage*: Verify proper indexing
- [ ] *Connection Pooling*: Monitor connections

### 🔒 Security Testing

#### Authentication Security
- [ ] *Password Strength*: Enforce strong passwords
- [ ] *Session Management*: Secure session handling
- [ ] *Role-based Access*: Verify RLS policies

#### Data Security
- [ ] *SQL Injection*: Test input sanitization
- [ ] *XSS Protection*: Verify output encoding
- [ ] *File Upload Security*: Validate file types

## 📈 Monitoring & Analytics

### Dashboard Metrics
- *Health Reports*: Number of reports submitted
- *Water Tests*: Water quality test results
- *Active Alerts*: Current alert count and severity
- *Risk Assessment*: Community health risk levels

### Real-time Features
- *Live Updates*: Real-time dashboard updates
- *Alert Notifications*: Instant email alerts
- *Database Subscriptions*: Supabase real-time subscriptions

## 🔧 Configuration Files

### Key Configuration Files
- package.json: Frontend dependencies and scripts
- server/package.json: Backend dependencies
- vite.config.ts: Vite build configuration
- tailwind.config.ts: Tailwind CSS configuration
- tsconfig.json: TypeScript configuration
- supabase/config.toml: Supabase local configuration

## 🛠 Development

### Project Structure

AquaAlert/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   └── integrations/       # External integrations
├── server/                # Backend server
│   ├── email-api.js       # Email API server
│   └── real-time-alerts.js # Real-time monitoring
├── supabase/              # Database migrations
└── public/                # Static assets


### Development Commands
bash
# Frontend development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint

# Backend development
cd server
npm start              # Start email server
npm run dev            # Start with nodemon


## 📚 Additional Resources

### 📖 Documentation Files
- QUICK_SETUP.md: Quick start guide for Gmail setup
- EMAIL_SETUP.md: Detailed email configuration guide
- GMAIL_SETUP_COMPLETE.md: Complete Gmail setup instructions

### 🛠 Development Tools
- *Vite*: Fast build tool and development server
- *ESLint*: Code linting and formatting
- *TypeScript*: Type safety and better development experience
- *Tailwind CSS*: Utility-first CSS framework
- *Radix UI*: Accessible component library

### 🔗 External Services
- *Supabase*: Backend-as-a-Service (Database, Auth, Storage)
- *Gmail SMTP*: Email delivery service
- *Vercel/Netlify*: Frontend hosting platforms
- *Railway/Heroku*: Backend hosting platforms

## 🤝 Contributing

We welcome contributions to AquaAlert! Here's how you can help:

### 🐛 Bug Reports
1. Check existing issues first
2. Create a detailed bug report with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details

### ✨ Feature Requests
1. Check existing feature requests
2. Describe the feature clearly
3. Explain the use case and benefits
4. Consider implementation complexity

### 💻 Code Contributions
1. *Fork the repository*
2. *Create a feature branch*:
   bash
   git checkout -b feature/your-feature-name
   
3. *Make your changes*:
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation if needed
4. *Test thoroughly*:
   - Run all test files
   - Test on different browsers/devices
   - Verify email functionality
5. *Submit a pull request*:
   - Clear description of changes
   - Link to related issues
   - Include screenshots if UI changes

### 📋 Development Guidelines
- *Code Style*: Follow existing patterns and ESLint rules
- *Commits*: Use clear, descriptive commit messages
- *Testing*: Always test your changes thoroughly
- *Documentation*: Update README and comments as needed

## 📞 Support & Community

### 🆘 Getting Help
- *Documentation*: Check this README and other docs first
- *Issues*: Search existing GitHub issues
- *Discussions*: Use GitHub Discussions for questions
- *Email*: Contact the maintainers for urgent issues

### 🐛 Known Issues
- *Gmail Rate Limits*: Gmail has daily sending limits
- *Mobile Safari*: Some features may work differently
- *Internet Explorer*: Not supported (use modern browsers)

### 🔄 Updates & Roadmap
- *Version 1.0*: Current stable release
- *Planned Features*:
  - SMS notifications
  - Multi-language support
  - Advanced analytics
  - Mobile app development

## 📄 License

This project is licensed under the *MIT License* - see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ *Commercial use* allowed
- ✅ *Modification* allowed
- ✅ *Distribution* allowed
- ✅ *Private use* allowed
- ❌ *No warranty* provided

## 🙏 Acknowledgments

- *Supabase* for providing excellent backend services
- *Radix UI* for accessible component primitives
- *Tailwind CSS* for the utility-first CSS framework
- *React Team* for the amazing frontend framework
- *Community* for feedback and contributions

## 📊 Project Statistics

- *Lines of Code*: ~5,000+ lines
- *Languages*: TypeScript, JavaScript, SQL, HTML, CSS
- *Dependencies*: 60+ packages
- *Test Coverage*: Comprehensive test suite included
- *Documentation*: Complete setup and usage guides

---

## 🎯 Quick Start Summary

*For immediate setup:*
1. Clone repository: git clone <repo-url>
2. Install dependencies: npm install && cd server && npm install
3. Set up Gmail App Password
4. Create Supabase project and run migrations
5. Configure .env files
6. Start servers: npm start (server) and npm run dev (frontend)
7. Test at http://localhost:8080


*AquaAlert* - Empowering communities with smart health monitoring technology. 🏥💧📊
