-- =====================================================================
-- ShopEase Ecommerce Database Queries Reference
-- Database Type: SQLite (backend/shopease.db)
-- =====================================================================

-- =====================================================================
-- SECTION 1: DATABASE SCHEMA DEFINITIONS (DDL)
-- =====================================================================

-- 1. Users Table
-- Stores user accounts, authentication data, and status controls (role, ban status, violations).
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    avatar TEXT,
    violations INTEGER DEFAULT 0,
    banned BOOLEAN DEFAULT 0,
    role TEXT DEFAULT 'user',
    one_star_reviews INTEGER DEFAULT 0
);

-- 2. Products Table
-- Stores catalog products. Images are stored as JSON serialized lists.
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT NOT NULL,
    images TEXT NOT NULL, -- JSON serialized list of secondary image URLs
    badge TEXT,
    stock INTEGER NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    longDescription TEXT NOT NULL,
    addedBy TEXT NOT NULL
);

-- 3. Reviews Table
-- Stores product reviews left by customers.
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL,
    rating INTEGER NOT NULL,
    date TEXT NOT NULL,
    verified BOOLEAN DEFAULT 0,
    title TEXT,
    text TEXT NOT NULL,
    helpful INTEGER DEFAULT 0,
    user_username TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 4. Orders Table
-- Stores checkouts/orders. Items is stored as a JSON serialized list of products.
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    storeName TEXT NOT NULL,
    status TEXT NOT NULL, -- 'Pending' | 'To Ship' | 'Shipped' | 'Completed' | 'Cancelled'
    date TEXT NOT NULL,
    items TEXT NOT NULL, -- JSON serialized list of ordered items (name, price, quantity, image)
    amount REAL NOT NULL
);

-- 5. Seller Applications Table
-- Stores applications of customers wishing to become store sellers.
CREATE TABLE IF NOT EXISTS seller_applications (
    username TEXT PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending' | 'Approved' | 'Rejected'
    submittedAt TEXT NOT NULL,
    storeName TEXT,
    storeDescription TEXT
);

-- 6. Reported Avatars Table
-- Tracks avatars flagged/reported for violation.
CREATE TABLE IF NOT EXISTS reported_avatars (
    username TEXT PRIMARY KEY,
    avatar TEXT NOT NULL,
    date TEXT NOT NULL
);

-- 7. Coupons Table
-- Discount coupons created by admins.
CREATE TABLE IF NOT EXISTS coupons (
    code TEXT PRIMARY KEY,
    percent INTEGER NOT NULL,
    creator TEXT NOT NULL
);

-- 8. Messages Table
-- Stores contact messages/inquiries from visitors.
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    date TEXT NOT NULL
);


-- =====================================================================
-- SECTION 2: CORE APPLICATION QUERIES (CRUD)
-- =====================================================================

-- ---------------------------------------------------------------------
-- User Authentication & Management
-- ---------------------------------------------------------------------

-- Register a new user
-- Params: :name, :username, :email, :password
INSERT INTO users (name, username, email, password, phone, address, role)
VALUES ('John Doe', 'johndoe', 'john@example.com', 'password123', '', '', 'user');

-- Retrieve user for login authentication
-- Params: :username
SELECT * FROM users WHERE username = 'johndoe';

-- Update user profile details
-- Params: :name, :email, :phone, :address, :avatar, :username
UPDATE users 
SET name = 'John S. Doe', email = 'john.doe@example.com', phone = '9851098765', address = 'Lalitpur, Nepal', avatar = 'JD'
WHERE username = 'johndoe';

-- Update user password
-- Params: :new_password, :username
UPDATE users SET password = 'newSecurePassword123' WHERE username = 'johndoe';

-- Update user violations (relative increment)
-- Params: :delta, :username
UPDATE users SET violations = MAX(0, violations + 1) WHERE username = 'johndoe';

-- Set exact user violations count
-- Params: :count, :username
UPDATE users SET violations = 3 WHERE username = 'johndoe';

-- Toggle user ban status
-- Params: :username
UPDATE users SET banned = NOT banned WHERE username = 'johndoe';

-- Reset user password (administrative action)
-- Params: :username
UPDATE users SET password = 'resetPassword123' WHERE username = 'johndoe';

-- Promote user to sub-admin/admin role
-- Params: :username
UPDATE users SET role = 'sub-admin' WHERE username = 'johndoe';


-- ---------------------------------------------------------------------
-- Product Catalog CRUD
-- ---------------------------------------------------------------------

-- Add new product to catalog
-- Params: :name, :price, :image, :images, :badge, :stock, :category, :description, :longDescription, :addedBy
INSERT INTO products (name, price, image, images, badge, stock, category, description, longDescription, addedBy)
VALUES (
    'Himalayan Woolen Blanket', 
    3200.0, 
    'https://i.pinimg.com/736x/blanket_url.jpg', 
    '["url1", "url2"]', 
    'Warm Offer', 
    15, 
    'Local Handicrafts', 
    'A soft woolen blanket crafted high in the mountains.', 
    'Handmade blanket using authentic Yak wool directly imported from Mustang. Durable, extra warm, and soft.',
    'admin'
);

-- Retrieve all products
SELECT * FROM products;

-- Retrieve a single product by ID
-- Params: :id
SELECT * FROM products WHERE id = 1;

-- Update product details
-- Params: :name, :price, :image, :images, :badge, :stock, :category, :description, :longDescription, :addedBy, :id
UPDATE products
SET name = 'Premium Dhaka Topi v2', price = 1350.0, stock = 20
WHERE id = 1;

-- Delete a product
-- Params: :id
DELETE FROM products WHERE id = 99;


-- ---------------------------------------------------------------------
-- Reviews & Customer Testimonials
-- ---------------------------------------------------------------------

-- Add product review
-- Params: :product_id, :name, :avatar, :rating, :date, :verified, :title, :text, :helpful, :user_username
INSERT INTO reviews (product_id, name, avatar, rating, date, verified, title, text, helpful, user_username)
VALUES (1, 'Kiran Thapa', 'KT', 5, 'July 21, 2026', 1, 'Top Quality!', 'Perfect fit, very authentic traditional Dhaka weaves.', 4, 'user');

-- Get reviews for a specific product
-- Params: :product_id
SELECT * FROM reviews WHERE product_id = 1 ORDER BY date DESC;

-- Get all reviews in the system
SELECT * FROM reviews ORDER BY id DESC;


-- ---------------------------------------------------------------------
-- Checkout & Orders
-- ---------------------------------------------------------------------

-- Create a new order
-- Params: :id, :username, :storeName, :status, :date, :items, :amount
INSERT INTO orders (id, username, storeName, status, date, items, amount)
VALUES (
    '#ORD-NP-55432', 
    'user', 
    'Palpa Weaver Cooperatives', 
    'Pending', 
    'Jul 21, 2026', 
    '[{"name": "Gunyu Cholo", "price": 2800, "quantity": 1, "image": "/gunyo-choli.jpg"}]', 
    2800.0
);

-- Retrieve orders for a specific user
-- Params: :username
SELECT * FROM orders WHERE username = 'user' ORDER BY date DESC;

-- Retrieve all orders (administrative check)
SELECT * FROM orders ORDER BY date DESC;

-- Update order status
-- Params: :status, :id
UPDATE orders SET status = 'Shipped' WHERE id = '#ORD-NP-55432';


-- ---------------------------------------------------------------------
-- Coupons & Discounts
-- ---------------------------------------------------------------------

-- Create new coupon code
-- Params: :code, :percent, :creator
INSERT INTO coupons (code, percent, creator) VALUES ('SUMMER25', 25, 'admin');

-- Retrieve coupon details by code
-- Params: :code
SELECT * FROM coupons WHERE code = 'SUMMER25';

-- Get all active coupons
SELECT * FROM coupons;

-- Delete coupon
-- Params: :code
DELETE FROM coupons WHERE code = 'SUMMER25';


-- ---------------------------------------------------------------------
-- Seller Applications & Moderation
-- ---------------------------------------------------------------------

-- Submit a seller application
-- Params: :username, :submittedAt, :storeName, :storeDescription
INSERT INTO seller_applications (username, submittedAt, storeName, storeDescription)
VALUES ('johndoe', '2026-07-21 20:00:00', 'Johns Craft Emporium', 'Selling handcrafted souvenirs from Pokhara');

-- Get all seller applications
SELECT * FROM seller_applications ORDER BY submittedAt DESC;

-- Review / update seller application status
-- Params: :status, :username
UPDATE seller_applications SET status = 'Approved' WHERE username = 'johndoe';


-- ---------------------------------------------------------------------
-- Contact Messages
-- ---------------------------------------------------------------------

-- Add contact inquiry message
-- Params: :name, :email, :phone, :message, :date
INSERT INTO messages (name, email, phone, message, date)
VALUES ('Alice Sen', 'alice@gmail.com', '9812345678', 'Do you ship to Pokhara?', '2026-07-21');

-- Retrieve all contact messages
SELECT * FROM messages ORDER BY id DESC;


-- =====================================================================
-- SECTION 3: ANALYTICS, AUDITING, & BUSINESS REPORTING
-- =====================================================================

-- 1. Total Cumulative Sales Revenue
-- Calculates the sum of all payments received from orders that are completed or shipped.
SELECT SUM(amount) AS total_revenue 
FROM orders 
WHERE status IN ('Completed', 'Shipped');

-- 2. Total Order Count and Average Order Value (AOV)
SELECT 
    COUNT(id) AS total_orders,
    AVG(amount) AS average_order_value,
    SUM(amount) AS gross_sales
FROM orders;

-- 3. Sales Revenue Grouped by Seller (addedBy)
-- Maps products within orders back to their sellers to aggregate seller payouts.
SELECT 
    storeName AS seller_store,
    COUNT(id) AS order_count,
    SUM(amount) AS total_sales
FROM orders 
GROUP BY storeName
ORDER BY total_sales DESC;

-- 4. Most Popular Categories
-- Finds which product categories are selling most and generating highest revenue.
SELECT 
    p.category, 
    COUNT(r.id) AS review_count, 
    AVG(p.price) AS avg_category_price,
    SUM(p.stock) AS total_remaining_stock
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.category
ORDER BY review_count DESC;

-- 5. Top 5 Best-Selling Products (Most Reviews / Popularity indicator)
SELECT 
    p.id, 
    p.name, 
    p.category, 
    p.price,
    COUNT(r.id) AS total_reviews, 
    ROUND(AVG(r.rating), 1) AS average_rating
FROM products p
INNER JOIN reviews r ON p.id = r.product_id
GROUP BY p.id
ORDER BY total_reviews DESC, average_rating DESC
LIMIT 5;

-- 6. Low Stock Inventory Warnings (Restock Alerts)
-- Highlights products with less than 5 units left in stock.
SELECT id, name, category, stock, price, addedBy
FROM products
WHERE stock < 5
ORDER BY stock ASC;

-- 7. High-Risk User / Violation Audit Board
-- Identifies users with violations or those who are currently banned.
SELECT username, name, email, violations, banned, role
FROM users
WHERE violations > 0 OR banned = 1
ORDER BY violations DESC, banned DESC;

-- 8. Customer Satisfaction Report
-- Lists all products with their average review rating and review count.
SELECT 
    p.id AS product_id,
    p.name AS product_name,
    p.category AS category,
    COUNT(r.id) AS total_reviews,
    ROUND(AVG(r.rating), 2) AS average_rating,
    SUM(CASE WHEN r.rating = 5 THEN 1 ELSE 0 END) AS five_star_reviews,
    SUM(CASE WHEN r.rating = 1 THEN 1 ELSE 0 END) AS one_star_reviews
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id
ORDER BY average_rating DESC;

-- 9. Order Status Breakdown
-- Counts current distribution of orders in various parts of the fulfillment pipeline.
SELECT 
    status, 
    COUNT(*) AS count, 
    SUM(amount) AS volume
FROM orders
GROUP BY status
ORDER BY count DESC;
