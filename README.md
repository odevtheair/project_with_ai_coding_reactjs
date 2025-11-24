# Authentication System with JWT and PIN Verification

ระบบ Authentication ที่สมบูรณ์แบบพร้อม JWT Token และการยืนยันตัวตนด้วย PIN 6 หลัก

## 📋 Features

### Backend
- ✅ Node.js 22 + ES Modules
- ✅ Express.js REST API
- ✅ MySQL2 with Promise
- ✅ JWT Authentication
- ✅ Bcrypt Password Hashing
- ✅ CORS Configuration
- ✅ Error Handling
- ✅ Input Validation
- ✅ MVC Pattern
- ✅ Environment Variables
- ✅ Rate Limiting
- ✅ Login/PIN Verification Logging

### External PIN API
- ✅ Standalone PIN Verification Service
- ✅ Runs on separate port (3001)
- ✅ Rate Limiting (10 req/min)
- ✅ Request Statistics & Monitoring
- ✅ Configurable Valid PIN
- ✅ Simulated Network Latency

### Frontend
- ✅ React 19 + Vite
- ✅ React Router DOM
- ✅ Context API for State Management
- ✅ Axios for API calls
- ✅ Protected Routes
- ✅ Auto Focus & Auto Submit PIN
- ✅ Paste Support for PIN
- ✅ Keyboard Navigation
- ✅ Responsive Design
- ✅ Separated CSS Files

### Authentication Flow
1. User Login/Register → Get JWT Token
2. Redirect to PIN Verification
3. Enter 6-digit PIN
4. Backend verifies PIN with External API
5. If valid → Redirect to Dashboard
6. If invalid → Show Error

## 🚀 Installation

### 1. Clone Repository
```bash
cd C:\Users\Leader\Desktop\nvm\project-with-ai-coding
```

### 2. Setup Backend

```bash
cd backend
npm install
```

**สร้างไฟล์ `.env`** (คัดลอกจาก `.env.example`):
```bash
cp .env.example .env
```

**แก้ไขไฟล์ `.env`**:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=sys_ai_pincode
DB_PORT=3306

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h

EXTERNAL_PIN_API_URL=http://localhost:3001/api/verify-pin
EXTERNAL_PIN_API_TIMEOUT=5000

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
```

**สร้าง Database**:
```bash
# เข้า MySQL
mysql -u root -p

# รันไฟล์ schema.sql
source database/schema.sql
```

หรือ import ด้วย MySQL Workbench:
```sql
-- เปิดไฟล์ database/schema.sql และรัน
```

### 3. Setup External PIN API

```bash
cd ../external-pin-api
npm install
```

**สร้างไฟล์ `.env`** (optional):
```bash
cp .env.example .env
```

**แก้ไขไฟล์ `.env`** (ถ้าต้องการ):
```env
PORT=3001
NODE_ENV=development
VALID_PIN=123456
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 4. Setup Frontend

```bash
cd ../vite-project
npm install
```

**สร้างไฟล์ `.env`**:
```bash
cp .env.example .env
```

**แก้ไขไฟล์ `.env`**:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### 1. Register User

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Password123",
  "fullName": "Test User"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "fullName": "Test User"
    }
  }
}
```

**Validation Rules:**
- `username`: 3-50 characters, alphanumeric + underscore only
- `email`: Valid email format
- `password`: Minimum 6 characters, must contain uppercase, lowercase, and number
- `fullName`: Optional, maximum 100 characters

---

### 2. Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "testuser",
  "password": "Password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "fullName": "Test User"
    }
  }
}
```

**Rate Limiting:**
- 5 attempts per 15 minutes
- Returns 429 if limit exceeded

---

### 3. Get Profile (Protected)

**Endpoint:** `GET /auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "full_name": "Test User",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 4. Verify PIN (Protected)

**Endpoint:** `POST /pin/verify`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "pin": "123456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "PIN verified successfully"
}
```

**Response (Invalid PIN):**
```json
{
  "success": false,
  "message": "Invalid PIN"
}
```

**Valid PIN:** `123456`

---

### 5. Mock PIN API (for testing)

**Endpoint:** `POST /pin/verify-pin`

**Request Body:**
```json
{
  "pin": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "PIN is valid"
}
```

---

## 🎯 Running the Application

**สำคัญ:** ต้องรัน 3 services พร้อมกัน

### วิธีที่ 1: ใช้ Start Script (แนะนำ)

**Windows (PowerShell):**
```powershell
.\start-all.ps1
```

**Linux/Mac (Bash):**
```bash
chmod +x start-all.sh
./start-all.sh
```

Script จะเปิด 3 terminal windows/tabs แยกกัน สำหรับแต่ละ service

### วิธีที่ 2: เปิด Manual (3 Terminal แยกกัน)

**Terminal 1 - External PIN API:**
```bash
cd external-pin-api
npm start
```
External PIN API จะรันที่: `http://localhost:3001`

**Terminal 2 - Backend:**
```bash
cd backend
npm start
```
Backend จะรันที่: `http://localhost:3000`

**Terminal 3 - Frontend:**
```bash
cd vite-project
npm run dev
```
Frontend จะรันที่: `http://localhost:5173`

---

## 🧪 Testing

### Test User Credentials
```
Username: testuser
Password: password123
PIN: 123456
```

**หมายเหตุ:** คุณต้องสร้าง user ก่อนด้วยการ register หรือ insert ข้อมูลใน database

### Insert Test User (ถ้ายังไม่มี)
```sql
-- Password: password123
INSERT INTO users (username, email, password, full_name) VALUES
('testuser', 'test@example.com', '$2b$10$YourBcryptHashedPasswordHere', 'Test User');
```

หรือใช้ Register API เพื่อสร้าง user ใหม่

---

## 🏗️ Project Structure

```
project-with-ai-coding/
├── backend/
│   ├── database/
│   │   └── schema.sql              # Database schema
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # Database configuration
│   │   ├── controllers/
│   │   │   ├── authController.js   # Auth logic
│   │   │   └── pinController.js    # PIN verification logic
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT middleware
│   │   │   └── validation.js       # Input validation
│   │   ├── models/
│   │   │   └── User.js             # User model
│   │   ├── routes/
│   │   │   ├── authRoutes.js       # Auth routes
│   │   │   └── pinRoutes.js        # PIN routes
│   │   └── utils/
│   │       └── logger.js           # Logging utilities
│   ├── .env.example
│   ├── package.json
│   ├── README.md
│   └── server.js                   # Entry point
│
├── external-pin-api/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── README.md
│   └── server.js                   # PIN verification service
│
└── vite-project/
    ├── src/
    │   ├── components/
    │   │   ├── LoginForm.jsx       # Login/Register component
    │   │   ├── PinCodeForm.jsx     # PIN verification component
    │   │   └── ProtectedRoute.jsx  # Route guard
    │   ├── context/
    │   │   └── AuthContext.jsx     # Auth state management
    │   ├── pages/
    │   │   └── Dashboard.jsx       # Dashboard page
    │   ├── services/
    │   │   └── api.js              # API service
    │   ├── styles/
    │   │   ├── LoginForm.css
    │   │   ├── PinCodeForm.css
    │   │   └── Dashboard.css
    │   ├── App.jsx                 # Main app with routing
    │   ├── index.css
    │   └── main.jsx
    ├── .env.example
    ├── CLAUDE.md
    ├── package.json
    └── vite.config.js
```

---

## 🔒 Security Features

1. **Password Hashing**: bcrypt with salt rounds = 10
2. **JWT Tokens**: Expiration time configurable
3. **Rate Limiting**: Prevents brute force attacks
4. **Input Validation**: Server-side validation for all inputs
5. **CORS**: Configured for specific origins
6. **SQL Injection Protection**: Prepared statements with mysql2
7. **XSS Protection**: Input sanitization
8. **Logging**: All login and PIN verification attempts logged

---

## 📝 Database Schema

### users
```sql
- id (INT, PK, AUTO_INCREMENT)
- username (VARCHAR(50), UNIQUE)
- email (VARCHAR(100), UNIQUE)
- password (VARCHAR(255))
- full_name (VARCHAR(100))
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### login_logs
```sql
- id (INT, PK, AUTO_INCREMENT)
- user_id (INT, FK)
- ip_address (VARCHAR(45))
- user_agent (TEXT)
- login_time (TIMESTAMP)
- status (ENUM: success, failed)
- failure_reason (VARCHAR(255))
```

### pin_verification_logs
```sql
- id (INT, PK, AUTO_INCREMENT)
- user_id (INT, FK)
- ip_address (VARCHAR(45))
- verification_time (TIMESTAMP)
- status (ENUM: success, failed)
- failure_reason (VARCHAR(255))
```

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:** ตรวจสอบว่า MySQL กำลังรันอยู่และ credentials ใน `.env` ถูกต้อง

### CORS Error
```
Access to fetch at 'http://localhost:3000/api/...' has been blocked by CORS policy
```
**Solution:** ตรวจสอบว่า Backend กำลังรันและ CORS ตั้งค่าถูกต้อง

### Token Expired
```
{"success": false, "message": "Token expired"}
```
**Solution:** Login ใหม่เพื่อรับ token ใหม่

---

## 📚 Dependencies

### Backend
- express: ^5.1.0
- mysql2: ^3.11.5
- bcrypt: ^5.1.1
- jsonwebtoken: ^9.0.2
- cors: ^2.8.5
- dotenv: ^16.4.7
- express-validator: ^7.2.1
- express-rate-limit: ^7.5.0
- axios: ^1.7.9

### Frontend
- react: ^19.2.0
- react-dom: ^19.2.0
- react-router-dom: ^7.1.3
- axios: ^1.7.9
- vite: ^7.2.4

---

## 👨‍💻 Development Tips

1. **Backend Development:**
   ```bash
   npm run dev  # Auto-restart on file changes (Node 22)
   ```

2. **Frontend Development:**
   ```bash
   npm run dev  # Hot Module Replacement (HMR)
   ```

3. **View Logs:**
   - Login logs: `SELECT * FROM login_logs ORDER BY login_time DESC;`
   - PIN logs: `SELECT * FROM pin_verification_logs ORDER BY verification_time DESC;`

4. **Test API with curl:**
   ```bash
   # Register
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"test","email":"test@test.com","password":"Test123","fullName":"Test"}'

   # Login
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"test","password":"Test123"}'

   # Verify PIN
   curl -X POST http://localhost:3000/api/pin/verify \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"pin":"123456"}'
   ```

---

## 📄 License

ISC

---

## 🙏 Support

หากพบปัญหาหรือมีคำถาม สามารถ:
1. ตรวจสอบ error logs ใน console
2. ตรวจสอบว่า environment variables ถูกต้อง
3. ตรวจสอบว่า database กำลังรันอยู่
4. ตรวจสอบว่า port ไม่ถูกใช้งานโดยโปรแกรมอื่น
