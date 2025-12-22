# **📚 BookWormed — Social Reading Platform**

Live Application:
🔗 https://book-wormed.vercel.app/

BookWormed is a full-stack social reading platform that enables users to discover books, publish reviews and posts, join reading groups, manage personalized reading lists, and purchase in-app credits.

The platform is built using a modern MERN architecture with secure JWT-based authentication, Stripe/Razorpay payments, real-time notifications, and automated data ingestion pipelines for large book datasets.

---

## **🚀 Features**

### **🔍 Book Discovery**

* Search and browse books by metadata, genres, and reviews
* Rich book pages with author data, ratings, and descriptions

### **📢 Social & Community**

* Create posts and reviews
* Follow users and join public reading groups
* Commenting and group discussion boards

### **📘 Reading Lists**

* Create and manage custom reading lists
* Track completed, in-progress, and saved books

### **💰 Credits & Payments**

* Purchase in-app reading credits
* Integrated payment system using **Stripe** & **Razorpay**

### **📩 Notifications & Email**

* Real-time notifications
* Transactional emails via **Nodemailer**

### **⚙️ Data Engineering Tools**

* Book dataset processing scripts in Python
* Node.js seeding pipelines for fast DB population

---

## **🛠️ Tech Stack**

### **Frontend**

* React (Vite)
* Tailwind CSS
* Framer Motion
* React Router
* Axios
* React Toastify

### **Backend**

* Node.js + Express
* MongoDB + Mongoose
* JWT Authentication & RBAC
* bcryptjs password hashing

### **Payments & Email**

* Stripe & Razorpay
* Nodemailer (SMTP emails)

### **Security & Logging**

* Helmet
* CORS
* express-rate-limit
* Winston logging

### **Development Tools**

* Vite, ESLint, Nodemon, dotenv

### **Data Processing**

* Python scripts for dataset cleaning and transformation

---

## **📁 Project Structure**

```
BookWormed/
│
├── client/                # React frontend
│   ├── src/
│   └── vite.config.js
│
├── server/                # Backend API & database models
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── seedBooks.js
│   └── logger.js
│
├── data-processing/       # Python dataset cleaning scripts
│   └── clean_data.py
│
└── scripts/               # Utility/maintenance scripts
    └── cleanup_reviews.js
```

---

## **📦 Requirements**

* Node.js ≥ 16
* MongoDB database (Atlas/local)
* (Optional) Python 3 for data scripts

---

## **⚙️ Environment Setup**

Create a `.env` file inside `/server` directory:

```
PORT=4000
NODE_ENV=development
MONGODB_URI=<your-mongodb-uri>
DB_NAME=book_worm
JWT_SECRET=<your-jwt-secret>

RAZORPAY_KEY_ID=<key>
RAZORPAY_KEY_SECRET=<secret>

CURRENCY=INR

EMAIL_USER=<email-user>
EMAIL_PASS=<email-password>
SENDER_EMAIL=<sender-email>
SENDER_PASSWORD=<sender-pass>
```

---

## **🚀 Getting Started**

### **Clone Repo**

```
git clone <repo-url>
cd BookWormed
```

---

### **Backend Setup**

```
cd server
npm install
npm run server     # dev mode using nodemon
npm start          # production start
```
---

### **Frontend Setup**

```
cd client
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

Backend runs on:

```
http://localhost:4000 (default)
```





