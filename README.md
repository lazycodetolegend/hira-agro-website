# 🌾 Hira Agro Industry

A full-stack MERN application for **Hira Agro Industry** — a premium rice milling business with three generations of trust.

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React (Vite) + Tailwind CSS v4    |
| Backend    | Node.js + Express                 |
| Database   | MongoDB (Mongoose)                |
| Auth       | JWT with role-based access        |
| Images     | Cloudinary / local uploads        |

## Quick Start

### Prerequisites
- Node.js 18+  
- MongoDB Atlas account (or local MongoDB)
- (Optional) Cloudinary account

### 1. Clone & Configure

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values:
# - MONGO_URI (required)
# - JWT_SECRET (required — change the default!)
# - CLOUDINARY_* (optional)
```

### 2. Server Setup

```bash
cd server
npm install
npm run seed    # Creates default admin account
npm run dev     # Starts server on port 5000
```

### 3. Client Setup

```bash
cd client
npm install
npm run dev     # Starts client on port 3000
```

### 4. Access

| URL                     | Description          |
|-------------------------|----------------------|
| http://localhost:3000    | Public website       |
| http://localhost:3000/login | Staff login       |

### Default Admin Account

| Field    | Value               |
|----------|---------------------|
| Email    | admin@hiraagro.com  |
| Password | Admin@123           |

> ⚠️ **Change the default admin password after first login!**

## User Roles

| Role    | Capabilities                                              |
|---------|-----------------------------------------------------------|
| Admin   | Manage products, create/remove managers, view all data    |
| Manager | Update stock, record sales, manage expenses, view own data|
| Public  | Browse product catalogue (no login required)              |

## Project Structure

```
Hira Agro Industry/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── utils/
│   └── ...
├── server/          # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── ...
├── .env.example
└── README.md
```

## API Endpoints

### Auth
| Method | Endpoint            | Access | Description          |
|--------|---------------------|--------|----------------------|
| POST   | /api/auth/login     | Public | Login                |
| GET    | /api/auth/me        | Auth   | Current user         |
| POST   | /api/auth/register  | Admin  | Create manager       |
| GET    | /api/auth/users     | Admin  | List managers        |
| DELETE | /api/auth/users/:id | Admin  | Remove manager       |

### Products
| Method | Endpoint            | Access | Description          |
|--------|---------------------|--------|----------------------|
| GET    | /api/products       | Public | List products        |
| GET    | /api/products/:id   | Public | Product details      |
| POST   | /api/products       | Admin  | Create product       |
| PUT    | /api/products/:id   | Admin  | Update product       |
| DELETE | /api/products/:id   | Admin  | Delete product       |

### Stock
| Method | Endpoint    | Access         | Description          |
|--------|-------------|----------------|----------------------|
| POST   | /api/stock  | Admin, Manager | Update stock         |
| GET    | /api/stock  | Admin, Manager | View stock logs      |

### Sales
| Method | Endpoint    | Access         | Description          |
|--------|-------------|----------------|----------------------|
| POST   | /api/sales  | Admin, Manager | Record sale          |
| GET    | /api/sales  | Admin, Manager | View sales           |

### Expenses
| Method | Endpoint       | Access         | Description          |
|--------|----------------|----------------|----------------------|
| POST   | /api/expenses  | Admin, Manager | Add expense          |
| GET    | /api/expenses  | Admin, Manager | View expenses        |

### Contact
| Method | Endpoint       | Access | Description          |
|--------|----------------|--------|----------------------|
| POST   | /api/contact   | Public | Submit inquiry       |

## License

Private — Hira Agro Industry © 2026
"# Deployment fix" 
