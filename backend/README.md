# Backend API - Authentication System

Express.js REST API พร้อม JWT Authentication และ PIN Verification

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env`:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=auth_system
DB_PORT=3306

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h

EXTERNAL_PIN_API_URL=http://localhost:3000/api/pin/verify-pin
EXTERNAL_PIN_API_TIMEOUT=5000

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
```

### 3. Setup Database
```bash
# เข้า MySQL
mysql -u root -p

# รันไฟล์ schema
source database/schema.sql
```

### 4. Start Server
```bash
# Production
npm start

# Development (auto-restart on changes)
npm run dev
```

Server จะรันที่: `http://localhost:3000`

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Authentication
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - Login (rate limited: 5 attempts/15min)
GET  /api/auth/profile     - Get user profile (protected)
```

### PIN Verification
```
POST /api/pin/verify       - Verify PIN (protected)
POST /api/pin/verify-pin   - Mock external PIN API
```

## 🏗️ Project Structure

```
backend/
├── database/
│   └── schema.sql              # Database schema และ migrations
├── src/
│   ├── config/
│   │   └── database.js         # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js   # Login, Register, Profile
│   │   └── pinController.js    # PIN verification
│   ├── middleware/
│   │   ├── auth.js             # JWT verification
│   │   └── validation.js       # Input validation rules
│   ├── models/
│   │   └── User.js             # User model (CRUD)
│   ├── routes/
│   │   ├── authRoutes.js       # Auth endpoints
│   │   └── pinRoutes.js        # PIN endpoints
│   └── utils/
│       └── logger.js           # Login & PIN logging
├── .env.example
├── package.json
└── server.js                   # Entry point
```

## 🔒 Security Features

- **Bcrypt**: Password hashing (10 salt rounds)
- **JWT**: Token-based authentication
- **Rate Limiting**: 5 login attempts per 15 minutes
- **Input Validation**: express-validator
- **SQL Injection Protection**: Prepared statements
- **CORS**: Configured for specific origins
- **Logging**: All login and PIN attempts

## 🗄️ Database Tables

### users
- Authentication และ user information
- Password hashed ด้วย bcrypt
- Unique constraints: username, email

### login_logs
- บันทึกทุก login attempts
- เก็บ IP, User Agent, Status, Timestamp
- ใช้สำหรับ security audit

### pin_verification_logs
- บันทึกทุก PIN verification attempts
- เก็บ Status, Failure Reason
- Linked to users table

## 🧪 Testing

### Test with curl
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"Test123","fullName":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"Test123"}'

# Get Profile (replace TOKEN)
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Verify PIN (replace TOKEN)
curl -X POST http://localhost:3000/api/pin/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"pin":"123456"}'
```

### View Logs
```sql
-- Login logs
SELECT * FROM login_logs ORDER BY login_time DESC LIMIT 10;

-- PIN verification logs
SELECT * FROM pin_verification_logs ORDER BY verification_time DESC LIMIT 10;
```

## 📦 Dependencies

- **express**: ^5.1.0 - Web framework
- **mysql2**: ^3.11.5 - MySQL driver with Promise
- **bcrypt**: ^5.1.1 - Password hashing
- **jsonwebtoken**: ^9.0.2 - JWT implementation
- **cors**: ^2.8.5 - CORS middleware
- **dotenv**: ^16.4.7 - Environment variables
- **express-validator**: ^7.2.1 - Input validation
- **express-rate-limit**: ^7.5.0 - Rate limiting
- **axios**: ^1.7.9 - HTTP client for external API

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | MySQL host | localhost |
| `DB_USER` | MySQL user | root |
| `DB_PASSWORD` | MySQL password | - |
| `DB_NAME` | Database name | auth_system |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | Token expiration | 1h |
| `EXTERNAL_PIN_API_URL` | PIN API endpoint | - |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests | 5 |

## 🐛 Common Issues

### Database Connection Failed
```
❌ Database connection failed: connect ECONNREFUSED
```
**Solution:**
1. ตรวจสอบว่า MySQL กำลังรันอยู่
2. ตรวจสอบ credentials ใน `.env`
3. ตรวจสอบว่า database `auth_system` ถูกสร้างแล้ว

### JWT_SECRET not defined
```
Warning: JWT_SECRET not set, using default
```
**Solution:** ตั้งค่า `JWT_SECRET` ใน `.env`

### Rate Limit Exceeded
```
{"success": false, "message": "Too many login attempts..."}
```
**Solution:** รอ 15 นาทีหรือ restart server (dev only)

## 📝 License

ISC
