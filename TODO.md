# ShopEase Nepal - Remaining Tasks & TODOs

This document outlines the remaining tasks and future enhancements for the ShopEase Ecommerce platform.

## 🚀 Deployment & Infrastructure
- [ ] **GitHub Pages Deployment**: Finalize the GitHub Actions workflow and deploy the Vite build to GitHub Pages.
- [ ] **Custom Domain Setup**: Configure custom domain routing (if applicable) for the live deployment.

## 🔌 Backend & API Integration (Future Phase)
Currently, the application runs entirely on the frontend using `localStorage` to simulate a database. The next major phase is backend integration.
- [ ] **REST API Integration**: Replace mock data with real REST API endpoints.
- [ ] **Database Setup**: Design and implement a real database (e.g., PostgreSQL, MongoDB) for Products, Users, Orders, and Coupons.
- [ ] **Authentication**: Implement JWT-based secure authentication (replacing the current UI-only login).
- [ ] **Real-time Order Tracking**: Integrate WebSockets or Server-Sent Events (SSE) for real-time order status updates in the Admin and User dashboards.

## 💳 Payments & Checkout
- [ ] **Payment Gateway Integration**: Integrate local Nepali payment gateways (eSewa, Khalti, IME Pay) for digital wallet payments.
- [ ] **Card Payments**: Integrate Stripe or a local bank API for direct Credit/Debit card processing.
- [ ] **Shipping Calculation API**: Connect to a logistics API to calculate dynamic shipping rates based on exact weight and dimensions rather than static province fees.

## 🛍️ Product & Catalog Enhancements
- [ ] **Product Reviews & Ratings**: Allow authenticated users to leave real reviews and ratings on products they have purchased.
- [ ] **Advanced Search & Filtering**: Implement server-side search, category filtering, and price range sliders on the catalog pages.
- [ ] **Inventory Management**: Add stock limits and "Out of Stock" states to prevent overselling.

## 👨‍💼 Seller & Admin Features
- [ ] **Seller Payouts**: Create a dashboard section for sellers to track their earnings and request payouts.
- [ ] **Analytics Dashboard**: Add charts (e.g., Recharts, Chart.js) to the Admin Dashboard to visualize sales trends over time.
- [ ] **Advanced Coupon Rules**: Allow coupons to have expiry dates, minimum purchase amounts, and usage limits.
