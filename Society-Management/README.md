<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=Smart%20Society%20Management&fontSize=50&animation=fadeIn&fontAlignY=38&desc=Modernize%20your%20housing%20society%20with%20seamless%20management&descAlignY=51&descAlign=62" alt="Smart Society Management Banner" />
</div>

<div align="center">
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge&logo=opensourceinitiative)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

  <p align="center">
    <b>A comprehensive, state-of-the-art MERN stack solution for modern housing societies, apartments, and gated communities.</b>
  </p>
</div>

---

## 🚀 Overview

The **Smart Society Management System** is a robust web application built to digitize and simplify the daily administrative and community tasks within a housing society. It bridges the gap between residents, committee members, and security personnel by providing a unified platform for communication, financial management, visitor tracking, and maintenance.

> **The Problem:** Traditional society management relies on manual ledgers, paper logs, WhatsApp groups, and fragmented communication, leading to delayed maintenance, financial discrepancies, and security vulnerabilities.
> 
> **The Solution:** A centralized, transparent, and role-based platform that automates billing, secures visitor entry, tracks complaints, and fosters community engagement.

---

## ✨ Key Features

This platform is powered by a robust **Role-Based Access Control (RBAC)** system with 4 dedicated portals:

### 👑 Admin Workspace
- **Resident Directory:** Manage all resident profiles, flats, and vehicles.
- **Financial Control:** Generate monthly maintenance bills, calculate late penalty fees, and record offline/online payments.
- **Facility Management:** Monitor society amenities (pool, clubhouse) and approve/reject bookings.
- **Analytics Dashboard:** View beautiful, real-time charts for revenue, complaints, and visitor trends.
- **Notice Board & Polls:** Broadcast critical announcements and create democratic polls for society elections.

### 🏠 Resident Portal
- **My Profile & Family:** Manage your flat details, family members, and registered vehicles.
- **Smart Visitor Passes:** Pre-approve visitors or delivery agents by generating one-time QR codes.
- **Automated Billing:** View your monthly maintenance statements and pay securely from your dashboard.
- **Complaints & Maintenance:** Raise tickets for plumbing or electrical issues and track resolution status.
- **Facility Booking:** Reserve the clubhouse, gym, or tennis court with a few clicks.

### 🛡️ Security Gate
- **Live Visitor Log:** Record new visitors and track who is currently inside the society.
- **QR Code Scanner:** Quickly scan pre-approved resident QR passes for lightning-fast entry.
- **Alerts:** View active society notices and alerts from the Admin.

### 🔧 Maintenance Staff
- **Work Order List:** Receive and view assigned complaint tickets in real-time.
- **Status Updates:** Update the progress of ongoing maintenance work (e.g., In Progress, Resolved).

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js + Vite ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
- **Routing:** React Router v6
- **State Management:** Redux Toolkit ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
- **Styling:** Tailwind CSS + Vanilla CSS (Premium Dark Mode support) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
- **Icons:** Lucide React
- **Charts:** Recharts
- **Alerts:** SweetAlert2 & Custom Toast Context

### Backend
- **Environment:** Node.js ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
- **Framework:** Express.js ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
- **Database:** MongoDB + Mongoose ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
- **Authentication:** JWT with HTTP-Only Cookies ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
- **Real-time:** Socket.io (instant notifications & live data) ![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
- **Email Service:** Nodemailer (OTP & alerts)

---

## 📸 Screenshots

### 🔑 Authentication
<div align="center">
  <img src="./Docs/admin/auth_login.png" alt="Secure Login" width="800" />
</div>

### 👑 Admin Workspace
<p align="center">
  <img src="./Docs/admin/admin_dashboard.png" alt="Admin Dashboard" width="49%" />
  <img src="./Docs/admin/resident_list.png" alt="Resident Management" width="49%" />
  <img src="./Docs/admin/admin_billings.png" alt="Financial Control" width="49%" />
  <img src="./Docs/admin/admin_complaints.png" alt="Complaints Management" width="49%" />
  <img src="./Docs/admin/admin_facilityBookings.png" alt="Facility Bookings" width="49%" />
  <img src="./Docs/admin/visitor_logs.png" alt="Visitor Logs" width="49%" />
  <img src="./Docs/admin/payment-model.png" alt="Payment Modal" width="49%" />
  <img src="./Docs/admin/my_profile.png" alt="My Profile" width="49%" />
</p>

### 🏠 Resident Portal
<p align="center">
  <img src="./Docs/resident/dashboard.png" alt="Resident Dashboard" width="49%" />
  <img src="./Docs/resident/dark-mode.png" alt="Premium Dark Mode" width="49%" />
  <img src="./Docs/resident/bills.png" alt="Billing and Payments" width="49%" />
  <img src="./Docs/resident/complaints.png" alt="Complaints" width="49%" />
  <img src="./Docs/resident/facilityBooking.png" alt="Facility Bookings" width="49%" />
  <img src="./Docs/resident/my-profile.png" alt="My Profile" width="49%" />
  <img src="./Docs/resident/notice%20board.png" alt="Notice Board" width="49%" />
  <img src="./Docs/resident/visitors.png" alt="Visitors" width="49%" />
  <img src="./Docs/resident/votings.png" alt="Voting & Polls" width="49%" />
</p>

### 🛡️ Security Gate
<p align="center">
  <img src="./Docs/security/dashboard.png" alt="Security Dashboard" width="49%" />
  <img src="./Docs/security/activeVisitors.png" alt="Active Visitors" width="49%" />
  <img src="./Docs/security/vistorsEntry.png" alt="Visitor Entry" width="49%" />
  <img src="./Docs/security/notice.png" alt="Notice Board" width="49%" />
  <img src="./Docs/security/profile.png" alt="Security Profile" width="49%" />
</p>

### 🔧 Maintenance Staff
<p align="center">
  <img src="./Docs/maintainence/dasboard.png" alt="Maintenance Dashboard" width="49%" />
  <img src="./Docs/maintainence/assigned-tassk.png" alt="Assigned Tasks" width="49%" />
  <img src="./Docs/maintainence/notice.png" alt="Notice Board" width="49%" />
  <img src="./Docs/maintainence/changePwd.png" alt="Change Password" width="49%" />
  <img src="./Docs/maintainence/profile.png" alt="Maintenance Profile" width="49%" />
</p>

---

## 🏗️ Project Architecture

The project follows a modern client-server architecture with a clear separation of concerns:

```mermaid
graph TD
    Client[React Frontend] -->|REST API & Socket.io| API[Express API Gateway]
    API --> Auth[Auth Service]
    API --> Core[Core Service]
    API --> Notifications[Email/Real-time]
    Auth --> DB[(MongoDB)]
    Core --> DB
```

---

## 📂 Folder Structure

```text
📦 smart-society-management
 ┣ 📂 Backend
 ┃ ┣ 📂 controllers
 ┃ ┣ 📂 models
 ┃ ┣ 📂 routes
 ┃ ┣ 📂 middleware
 ┃ ┣ 📂 utils
 ┃ ┣ 📂 tests
 ┃ ┣ 📜 .env
 ┃ ┣ 📜 server.js
 ┃ ┗ 📜 package.json
 ┣ 📂 Frontend
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 assets
 ┃ ┃ ┣ 📂 components
 ┃ ┃ ┣ 📂 contexts
 ┃ ┃ ┣ 📂 pages
 ┃ ┃ ┣ 📂 services
 ┃ ┃ ┣ 📂 store
 ┃ ┃ ┣ 📜 App.jsx
 ┃ ┃ ┗ 📜 main.jsx
 ┃ ┣ 📜 tailwind.config.js
 ┃ ┣ 📜 vite.config.js
 ┃ ┗ 📜 package.json
 ┗ 📜 README.md
```

---

## 🔐 Authentication & Authorization

Our platform utilizes a robust security model to ensure data integrity and privacy.

- **Authentication Flow:** We use JSON Web Tokens (JWT) stored securely in HTTP-Only Cookies to prevent XSS attacks. Passwords are cryptographically hashed using `bcrypt` before storing.
- **Role-Based Access Control (RBAC):** Every API endpoint is protected by middleware that checks the user's role and permissions.

---

## 🎭 User Roles

| Role | Responsibilities | Key Permissions |
| :--- | :--- | :--- |
| 👑 **Admin Workspace** | System configuration, global settings | Full access to all modules, analytics, and billing |
| 🏠 **Resident Portal** | Bill payment, complaints, booking | Pay bills, raise tickets, manage guests |
| 🛡️ **Security Gate** | Gate management, visitor logging | Add/verify visitors, trigger alerts |
| 🔧 **Maintenance Staff**| Resolving assigned tickets | View assigned tasks, update ticket status |

---

## ⚡ Installation Guide

Follow these steps to set up the project locally.

> [!NOTE]
> Ensure you have **Node.js (v16+)** and **MongoDB** installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/smart-society-management.git
cd smart-society-management
```

### 2. Setup the Backend
Open a new terminal window:
```bash
cd Backend
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the `Backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=development
```

Run the backend server:
```bash
npm run dev
```

### 4. Setup the Frontend
Open another terminal window:
```bash
cd ../Frontend
npm install
```

Create a `.env` file in the `Frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend app:
```bash
npm run dev
```
Your application should now be running at `http://localhost:5173`. You can register a new admin account to get started!

---

## 📡 API Endpoints (Example)

| Method | Endpoint | Description | Auth Required | Role |
| :--- | :--- | :--- | :---: | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate user & get token | ❌ | All |
| `GET` | `/api/v1/users/profile` | Get current user profile | ✅ | All |
| `GET` | `/api/v1/maintenance/tickets` | Get all maintenance tickets | ✅ | Admin/Maintenance |
| `POST` | `/api/v1/visitors/log` | Add a new visitor entry | ✅ | Security |
| `POST` | `/api/v1/payments/checkout` | Initiate bill payment | ✅ | Resident |

---

## 🎨 UI/UX Highlights

- **Premium Dark Mode:** First-class dark mode tailored for low-light environments, reducing eye strain.
- **Glassmorphism Design:** A modern aesthetic with translucent cards and smooth blur effects.
- **Toast Notifications:** Non-intrusive, context-aware alerts utilizing our Custom Toast Context & SweetAlert2.
- **Responsive Layout:** Perfectly scales from large desktop monitors down to mobile devices used by security personnel.
- **Rich Data Visualization:** Interactive and beautiful charts powered by Recharts.

---

## 🔒 Security Features

> [!WARNING]
> Security is our top priority. The following measures are strictly enforced:

- **JWT in HTTP-Only Cookies:** Prevents token theft via XSS.
- **Data Sanitization:** Defense against NoSQL Injection and XSS attacks.
- **Rate Limiting:** Protects against brute-force attacks on authentication routes.
- **CORS Configuration:** Strictly configured to allow requests only from trusted origins.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/your-username/smart-society-management/issues).

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <br>
  <a href="https://github.com/TosifKureshi">
    <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=700&size=28&pause=1000&color=4F46E5&center=true&vCenter=true&width=600&lines=Developed+by+Tosif+Kureshi;Architected+with+Passion;MERN+Stack+Visionary" alt="Typing SVG - Tosif Kureshi" />
  </a>
  <br>
  <p>
    <a href="https://github.com/TosifKureshi">
      <img src="https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
    </a>
  </p>
  <br>
  <i>Crafted with ❤️ and ☕ for modern communities</i>
</div>
