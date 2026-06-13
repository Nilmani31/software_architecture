# 🚔 Sri Lanka Traffic Fine Payment System — Backend API

A REST API backend for the Sri Lanka Police Traffic Fine Payment System, built with **Node.js**, **Express**, and **MongoDB**.

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Officer & Admin login/register
│   ├── fineController.js      # Issue & lookup fines
│   ├── paymentController.js   # Process payments + SMS
│   ├── categoryController.js  # Fine categories CRUD
│   └── adminController.js     # Dashboard & analytics
├── middleware/
│   ├── auth.js                # JWT protect + authorize
│   └── errorHandler.js        # Global error handler
├── models/
│   ├── Admin.js
│   ├── Officer.js
│   ├── Driver.js
│   ├── Vehicle.js
│   ├── Fine.js
│   ├── FineCategory.js
│   └── Payment.js
├── routes/
│   ├── authRoutes.js
│   ├── fineRoutes.js
│   ├── paymentRoutes.js
│   ├── categoryRoutes.js
│   └── adminRoutes.js
├── seeders/
│   └── seed.js                # Seed DB with test data
├── services/
│   └── smsService.js          # Twilio SMS (mock in dev)
├── .env                       # Environment variables
├── .env.example
├── package.json
└── server.js                  # Entry point
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Copy `.env.example` to `.env` and fill in your values:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
SMS_MOCK=true          # set false to use real Twilio
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
```

### 3. Seed the database
```bash
node seeders/seed.js
```
This creates:
- Admin: `admin@slpolice.lk` / `Admin@1234`
- Officer: `officer@slpolice.lk` / `Officer@1234`
- 10 fine categories

### 4. Start the server
```bash
npm start        # production
npm run dev      # development (nodemon)
```

Server runs on **http://localhost:5000**

---

## 📡 API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/officer/register` | Public | Register officer |
| POST | `/api/auth/officer/login` | Public | Officer login |
| POST | `/api/auth/admin/register` | Public | Register admin |
| POST | `/api/auth/admin/login` | Public | Admin login |
| GET | `/api/auth/me` | Protected | Get current user |

### Fine Categories
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/categories` | Public | List all categories |
| GET | `/api/categories/:id` | Public | Get one category |
| POST | `/api/categories` | Admin | Create category |
| PUT | `/api/categories/:id` | Admin | Update category |
| DELETE | `/api/categories/:id` | Admin | Deactivate category |

### Fines
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/fines/lookup?ref=TF-XXX&categoryCode=OVS` | Public | Lookup fine (for payment) |
| GET | `/api/fines/ref/:referenceNumber` | Public | Get fine by ref number |
| POST | `/api/fines` | Officer | Issue a new fine |
| GET | `/api/fines` | Officer/Admin | List fines |
| GET | `/api/fines/:id` | Officer/Admin | Get fine by ID |

### Payments
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/payments/pay` | Public | Pay a fine (mobile/web) |
| GET | `/api/payments` | Admin | List all payments |
| GET | `/api/payments/:transactionId` | Admin | Get payment by txn ID |

### Admin Analytics
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/dashboard` | Admin | Summary stats |
| GET | `/api/admin/analytics/district` | Admin | District-wise collections |
| GET | `/api/admin/analytics/category` | Admin | Category-wise breakdown |
| GET | `/api/admin/analytics/monthly?year=2024` | Admin | Monthly trend |
| GET | `/api/admin/officers` | Admin | List all officers |

---

## 💳 Pay a Fine (Example)

```json
POST /api/payments/pay
{
  "referenceNumber": "TF-ABC123-XY12",
  "categoryCode": "OVS",
  "paymentMethod": "CARD",
  "cardNumber": "4111111111111111",
  "paymentChannel": "MOBILE_APP"
}
```

On success:
- Fine is marked as paid
- SMS sent to issuing officer's phone
- Transaction ID returned

---

## 🔐 JWT Authentication

Include the token in the `Authorization` header:
```
Authorization: Bearer <your_token_here>
```

---

## 📱 SMS Notifications

Set `SMS_MOCK=true` in `.env` for development (logs to console).
For production, set `SMS_MOCK=false` and add Twilio credentials.
