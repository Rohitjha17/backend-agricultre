# 🌾 Agrio India - Complete API Documentation

> **Last Updated:** January 11, 2026  
> **Backend Version:** 1.0.0  
> **Base URL (Local):** `http://localhost:3001/api/v1`

---

## 📍 Configuration

### Frontend `.env` Setup

```env
# Development (Local)
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# Production (Railway - when working)
NEXT_PUBLIC_API_URL=https://backend-agricultre-new.up.railway.app/api/v1
```

---

## 🔧 API Helper Function

Create this helper in your frontend:

```javascript
// lib/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'API Error');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Admin API Helper
export async function adminApiCall(endpoint, options = {}) {
  const adminToken = localStorage.getItem('adminToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(adminToken && { 'Authorization': `Bearer ${adminToken}` }),
    ...options.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error?.message || 'API Error');
  }
  
  return data;
}
```

---

# 📱 USER APIs (Frontend App/Website)

---

## 🔐 Authentication

### 1. Dev Login (Development Only - Bypasses OTP)

```javascript
// POST /auth/dev-login
const response = await apiCall('/auth/dev-login', {
  method: 'POST',
  body: JSON.stringify({
    phone_number: "9876543210"
  })
});

// Response
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "is_new_user": false,
    "user": {
      "id": "uuid",
      "phone_number": "9876543210",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    }
  }
}

// Save token after login
localStorage.setItem('token', response.data.token);
localStorage.setItem('refreshToken', response.data.refresh_token);
```

### 2. Send OTP (Production)

```javascript
// POST /auth/send-otp
const response = await apiCall('/auth/send-otp', {
  method: 'POST',
  body: JSON.stringify({
    phone_number: "9876543210"
  })
});

// Response
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### 3. Verify OTP

```javascript
// POST /auth/verify-otp
// Note: Use "123456" as OTP in development mode for bypass
const response = await apiCall('/auth/verify-otp', {
  method: 'POST',
  body: JSON.stringify({
    phone_number: "9876543210",
    otp_code: "123456"  // Use "123456" in development
  })
});

// Response (same as dev-login)
{
  "success": true,
  "data": {
    "token": "...",
    "refresh_token": "...",
    "is_new_user": true,
    "user": { ... }
  }
}
```

### 4. Refresh Token

```javascript
// POST /auth/refresh-token
const response = await apiCall('/auth/refresh-token', {
  method: 'POST',
  body: JSON.stringify({
    refresh_token: localStorage.getItem('refreshToken')
  })
});

// Response
{
  "success": true,
  "data": {
    "token": "new-access-token",
    "refresh_token": "new-refresh-token"
  }
}
```

### 5. Logout

```javascript
// POST /auth/logout (Requires Auth)
const response = await apiCall('/auth/logout', {
  method: 'POST'
});

// Clear local storage after logout
localStorage.removeItem('token');
localStorage.removeItem('refreshToken');
```

---

## 📦 Products

### 1. Get All Products

```javascript
// GET /products
// Query params: page, limit, category, crop, q, sort, best_seller
const response = await apiCall('/products?page=1&limit=10');

// With filters
const filtered = await apiCall('/products?category=insecticide&sort=popular&limit=20');

// Response
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Product Name",
        "name_hi": "उत्पाद नाम",
        "slug": "product-slug",
        "category": {
          "id": "cat-uuid",
          "name": "Insecticides",
          "name_hi": "कीटनाशक"
        },
        "description": "Product description",
        "description_hi": "उत्पाद विवरण",
        "composition": "Chemical composition",
        "dosage": "Dosage instructions",
        "application_method": "How to apply",
        "target_pests": ["pest1", "pest2"],
        "suitable_crops": ["crop-id-1", "crop-id-2"],
        "pack_sizes": [
          { "size": "100ml", "sku": "SKU001", "mrp": 150, "selling_price": 120 },
          { "size": "250ml", "sku": "SKU002", "mrp": 300, "selling_price": 250 }
        ],
        "safety_precautions": ["precaution1", "precaution2"],
        "images": ["url1", "url2"],
        "is_best_seller": true,
        "is_active": true,
        "sales_count": 150
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### 2. Get Best Sellers

```javascript
// GET /products/best-sellers?limit=8
const response = await apiCall('/products/best-sellers?limit=8');

// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "name_hi": "उत्पाद नाम",
      "slug": "product-slug",
      "category": { "id": "...", "name": "...", "name_hi": "..." },
      "images": ["url1"],
      "pack_sizes": [...],
      "is_best_seller": true
    }
  ]
}
```

### 3. Get New Arrivals

```javascript
// GET /products/new-arrivals?limit=8
const response = await apiCall('/products/new-arrivals?limit=8');
```

### 4. Get Featured Products

```javascript
// GET /products/featured?limit=8
const response = await apiCall('/products/featured?limit=8');
```

### 5. Search Products

```javascript
// GET /products/search?q=keyword
const response = await apiCall('/products/search?q=fertilizer');

// Response
{
  "success": true,
  "data": [
    { "id": "...", "name": "...", "slug": "...", ... }
  ]
}
```

### 6. Get Product by Slug

```javascript
// GET /products/:slug
const response = await apiCall('/products/product-slug-here');

// Response includes related_products
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Product Name",
    "name_hi": "...",
    "slug": "product-slug",
    "category": { ... },
    "description": "...",
    "description_hi": "...",
    "composition": "...",
    "dosage": "...",
    "application_method": "...",
    "target_pests": [...],
    "suitable_crops": [...],
    "pack_sizes": [...],
    "safety_precautions": [...],
    "images": [...],
    "technical_details": { ... },
    "is_best_seller": true,
    "related_products": [
      { "id": "...", "name": "...", "slug": "...", "images": [...] }
    ]
  }
}
```

### 7. Get Recommended Products (Auth Required)

```javascript
// GET /products/recommended?limit=10
const response = await apiCall('/products/recommended?limit=10');
```

---

## 🏷️ Categories

### Get All Categories

```javascript
// GET /categories
const response = await apiCall('/categories');

// Response
{
  "success": true,
  "data": [
    {
      "id": "insecticide",
      "name": "Insecticides",
      "name_hi": "कीटनाशक",
      "slug": "insecticides",
      "image_url": "https://...",
      "product_count": 15,
      "is_active": true
    },
    {
      "id": "fungicide",
      "name": "Fungicides",
      "name_hi": "फफूंदनाशक",
      "slug": "fungicides",
      "image_url": "https://...",
      "product_count": 10,
      "is_active": true
    }
  ]
}
```

---

## 🌱 Crops

### Get All Crops

```javascript
// GET /crops
const response = await apiCall('/crops');

// Response
{
  "success": true,
  "data": [
    {
      "id": "wheat",
      "name": "Wheat",
      "name_hi": "गेहूं",
      "slug": "wheat",
      "image_url": "https://...",
      "season": "Rabi",
      "is_active": true
    },
    {
      "id": "rice",
      "name": "Rice",
      "name_hi": "चावल",
      "slug": "rice",
      "image_url": "https://...",
      "season": "Kharif",
      "is_active": true
    }
  ]
}
```

---

## 👤 User Profile (Auth Required)

### 1. Get Profile

```javascript
// GET /user/profile
const response = await apiCall('/user/profile');

// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "phone_number": "9876543210",
    "name": "John Doe",
    "email": "john@example.com",
    "pincode": "400001",
    "role": "USER",
    "is_profile_complete": true,
    "preferences": {
      "language": "en",
      "notifications_enabled": true
    },
    "crops": [
      { "id": "wheat", "name": "Wheat", "name_hi": "गेहूं" }
    ],
    "created_at": "2026-01-01T00:00:00.000Z"
  }
}
```

### 2. Create/Complete Profile

```javascript
// POST /user/profile
const response = await apiCall('/user/profile', {
  method: 'POST',
  body: JSON.stringify({
    name: "John Doe",
    pincode: "400001",
    email: "john@example.com"  // optional
  })
});
```

### 3. Update Profile

```javascript
// PUT /user/profile
const response = await apiCall('/user/profile', {
  method: 'PUT',
  body: JSON.stringify({
    name: "John Doe Updated",
    email: "newemail@example.com"
  })
});
```

### 4. Update Language

```javascript
// PUT /user/language
const response = await apiCall('/user/language', {
  method: 'PUT',
  body: JSON.stringify({
    language: "hi"  // "en" or "hi"
  })
});
```

### 5. Get User Stats

```javascript
// GET /user/stats
const response = await apiCall('/user/stats');

// Response
{
  "success": true,
  "data": {
    "total_scans": 15,
    "total_rewards": 5,
    "rewards_amount": 500,
    "coupons_scanned": 20
  }
}
```

### 6. Get Crop Preferences

```javascript
// GET /user/crops
const response = await apiCall('/user/crops');

// Response
{
  "success": true,
  "data": [
    { "id": "wheat", "name": "Wheat", "name_hi": "गेहूं" },
    { "id": "rice", "name": "Rice", "name_hi": "चावल" }
  ]
}
```

### 7. Sync Crop Preferences

```javascript
// POST /user/crops
const response = await apiCall('/user/crops', {
  method: 'POST',
  body: JSON.stringify({
    crop_ids: ["wheat", "rice", "cotton"]
  })
});
```

### 8. Get Coupon History

```javascript
// GET /user/coupons
const response = await apiCall('/user/coupons');

// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "code": "ABC123XYZ456",
      "scanned_at": "2026-01-10T12:00:00.000Z",
      "reward": {
        "type": "CASHBACK",
        "amount": 100
      }
    }
  ]
}
```

### 9. Get User Rewards

```javascript
// GET /user/rewards
const response = await apiCall('/user/rewards');

// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "CASHBACK",
      "amount": 100,
      "status": "PENDING",
      "won_at": "2026-01-10T12:00:00.000Z",
      "product_name": "Product XYZ"
    }
  ]
}
```

---

## 🎟️ Coupons (Auth Required)

### 1. Validate Coupon

```javascript
// POST /coupons/validate
const response = await apiCall('/coupons/validate', {
  method: 'POST',
  body: JSON.stringify({
    code: "ABC123XYZ456"
  })
});

// Response
{
  "success": true,
  "data": {
    "valid": true,
    "product_name": "Product XYZ",
    "message": "Coupon is valid! Scan to reveal your prize."
  }
}

// If invalid
{
  "success": false,
  "error": {
    "code": "INVALID_COUPON",
    "message": "This coupon has already been used"
  }
}
```

### 2. Scan Coupon (Reveal Prize)

```javascript
// POST /coupons/scan
const response = await apiCall('/coupons/scan', {
  method: 'POST',
  body: JSON.stringify({
    code: "ABC123XYZ456"
  })
});

// Response (if won)
{
  "success": true,
  "data": {
    "reward": {
      "id": "uuid",
      "type": "CASHBACK",  // CASHBACK, PRODUCT, POINTS, BETTER_LUCK
      "amount": 100,
      "message": "🎉 Congratulations! You won ₹100 cashback!"
    },
    "coupon": {
      "code": "ABC123XYZ456",
      "product_name": "Product XYZ"
    }
  }
}

// If better luck next time
{
  "success": true,
  "data": {
    "reward": {
      "type": "BETTER_LUCK",
      "amount": 0,
      "message": "Better luck next time! Keep scanning."
    }
  }
}
```

---

## 🏪 Distributors

### 1. Get Nearby Distributors

```javascript
// GET /distributors?pincode=400001
const response = await apiCall('/distributors?pincode=400001');

// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "ABC Agro Store",
      "owner_name": "Ramesh Kumar",
      "address": "123 Main Street, Mumbai",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "phone": "9876543210",
      "email": "store@example.com",
      "latitude": 19.0760,
      "longitude": 72.8777,
      "distance_km": 2.5,
      "is_active": true
    }
  ]
}
```

### 2. Get Distributor by ID

```javascript
// GET /distributors/:id
const response = await apiCall('/distributors/distributor-uuid');
```

---

## 🔔 Notifications (Auth Required)

### 1. Get Notifications

```javascript
// GET /notifications
const response = await apiCall('/notifications');

// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "New Reward!",
      "message": "You won ₹100 cashback",
      "type": "REWARD",
      "is_read": false,
      "created_at": "2026-01-10T12:00:00.000Z"
    }
  ]
}
```

### 2. Mark as Read

```javascript
// PUT /notifications/:id/read
const response = await apiCall('/notifications/notification-uuid/read', {
  method: 'PUT'
});
```

### 3. Mark All as Read

```javascript
// PUT /notifications/read-all
const response = await apiCall('/notifications/read-all', {
  method: 'PUT'
});
```

---

## 🔍 Search

### Global Search

```javascript
// GET /search?q=keyword
const response = await apiCall('/search?q=rice');

// Response
{
  "success": true,
  "data": {
    "products": [
      { "id": "...", "name": "...", "slug": "...", "images": [...] }
    ],
    "categories": [
      { "id": "...", "name": "...", "slug": "..." }
    ],
    "crops": [
      { "id": "...", "name": "...", "slug": "..." }
    ]
  }
}
```

---

## ⚙️ Config & Banners

### 1. Get App Config

```javascript
// GET /config
const response = await apiCall('/config');
```

### 2. Get Banners

```javascript
// GET /config/banners
const response = await apiCall('/config/banners');

// Response
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Summer Sale",
      "image_url": "https://...",
      "link": "/products",
      "display_order": 1,
      "is_active": true
    }
  ]
}
```

---

## 📄 Support & Pages

### 1. Get FAQ

```javascript
// GET /support/faq
const response = await apiCall('/support/faq');
```

### 2. Contact Support

```javascript
// POST /support/contact
const response = await apiCall('/support/contact', {
  method: 'POST',
  body: JSON.stringify({
    name: "John Doe",
    phone: "9876543210",
    email: "john@example.com",  // optional
    subject: "Product Inquiry",
    message: "I need help with..."
  })
});
```

### 3. Get Page Content

```javascript
// GET /pages/:slug (terms, privacy, about)
const terms = await apiCall('/pages/terms');
const privacy = await apiCall('/pages/privacy');
const about = await apiCall('/pages/about');
```

---

## 🏥 Health Check

```javascript
// GET /health (No /api/v1 prefix)
const response = await fetch('http://localhost:3001/health');

// Response
{
  "success": true,
  "message": "Agrio India API is running",
  "timestamp": "2026-01-11T12:00:00.000Z",
  "version": "1.0.0"
}
```

---

# 🔐 ADMIN APIs (Admin Panel)

---

## Admin Authentication

### Admin Login

```javascript
// POST /admin/auth/login
const response = await fetch(`${API_URL}/admin/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: "admin@agrioindia.com",
    password: "admin123"
  })
});

// Response
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "...",
    "admin": {
      "id": "uuid",
      "name": "Super Admin",
      "email": "admin@agrioindia.com",
      "role": "SUPER_ADMIN"
    }
  }
}

// Save admin token
localStorage.setItem('adminToken', response.data.token);
```

### Admin Credentials

| Field | Value |
|-------|-------|
| Email | `admin@agrioindia.com` |
| Password | `admin123` |
| Role | `SUPER_ADMIN` |

---

## Admin Dashboard

### Get Dashboard Stats

```javascript
// GET /admin/dashboard/stats
const response = await adminApiCall('/admin/dashboard/stats');

// Response
{
  "success": true,
  "data": {
    "total_users": 150,
    "total_products": 50,
    "total_orders": 200,
    "total_revenue": 50000,
    "total_coupons_scanned": 500,
    "recent_activity": [...]
  }
}
```

---

## Admin Products

### 1. List Products

```javascript
// GET /admin/products?page=1&limit=10
const response = await adminApiCall('/admin/products?page=1&limit=10');

// Response
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Product Name",
        "name_hi": "...",
        "slug": "...",
        "category": "Insecticides",
        "is_best_seller": true,
        "is_active": true,
        "sales_count": 100,
        "pack_sizes": 3,
        "created_at": "..."
      }
    ],
    "pagination": { ... }
  }
}
```

### 2. Get Single Product

```javascript
// GET /admin/products/:id
const response = await adminApiCall('/admin/products/product-uuid');
```

### 3. Create Product

```javascript
// POST /admin/products
const response = await adminApiCall('/admin/products', {
  method: 'POST',
  body: JSON.stringify({
    name: "New Product",
    name_hi: "नया उत्पाद",
    category_id: "insecticide",
    description: "Product description",
    description_hi: "उत्पाद विवरण",
    composition: "Chemical composition",
    dosage: "Dosage info",
    application_method: "How to apply",
    target_pests: ["pest1", "pest2"],
    suitable_crops: ["wheat", "rice"],
    safety_precautions: ["precaution1"],
    images: ["url1", "url2"],
    is_best_seller: false,
    is_active: true,
    pack_sizes: [
      { size: "100ml", sku: "SKU001", mrp: 150, selling_price: 120 },
      { size: "250ml", sku: "SKU002", mrp: 300, selling_price: 250 }
    ]
  })
});
```

### 4. Update Product

```javascript
// PUT /admin/products/:id
const response = await adminApiCall('/admin/products/product-uuid', {
  method: 'PUT',
  body: JSON.stringify({
    name: "Updated Product Name",
    is_best_seller: true
  })
});
```

### 5. Delete Product

```javascript
// DELETE /admin/products/:id
const response = await adminApiCall('/admin/products/product-uuid', {
  method: 'DELETE'
});
```

---

## Admin Users

### 1. List Users

```javascript
// GET /admin/users?page=1&limit=10
const response = await adminApiCall('/admin/users?page=1&limit=10');

// Response
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "phone_number": "9876543210",
        "name": "John Doe",
        "email": "john@example.com",
        "pincode": "400001",
        "role": "USER",
        "total_scans": 15,
        "total_rewards": 5,
        "created_at": "..."
      }
    ],
    "pagination": { ... }
  }
}
```

### 2. Get Single User

```javascript
// GET /admin/users/:id
const response = await adminApiCall('/admin/users/user-uuid');
```

---

## Admin Coupons

### 1. List Coupons

```javascript
// GET /admin/coupons?page=1&limit=10
const response = await adminApiCall('/admin/coupons?page=1&limit=10');
```

### 2. Create Coupons (Batch)

```javascript
// POST /admin/coupons/generate
const response = await adminApiCall('/admin/coupons/generate', {
  method: 'POST',
  body: JSON.stringify({
    product_id: "product-uuid",
    batch_name: "Batch 2026-01",
    quantity: 100,
    reward_type: "CASHBACK",
    reward_amount: 50,
    expiry_date: "2026-12-31"
  })
});
```

---

## Admin Distributors

### 1. List Distributors

```javascript
// GET /admin/distributors?page=1&limit=10
const response = await adminApiCall('/admin/distributors?page=1&limit=10');
```

### 2. Create Distributor

```javascript
// POST /admin/distributors
const response = await adminApiCall('/admin/distributors', {
  method: 'POST',
  body: JSON.stringify({
    name: "ABC Agro Store",
    owner_name: "Ramesh Kumar",
    address: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    phone: "9876543210",
    email: "store@example.com",
    latitude: 19.0760,
    longitude: 72.8777
  })
});
```

### 3. Update Distributor

```javascript
// PUT /admin/distributors/:id
const response = await adminApiCall('/admin/distributors/distributor-uuid', {
  method: 'PUT',
  body: JSON.stringify({
    name: "Updated Store Name"
  })
});
```

---

## Admin Settings

### Get Settings

```javascript
// GET /admin/settings
const response = await adminApiCall('/admin/settings');
```

### Update Settings

```javascript
// PUT /admin/settings
const response = await adminApiCall('/admin/settings', {
  method: 'PUT',
  body: JSON.stringify({
    app_name: "Agrio India",
    support_email: "support@agrioindia.com",
    support_phone: "1800-XXX-XXXX"
  })
});
```

---

## Admin Reports

### Get Reports

```javascript
// GET /admin/reports?type=sales&from=2026-01-01&to=2026-01-31
const response = await adminApiCall('/admin/reports?type=sales&from=2026-01-01&to=2026-01-31');
```

---

# 📊 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

---

# 🚨 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Token missing or invalid |
| `FORBIDDEN` | 403 | Access denied |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `INVALID_COUPON` | 400 | Coupon is invalid or used |
| `EXPIRED_COUPON` | 400 | Coupon has expired |
| `INTERNAL_ERROR` | 500 | Server error |

---

# 📝 Quick Reference

## Public Endpoints (No Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List products |
| GET | `/products/best-sellers` | Best selling products |
| GET | `/products/new-arrivals` | New arrivals |
| GET | `/products/featured` | Featured products |
| GET | `/products/search?q=` | Search products |
| GET | `/products/:slug` | Single product |
| GET | `/categories` | All categories |
| GET | `/crops` | All crops |
| GET | `/distributors?pincode=` | Nearby distributors |
| GET | `/search?q=` | Global search |
| GET | `/config/banners` | App banners |
| GET | `/support/faq` | FAQ |
| POST | `/auth/dev-login` | Dev login |
| POST | `/auth/send-otp` | Send OTP |
| POST | `/auth/verify-otp` | Verify OTP |

## User Endpoints (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/profile` | Get profile |
| POST | `/user/profile` | Create profile |
| PUT | `/user/profile` | Update profile |
| PUT | `/user/language` | Update language |
| GET | `/user/stats` | User statistics |
| GET | `/user/crops` | Crop preferences |
| POST | `/user/crops` | Update crops |
| GET | `/user/coupons` | Coupon history |
| GET | `/user/rewards` | User rewards |
| GET | `/products/recommended` | Recommended products |
| POST | `/coupons/validate` | Validate coupon |
| POST | `/coupons/scan` | Scan coupon |
| GET | `/notifications` | Notifications |
| PUT | `/notifications/:id/read` | Mark read |
| POST | `/auth/logout` | Logout |
| POST | `/auth/refresh-token` | Refresh token |

## Admin Endpoints (Admin Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/auth/login` | Admin login |
| GET | `/admin/dashboard/stats` | Dashboard stats |
| GET | `/admin/products` | List products |
| POST | `/admin/products` | Create product |
| PUT | `/admin/products/:id` | Update product |
| DELETE | `/admin/products/:id` | Delete product |
| GET | `/admin/users` | List users |
| GET | `/admin/coupons` | List coupons |
| POST | `/admin/coupons/generate` | Generate coupons |
| GET | `/admin/distributors` | List distributors |
| POST | `/admin/distributors` | Create distributor |
| GET | `/admin/settings` | Get settings |
| PUT | `/admin/settings` | Update settings |
| GET | `/admin/reports` | Get reports |

---

# 📞 Backend Info

| Property | Value |
|----------|-------|
| **Local Backend** | `http://localhost:3001` |
| **API Base URL** | `http://localhost:3001/api/v1` |
| **Health Check** | `http://localhost:3001/health` |
| **Admin Email** | `admin@agrioindia.com` |
| **Admin Password** | `admin123` |
| **Dev OTP Code** | `123456` |

---

**Document Version:** 2.0  
**Last Updated:** January 11, 2026
