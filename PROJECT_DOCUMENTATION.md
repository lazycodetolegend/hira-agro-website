# Hira Agro Industry — Full MERN Stack Project Guide & Academic Documentation

> **Prepared for:** Academic Viva, Project Presentation & Professor Review  
> **Project Name:** Hira Agro Industry — Enterprise Rice Mill Management System & Public E-Catalogue  
> **Tech Stack:** MERN (MongoDB, Express.js, React.js, Node.js) + Tailwind CSS v4  

---

## 📋 Table of Contents
1. [Project Overview & Executive Summary](#1-project-overview--executive-summary)
2. [Translating Web Basics to MERN (HTML/CSS/JS → MERN)](#2-translating-web-basics-to-mern-htmlcssjs--mern)
3. [System Architecture & Data Flow](#3-system-architecture--data-flow)
4. [Folder & File Structure Explained](#4-folder--file-structure-explained)
5. [Database Schema Design (MongoDB / Mongoose)](#5-database-schema-design-mongodb--mongoose)
6. [Backend API Architecture (Node.js & Express)](#6-backend-api-architecture-nodejs--express)
7. [Frontend Architecture (React.js & Tailwind CSS v4)](#7-frontend-architecture-reactjs--tailwind-css-v4)
8. [Detailed Code Walkthrough (Key Files & Logic)](#8-detailed-code-walkthrough-key-files--logic)
9. [Security Features & Authentication Flow](#9-security-features--authentication-flow)
10. [Professor Viva Q&A Guide (Top Questions & Answers)](#10-professor-viva-qa-guide-top-questions--answers)

---

## 1. Project Overview & Executive Summary

### What is Hira Agro Industry?
**Hira Agro Industry** is a full-stack enterprise web application built for a rice milling and grain processing business located in Jamshet, Vasantwadi, Ashagad, Tal. Dahanu, Dist. Palghar - 401602 (Email: `hiraagroindustry51@gmail.com`, Mob: `7977697797 / 9823958410`). The application serves two main audiences:

1. **Public Website (Customers, Wholesalers & Exporters)**:
   - Interactive landing page highlighting company legacy and 10,000+ Tonne annual capacity.
   - Filterable product catalogue (Basmati, Sona Masuri, Sella, Kolam, IR64) with live pricing and stock availability.
   - Detailed product view with quote request features.
   - Contact form connected directly to backend database.

2. **Role-Based Staff Portal (Managers & Admins)**:
   - **Manager Dashboard**: Record daily sales with automatic stock deduction, manage stock additions/removals, record operational expenses, and view sales history with revenue summaries.
   - **Admin Dashboard**: Full CRUD over product catalogue, manager user account management, global inventory tracking, low-stock automated alerts (<100 units), and real-time revenue analytics.

---

## 2. Translating Web Basics to MERN (HTML/CSS/JS → MERN)

If you only know basic HTML, CSS, and vanilla JavaScript, here is how MERN connects to what you already know:

| HTML / CSS / JS Concept | Equivalent in MERN Stack | Simple Analogy |
|:--- |:--- |:--- |
| **`index.html`** | **React Components (`.jsx`)** | Instead of writing static HTML pages, React uses JS functions that return HTML-like code called **JSX**. |
| **`style.css`** | **Tailwind CSS v4 (`index.css`)** | Instead of writing long CSS rules, utility classes like `py-16 bg-primary text-white` style elements directly. |
| **`script.js` (DOM manipulation)** | **React State (`useState`)** | In plain JS you do `document.getElementById('total').innerText = 500`. In React, when `useState` updates, the page updates automatically. |
| **Storing data in arrays/variables** | **MongoDB Database** | Plain JS variables disappear when you refresh the page. MongoDB stores data permanently on a database server. |
| **`fetch()` or AJAX** | **Axios API Client (`api.js`)** | The frontend uses Axios to send requests to the backend server and receive JSON data. |
| **Backend Server** | **Node.js + Express.js** | Express acts like a "waiter" listening for HTTP requests (like GET products or POST login), querying MongoDB, and sending JSON back. |

---

## 3. System Architecture & Data Flow

```
+-----------------------------------------------------------------------------------+
|                                  BROWSER (Client)                                 |
|                                                                                   |
|   +-------------------+    +----------------------+    +----------------------+   |
|   |  Home / Products  |    |   Staff Login Page   |    | Admin/Manager Dash   |   |
|   |    (React.js)     |    |   (Auth Context)     |    |   (Role Protected)   |   |
|   +---------+---------+    +----------+-----------+    +----------+-----------+   |
+-------------|-------------------------|---------------------------|---------------+
              |                         |                           |
              | Axios HTTP Requests     | JWT Token Header          | REST API
              v                         v                           v
+-----------------------------------------------------------------------------------+
|                              BACKEND SERVER (Express.js)                           |
|                                                                                   |
|   +-------------------+    +----------------------+    +----------------------+   |
|   | Product Controller|    |   Auth Controller    |    | Stock/Sales Control  |   |
|   | (GET/POST/PUT/DEL)|    |   (JWT & Bcrypt)     |    | (Auto Stock Deduct)  |   |
|   +---------+---------+    +----------+-----------+    +----------+-----------+   |
+-------------|-------------------------|---------------------------|---------------+
              |                         |                           |
              v                         v                           v
+-----------------------------------------------------------------------------------+
|                             DATABASE (MongoDB Atlas Cloud)                        |
|                                                                                   |
|      [Products]               [Users]               [Sales] / [StockLogs]         |
+-----------------------------------------------------------------------------------+
```

---

## 4. Folder & File Structure Explained

```
Hira Agro Industry/
├── client/                      # Frontend Application (React.js + Vite + Tailwind v4)
│   ├── public/
│   │   └── images/              # High-resolution images (hero, silos, rice)
│   ├── src/
│   │   ├── components/          # Reusable UI Components
│   │   │   ├── Navbar.jsx       # Floating Header with logo & nav links
│   │   │   ├── Footer.jsx       # Footer with company & contact info
│   │   │   └── ProtectedRoute.jsx # Role-based router guard (Admin/Manager check)
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global Auth state (user, token, login, logout)
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Hero section, stats, quality features, CTA
│   │   │   ├── Products.jsx     # Product grid with variety filters & search
│   │   │   ├── ProductDetail.jsx# Single product detail view
│   │   │   ├── Contact.jsx      # Contact info cards + inquiry form
│   │   │   ├── Login.jsx        # Staff Portal login page
│   │   │   ├── ManagerDashboard.jsx # Stock, Record Sale, History, Expenses
│   │   │   └── AdminDashboard.jsx   # Overview, Products CRUD, Managers, Sales, Logs
│   │   ├── utils/
│   │   │   └── api.js           # Axios instance configured with baseURL & JWT interceptor
│   │   ├── App.jsx              # Main App component with React Router routes
│   │   ├── index.css            # Tailwind CSS v4 design system tokens & custom styles
│   │   └── main.jsx             # React entry point
│   ├── vite.config.js           # Vite server configuration (Port 5173 & /api proxy)
│   └── package.json             # Frontend dependencies
│
└── server/                      # Backend Application (Node.js + Express.js + Mongoose)
    ├── config/
    │   ├── db.js                # MongoDB connection with DNS SRV fallback
    │   └── cloudinary.js        # Image storage configuration
    ├── controllers/
    │   ├── authController.js    # Login, register manager, get users, delete user
    │   ├── productController.js # Product CRUD & file upload handling
    │   ├── stockController.js   # Stock addition/deduction & audit logging
    │   ├── saleController.js    # Sale recording, auto stock deduction, revenue calculation
    │   ├── expenseController.js # Expense recording & aggregation
    │   └── contactController.js # Contact form submissions & admin management
    ├── middleware/
    │   ├── auth.js              # protect (JWT verification) & authorize (Role check)
    │   └── upload.js            # Multer file upload middleware
    ├── models/
    │   ├── User.js              # User schema (name, email, password, role)
    │   ├── Product.js           # Product schema (name, variety, ratePerKg, stock)
    │   ├── StockLog.js          # Stock audit log schema
    │   ├── Sale.js              # Sale transaction schema
    │   ├── Expense.js           # Expense log schema
    │   └── Contact.js           # Contact inquiry schema
    ├── routes/
    │   ├── authRoutes.js        # Authentication endpoints
    │   ├── productRoutes.js     # Product REST endpoints
    │   ├── stockRoutes.js       # Stock log endpoints
    │   ├── saleRoutes.js        # Sales endpoints
    │   ├── expenseRoutes.js     # Expense endpoints
    │   └── contactRoutes.js     # Contact endpoints
    ├── .env                     # Environment variables (MONGO_URI, JWT_SECRET, PORT)
    ├── seed.js                  # Initial Admin account seeder script
    ├── server.js                # Central Express application entry point
    └── package.json             # Backend dependencies
```

---

## 5. Database Schema Design (MongoDB / Mongoose)

MongoDB is a **NoSQL Database** that stores data as JSON-like documents. In our application, we use **Mongoose** (an Object Data Modeling library for Node.js) to define strict schemas.

### Key Models Overview:

1. **User Schema (`server/models/User.js`)**:
   - `name`: String (Required)
   - `email`: String (Unique, Required, Lowercase)
   - `password`: String (Hashed with `bcryptjs`, selected: false by default for security)
   - `role`: Enum `['admin', 'manager']` (Default: `'manager'`)

2. **Product Schema (`server/models/Product.js`)**:
   - `name`: String (Required)
   - `variety`: String (`Basmati`, `Sona Masuri`, `Sella`, `Kolam`, `IR64`)
   - `ratePerKg`: Number (Wholesale rate)
   - `unit`: String (Default: `'kg'`)
   - `description`: String
   - `stockQuantity`: Number (Current stock balance in kg/quintals)
   - `isAvailable`: Boolean (Default: `true`)
   - `photoUrl`: String (Path or Cloudinary URL)

3. **Sale Schema (`server/models/Sale.js`)**:
   - `productId`: Reference to `Product`
   - `quantitySold`: Number
   - `ratePerUnit`: Number
   - `totalAmount`: Number (Calculated as `quantitySold * ratePerUnit`)
   - `buyerName`: String
   - `paymentStatus`: Enum `['paid', 'due']`
   - `recordedBy`: Reference to `User`
   - `date`: Date

4. **StockLog Schema (`server/models/StockLog.js`)**:
   - `productId`: Reference to `Product`
   - `changeAmount`: Number
   - `type`: Enum `['add', 'remove']`
   - `note`: String
   - `updatedBy`: Reference to `User`

5. **Expense Schema (`server/models/Expense.js`)**:
   - `category`: String (e.g. `Transport`, `Labour`, `Packaging`)
   - `amount`: Number
   - `note`: String
   - `recordedBy`: Reference to `User`
   - `date`: Date

6. **Contact Schema (`server/models/Contact.js`)**:
   - `name`, `email`, `phone`, `message`, `isRead`: Boolean

---

## 6. Backend API Architecture (Node.js & Express)

The backend follows the **MVC (Model-View-Controller)** design pattern:
- **Routes**: Define URL paths (e.g. `/api/products`).
- **Middleware**: Intercept requests to check authentication (`protect`), check user roles (`authorize`), or handle file uploads (`upload`).
- **Controllers**: Contain the actual business logic (e.g. check stock balance, deduct inventory, save to database).

### How Stock Auto-Deduction Works in `saleController.js`:
When a manager records a sale:
```js
// 1. Verify product exists
const product = await Product.findById(productId);

// 2. Validate stock balance
if (product.stockQuantity < quantitySold) {
  return res.status(400).json({ message: 'Insufficient stock' });
}

// 3. Calculate total amount
const totalAmount = quantitySold * ratePerUnit;

// 4. Deduct quantity from product stock & save
product.stockQuantity -= quantitySold;
await product.save();

// 5. Create Sale transaction record
const sale = await Sale.create({
  productId,
  quantitySold,
  ratePerUnit,
  totalAmount,
  buyerName,
  paymentStatus,
  recordedBy: req.user._id
});
```

---

## 7. Frontend Architecture (React.js & Tailwind CSS v4)

### React Core Concepts Used:
1. **Components**: Modular, reusable UI code (e.g. `Navbar`, `Footer`, `ProtectedRoute`).
2. **State (`useState`)**: Local memory for components (e.g. search query, modal open/close, form inputs).
3. **Effects (`useEffect`)**: Executes side-effects like fetching data from backend API when page loads.
4. **Context API (`AuthContext`)**: Provides global authentication state (`user`, `token`, `login()`, `logout()`) across the entire application without prop drilling.
5. **React Router (`react-router-dom`)**: Handles page navigation without browser page reloads (Single Page Application — SPA).

### Tailwind CSS v4 Configuration:
Configured in `client/src/index.css` using the new `@theme` directive:
```css
@theme {
  --color-primary: #1a3d2e;       /* Deep Forest Green */
  --color-primary-light: #245a42;
  --color-accent: #d4a017;        /* Warm Gold */
  --color-cream: #f7f6f1;         /* Off-White / Cream background */
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

---

## 8. Detailed Code Walkthrough (Key Files & Logic)

### 1. `server/middleware/auth.js` (JWT Security Guard)
```js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect middleware: Verifies JWT token attached in Authorization header
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract token after "Bearer "
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode JWT token
      req.user = await User.findById(decoded.id).select('-password'); // Attach user to request
      next(); // Proceed to next controller
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
};

// Authorize middleware: Restricts routes to specific roles (e.g. 'admin')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role ${req.user.role} is not authorized` });
    }
    next();
  };
};
```

---

### 2. `client/src/utils/api.js` (Axios Interceptor)
```js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Proxied to http://localhost:5000/api by Vite
});

// Request Interceptor: Automatically attaches JWT token to every outgoing HTTP request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 9. Security Features & Authentication Flow

1. **Password Hashing**: Passwords are never stored in plain text. `bcryptjs` generates a cryptographic salt and hashes passwords before saving to MongoDB.
2. **JWT Tokens**: On successful login, server signs a JSON Web Token containing `{ id, role }` valid for 7 days.
3. **Stateless Authorization**: Client stores token in `localStorage` and includes it as `Authorization: Bearer <token>` header in requests.
4. **Role-Based Guards**:
   - `/api/products` (POST/PUT/DELETE) → Admin Only
   - `/api/auth/register` (POST) → Admin Only
   - `/api/stock`, `/api/sales`, `/api/expenses` → Admin & Manager
5. **CORS Protection & Input Sanitization**: Prevents unauthorized cross-origin requests.

---

## 10. Professor Viva Q&A Guide (Top Questions & Answers)

Here are the exact questions your professor or viva external examiner is likely to ask, along with clear, professional answers you can give:

### Q1: "What architecture does your project follow?"
> **Answer:** "Our project follows the **MERN Stack architecture** — MongoDB for the database, Express.js and Node.js for the backend REST API, and React.js with Tailwind CSS v4 for the frontend Single Page Application (SPA). It uses a modular MVC (Model-View-Controller) structure on the backend."

### Q2: "How do the frontend and backend communicate?"
> **Answer:** "The frontend communicates with the backend via asynchronous HTTP requests using **Axios**. We configured Vite to proxy `/api` requests to our Express server running on port 5000. Data is exchanged in JSON format."

### Q3: "How is authentication handled in your application?"
> **Answer:** "Authentication uses **JSON Web Tokens (JWT)** and **bcryptjs** for password hashing. When a user logs in via `/api/auth/login`, the backend verifies the password using bcrypt, generates a signed JWT token, and sends it back. The frontend stores the token in `localStorage` and an Axios interceptor automatically attaches it as a `Bearer` token in the `Authorization` header for protected routes."

### Q4: "What is the difference between Admin and Manager roles in your system?"
> **Answer:** "We implemented Role-Based Access Control (RBAC). **Managers** can record stock additions/deductions, record sales, track expenses, and view their own transactions. **Admins** have full control: they can create/delete Manager accounts, perform CRUD operations on products with image uploads, monitor low-stock inventory alerts, and review global revenue analytics."

### Q5: "What happens to product stock when a sale is recorded?"
> **Answer:** "In `saleController.js`, when a sale is submitted, the controller first checks if `product.stockQuantity` is greater than or equal to the requested quantity. If valid, it calculates the total amount (`quantitySold * ratePerUnit`), deducts the quantity directly from `product.stockQuantity`, saves the updated product document, and creates a record in the `Sale` collection."

### Q6: "Why did you choose MongoDB over a SQL database like MySQL?"
> **Answer:** "MongoDB is a document-oriented NoSQL database that pairs natively with JavaScript and JSON formats in Node.js. It allows flexible schemas, fast document queries, and seamless scaling using Mongoose models."

### Q7: "What is React State (`useState`) and Effect (`useEffect`)?"
> **Answer:** "`useState` is a React Hook that lets components hold dynamic memory (like search queries, form inputs, or fetched product lists). `useEffect` allows us to run side-effects, such as fetching data from our backend REST API when a page component mounts."

---

## 🎯 Summary Checklist for Presentation

- [x] Backend running on port `5000` connected to MongoDB Atlas.
- [x] Frontend running on port `5173`.
- [x] Default Admin credentials ready: `admin@hiraagro.com` / `Admin@123`.
- [x] Demonstrate public pages: Home, Catalogue with filters, Product Details, Contact Form.
- [x] Demonstrate Staff Portal: Login, Stock Update, Sales Recording, Low Stock Alerts, Product Management.

*(Documentation compiled for Hira Agro Industry MERN Project Review)*
