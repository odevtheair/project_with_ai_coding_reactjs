# External PIN Verification API

External API Service สำหรับตรวจสอบ PIN Code - จำลองการทำงานของ Third-party PIN Verification Service

## 🎯 Overview

API นี้เป็น External Service แยกต่างหาก ที่รันบน port 3001 เพื่อจำลองการตรวจสอบ PIN กับระบบภายนอก
- รับ PIN 6 หลัก
- ตรวจสอบความถูกต้อง
- ส่งผลลัพธ์กลับ (success/failed)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd external-pin-api
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env` (optional):
```env
PORT=3001
NODE_ENV=development
VALID_PIN=123456
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 3. Start Server
```bash
# Production
npm start

# Development (auto-restart on changes)
npm run dev
```

Server จะรันที่: `http://localhost:3001`

## 📡 API Endpoints

### 1. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "External PIN Verification API is running",
  "timestamp": "2025-01-24T00:00:00.000Z",
  "service": "PIN Verification",
  "version": "1.0.0"
}
```

---

### 2. Verify PIN
```http
POST /api/verify-pin
Content-Type: application/json

{
  "pin": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "PIN is valid",
  "code": "PIN_VALID",
  "verified": true,
  "timestamp": "2025-01-24T00:00:00.000Z"
}
```

**Invalid PIN Response (401):**
```json
{
  "success": false,
  "message": "PIN is invalid",
  "code": "PIN_INVALID",
  "verified": false
}
```

**Invalid Format Response (400):**
```json
{
  "success": false,
  "message": "PIN must be exactly 6 digits",
  "code": "INVALID_FORMAT"
}
```

---

### 3. Get Statistics
```http
GET /api/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRequests": 100,
    "successfulVerifications": 85,
    "failedVerifications": 15,
    "successRate": "85.00%",
    "uptime": 3600,
    "timestamp": "2025-01-24T00:00:00.000Z"
  }
}
```

---

### 4. Reset Statistics
```http
POST /api/stats/reset
```

**Response:**
```json
{
  "success": true,
  "message": "Statistics reset successfully"
}
```

## 🧪 Testing

### Test with curl

```bash
# Health check
curl http://localhost:3001/api/health

# Verify valid PIN
curl -X POST http://localhost:3001/api/verify-pin \
  -H "Content-Type: application/json" \
  -d '{"pin":"123456"}'

# Verify invalid PIN
curl -X POST http://localhost:3001/api/verify-pin \
  -H "Content-Type: application/json" \
  -d '{"pin":"000000"}'

# Get statistics
curl http://localhost:3001/api/stats

# Reset statistics
curl -X POST http://localhost:3001/api/stats/reset
```

### Test with Postman

1. Import the following collection:
   - Base URL: `http://localhost:3001/api`
   - Health: `GET /health`
   - Verify PIN: `POST /verify-pin` with body `{"pin": "123456"}`
   - Statistics: `GET /stats`

## 🔒 Security Features

- **Rate Limiting**: 10 requests per minute per IP
- **CORS**: Configurable allowed origins
- **Input Validation**: PIN must be exactly 6 digits
- **Logging**: All requests logged with timestamp and IP
- **Error Handling**: Graceful error responses

## 📊 Response Codes

| Code | Description |
|------|-------------|
| `PIN_VALID` | PIN is correct |
| `PIN_INVALID` | PIN is incorrect |
| `PIN_REQUIRED` | PIN not provided |
| `INVALID_FORMAT` | PIN format is invalid |
| `SERVER_ERROR` | Internal server error |
| `NOT_FOUND` | Endpoint not found |

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `VALID_PIN` | Valid PIN code | 123456 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | 60000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 10 |
| `ALLOWED_ORIGINS` | CORS allowed origins | localhost:3000,5173 |

### Change Valid PIN

แก้ไขใน `.env`:
```env
VALID_PIN=654321
```

## 🔗 Integration with Main Backend

ใน Backend หลัก (port 3000), ตั้งค่า `.env`:
```env
EXTERNAL_PIN_API_URL=http://localhost:3001/api/verify-pin
EXTERNAL_PIN_API_TIMEOUT=5000
```

Backend จะเรียก External API นี้เพื่อตรวจสอบ PIN

## 📝 Features

✅ **Realistic API Behavior**
- 300ms processing delay (simulates network latency)
- Proper HTTP status codes
- Structured JSON responses

✅ **Monitoring**
- Request statistics
- Success/failure tracking
- Uptime monitoring

✅ **Development Friendly**
- Hot reload with `--watch`
- Detailed console logging
- Error messages in development mode

✅ **Production Ready**
- Rate limiting
- CORS protection
- Error handling
- Graceful shutdown

## 🐛 Troubleshooting

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Solution:**
1. เปลี่ยน PORT ใน `.env`
2. หรือ kill process ที่ใช้ port 3001

### CORS Error
```
Access-Control-Allow-Origin error
```
**Solution:** เพิ่ม origin ใน `ALLOWED_ORIGINS` ใน `.env`

### Rate Limit
```
{"success": false, "message": "Too many requests..."}
```
**Solution:** รอ 1 นาทีหรือ restart server

## 📚 Dependencies

- **express**: ^5.1.0 - Web framework
- **cors**: ^2.8.5 - CORS middleware
- **dotenv**: ^16.4.7 - Environment variables
- **express-rate-limit**: ^7.5.0 - Rate limiting

## 🎨 Example Integration Flow

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│   Frontend  │         │   Backend    │         │  External PIN   │
│  (Port 5173)│         │  (Port 3000) │         │  API (Port 3001)│
└──────┬──────┘         └──────┬───────┘         └────────┬────────┘
       │                       │                          │
       │  1. Login             │                          │
       ├──────────────────────>│                          │
       │  <JWT Token>          │                          │
       │<──────────────────────┤                          │
       │                       │                          │
       │  2. Submit PIN        │                          │
       ├──────────────────────>│                          │
       │                       │  3. Verify PIN           │
       │                       ├─────────────────────────>│
       │                       │  <Valid/Invalid>         │
       │                       │<─────────────────────────┤
       │  <Success/Error>      │                          │
       │<──────────────────────┤                          │
       │                       │                          │
```

## 📄 License

ISC

## 🙏 Notes

- API นี้เป็น Mock Service สำหรับ Development
- สำหรับ Production ให้เชื่อมต่อกับ PIN Verification Service จริง
- Valid PIN ปัจจุบัน: **123456**
- สามารถเปลี่ยน Valid PIN ได้ใน `.env`
