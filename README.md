# Ekub Backend (እቁብ)

A robust, secure, and feature-rich RESTful API backend for **Ekub** (traditional rotating savings and credit association) built with Node.js, Express, MongoDB, Redis, and Cloudinary.

---

## 🚀 Features

- **Authentication & Authorization**: Secure JWT-based auth, role-based access control (User, Admin), email verification, and password reset flows.
- **Ekub Group Management**: Create, manage, join, and track traditional rotating savings (Ekub) groups, rounds, and contributions.
- **Transaction & Payment Management**: Track deposits, payouts, fees, and financial transactions with Cloudinary receipt/image uploads.
- **Admin Dashboard Controls**: Comprehensive administrative tools for user management, group oversight, and platform monitoring.
- **Scheduled Reminders**: Automated cron jobs (`node-cron`) for contribution reminders and deadline notifications.
- **Security Best Practices**: Helmet, Express-Rate-Limit, Mongo Sanitize, CORS, and robust validation (`express-validator`).
- **Caching**: Redis integration for high-performance data caching and session/rate limiting support.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Caching**: Redis
- **Media Storage**: Cloudinary (Multer storage)
- **Security & Validation**: Helmet, Express-Validator, BcryptJS, JWT
- **Cron Jobs**: Node-Cron
- **Email/Notifications**: Nodemailer

---

## 📁 Project Structure

```tree
c:/Users/Administrator/Ekub-backend/
├── config/             # Database, Redis, and Cloudinary configurations
├── controllers/        # Route business logic controllers
├── jobs/               # Background tasks & cron jobs (e.g., reminders)
├── middlewares/        # Authentication, security, validation & rate limiting
├── models/             # Mongoose schemas (User, Group, Transaction, Contact, Blacklist)
├── routes/             # API endpoint definitions
├── utils/              # Helper utilities (notifications, etc)
├── .env                # Environment variables
├── server.js           # Main application entry point
└── package.json        # Dependencies and scripts
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or Atlas)
- Redis server
- Cloudinary account

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/Ekub-backend.git
   cd Ekub-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   REDIS_URL=your_redis_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   EMAIL_HOST=your_email_host
   EMAIL_PORT=your_email_port
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_pass
   ```

4. **Run the application**:
   - Development mode (with `nodemon`):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     node server.js
     ```

---

## 🔌 API Endpoints Overview

- **Auth**: `/api/v1/auth` (Register, Login, Password Reset, Verification)
- **Users**: `/api/v1/user` (Profile management, settings)
- **Groups**: `/api/v1/groups` (Ekub groups, memberships, rounds)
- **Transactions**: `/api/v1/transaction` (Contributions, payouts, receipts)
- **Admin**: `/api/v1/admin` (System administration and reports)
- **Contact**: `/api/v1/contact` (Inquiries and support)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
