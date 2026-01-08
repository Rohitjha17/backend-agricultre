# 🚀 Deployment Setup Guide - Aiven Database & Msg91 OTP

## ✅ Kya Already Setup Hai (What's Already Done)

### 1. **Aiven PostgreSQL Database** ✅
- ✅ Prisma ORM configured
- ✅ Database schema ready (22+ tables)
- ✅ Connection uses `DATABASE_URL` from environment
- ✅ All data will be stored in Aiven PostgreSQL

**Tables Created:**
- `users` - User accounts
- `otp_verifications` - OTP storage
- `products`, `categories`, `crops` - Product catalog
- `distributors` - Dealer information
- `coupons`, `scan_redemptions` - Scan & Win system
- `notifications` - User notifications
- And 15+ more tables...

### 2. **Msg91 OTP Integration** ✅
- ✅ OTP generation (6-digit)
- ✅ Msg91 API integration
- ✅ SMS sending via Msg91
- ✅ OTP verification
- ✅ OTP expiry (5 minutes)

**How it works:**
1. User requests OTP → Generated & stored in database
2. OTP sent via Msg91 SMS
3. User enters OTP → Verified from database
4. User logged in → JWT token generated

### 3. **Render Deployment** ✅
- ✅ Build configuration ready
- ✅ Start command configured
- ✅ Environment variables setup needed

---

## 🔧 Render Pe Deploy Karne Ke Liye (To Deploy on Render)

### Step 1: Render Dashboard Me Environment Variables Add Karo

Go to **Render Dashboard** → Your Service → **Environment** → Add these:

#### **CRITICAL - Must Add:**

```env
# Aiven Database Connection
DATABASE_URL=postgres://avnadmin:AVNS_qc4aKDQawdTb9nYTDCy@pg-2e880e6a-rjham762-b7b2.i.aivencloud.com:16366/defaultdb?sslmode=require

# JWT Secrets (Change these to secure random strings!)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-this
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars-change-this
ADMIN_JWT_SECRET=your-admin-jwt-secret-key-change-this

# Production Mode
NODE_ENV=production
```

#### **Msg91 Configuration (OTP ke liye):**

```env
MSG91_API_KEY=your-msg91-api-key-here
MSG91_SENDER_ID=AGRIO
MSG91_TEMPLATE_ID=your-msg91-template-id
```

> **Note:** Agar Msg91 API key nahi hai, to development mode me OTP console me print hoga. Production me Msg91 key zaroori hai.

### Step 2: Aiven Me IP Whitelist

1. Go to [Aiven Console](https://console.aiven.io/)
2. Select your PostgreSQL service
3. Go to **"Service settings"** → **"Allowed IP addresses"**
4. Add: `0.0.0.0/0` (sab IPs allow karega - safe hai kyunki password + SSL required)

### Step 3: Database Schema Push Karo

Render deploy hone ke baad, database me tables create karni hongi:

**Option A: Render Shell se (Recommended)**
```bash
# Render Dashboard → Your Service → Shell
npm run db:push
npm run db:seed  # Optional - sample data
```

**Option B: Local se (Agar Aiven IP whitelist me ho)**
```bash
# Local terminal me
DATABASE_URL="your-aiven-url" npm run db:push
```

---

## 📋 Complete Environment Variables List

### **Required (Zaroori):**
| Variable | Value | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | Aiven PostgreSQL URL | Database connection |
| `JWT_SECRET` | Random 32+ char string | User JWT tokens |
| `JWT_REFRESH_SECRET` | Random 32+ char string | Refresh tokens |
| `ADMIN_JWT_SECRET` | Random 32+ char string | Admin JWT tokens |
| `NODE_ENV` | `production` | Production mode |

### **Msg91 (OTP ke liye):**
| Variable | Value | Purpose |
|----------|-------|---------|
| `MSG91_API_KEY` | Your Msg91 API key | SMS sending |
| `MSG91_SENDER_ID` | `AGRIO` | SMS sender name |
| `MSG91_TEMPLATE_ID` | Your template ID | SMS template |

### **Optional (Baad me add kar sakte ho):**
- `AWS_*` - File uploads (future)
- `FCM_SERVER_KEY` - Push notifications (future)
- `CORS_ORIGINS` - CORS settings (default works)

---

## 🧪 Testing After Deployment

### 1. Health Check
```
GET https://backend-agricultre.onrender.com/health
```

### 2. Send OTP
```json
POST https://backend-agricultre.onrender.com/api/v1/auth/send-otp
{
  "phone_number": "9876543210"
}
```

### 3. Verify OTP
```json
POST https://backend-agricultre.onrender.com/api/v1/auth/verify-otp
{
  "phone_number": "9876543210",
  "otp_code": "123456"
}
```

---

## 🔍 Kya Kya Data Store Hoga Aiven Me

### **User Data:**
- Phone numbers, names, addresses
- Crop preferences
- Language settings
- Login history

### **OTP Data:**
- OTP codes (temporary - 5 min expiry)
- Request IDs
- Verification status

### **Product Data:**
- Products, categories
- Pack sizes, prices
- Best sellers

### **Scan & Win:**
- Coupon codes
- Redemptions
- Prize tiers
- Winner ranks

### **And More:**
- Distributors
- Notifications
- Support tickets
- Admin users

---

## ⚠️ Important Notes

1. **Database URL Security:** 
   - Aapka DATABASE_URL me password hai - kabhi publicly share mat karo
   - GitHub me commit mat karo (already .gitignore me hai)

2. **JWT Secrets:**
   - Production me strong random strings use karo
   - Minimum 32 characters

3. **Msg91 Setup:**
   - [Msg91 Dashboard](https://control.msg91.com/) se API key lo
   - Template create karo OTP ke liye
   - Template ID add karo environment variables me

4. **Aiven IP Whitelist:**
   - `0.0.0.0/0` add karo (all IPs allow)
   - Safe hai kyunki username/password + SSL required

---

## ✅ Summary

**Backend me ye sab already setup hai:**
- ✅ Aiven PostgreSQL connection ready
- ✅ Msg91 OTP integration complete
- ✅ All APIs working
- ✅ Data storage configured
- ✅ Render deployment ready

**Bas ye karna hai:**
1. Render me environment variables add karo
2. Aiven me IP whitelist karo
3. Database schema push karo (`npm run db:push`)
4. Deploy! 🚀

---

## 🆘 Help

Agar koi issue aaye:
1. Render logs check karo
2. Database connection verify karo
3. Environment variables double-check karo
4. Aiven console me connection test karo

**Backend URL:** `https://backend-agricultre.onrender.com`
**API Base:** `https://backend-agricultre.onrender.com/api/v1`

