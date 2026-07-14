<div align="center">

# Gleamy Baby Cots & Furniture — Frontend

**Customer storefront and admin dashboard for a real furniture manufacturing business.**

Built with React, Vite, and a WhatsApp-first ordering experience for the Kenyan market.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-lightgrey?style=for-the-badge)

<img src="./screenshots/01-homepage-hero.jpg" width="850" alt="Gleamy homepage" />

</div>

---

## Table of Contents

- [About the Project](#about-the-project)
- [Live Preview](#live-preview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Backend Dependency](#backend-dependency)
- [Production Architecture](#production-architecture)
- [Security](#security)
- [Roadmap](#roadmap)
- [Author](#author)

---

## About the Project

Gleamy Baby Cots & Furniture is a Nairobi-based furniture manufacturer specializing in baby cots, toddler beds, storage furniture, and custom home fittings. This frontend replaces what was previously a manual, WhatsApp-only sales process with a modern digital storefront — while keeping WhatsApp as the final, familiar step customers already trust.

It ships with two experiences in one codebase:

- **A public storefront** for browsing, searching, and inquiring about products
- **A protected admin dashboard** for managing inventory, orders, and sales performance

---

## Live Preview

<table>
<tr>
<td width="50%">
<img src="./screenshots/02-shop-by-category.jpg" width="100%" alt="Shop by category" /><br/>
<sub><b>Category browsing</b> — designed for fast product discovery</sub>
</td>
<td width="50%">
<img src="./screenshots/03-featured-products.jpg" width="100%" alt="Featured products" /><br/>
<sub><b>Featured products</b> — live stock badges and one-tap WhatsApp inquiry</sub>
</td>
</tr>
<tr>
<td width="50%">
<img src="./screenshots/04-catalogue.jpg" width="100%" alt="Product catalogue" /><br/>
<sub><b>Full catalogue</b> — search, category, availability, and sort filters</sub>
</td>
<td width="50%">
<img src="./screenshots/05-contact-inquiry.jpg" width="100%" alt="Contact and inquiry form" /><br/>
<sub><b>Inquiry form</b> — routes straight into a WhatsApp conversation</sub>
</td>
</tr>
<tr>
<td width="50%">
<img src="./screenshots/06-login.jpg" width="100%" alt="Admin login" /><br/>
<sub><b>Admin authentication</b> — JWT-protected portal access</sub>
</td>
<td width="50%">
<img src="./screenshots/07-admin-dashboard.jpg" width="100%" alt="Admin dashboard" /><br/>
<sub><b>Admin dashboard</b> — revenue, sales volume, and inquiries at a glance</sub>
</td>
</tr>
</table>

<div align="center">
<img src="./screenshots/08-admin-products.jpg" width="850" alt="Product management" /><br/>
<sub><b>Product management</b> — live stock, pricing, and category control</sub>
</div>

---

## Features

### 🛋️ Public Website
- Browse and search the full product catalogue
- Filter by category and availability
- View detailed product pages with responsive image galleries
- Contact the business directly via WhatsApp deep links
- Explore featured and in-stock products on the homepage

### 📦 Product Catalogue
- Dynamic, real-time product listing sourced from the backend API
- Category filtering and keyword search
- Responsive image galleries with graceful fallbacks

### 🔐 Authentication
- User registration and secure login
- JWT-based authentication with persistent sessions
- Protected routes and role-based access control

### 📊 Admin Dashboard
- Business metrics: revenue, sales volume, and inventory at a glance
- Full product management — create, edit, archive, and restore
- Inventory monitoring with live stock adjustments
- Sales analytics with top-selling product rankings
- Cloudinary-backed product image uploads

### 📱 Responsive Design
Fully responsive across mobile, tablet, laptop, and desktop, built with CSS3 Flexbox and Grid.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Library | React |
| Build Tool | Vite |
| Routing | React Router |
| HTTP Client | Axios |
| Styling | CSS3, Flexbox, CSS Grid |
| Auth | JWT, Protected Routes |
| Media | Cloudinary-hosted images |
| Tooling | Git, GitHub, VS Code |

---

## Project Structure

```text
src/
│
├── api/          # Axios instances & API request modules
├── assets/       # Static assets
├── components/   # Reusable UI components
├── context/      # React context providers (auth, etc.)
├── features/     # Feature-scoped modules
├── hooks/        # Custom React hooks
├── layouts/      # Page layout wrappers
├── pages/        # Route-level page components
├── routes/       # Route definitions & protected route logic
├── utils/        # Helper utilities
│
├── App.jsx
└── main.jsx
```

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Churchillcodes/gleamy-frontend.git
cd gleamy-frontend
```

Install dependencies:

```bash
npm install
```

Run in development mode:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3500
```

---

## Backend Dependency

This application requires the **Gleamy Backend API** to be running.

➡️ **Backend repository:** [github.com/Churchillcodes/gleamy-backend](https://github.com/Churchillcodes/gleamy-backend)

---

## Production Architecture

```mermaid
flowchart TD
    A[Users] --> B[Frontend · Netlify]
    B --> C[Backend API · Railway]
    C --> D[(MongoDB Atlas)]
    C --> E[Cloudinary]
```

---

## Security

- Protected routes on both public and admin sides
- JWT authentication with persistent, secure sessions
- Role-based access control for admin-only features
- Secure API communication with the backend

---

## Roadmap

- [ ] Shopping cart
- [ ] Online checkout
- [ ] M-Pesa integration
- [ ] Customer accounts
- [ ] Product reviews
- [ ] Wishlist functionality
- [ ] Advanced search
- [ ] Product recommendations

---

## Author

**Churchill**
Full-Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-Churchillcodes-181717?style=for-the-badge&logo=github)](https://github.com/Churchillcodes)

---

<sub>This project is proprietary software developed for Gleamy Baby Cots & Furniture.</sub>
