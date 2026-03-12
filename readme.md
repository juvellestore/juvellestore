# Juvelle - E-Commerce Platform

Welcome to the Juvelle repository! Juvelle is a modern, responsive e-commerce web application built using the MERN stack (MongoDB, Express.js, React, Node.js) along with Vite and Tailwind CSS. It features a complete shopping experience from product browsing to secure checkout using Razorpay, along with a comprehensive Admin Dashboard for managing products and orders.

## Features

- **Storefront:** Browse a wide variety of clothing products.
- **Product Details:** View item descriptions, prices, stock availability, and high-quality images.
- **Shopping Cart & Checkout:** Add items to cart and checkout securely with the Razorpay payment gateway integration.
- **User Authentication:** Secure signup and login for customers and administrators.
- **User Profiles:** Customers can view their order history and track the status of current orders.
- **Admin Dashboard:**
  - Create, view, update, and delete products.
  - Manage product images via Cloudinary integration.
  - View and manage all customer orders.
  - Generate and download Billing and Shipping PDFs for orders.

## Tech Stack

### Frontend

- **React (v19)** with **Vite**
- **Tailwind CSS v4** for highly responsive and modern styling
- **React Router DOM** for routing
- **Axios** for API requests
- **Framer Motion** for smooth UI animations
- **jsPDF & jsPDF-AutoTable** for invoice generation on the admin side
- **Sonner** for toast notifications

### Backend

- **Node.js** & **Express.js**
- **MongoDB** with **Mongoose** for data storage
- **JWT (JSON Web Tokens)** for authentication
- **Bcrypt.js** for secure password hashing
- **Razorpay** for payment processing
- **Cloudinary** & **Multer** for image uploads and management

---

## Project Structure

The project is structured into two main directories:

- `/frontend` - Contains the Vite/React application.
- `/backend` - Contains the Express.js API server.

---

## Local Development Setup

To get a local copy up and running, follow these steps.

### Prerequisites

You need the following installed on your machine:

- Node.js (v18 or higher recommended)
- Git
- MongoDB (or a MongoDB Atlas connection string)
- Accounts for [Cloudinary](https://cloudinary.com) and [Razorpay](https://razorpay.com)

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project folder>
```

### 2. Setup the Backend

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the root of the `backend` directory and add the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

# Razorpay Keys
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary Keys
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend development server:

```bash
npm run dev
```

The API should now be running on `http://localhost:5000`.

### 3. Setup the Frontend

Open a new terminal window, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Create a `.env` file in the root of the `frontend` directory and add the following variables:

```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start the frontend Vite server:

```bash
npm run dev
```

The application should now be accessible at `http://localhost:5173`.

---

## Deployment

Please refer to [`deployment.md`](./deployment.md) for detailed instructions on deploying the frontend and backend to Vercel.

## Contact

- Project Author: [Aravind A Kamath](https://github.com/aravindanirudh)
