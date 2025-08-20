# 💻 TechMartX – MERN Stack e-commerce Platform

> TechMartX is an e-commerce web application for buying and selling tech products.

🌐 Visit Site: [www.techmartx.store](https://www.techmartx.store)

![Screens](docs/screenshots/screens.jpg)

## 🚀 Project Overview

TechMartX is a MERN e‑commerce web application featuring product catalog, cart & checkout, PayPal payments, order management, and an admin dashboard.  
Built to demonstrate clean React + Redux Toolkit architecture, REST API design, and full‑stack delivery.

### ✅ Quick Glance

| Area       | Highlights                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------------- |
| Frontend   | React 18, Redux Toolkit + RTK Query, component composition, responsive UI (React‑Bootstrap)        |
| Backend    | Node.js / Express modular routers, async handlers, secure JWT auth, pagination, PayPal integration |
| Data Layer | MongoDB + Mongoose models (Users / Products / Orders / Reviews) with indexing considerations       |
| Payments   | PayPal Smart Buttons + server verification flow                                                    |

## 🎯 Why I Built This

I built TechMartX as the final project for a 3-month MERN Stack Course at the University of Colombo, as well as part of my personal learning journey to deepen my skills in JavaScript-based full-stack web development.

Note that throughout the project, I thoroughly documented the code with comments to reinforce my understanding of key concepts.

## 🧠 Developer Notes

I've included a set of personal notes I created while learning and building this project.  
They cover some foundational concepts in React, Redux, JavaScript and other Technologies used along with code explanations and architectural thoughts.

📄 [View Developer Notes PDF](docs/TechMartX_DeveloperNotes.pdf)

> Note that this is a raw, working document created during my learning process - not a finalized guide.

## 🛠️ Tech Stack

| Layer    | Tools                                                                 |
| -------- | --------------------------------------------------------------------- |
| Frontend | React, Redux Toolkit, RTK Query, React Router, React‑Bootstrap        |
| Backend  | Node.js, Express.js, Mongoose                                         |
| Auth     | JWT (access tokens), bcrypt hashing                                   |
| Payments | PayPal Checkout (Sandbox -> Live ready)                               |
| Database | MongoDB Atlas                                                         |
| Tooling  | Nodemon, Concurrent Dev Scripts, ESLint (extendable), Postman         |
| Other    | Toast notifications, Custom hooks/utilities, Environment‑based config |

## ✨ Features

- JWT authentication & protected routes
- Product listing, detail view, reviews & ratings
- Search & pagination (server + client integration)
- Cart with quantity management & persisted state
- Checkout flow: shipping → payment → place order
- PayPal payment capture & order status updates
- Order history & profile management
- Admin dashboard: products, users, orders
- Top products carousel
- Responsive + accessible UI patterns

## 🎬 Feature Demos

### 🛒 Cart and Checkout Flow

![Cart](docs/screenshots/checkout_flow.gif)

### 🛠 Admin Panel

![Admin Panel](docs/screenshots/admin_panel.gif)

## 🧩 Architecture Overview

```
backend/
  config/        # DB & PayPal config
  controllers/   # Business logic per resource
  middleware/    # Auth, error handlers
  models/        # Mongoose schemas
  routes/        # Express routers
  utils/         # Helpers (e.g., token generator)
frontend/
  src/
    components/  # Reusable UI (Rating, Loader, etc.)
    screens/     # Route-level containers
    slices/      # Redux Toolkit slices + RTK Query endpoints
    utils/       # formatPrice, formatDate, etc.
    hooks/       # (extendable)
    assets/      # Styles & static media
```

## 🔐 Security & Best Practices

- Passwords hashed with bcrypt.
- JWT stored client‑side; protected routes validate token server‑side.
- Environment variables for secrets & external service keys.
- Data validation at model + route level (extensible).
- Avoids exposing admin-only operations to non‑privileged users.

## ⚙️ Performance Considerations

- RTK Query caching reduces duplicate API calls.
- Pagination limits payload for product lists.
- Lean Mongoose queries where applicable (extendable).
- Image dimensions constrained for consistent layout.

---

## 📦 Installation

1. Create a MongoDB database and obtain your `MongoDB URI` - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)

2. Create a PayPal account and obtain your `Client ID` - [PayPal Developer](https://developer.paypal.com/)

3. **Clone the repository:**

   ```sh
   git clone https://github.com/RandulaTharaka/TechMartX.git

   ```

4. **Install dependencies for both frontend and backend:**
   ```sh
   cd TechMartX
   npm install
   cd frontend
   npm install
   ```
5. **Set up environment variables:**  
   Rename the `.env.example` file to `.env` and add the following

   ```env
   NODE_ENV=development
   PORT=5000

   MONGO_URI=your_mongodb_uri
   JWT_SECRET=abc123

   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_APP_SECRET=your_paypal_app_secret
   PAYPAL_API_URL=https://api-m.sandbox.paypal.com

   PAGINATION_LIMIT=8
   ```

6. **Start the development servers:**

   ```sh
   # Run frontend (:3000) & backend (:5000)
   npm run dev
   # Run backend only
   npm run server
   ```

7. **Build & Deploy**

```sh
   # Create frontend production build
   cd frontend
   npm run build
```

## 📚 Selected API Endpoints

| Method | Endpoint                | Description                               |
| ------ | ----------------------- | ----------------------------------------- |
| GET    | /api/products           | List products (with pagination & keyword) |
| GET    | /api/products/:id       | Product details                           |
| POST   | /api/users/login        | Authenticate user                         |
| POST   | /api/users              | Register user                             |
| POST   | /api/orders             | Create order                              |
| GET    | /api/orders/:id         | Get order details                         |
| PUT    | /api/orders/:id/pay     | Mark order paid (PayPal)                  |
| PUT    | /api/orders/:id/deliver | Mark delivered (admin)                    |

> Additional endpoints include reviews, admin CRUD, and profile updates.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Connect With Me

I'm passionate about building full-stack applications and open to new opportunities in software development.

Feel free to connect or reach out!

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Randula%20Tharaka-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/randula-tharaka-79a61a145/)
[![Email](https://img.shields.io/badge/Email-iamrandula%40gmail.com-red?style=flat-square&logo=gmail)](mailto:iamrandula@gmail.com)
