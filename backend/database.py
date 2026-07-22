import sqlite3
import json
import os

DB_FILE = os.path.join(os.path.dirname(__file__), "shopease.db")

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # 1. Users Table
    cursor.execute("""
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
    )
    """)
    
    # 2. Products Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT NOT NULL,
        images TEXT NOT NULL, -- JSON serialized list
        badge TEXT,
        stock INTEGER NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        longDescription TEXT NOT NULL,
        addedBy TEXT NOT NULL
    )
    """)
    
    # 3. Reviews Table
    cursor.execute("""
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
    )
    """)
    
    # 4. Orders Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        storeName TEXT NOT NULL,
        status TEXT NOT NULL,
        date TEXT NOT NULL,
        items TEXT NOT NULL, -- JSON serialized list
        amount REAL NOT NULL
    )
    """)
    
    # 5. Seller Applications Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS seller_applications (
        username TEXT PRIMARY KEY,
        status TEXT NOT NULL DEFAULT 'Pending',
        submittedAt TEXT NOT NULL,
        storeName TEXT,
        storeDescription TEXT
    )
    """)
    
    # 6. Reported Avatars Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reported_avatars (
        username TEXT PRIMARY KEY,
        avatar TEXT NOT NULL,
        date TEXT NOT NULL
    )
    """)
    
    # 7. Coupons Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS coupons (
        code TEXT PRIMARY KEY,
        percent INTEGER NOT NULL,
        creator TEXT NOT NULL
    )
    """)

    # 8. Messages Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        date TEXT NOT NULL
    )
    """)
    
    conn.commit()
    
    # --- Database Seeding ---
    
    # Seed default users if empty
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        default_users = [
            ("Admin", "admin", "admin@shopease.com", "admin123", "9800000000", "Kathmandu, Nepal", None, 0, 0, "admin"),
            ("Sahil Tuladhar", "user", "user@test.com", "user123", "9841234567", "New Baneshwor, Kathmandu", None, 0, 0, "user")
        ]
        cursor.executemany("""
        INSERT INTO users (name, username, email, password, phone, address, avatar, violations, banned, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, default_users)
        conn.commit()
        print("Seeded default users.")
        
    # Seed default coupons if empty
    cursor.execute("SELECT COUNT(*) FROM coupons")
    if cursor.fetchone()[0] == 0:
        default_coupons = [
            ("FESTIVAL20", 20, "admin"),
            ("NEPAL10", 10, "admin")
        ]
        cursor.executemany("""
        INSERT INTO coupons (code, percent, creator)
        VALUES (?, ?, ?)
        """, default_coupons)
        conn.commit()
        print("Seeded default coupons.")

    # Seed default products if empty
    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] == 0:
        default_products = [
            {
                "id": 1,
                "name": "Premium Dhaka Topi (Handwoven)",
                "price": 1200.0,
                "image": "https://i.pinimg.com/736x/d4/16/12/d41612e4db1ef4157d6e3f11e4b832c0.jpg",
                "images": ["https://i.pinimg.com/736x/d4/16/12/d41612e4db1ef4157d6e3f11e4b832c0.jpg", "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg"],
                "badge": "Best Seller",
                "stock": 25,
                "category": "Traditional Apparel",
                "description": "Authentic hand-loomed Dhaka Topi from Palpa, carefully woven by skilled artisans using traditional techniques.",
                "longDescription": "Celebrate Nepalese heritage with this authentic handwoven Dhaka Topi, crafted by skilled artisans in Palpa using traditional weaving techniques passed down through generations. Made from premium-quality Dhaka fabric, this iconic cap is lightweight, comfortable, and durable. It is a perfect choice for festivals, weddings, formal events, cultural celebrations, or everyday traditional wear. Every purchase supports local craftsmen while helping preserve Nepal's rich textile traditions.",
                "addedBy": "admin"
            },
            {
                "id": 2,
                "name": "Himalayan Orthodox Golden Tea",
                "price": 850.0,
                "image": "https://i.pinimg.com/736x/56/d0/7f/56d07fba8ab764c361db3999425b48f1.jpg",
                "images": ["https://i.pinimg.com/736x/56/d0/7f/56d07fba8ab764c361db3999425b48f1.jpg"],
                "badge": "Organic",
                "stock": 0,
                "category": "Organic Tea & Coffee",
                "description": "Premium black tea hand-picked from the high-altitude hills of Ilam, Nepal.",
                "longDescription": "Harvested from the lush tea gardens of Ilam, this premium Himalayan Orthodox Golden Tea offers a rich aroma, smooth flavor, and naturally sweet finish. Carefully hand-picked and processed using traditional methods, every cup delivers exceptional freshness and quality. Rich in antioxidants, it is perfect for relaxing mornings or refreshing evening tea breaks while experiencing the authentic taste of Nepal.",
                "addedBy": "admin"
            },
            {
                "id": 3,
                "name": "Handmade Shakyamuni Buddha Statue",
                "price": 18500.0,
                "image": "https://i.pinimg.com/736x/f2/df/28/f2df28734e8b2f896da2e4c7cad2f354.jpg",
                "images": ["https://i.pinimg.com/736x/f2/df/28/f2df28734e8b2f896da2e4c7cad2f354.jpg"],
                "badge": "Handcrafted",
                "stock": 5,
                "category": "Local Handicrafts",
                "description": "Exquisite copper statue with 24k gold gilding, handcrafted by master artisans in Patan.",
                "longDescription": "This beautifully handcrafted Shakyamuni Buddha statue is created by experienced artisans in Patan, Nepal, using traditional metalworking techniques. Featuring detailed craftsmanship and elegant 24k gold gilding, it symbolizes peace, wisdom, and compassion. Ideal for meditation spaces, temples, home décor, or as a meaningful cultural gift, this masterpiece reflects Nepal's centuries-old artistic heritage.",
                "addedBy": "admin"
            },
            {
                "id": 4,
                "name": "Organic Wild Himalayan Honey",
                "price": 1500.0,
                "image": "https://i.pinimg.com/736x/aa/a0/66/aaa066bd92f5721e603358173e219353.jpg",
                "images": ["https://i.pinimg.com/736x/aa/a0/66/aaa066bd92f5721e603358173e219353.jpg"],
                "badge": "Pure & Raw",
                "stock": 12,
                "category": "Herbs & Spices",
                "description": "100% pure raw honey harvested from the wild cliffs of Annapurna region.",
                "longDescription": "Collected from the pristine Himalayan cliffs of the Annapurna region, this raw wild honey is completely natural and free from artificial additives. It retains its rich nutrients, natural enzymes, and unique floral aroma, making it both delicious and nutritious. Perfect as a natural sweetener, a healthy breakfast companion, or a traditional wellness remedy.",
                "addedBy": "admin"
            },
            {
                "id": 5,
                "name": "Pure Pashmina Cashmere Shawl",
                "price": 9500.0,
                "image": "/pashmina_shawl.png",
                "images": ["/pashmina_shawl.png"],
                "badge": "Premium Quality",
                "stock": 8,
                "category": "Traditional Apparel",
                "description": "Ultra-soft, warm, and authentic Chyangra Pashmina shawl hand-woven in Kathmandu Valley.",
                "longDescription": "Crafted from authentic Chyangra Pashmina wool, this luxurious cashmere shawl is handwoven by skilled artisans in Kathmandu Valley. Known for its exceptional softness, warmth, and lightweight feel, it complements both traditional and modern outfits. Whether worn during winter or gifted to someone special, this elegant shawl represents timeless Nepalese craftsmanship.",
                "addedBy": "admin"
            },
            {
                "id": 6,
                "name": "Gorkha Khukuri (Authentic Service)",
                "price": 4500.0,
                "image": "https://i.pinimg.com/736x/09/41/ae/0941aefdc7b7a3151698e1c3dcc3853d.jpg",
                "images": ["https://i.pinimg.com/736x/09/41/ae/0941aefdc7b7a3151698e1c3dcc3853d.jpg"],
                "badge": "Artisanal",
                "stock": 10,
                "category": "Local Handicrafts",
                "description": "Genuine hand-forged steel Khukuri, crafted by traditional blacksmiths of Nepal.",
                "longDescription": "Inspired by the legendary weapon of the Gurkhas, this authentic hand-forged Khukuri is produced by experienced blacksmiths using traditional techniques. Featuring a durable steel blade and handcrafted wooden handle, it serves as both a practical utility tool and a treasured collector's item. It also represents Nepal's bravery, history, and cultural identity.",
                "addedBy": "admin"
            },
            {
                "id": 7,
                "name": "Organic Himalayan Cardamom (Alaichi)",
                "price": 650.0,
                "image": "https://i.pinimg.com/736x/28/c6/48/28c648b0a74979111f737955b05d05cd.jpg",
                "images": ["https://i.pinimg.com/736x/28/c6/48/28c648b0a74979111f737955b05d05cd.jpg"],
                "badge": "Fresh Spice",
                "stock": 45,
                "category": "Herbs & Spices",
                "description": "High-grade, aromatic large cardamom pods harvested in the Eastern hills of Taplejung.",
                "longDescription": "Carefully cultivated in the fertile hills of Taplejung, this premium Himalayan cardamom is renowned for its bold aroma and rich smoky flavor. It enhances a wide variety of dishes, teas, desserts, and traditional recipes while adding authentic Himalayan freshness. Naturally dried and packed to preserve quality, it is an essential spice for every kitchen.",
                "addedBy": "admin"
            },
            {
                "id": 8,
                "name": "Mt. Everest Arabica Coffee Beans",
                "price": 1100.0,
                "image": "https://i.pinimg.com/736x/63/0d/01/630d013345d875610fec89f4c28dd2b6.jpg",
                "images": ["https://i.pinimg.com/736x/63/0d/01/630d013345d875610fec89f4c28dd2b6.jpg"],
                "badge": "Single Origin",
                "stock": 30,
                "category": "Organic Tea & Coffee",
                "description": "Organic single-origin Arabica beans grown in the high altitude volcanic soils of Nuwakot.",
                "longDescription": "Experience the rich aroma and smooth taste of Nepal's premium single-origin Arabica coffee. Carefully cultivated in the fertile highlands of Nuwakot, these organically grown beans are handpicked, naturally processed, and expertly roasted to preserve their unique flavor. Every cup delivers notes of chocolate, caramel, and subtle fruity undertones, making it an excellent choice for coffee lovers seeking an authentic Himalayan coffee experience.",
                "addedBy": "admin"
            },
            {
                "id": 9,
                "name": "Traditional Daura Suruwal Set",
                "price": 3500.0,
                "image": "/daura_suruwal.jpg",
                "images": ["/daura_suruwal.jpg"],
                "badge": "New Arrival",
                "stock": 20,
                "category": "Traditional Apparel",
                "description": "Authentic Nepali Daura Suruwal made from premium cotton.",
                "longDescription": "The Daura Suruwal is Nepal's national dress, representing centuries of culture and tradition. This premium cotton set is tailored for both comfort and elegance, making it ideal for festivals, weddings, official ceremonies, and cultural events. Its breathable fabric and fine stitching ensure durability while maintaining the timeless beauty of traditional Nepali attire.",
                "addedBy": "admin"
            },
            {
                "id": 10,
                "name": "Gunyu Cholo",
                "price": 2800.0,
                "image": "/gunyo-choli.jpg",
                "images": ["/gunyo-choli.jpg"],
                "badge": "Traditional",
                "stock": 15,
                "category": "Traditional Apparel",
                "description": "Traditional Nepali women's dress handcrafted with quality fabric.",
                "longDescription": "Gunyu Cholo is a cherished traditional dress worn by Nepali women during cultural ceremonies, festivals, and family celebrations. Carefully handcrafted using premium-quality fabric, it combines elegance with comfort while preserving Nepal's rich cultural heritage. The beautiful design and fine craftsmanship make it a meaningful addition to any traditional wardrobe.",
                "addedBy": "admin"
            },
            {
                "id": 11,
                "name": "Haku Patasi",
                "price": 3200.0,
                "image": "/hakupatasi.jpg",
                "images": ["/hakupatasi.jpg"],
                "badge": "Handwoven",
                "stock": 10,
                "category": "Traditional Apparel",
                "description": "Traditional Newari black and red sari, handwoven in Nepal.",
                "longDescription": "Haku Patasi is one of the most iconic traditional garments of the Newar community. Woven with striking black fabric and vibrant red borders, it reflects elegance, cultural pride, and centuries of craftsmanship. Perfect for traditional ceremonies, festivals, and cultural performances, this handwoven attire beautifully showcases Nepal's living heritage.",
                "addedBy": "admin"
            },
            {
                "id": 12,
                "name": "Traditional Bhadgaule Topi",
                "price": 950.0,
                "image": "/bhadgauletopi.jpg",
                "images": ["/bhadgauletopi.jpg"],
                "badge": "Cultural",
                "stock": 50,
                "category": "Traditional Apparel",
                "description": "Classic black Bhadgaule Topi handcrafted in Bhaktapur, a timeless symbol of Nepali tradition.",
                "longDescription": "Handcrafted in the historic city of Bhaktapur, the Bhadgaule Topi is a timeless symbol of Nepali identity and cultural heritage. Made using traditional techniques and premium-quality fabric, it offers exceptional comfort and durability. Whether worn during national celebrations, religious festivals, or formal occasions, this elegant cap proudly represents Nepalese tradition.",
                "addedBy": "admin"
            },
            {
                "id": 13,
                "name": "Handwoven Dhaka Saree",
                "price": 6500.0,
                "image": "/dhakasaree.jpg",
                "images": ["/dhakasaree.jpg"],
                "badge": "Handwoven",
                "stock": 5,
                "category": "Traditional Apparel",
                "description": "Beautiful Dhaka saree woven with traditional Nepali patterns, ideal for festivals and special occasions.",
                "longDescription": "This elegant handwoven Dhaka Saree is crafted using authentic Nepali weaving techniques and vibrant traditional patterns. Its lightweight fabric, intricate designs, and exceptional craftsmanship make it an excellent choice for weddings, festivals, religious ceremonies, and formal events. Every saree supports skilled local artisans while celebrating Nepal's rich textile heritage.",
                "addedBy": "admin"
            },
            {
                "id": 14,
                "name": "Hand-Carved Wooden Peacock Window",
                "price": 12500.0,
                "image": "/peacock_window.jpg",
                "images": ["/peacock_window.jpg"],
                "badge": "Artisanal",
                "stock": 3,
                "category": "Local Handicrafts",
                "description": "Intricately carved wooden peacock window, a classic masterpiece of Newari architecture.",
                "longDescription": "Inspired by the world-famous Peacock Window of Bhaktapur, this handcrafted wooden artwork showcases the exceptional skill of Newari woodcarvers. Each intricate detail is carved by hand, making every piece unique. Ideal as a decorative wall piece or cultural souvenir, it brings the beauty of Nepalese architecture and craftsmanship into your home.",
                "addedBy": "admin"
            },
            {
                "id": 15,
                "name": "Pure Shilajit Resin from Himalayas",
                "price": 2400.0,
                "image": "/shilajit.jpg",
                "images": ["/shilajit.jpg"],
                "badge": "Organic",
                "stock": 18,
                "category": "Herbs & Spices",
                "description": "100% pure Himalayan Shilajit, sustainably sourced from high altitude rocks.",
                "longDescription": "Our premium Himalayan Shilajit resin is carefully harvested from the pristine high-altitude mountains of Nepal using sustainable collection methods. Naturally rich in fulvic acid and essential minerals, it has been valued in traditional wellness practices for generations. Every batch is carefully purified to maintain its natural quality while preserving its authentic Himalayan origin.",
                "addedBy": "admin"
            },
            {
                "id": 16,
                "name": "Nepali Singing Bowl Set",
                "price": 4200.0,
                "image": "/singing_bowl.jpg",
                "images": ["/singing_bowl.jpg"],
                "badge": "Healing",
                "stock": 22,
                "category": "Local Handicrafts",
                "description": "Hand-hammered brass singing bowl set for meditation and sound healing.",
                "longDescription": "This authentic hand-hammered singing bowl set is crafted by experienced artisans in Nepal using traditional techniques. Producing deep, soothing vibrations, it is widely used for meditation, yoga, mindfulness, and sound healing practices. The elegant craftsmanship and rich resonance make it a meaningful addition to any meditation space or thoughtful cultural gift.",
                "addedBy": "admin"
            }
        ]
        
        for p in default_products:
            cursor.execute("""
            INSERT INTO products (id, name, price, image, images, badge, stock, category, description, longDescription, addedBy)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                p["id"], p["name"], p["price"], p["image"],
                json.dumps(p["images"]), p["badge"], p["stock"],
                p["category"], p["description"], p["longDescription"], p["addedBy"]
            ))
        conn.commit()
        print("Seeded default products.")
        
    # Seed default reviews if empty
    cursor.execute("SELECT COUNT(*) FROM reviews")
    if cursor.fetchone()[0] == 0:
        default_reviews = [
            (1, "Priya Sharma", "PS", 5, "June 12, 2025", 1, "Absolutely love it!", "The quality is outstanding. Exactly as described and beautifully packaged. Will definitely buy again!", 24, None),
            (1, "Rohan Thapa", "RT", 4, "May 28, 2025", 1, "Great product, fast delivery", "Very happy with this purchase. The craftsmanship is excellent. Shipping was quicker than expected.", 18, None),
            (1, "Anita Gurung", "AG", 5, "May 15, 2025", 0, "Authentic Nepali quality", "This is exactly what I was looking for. The authenticity and detail is remarkable. Highly recommend!", 31, None),
            (2, "Bikram Rai", "BR", 3, "April 30, 2025", 1, "Good but slightly small", "Quality is good but the size was a little smaller than I expected. Still a good buy for the price.", 7, None),
            (2, "Sushma Karki", "SK", 5, "April 10, 2025", 1, "Perfect gift!", "Bought this as a gift and the recipient absolutely loved it. Beautiful packaging and premium feel.", 42, None),
        ]
        cursor.executemany("""
        INSERT INTO reviews (product_id, name, avatar, rating, date, verified, title, text, helpful, user_username)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, default_reviews)
        conn.commit()
        print("Seeded default reviews.")
        
    # Seed default orders if empty
    cursor.execute("SELECT COUNT(*) FROM orders")
    if cursor.fetchone()[0] == 0:
        default_orders = [
            (
                "#ORD-NP-92841",
                "user",
                "Palpa Weaver Cooperatives",
                "Completed",
                "Jun 15, 2026",
                json.dumps([{
                    "name": "Premium Dhaka Topi (Handwoven)",
                    "price": 1200,
                    "quantity": 1,
                    "image": "https://i.pinimg.com/736x/d4/16/12/d41612e4db1ef4157d6e3f11e4b832c0.jpg"
                }]),
                1200.0
            ),
            (
                "#ORD-NP-81724",
                "user",
                "Ilam Tea Gardens",
                "Completed",
                "Jun 10, 2026",
                json.dumps([{
                    "name": "Himalayan Orthodox Golden Tea",
                    "price": 850,
                    "quantity": 2,
                    "image": "https://i.pinimg.com/736x/56/d0/7f/56d07fba8ab764c361db3999425b48f1.jpg"
                }]),
                1700.0
            ),
            (
                "#ORD-NP-73918",
                "user",
                "Patan Craft Cooperatives",
                "To Ship",
                "Jun 20, 2026",
                json.dumps([{
                    "name": "Handmade Shakyamuni Buddha Statue",
                    "price": 18500,
                    "quantity": 1,
                    "image": "https://i.pinimg.com/736x/f2/df/28/f2df28734e8b2f896da2e4c7cad2f354.jpg"
                }]),
                18500.0
            )
        ]
        cursor.executemany("""
        INSERT INTO orders (id, username, storeName, status, date, items, amount)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, default_orders)
        conn.commit()
        print("Seeded default orders.")
        
    conn.close()

if __name__ == "__main__":
    init_db()
