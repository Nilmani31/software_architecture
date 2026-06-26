# 🚔 Sri Lanka Police Traffic Fine Payment System

> A full-stack web application for digitizing the Sri Lanka Police traffic fine issuance and online payment process.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Modules & Features](#modules--features)
- [API Reference](#api-reference)
- [Database Models](#database-models)
- [Default Credentials](#default-credentials)
- [Quick Start Guide](#quick-start-guide)
- [Environment Variables](#environment-variables)
- [How It All Connects](#how-it-all-connects)
- [Presentation Flow](#presentation-flow)

---

## 🎯 Project Overview

This system replaces the manual, paper-based traffic fine process in Sri Lanka with a digital, end-to-end solution. It consists of **three integrated modules**:

| Module | Description | Port |
|--------|-------------|------|
| `software_architecture-Chamsha_backend_v2` | Node.js REST API (Backend) | `5000` |
| `software_architecture-web_portal` | React – Public fine payment portal for drivers | `5173` |
| `software_architecture-viduni` (frontend) | React – Admin dashboard for police officers & admins | `5174` |

### 🏆 Key Achievements
- ✅ Fully working REST API with JWT authentication
- ✅ MongoDB Atlas cloud database (+ fallback in-memory DB for demo)
- ✅ SMS notification to officer upon payment (Twilio / Mock)
- ✅ Auto-generated fine reference numbers (`TF-XXXXXXXX-XXXX`)
- ✅ 30-day payment deadline auto-set on each fine
- ✅ PDF report export from admin dashboard
- ✅ Real-time analytics: district-wise, category-wise, monthly

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                                  │
│                                                                  │
│   ┌──────────────────────┐    ┌──────────────────────────────┐  │
│   │   Web Portal         │    │   Admin Dashboard            │  │
│   │  (Public Drivers)    │    │  (Officers & Admins)         │  │
│   │  React + Vite        │    │  React + Vite                │  │
│   │  Port: 5173          │    │  Port: 5174                  │  │
│   └──────────┬───────────┘    └──────────────┬───────────────┘  │
└──────────────┼─────────────────────────────-─┼──────────────────┘
               │ HTTP / REST                   │ HTTP / REST (JWT)
               ▼                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API LAYER (Port: 5000)                        │
│                                                                  │
│   Express.js REST API                                            │
│   ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌──────────────┐    │
│   │  /auth   │ │  /fines  │ │ /payments  │ │  /categories │    │
│   └──────────┘ └──────────┘ └────────────┘ └──────────────┘    │
│                       ┌──────────┐                              │
│                       │  /admin  │                              │
│                       └──────────┘                              │
│   Middleware: JWT Auth │ CORS │ Global Error Handler            │
└─────────────────────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                                  │
│   MongoDB Atlas (Cloud) / MongoDB Memory Server (Dev/Demo)       │
│   Collections: fines, payments, officers, admins,                │
│                drivers, vehicles, finecategories                 │
└─────────────────────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                  NOTIFICATION LAYER                               │
│   Twilio SMS (Production) / Mock SMS Logger (Development)        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database & ORM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| Twilio | SMS notifications |
| dotenv | Environment configuration |
| nodemon | Development hot-reload |
| mongodb-memory-server | In-memory DB for demo/dev |

### Frontend – Web Portal (Driver Payment)
| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| Vite 8 | Build tool & dev server |
| React Router DOM v7 | Client-side routing |
| Axios | HTTP requests to backend |
| jsPDF + jspdf-autotable | PDF report generation |

### Frontend – Admin Dashboard
| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| Vite 8 | Build tool & dev server |
| React Router DOM v7 | Client-side routing |
| Axios | HTTP requests to backend |
| jsPDF + jspdf-autotable | PDF report generation |

---

## 📁 Project Structure

```
software_architecture-Chamsha_backend_v2 (1)/
│
├── 📂 software_architecture-Chamsha_backend_v2/   ← BACKEND
│   ├── server.js                  ← App entry point
│   ├── .env                       ← Environment variables
│   ├── package.json
│   ├── config/
│   │   └── db.js                  ← MongoDB connection + auto seed
│   ├── controllers/
│   │   ├── authController.js      ← Login/register for officers & admins
│   │   ├── fineController.js      ← Issue & lookup fines
│   │   ├── paymentController.js   ← Payment processing + SMS trigger
│   │   ├── categoryController.js  ← Fine categories CRUD
│   │   └── adminController.js     ← Dashboard analytics aggregations
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Officer.js
│   │   ├── Driver.js
│   │   ├── Vehicle.js
│   │   ├── Fine.js                ← Auto-generates reference number
│   │   ├── FineCategory.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── fineRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   └── errorHandler.js        ← Global error handling
│   └── services/
│       └── smsService.js          ← Twilio / Mock SMS
│
├── 📂 software_architecture-web_portal/            ← DRIVER PORTAL (React)
│   └── src/
│       ├── App.jsx                ← Routes: /, /fine/:id, /pay/:id, /success
│       ├── pages/
│       │   ├── Home.jsx           ← Fine lookup by reference number
│       │   ├── FineDetails.jsx    ← Show fine details before payment
│       │   ├── PaymentGateway.jsx ← Card payment form
│       │   └── PaymentSuccess.jsx ← Success confirmation screen
│       └── services/
│           └── api.js             ← Axios → http://localhost:5000/api
│
└── 📂 software_architecture-viduni/                ← ADMIN DASHBOARD (React)
    └── frontend/src/
        ├── App.jsx                ← Routes: / (login), /admin/*
        ├── pages/
        │   ├── Login.jsx          ← Admin/Officer login page
        │   ├── Dashboard.jsx      ← Summary stats & KPIs
        │   ├── OfficerRegister.jsx← Register new officers
        │   ├── PaymentLogs.jsx    ← All payment history
        │   ├── DistrictReport.jsx ← District analytics
        │   └── CategoryReport.jsx ← Category analytics
        ├── layouts/
        │   └── AdminLayout.jsx    ← Sidebar + Navbar wrapper
        └── services/
            └── api.js             ← Axios → http://localhost:5000/api
```

---

## 🎮 Modules & Features

### 1. 🔒 Authentication Module
- **Officer Login** → JWT token via `POST /api/auth/officer/login`
- **Admin Login** → Role-based JWT (SUPER_ADMIN) via `POST /api/auth/admin/login`
- **Register Officer** → Admin creates new traffic officers
- Passwords hashed with **bcrypt** (12 salt rounds)
- JWT tokens expire in **1 day**
- Protected routes enforce role: OFFICER vs ADMIN

### 2. 🚨 Fine Management (Officer Side)
- Officers issue fines with: vehicle plate, driver licence, category, location
- Each fine gets a unique reference number auto-generated: `TF-XXXXXXXX-XXXX`
- Payment due date auto-set to **30 days from issue date**
- Officers can only view their **own issued fines**
- Admins can view **all fines** with district/payment status filters

### 3. 💳 Payment Module (Driver/Public — Web Portal)
1. Driver visits Web Portal → enters **Reference Number**
2. System looks up the fine and shows details (amount, officer, location)
3. Driver pays via **card payment form** (card number, expiry, CVV)
4. Backend marks fine as `isPaid: true` and creates a `Payment` record
5. **SMS notification sent** to the issuing officer
6. Driver sees ✅ success screen with unique **Transaction ID**

### 4. 📊 Admin Analytics Dashboard
| Report | Description |
|--------|-------------|
| Summary KPIs | Total fines issued, paid, unpaid, total revenue, top district |
| District Analytics | Revenue collected and fines issued per district |
| Category Analytics | Revenue broken down by fine type (speeding, DUI, etc.) |
| Monthly Trends | Month-by-month revenue for any selected year |
| Officer Management | View all registered officers by district |
| Payment Logs | Full payment history with filters |

### 5. 📱 SMS Notification Service
- **Production:** Uses Twilio (configure credentials in `.env`)
- **Development/Demo:** `SMS_MOCK=true` → logs SMS content to terminal
- Message includes: fine reference, amount, transaction ID, officer instructions

---

## 🔌 API Reference

### Base URL: `http://localhost:5000/api`

#### Authentication

| Method | Endpoint | Auth Required | Description |
|--------|----------|--------------|-------------|
| POST | `/auth/officer/register` | Admin JWT | Register new officer |
| POST | `/auth/officer/login` | None | Officer login → returns JWT |
| POST | `/auth/admin/login` | None | Admin login → returns JWT |
| GET | `/auth/me` | JWT | Get current logged-in user |

#### Fines

| Method | Endpoint | Auth Required | Description |
|--------|----------|--------------|-------------|
| GET | `/fines/lookup?ref=TF-XXX&categoryCode=OVS` | None | Public fine lookup |
| GET | `/fines/ref/:referenceNumber` | None | Get fine by reference number |
| POST | `/fines` | Officer JWT | Issue a new fine |
| GET | `/fines` | JWT | List fines (officer=own, admin=all) |
| GET | `/fines/:id` | JWT | Get single fine by ID |

#### Payments

| Method | Endpoint | Auth Required | Description |
|--------|----------|--------------|-------------|
| POST | `/payments/pay` | None | Pay a fine (public endpoint) |
| GET | `/payments` | Admin JWT | List all payments with filters |
| GET | `/payments/:transactionId` | JWT | Get payment by transaction ID |

#### Admin Analytics

| Method | Endpoint | Auth Required | Description |
|--------|----------|--------------|-------------|
| GET | `/admin/dashboard` | Admin JWT | Summary statistics |
| GET | `/admin/analytics/district` | Admin JWT | District-wise analytics |
| GET | `/admin/analytics/category` | Admin JWT | Category-wise analytics |
| GET | `/admin/analytics/monthly?year=2024` | Admin JWT | Monthly revenue trends |
| GET | `/admin/officers` | Admin JWT | List officers |

#### Categories

| Method | Endpoint | Auth Required | Description |
|--------|----------|--------------|-------------|
| GET | `/categories` | None | List all fine categories |
| POST | `/categories` | Admin JWT | Create new category |
| PUT | `/categories/:id` | Admin JWT | Update category |
| DELETE | `/categories/:id` | Admin JWT | Delete category |

---

## 🗃️ Database Models

### Fine
```js
{
  referenceNumber: String,     // Auto: "TF-XXXXXXXX-XXXX" (unique)
  vehicleId:       ObjectId,   // → Vehicle
  driverId:        ObjectId,   // → Driver
  categoryId:      ObjectId,   // → FineCategory
  officerId:       ObjectId,   // → Officer
  location:        String,
  district:        String,
  description:     String,
  isPaid:          Boolean,    // default: false
  issuedDate:      Date,       // default: Date.now
  dueDate:         Date,       // auto: issuedDate + 30 days
}
```

### Payment
```js
{
  transactionId:         String,   // Auto UUID
  fineId:                ObjectId, // → Fine
  amount:                Number,   // Copied from FineCategory.amount
  paymentMethod:         String,   // CARD | MOBILE | ONLINE_BANKING
  cardLastFour:          String,   // Last 4 digits only
  paymentChannel:        String,   // MOBILE_APP | WEB_PORTAL
  status:                String,   // SUCCESS | FAILED | PENDING
  smsNotificationSent:   Boolean,
  paymentDate:           Date,     // default: Date.now
}
```

### Officer
```js
{
  name:         String,
  badgeNumber:  String,  // Unique e.g. "SLP-001"
  email:        String,  // Unique
  password:     String,  // bcrypt hashed
  phone:        String,  // For SMS notifications
  district:     String,
  isActive:     Boolean, // default: true
}
```

### FineCategory
```js
{
  categoryCode:  String,  // e.g. "OVS", "DUI" (unique)
  name:          String,  // e.g. "Over Speeding"
  description:   String,
  amount:        Number,  // LKR amount
  isActive:      Boolean,
}
```

---

## 🔑 Default Credentials

> Automatically seeded when the in-memory DB starts (no MongoDB URI needed for demo).

### Admin Login
| Field | Value |
|-------|-------|
| URL | `http://localhost:5174` |
| Email | `admin@slpolice.lk` |
| Password | `Admin@1234` |
| Role | SUPER_ADMIN |

### Officer Login
| Field | Value |
|-------|-------|
| URL | `http://localhost:5174` |
| Email | `officer@slpolice.lk` |
| Password | `Officer@1234` |
| Badge Number | SLP-001 |
| District | Galle |

### Test Fine (Web Portal Demo)
| Field | Value |
|-------|-------|
| URL | `http://localhost:5173` |
| Reference Number | `TF-TEST-001` |
| Category Code | `OVS` |
| Amount | Rs. 3,000 |
| Status | Unpaid |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org) v18+
- npm v9+

---

### ▶️ Step 1 — Start the Backend

```bash
cd "software_architecture-Chamsha_backend_v2"
npm install
npm run dev
```

Expected output:
```
🚀 Server running on port 5000
✅ MongoDB Connected: cluster0.ua4151c.mongodb.net
```

> If MongoDB Atlas is unreachable, in-memory DB starts automatically with seeded test data.

---

### ▶️ Step 2 — Start the Driver Web Portal

```bash
cd "software_architecture-web_portal"
npm install
npm run dev
```

Open: **`http://localhost:5173`**

---

### ▶️ Step 3 — Start the Admin Dashboard

```bash
cd "software_architecture-viduni/frontend"
npm install
npm run dev
```

Open: **`http://localhost:5174`**

---

### ▶️ Step 4 — Run the Full Demo

**Driver Portal (`http://localhost:5173`):**
1. Enter `TF-TEST-001` → Click **Lookup Fine**
2. View fine details → Click **Pay Fine**
3. Card: `4242 4242 4242 4242` | Expiry: `12/26` | CVV: `123`
4. Click **Pay Rs. 3,000** → ✅ Success screen

**Admin Dashboard (`http://localhost:5174`):**
1. Login: `admin@slpolice.lk` / `Admin@1234`
2. Dashboard → Updated KPIs
3. Payment Logs → New transaction visible
4. District / Category reports

---

## ⚙️ Environment Variables

File: `software_architecture-Chamsha_backend_v2/.env`

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=1d

# Server Port
PORT=5000

# Twilio (optional)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX

# Mock SMS for demo (no Twilio account needed)
SMS_MOCK=true
```

---

## 🔗 How It All Connects

```
Driver → Web Portal (5173) → GET /api/fines/lookup?ref=TF-TEST-001
                           ← Fine data returned

Driver → Pay → POST /api/payments/pay
             ← Payment record created
             ← fine.isPaid = true
             ← SMS sent to officer (mock or Twilio)
             ← Transaction ID returned

Admin → Dashboard (5174) → GET /api/admin/dashboard (JWT required)
                         ← Real-time analytics from MongoDB
```

---

## 🎤 Presentation Demo Script

### 1. Problem Statement
> "Sri Lanka traffic fines are paper-based — slow, error-prone, and hard to track."

### 2. Solution
> "We built a 3-tier web system: REST API backend, public driver payment portal, and admin dashboard."

### 3. Live Backend Check
```
GET http://localhost:5000/
→ {"message":"Sri Lanka Traffic Fine API is running ✅"}
```

### 4. Driver Payment Demo (Web Portal)
- Lookup `TF-TEST-001` → Pay → Success → Show Transaction ID

### 5. Admin Dashboard Demo
- Login → Dashboard KPIs → Payment Logs → Reports

### 6. Technical Highlights
- JWT auth with role-based access (OFFICER vs SUPER_ADMIN)
- Auto-generated reference numbers
- 30-day payment deadline
- MongoDB aggregation pipelines for analytics
- Twilio SMS with mock fallback
- Zero-config demo (in-memory DB + auto seed)

---

## 🐞 Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Run `npm install` in backend folder |
| MongoDB error | In-memory DB starts automatically |
| CORS error | Ensure backend is on port **5000** |
| Port conflict | Change `PORT` in `.env` |
| Fine not found | Use `TF-TEST-001` exactly |
| Login fails | `admin@slpolice.lk` / `Admin@1234` |
| SMS not sending | Set `SMS_MOCK=true` in `.env` |

---

## 👥 Team

| Module | Developer |
|--------|-----------|
| Backend REST API | Chamsha |
| Admin Dashboard Frontend | Viduni |
| Driver Web Portal | Chamsha |

---

*Sri Lanka Police Traffic Fine Payment System — Software Architecture Group Project*
