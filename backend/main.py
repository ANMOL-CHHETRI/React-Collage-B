from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import time
from database import get_db, init_db

# Initialize DB on start
init_db()

app = FastAPI(title="ShopEase Ecommerce API", version="1.0.0")

# CORS middleware config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models for Input Validation ---

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    username: str
    email: str
    password: str

class ChangePasswordRequest(BaseModel):
    role: str
    currentPassword: str
    newPassword: str
    username: str

class UpdateProfileRequest(BaseModel):
    username: str
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    avatar: Optional[str] = None

class ViolationsRequest(BaseModel):
    username: str
    delta: Optional[int] = None
    count: Optional[int] = None

class BanRequest(BaseModel):
    username: str

class ResetPasswordRequest(BaseModel):
    username: str

class PromoteRequest(BaseModel):
    username: str

class MessageCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    message: str

class ProductCreateUpdate(BaseModel):
    name: str
    price: float
    image: str
    images: List[str]
    badge: Optional[str] = None
    stock: int
    category: str
    description: str
    longDescription: str
    addedBy: str

class ReviewCreate(BaseModel):
    name: str
    avatar: str
    rating: int
    date: str
    verified: bool
    title: Optional[str] = ""
    text: str
    helpful: Optional[int] = 0
    user_username: Optional[str] = None

class OrderCreate(BaseModel):
    id: str
    username: str
    storeName: str
    status: str
    date: str
    items: List[dict]
    amount: float

class OrderStatusUpdate(BaseModel):
    status: str

class SellerApplicationCreate(BaseModel):
    storeName: str
    storeDescription: str
    username: str

class ReviewApplicationRequest(BaseModel):
    status: str

class ReportAvatarRequest(BaseModel):
    username: str
    avatar: str

class CouponRequest(BaseModel):
    code: str
    percent: int
    creator: str

# --- Helper functions to serialize sqlite Row objects to Dicts ---

def row_to_user_dict(row):
    return {
        "id": row["id"],
        "name": row["name"],
        "username": row["username"],
        "email": row["email"],
        "phone": row["phone"] or "",
        "address": row["address"] or "",
        "avatar": row["avatar"],
        "violations": row["violations"],
        "banned": bool(row["banned"]),
        "role": row["role"],
        "oneStarReviews": row["one_star_reviews"]
    }

def row_to_product_dict(row):
    try:
        images_list = json.loads(row["images"])
    except:
        images_list = [row["image"]]
        
    return {
        "id": row["id"],
        "name": row["name"],
        "price": row["price"],
        "image": row["image"],
        "images": images_list,
        "badge": row["badge"],
        "stock": row["stock"],
        "category": row["category"],
        "description": row["description"],
        "longDescription": row["longDescription"],
        "addedBy": row["addedBy"]
    }

def row_to_review_dict(row):
    return {
        "id": row["id"],
        "productId": row["product_id"],
        "name": row["name"],
        "avatar": row["avatar"],
        "rating": row["rating"],
        "date": row["date"],
        "verified": bool(row["verified"]),
        "title": row["title"] or "",
        "text": row["text"],
        "helpful": row["helpful"],
        "user_username": row["user_username"]
    }

def row_to_order_dict(row):
    try:
        items_list = json.loads(row["items"])
    except:
        items_list = []
    return {
        "id": row["id"],
        "username": row["username"],
        "storeName": row["storeName"],
        "status": row["status"],
        "date": row["date"],
        "items": items_list,
        "amount": row["amount"]
    }

def row_to_message_dict(row):
    return {
        "id": row["id"],
        "name": row["name"],
        "email": row["email"],
        "phone": row["phone"] or "",
        "message": row["message"],
        "date": row["date"]
    }

def row_to_application_dict(row):
    return {
        "username": row["username"],
        "status": row["status"],
        "submittedAt": row["submittedAt"],
        "storeName": row["storeName"] or "",
        "storeDescription": row["storeDescription"] or ""
    }

def row_to_reported_avatar_dict(row):
    return {
        "username": row["username"],
        "avatar": row["avatar"],
        "date": row["date"]
    }

def row_to_coupon_dict(row):
    return {
        "code": row["code"],
        "percent": row["percent"],
        "creator": row["creator"]
    }

# --- API Routes ---

@app.get("/api/health")
def health_check():
    return {"status": "ok", "timestamp": time.time()}

# 1. Authentication Endpoints

@app.post("/api/auth/login")
def login(req: LoginRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (req.username.strip(),))
    user_row = cursor.fetchone()
    conn.close()
    
    if not user_row:
        raise HTTPException(status_code=400, detail="Invalid username or password")
        
    if user_row["password"] != req.password:
        raise HTTPException(status_code=400, detail="Invalid username or password")
        
    if user_row["banned"]:
        raise HTTPException(status_code=400, detail="Your account has been banned due to violations.")
        
    return row_to_user_dict(user_row)

@app.post("/api/auth/register")
def register(req: RegisterRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if username exists
    cursor.execute("SELECT id FROM users WHERE username = ?", (req.username.strip(),))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Username already exists.")
        
    try:
        cursor.execute("""
        INSERT INTO users (name, username, email, password, phone, address, role)
        VALUES (?, ?, ?, ?, '', '', 'user')
        """, (req.name, req.username.strip(), req.email, req.password))
        conn.commit()
        
        cursor.execute("SELECT * FROM users WHERE username = ?", (req.username.strip(),))
        new_user = cursor.fetchone()
        conn.close()
        return row_to_user_dict(new_user)
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/api/auth/change-password")
def change_password(req: ChangePasswordRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    # Fetch admin and user details to check constraints
    cursor.execute("SELECT * FROM users WHERE username = ?", (req.username,))
    user_row = cursor.fetchone()
    
    if not user_row:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
        
    if user_row["password"] != req.currentPassword:
        conn.close()
        raise HTTPException(status_code=400, detail="Current password is incorrect")
        
    # Cross password verification: User cannot have admin password, Admin cannot have user password
    cursor.execute("SELECT password FROM users WHERE role = 'admin' LIMIT 1")
    admin_pwd = cursor.fetchone()["password"]
    
    cursor.execute("SELECT password FROM users WHERE role = 'user' LIMIT 1")
    user_pwd = cursor.fetchone()["password"]
    
    if req.role == "admin" and req.newPassword == user_pwd:
        conn.close()
        raise HTTPException(status_code=400, detail="Admin password cannot match the user password")
        
    if req.role in ["user", "sub-admin"] and req.newPassword == admin_pwd:
        conn.close()
        raise HTTPException(status_code=400, detail="User password cannot match the admin password")
        
    cursor.execute("UPDATE users SET password = ? WHERE username = ?", (req.newPassword, req.username))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Password updated successfully"}

@app.post("/api/auth/profile")
def update_profile(req: UpdateProfileRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE username = ?", (req.username,))
    user_row = cursor.fetchone()
    if not user_row:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
        
    name = req.name if req.name is not None else user_row["name"]
    email = req.email if req.email is not None else user_row["email"]
    phone = req.phone if req.phone is not None else user_row["phone"]
    address = req.address if req.address is not None else user_row["address"]
    avatar = req.avatar if req.avatar is not None else user_row["avatar"]
    
    cursor.execute("""
    UPDATE users SET name = ?, email = ?, phone = ?, address = ?, avatar = ?
    WHERE username = ?
    """, (name, email, phone, address, avatar, req.username))
    conn.commit()
    
    cursor.execute("SELECT * FROM users WHERE username = ?", (req.username,))
    updated_user = cursor.fetchone()
    conn.close()
    return row_to_user_dict(updated_user)

# 2. Administrative Controls

@app.get("/api/users")
def list_users():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()
    conn.close()
    return [row_to_user_dict(r) for r in rows]

@app.post("/api/users/violations")
def update_violations(req: ViolationsRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT violations FROM users WHERE username = ?", (req.username,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
        
    new_violations = row["violations"]
    if req.delta is not None:
        new_violations = max(0, new_violations + req.delta)
    elif req.count is not None:
        new_violations = max(0, req.count)
        
    cursor.execute("UPDATE users SET violations = ? WHERE username = ?", (new_violations, req.username))
    conn.commit()
    
    # Auto calculate violations if triggered from dashboard: violation = floor(one_star_reviews / 10)
    # If oneStarReviews changed, this can sync
    cursor.execute("SELECT * FROM users WHERE username = ?", (req.username,))
    updated_user = cursor.fetchone()
    conn.close()
    return row_to_user_dict(updated_user)

@app.post("/api/users/ban")
def toggle_ban(req: BanRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT banned FROM users WHERE username = ?", (req.username,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
        
    new_banned = 0 if row["banned"] else 1
    cursor.execute("UPDATE users SET banned = ? WHERE username = ?", (new_banned, req.username))
    conn.commit()
    
    cursor.execute("SELECT * FROM users WHERE username = ?", (req.username,))
    updated_user = cursor.fetchone()
    conn.close()
    return row_to_user_dict(updated_user)

@app.post("/api/users/reset-password")
def reset_password(req: ResetPasswordRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE username = ?", (req.username,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
        
    cursor.execute("UPDATE users SET password = 'shopease123' WHERE username = ?", (req.username,))
    conn.commit()
    conn.close()
    return {"success": True, "message": "User password reset successfully to shopease123"}

@app.post("/api/users/promote")
def promote_user(req: PromoteRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE username = ?", (req.username,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
        
    cursor.execute("UPDATE users SET role = 'sub-admin' WHERE username = ?", (req.username,))
    conn.commit()
    conn.close()
    return {"success": True, "message": "User promoted to sub-admin/seller successfully"}

# 3. Product Resource API

@app.get("/api/products")
def list_products():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products")
    rows = cursor.fetchall()
    conn.close()
    return [row_to_product_dict(r) for r in rows]

@app.post("/api/products")
def create_product(prod: ProductCreateUpdate):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""
        INSERT INTO products (name, price, image, images, badge, stock, category, description, longDescription, addedBy)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            prod.name, prod.price, prod.image, json.dumps(prod.images),
            prod.badge, prod.stock, prod.category, prod.description,
            prod.longDescription, prod.addedBy
        ))
        conn.commit()
        new_id = cursor.lastrowid
        cursor.execute("SELECT * FROM products WHERE id = ?", (new_id,))
        new_prod = cursor.fetchone()
        conn.close()
        return row_to_product_dict(new_prod)
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/products/{id}")
def update_product(id: int, prod: ProductCreateUpdate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM products WHERE id = ?", (id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Product not found")
        
    try:
        cursor.execute("""
        UPDATE products 
        SET name = ?, price = ?, image = ?, images = ?, badge = ?, stock = ?, category = ?, description = ?, longDescription = ?, addedBy = ?
        WHERE id = ?
        """, (
            prod.name, prod.price, prod.image, json.dumps(prod.images),
            prod.badge, prod.stock, prod.category, prod.description,
            prod.longDescription, prod.addedBy, id
        ))
        conn.commit()
        cursor.execute("SELECT * FROM products WHERE id = ?", (id,))
        updated = cursor.fetchone()
        conn.close()
        return row_to_product_dict(updated)
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/products/{id}")
def delete_product(id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM products WHERE id = ?", (id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Product not found")
        
    cursor.execute("DELETE FROM products WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Product deleted successfully"}

# 4. Reviews API

@app.get("/api/reviews/{product_id}")
def get_product_reviews(product_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM reviews WHERE product_id = ? ORDER BY id DESC", (product_id,))
    rows = cursor.fetchall()
    conn.close()
    return [row_to_review_dict(r) for r in rows]

@app.post("/api/reviews/{product_id}")
def create_review(product_id: int, rev: ReviewCreate):
    conn = get_db()
    cursor = conn.cursor()
    
    # Verify product exists
    cursor.execute("SELECT id FROM products WHERE id = ?", (product_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Product not found")
        
    try:
        cursor.execute("""
        INSERT INTO reviews (product_id, name, avatar, rating, date, verified, title, text, helpful, user_username)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            product_id, rev.name, rev.avatar, rev.rating, rev.date,
            1 if rev.verified else 0, rev.title, rev.text, rev.helpful, rev.user_username
        ))
        
        # If the review has 1 star, increment the one_star_reviews count of the reviewer
        if rev.rating == 1 and rev.user_username:
            cursor.execute("UPDATE users SET one_star_reviews = one_star_reviews + 1 WHERE username = ?", (rev.user_username,))
            
            # Recalculate violations automatically: violations = floor(one_star_reviews / 10)
            cursor.execute("SELECT one_star_reviews FROM users WHERE username = ?", (rev.user_username,))
            user_row = cursor.fetchone()
            if user_row:
                new_violations = user_row["one_star_reviews"] // 10
                cursor.execute("UPDATE users SET violations = ? WHERE username = ?", (new_violations, rev.user_username))
                
        conn.commit()
        new_id = cursor.lastrowid
        cursor.execute("SELECT * FROM reviews WHERE id = ?", (new_id,))
        new_rev = cursor.fetchone()
        conn.close()
        return row_to_review_dict(new_rev)
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

# 5. Orders API

@app.get("/api/orders")
def get_orders(username: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    if username:
        cursor.execute("SELECT * FROM orders WHERE username = ? ORDER BY date DESC", (username,))
    else:
        cursor.execute("SELECT * FROM orders ORDER BY date DESC")
    rows = cursor.fetchall()
    conn.close()
    return [row_to_order_dict(r) for r in rows]

@app.post("/api/orders")
def create_order(order: OrderCreate):
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if order ID already exists
    cursor.execute("SELECT id FROM orders WHERE id = ?", (order.id,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Order ID already exists.")
        
    try:
        cursor.execute("""
        INSERT INTO orders (id, username, storeName, status, date, items, amount)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            order.id, order.username, order.storeName, order.status,
            order.date, json.dumps(order.items), order.amount
        ))
        
        # Deduct stock for products ordered
        for item in order.items:
            item_name = item.get("name")
            qty = item.get("quantity", 1)
            cursor.execute("UPDATE products SET stock = MAX(0, stock - ?) WHERE name = ?", (qty, item_name))
            
        conn.commit()
        cursor.execute("SELECT * FROM orders WHERE id = ?", (order.id,))
        new_order = cursor.fetchone()
        conn.close()
        return row_to_order_dict(new_order)
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/orders/{id}/status")
def update_order_status(id: str, body: OrderStatusUpdate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM orders WHERE id = ?", (id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Order not found")
        
    cursor.execute("UPDATE orders SET status = ? WHERE id = ?", (body.status, id))
    conn.commit()
    cursor.execute("SELECT * FROM orders WHERE id = ?", (id,))
    updated = cursor.fetchone()
    conn.close()
    return row_to_order_dict(updated)

# 6. Seller Applications API

@app.post("/api/seller/apply")
def apply_seller(app_details: SellerApplicationCreate):
    conn = get_db()
    cursor = conn.cursor()
    try:
        submitted_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        cursor.execute("""
        INSERT OR REPLACE INTO seller_applications (username, status, submittedAt, storeName, storeDescription)
        VALUES (?, 'Pending', ?, ?, ?)
        """, (app_details.username, submitted_at, app_details.storeName, app_details.storeDescription))
        conn.commit()
        
        cursor.execute("SELECT * FROM seller_applications WHERE username = ?", (app_details.username,))
        row = cursor.fetchone()
        conn.close()
        return row_to_application_dict(row)
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/seller/applications")
def get_seller_applications():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM seller_applications ORDER BY submittedAt DESC")
    rows = cursor.fetchall()
    conn.close()
    return [row_to_application_dict(r) for r in rows]

@app.post("/api/seller/applications/{username}/review")
def review_seller_application(username: str, body: ReviewApplicationRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT username FROM seller_applications WHERE username = ?", (username,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Application not found")
        
    cursor.execute("UPDATE seller_applications SET status = ? WHERE username = ?", (body.status, username))
    
    if body.status == "Approved":
        cursor.execute("UPDATE users SET role = 'sub-admin' WHERE username = ?", (username,))
        
    conn.commit()
    cursor.execute("SELECT * FROM seller_applications WHERE username = ?", (username,))
    updated = cursor.fetchone()
    conn.close()
    return row_to_application_dict(updated)

# 7. Reported Avatars API

@app.post("/api/avatars/report")
def report_avatar(body: ReportAvatarRequest):
    conn = get_db()
    cursor = conn.cursor()
    try:
        date_str = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        cursor.execute("""
        INSERT OR REPLACE INTO reported_avatars (username, avatar, date)
        VALUES (?, ?, ?)
        """, (body.username, body.avatar, date_str))
        conn.commit()
        
        cursor.execute("SELECT * FROM reported_avatars WHERE username = ?", (body.username,))
        row = cursor.fetchone()
        conn.close()
        return row_to_reported_avatar_dict(row)
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/avatars/reported")
def get_reported_avatars():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM reported_avatars ORDER BY date DESC")
    rows = cursor.fetchall()
    conn.close()
    return [row_to_reported_avatar_dict(r) for r in rows]

@app.post("/api/avatars/reported/{username}/dismiss")
def dismiss_avatar_report(username: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM reported_avatars WHERE username = ?", (username,))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Avatar report dismissed successfully"}

@app.delete("/api/avatars/reported/{username}/remove")
def remove_reported_avatar(username: str):
    conn = get_db()
    cursor = conn.cursor()
    # Remove avatar from user profile
    cursor.execute("UPDATE users SET avatar = NULL WHERE username = ?", (username,))
    # Remove from reported list
    cursor.execute("DELETE FROM reported_avatars WHERE username = ?", (username,))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Avatar removed and report cleared successfully"}

# 8. Coupons API

@app.get("/api/coupons")
def list_coupons():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM coupons")
    rows = cursor.fetchall()
    conn.close()
    return [row_to_coupon_dict(r) for r in rows]

@app.post("/api/coupons")
def create_coupon(req: CouponRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if coupon code already exists
    cursor.execute("SELECT code FROM coupons WHERE code = ?", (req.code.upper().strip(),))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Coupon code already exists.")
        
    try:
        cursor.execute("""
        INSERT INTO coupons (code, percent, creator)
        VALUES (?, ?, ?)
        """, (req.code.upper().strip(), req.percent, req.creator))
        conn.commit()
        
        cursor.execute("SELECT * FROM coupons WHERE code = ?", (req.code.upper().strip(),))
        row = cursor.fetchone()
        conn.close()
        return row_to_coupon_dict(row)
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/coupons/{code}")
def delete_coupon(code: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT code FROM coupons WHERE code = ?", (code.upper().strip(),))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Coupon not found")
        
    cursor.execute("DELETE FROM coupons WHERE code = ?", (code.upper().strip(),))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Coupon deleted successfully"}

# 9. Messages API

@app.get("/api/messages")
def list_messages():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM messages ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [row_to_message_dict(r) for r in rows]

@app.post("/api/messages")
def create_message(msg: MessageCreate):
    conn = get_db()
    cursor = conn.cursor()
    try:
        date_str = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        cursor.execute("""
        INSERT INTO messages (name, email, phone, message, date)
        VALUES (?, ?, ?, ?, ?)
        """, (msg.name, msg.email, msg.phone, msg.message, date_str))
        conn.commit()
        new_id = cursor.lastrowid
        cursor.execute("SELECT * FROM messages WHERE id = ?", (new_id,))
        new_msg = cursor.fetchone()
        conn.close()
        return row_to_message_dict(new_msg)
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))
