# Gleamy Baby Cots & Furniture Frontend

Frontend application for the Gleamy Baby Cots & Furniture Management System.

This project provides the customer-facing website and administrator dashboard used to manage products, inventory visibility, sales insights, and business operations for Gleamy Baby Cots & Furniture.

---

## Overview

Gleamy Baby Cots & Furniture is a furniture manufacturing and retail business specializing in:

* Baby Cots
* Toddler Beds
* Storage Furniture
* Shoe Racks
* Chests
* Coffee Tables
* TV Stands
* Custom Furniture Products

This frontend was built to replace manual catalogue management and provide a modern digital platform for showcasing products while enabling administrators to manage inventory and monitor business performance.

---

## Key Features

### Public Website

Customers can:

* Browse products
* View product details
* Search available products
* Filter products by category
* View pricing information
* Contact the business via WhatsApp
* Explore featured products

---

### Product Catalogue

* Dynamic product listing
* Product detail pages
* Category filtering
* Search functionality
* Responsive image galleries
* Real-time data from backend API

---

### Authentication

* User registration
* Secure login
* JWT authentication
* Protected routes
* Persistent login sessions
* Role-based access control

---

### Admin Dashboard

Administrators can:

* View business metrics
* Manage products
* Monitor inventory
* View sales analytics
* Upload product images
* Archive products
* Restore archived products

---

### Analytics Dashboard

Provides:

* Revenue summaries
* Product performance insights
* Sales statistics
* Inventory summaries
* Business performance indicators

---

### Responsive Design

Fully responsive across:

* Mobile devices
* Tablets
* Laptops
* Desktop screens

Optimized for modern browsers and touch devices.

---

## Technology Stack

### Frontend

* React
* Vite
* React Router
* Axios

### Styling

* CSS3
* Responsive Design
* Flexbox
* CSS Grid

### Authentication

* JWT Authentication
* Protected Routes

### Image Management

* Cloudinary-hosted images

### Development Tools

* Git
* GitHub
* VS Code

---

## Project Structure

```text
src/
│
├── api/
├── assets/
├── components/
├── context/
├── features/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── utils/
│
├── App.jsx
└── main.jsx
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Churchillcodes/gleamy-frontend.git
```

Navigate into the project:

```bash
cd gleamy-frontend
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3500
```

---

## Running the Project

Development Mode:

```bash
npm run dev
```

Build Production Version:

```bash
npm run build
```

Preview Production Build:

```bash
npm run preview
```

---

## Backend Dependency

This application requires the Gleamy Backend API.

Backend Repository:

https://github.com/Churchillcodes/gleamy-backend

---

## Production Architecture

```text
Users
   │
   ▼
Frontend (Netlify)
   │
   ▼
Backend API (Railway)
   │
   ▼
MongoDB Atlas
   │
   ▼
Cloudinary
```

---

## Security Features

* Protected Routes
* JWT Authentication
* Role-Based Access Control
* Secure API Communication
* Authentication State Management

---

## Future Enhancements

Planned improvements include:

* Shopping Cart
* Online Checkout
* MPesa Integration
* Customer Accounts
* Product Reviews
* Wishlist Functionality
* Advanced Search
* Product Recommendations

---

## Author

**Churchill**

Full Stack Developer

GitHub:

https://github.com/Churchillcodes

---

## License

This project is proprietary software developed for Gleamy Baby Cots & Furniture.
