# 🏆 DryFruitKart — Royal Dry Fruits E-Commerce Platform

> **College Capstone — Full-Stack Web Application**  
> Styled in official **RCB 2026 Colors** (Red `#D0142C` · Black `#0B0B0C` · Gold `#D4AF37`)

---

## 📖 Overview

**DryFruitKart** is an end-to-end full-stack dry fruits e-commerce platform crafted for retail consumers and administrative management. It offers a luxury shopping experience featuring California & Mamra Almonds, W240 King Cashews, Iranian Green Pistachios, Kashmiri Snow-White Walnuts, Royal Medjool Dates, and Celebration Gift Hampers.

### ✨ Key Capabilities
- **Customer Portal**:
  - Royal RCB 2026 aesthetic with Cinzel & Inter typography
  - Search & multi-faceted filtering (category, price slider, sorting)
  - Pack weight variants (`250g`, `500g`, `1kg`) with live auto-calculating prices
  - Dynamic slide-over Cart Drawer with free-shipping threshold tracker (₹999)
  - Coupon discount engine (e.g., `RCB2026` for 18% OFF)
  - Secure checkout with simulated UPI QR scanner, Card, Net Banking & Cash on Delivery (COD)
  - Order success screen with celebration confetti and printable Tax Invoice
  - Customer Order tracking with a 4-step fulfillment timeline
  - Self-service "Request Return / Refund" modal
  - 1-Click quick login for testing and demonstration

- **Admin Portal**:
  - Executive dashboard with real-time sales telemetry and category distribution
  - Comprehensive orders table linking: `Order → User → OrderItems → Product → Payment`
  - Real-time order status updater (`PLACED` → `CONFIRMED` → `SHIPPED` → `DELIVERED`)
  - Inventory & Product CRUD with low-stock warnings (`<5kg`)
  - Customer directory with lifetime purchase amounts
  - Return & Refund claim management (Approve, Reject, or Refund)

---

## 🛠️ Tech Stack

- **Frontend**: React.js 18, Vite, Tailwind CSS (custom RCB palette), Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express.js, JWT authentication, Bcrypt password hashing, CORS, Morgan
- **Database**: Relational SQLite via Prisma ORM (zero-config local run; 100% PostgreSQL production ready)

---

## 🎨 Theme Tokens (RCB 2026)

| Token | Hex | Usage |
|---|---|---|
| **Primary Red** | `#D0142C` | CTAs, badges, discounts, buttons |
| **Deep Crimson** | `#8C0E1F` | Gradients, hover states |
| **Jet Black** | `#0B0B0C` | Navbar, footer, admin sidebar |
| **Regal Gold** | `#D4AF37` | Borders, crown icons, highlights |
| **Light Gold** | `#F1D77C` | Shimmer text, dark accents |
| **Warm Paper** | `#FBF8F1` | Background canvas |

---

## 🚀 Getting Started

### 1. Backend Setup & Run
```bash
cd server
npm install
npx prisma db push
node prisma/seed.js
npm run dev
```
*Backend runs on:* `http://localhost:5000`

### 2. Frontend Setup & Run
```bash
cd client
npm install
npm run dev
```
*Frontend runs on:* `http://localhost:5173`

---

## 🔑 Demo Accounts (1-Click Login Available)

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@dryfruitkart.com` | `admin123` |
| **Customer** | `customer@dryfruitkart.com` | `customer123` |

*(You can also use the convenient "Quick Demo Login" buttons directly on the Login page and top bar).*

---

## 🎟️ Active Coupons for Testing

- `RCB2026`: 18% OFF (Min cart value ₹799, Max discount ₹350)
- `ROYAL10`: 10% OFF (Min cart value ₹499, Max discount ₹200)
- `GOLDEN25`: 25% OFF (Min cart value ₹1499, Max discount ₹600)
