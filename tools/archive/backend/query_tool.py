import sqlite3
import os
import sys
import argparse

DB_FILE = os.path.join(os.path.dirname(__file__), "shopease.db")

ANALYTICS_QUERIES = {
    "1": {
        "title": "Total Cumulative Sales Revenue",
        "sql": "SELECT SUM(amount) AS total_revenue FROM orders WHERE status IN ('Completed', 'Shipped');"
    },
    "2": {
        "title": "Total Orders and Average Order Value (AOV)",
        "sql": "SELECT COUNT(id) AS total_orders, AVG(amount) AS average_order_value, SUM(amount) AS gross_sales FROM orders;"
    },
    "3": {
        "title": "Sales Revenue Grouped by Seller Store",
        "sql": "SELECT storeName AS seller_store, COUNT(id) AS order_count, SUM(amount) AS total_sales FROM orders GROUP BY storeName ORDER BY total_sales DESC;"
    },
    "4": {
        "title": "Category Performance & Stock Levels",
        "sql": "SELECT p.category, COUNT(r.id) AS review_count, AVG(p.price) AS avg_category_price, SUM(p.stock) AS total_remaining_stock FROM products p LEFT JOIN reviews r ON p.id = r.product_id GROUP BY p.category ORDER BY review_count DESC;"
    },
    "5": {
        "title": "Top 5 Products by Customer Popularity",
        "sql": "SELECT p.id, p.name, p.category, p.price, COUNT(r.id) AS total_reviews, ROUND(AVG(r.rating), 1) AS average_rating FROM products p INNER JOIN reviews r ON p.id = r.product_id GROUP BY p.id ORDER BY total_reviews DESC, average_rating DESC LIMIT 5;"
    },
    "6": {
        "title": "Low Stock Restock Alerts (Stock < 5)",
        "sql": "SELECT id, name, category, stock, price, addedBy FROM products WHERE stock < 5 ORDER BY stock ASC;"
    },
    "7": {
        "title": "High-Risk User & Violation Audit Board",
        "sql": "SELECT username, name, email, violations, banned, role FROM users WHERE violations > 0 OR banned = 1 ORDER BY violations DESC, banned DESC;"
    },
    "8": {
        "title": "Product Customer Satisfaction Report",
        "sql": "SELECT p.id AS product_id, p.name AS product_name, p.category AS category, COUNT(r.id) AS total_reviews, ROUND(AVG(r.rating), 2) AS average_rating, SUM(CASE WHEN r.rating = 5 THEN 1 ELSE 0 END) AS five_star_reviews, SUM(CASE WHEN r.rating = 1 THEN 1 ELSE 0 END) AS one_star_reviews FROM products p LEFT JOIN reviews r ON p.id = r.product_id GROUP BY p.id ORDER BY average_rating DESC;"
    },
    "9": {
        "title": "Order Fulfillment Pipeline Breakdown",
        "sql": "SELECT status, COUNT(*) AS count, SUM(amount) AS volume FROM orders GROUP BY status ORDER BY count DESC;"
    }
}

def get_db():
    if not os.path.exists(DB_FILE):
        print(f"Error: Database file not found at {DB_FILE}")
        print("Please run backend/database.py to initialize and seed the database first.")
        sys.exit(1)
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def print_table(cursor, rows):
    if not rows:
        print("\n[No rows returned / Empty set]\n")
        return
    
    colnames = [desc[0] for desc in cursor.description]
    widths = [len(name) for name in colnames]
    
    for row in rows:
        for idx, val in enumerate(row):
            val_str = str(val if val is not None else "NULL")
            widths[idx] = max(widths[idx], len(val_str))
            
    # Draw top border
    border = "+" + "+".join("-" * (w + 2) for w in widths) + "+"
    print(border)
    
    # Draw header
    header = "|" + "|".join(f" {colnames[idx]:<{widths[idx]}} " for idx in range(len(widths))) + "|"
    print(header)
    print(border)
    
    # Draw rows
    for row in rows:
        row_str = "|" + "|".join(f" {str(row[idx] if row[idx] is not None else 'NULL'):<{widths[idx]}} " for idx in range(len(widths))) + "|"
        print(row_str)
        
    # Draw bottom border
    print(border)
    print(f"Total Rows: {len(rows)}\n")

def run_custom_query():
    print("\nEnter custom SQL query (end with semicolon ';'). Press enter twice to execute or type 'exit' to cancel:")
    lines = []
    while True:
        line = input("> " if not lines else "... ")
        if line.strip().lower() == "exit":
            return
        if not line.strip() and lines:
            break
        lines.append(line)
        if line.strip().endswith(";"):
            break
            
    query = " ".join(lines).strip()
    if not query:
        return
        
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(query)
        if query.lower().startswith("select") or "returning" in query.lower():
            rows = cursor.fetchall()
            print_table(cursor, rows)
        else:
            conn.commit()
            print(f"\nQuery executed successfully. Rows affected: {cursor.rowcount}\n")
    except Exception as e:
        print(f"\nSQL Error: {e}\n")
    finally:
        conn.close()

def list_tables():
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
        tables = cursor.fetchall()
        print("\n--- Database Tables & Row Counts ---")
        rows_summary = []
        for t in tables:
            tname = t["name"]
            c2 = conn.cursor()
            c2.execute(f"SELECT COUNT(*) FROM {tname};")
            count = c2.fetchone()[0]
            rows_summary.append((tname, count))
            
        # Format list manually
        print(f"{'Table Name':<25} | {'Row Count':<10}")
        print("-" * 40)
        for name, cnt in rows_summary:
            print(f"{name:<25} | {cnt:<10}")
        print("\n")
    except Exception as e:
        print(f"Error reading tables: {e}")
    finally:
        conn.close()

def inspect_schema():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
    tables = [r["name"] for r in cursor.fetchall()]
    conn.close()
    
    if not tables:
        print("\nNo tables found in database.\n")
        return
        
    print("\nAvailable Tables:")
    for idx, table in enumerate(tables, 1):
        print(f"{idx}. {table}")
        
    choice = input("\nEnter table number or table name to inspect schema: ").strip()
    target_table = None
    
    if choice.isdigit():
        idx = int(choice) - 1
        if 0 <= idx < len(tables):
            target_table = tables[idx]
    elif choice in tables:
        target_table = choice
        
    if not target_table:
        print("Invalid table selection.")
        return
        
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(f"PRAGMA table_info({target_table});")
        info = cursor.fetchall()
        print(f"\n--- Schema for table '{target_table}' ---")
        print(f"{'CID':<4} | {'Column Name':<20} | {'Type':<12} | {'NotNull':<8} | {'Default':<10} | {'PK':<3}")
        print("-" * 67)
        for col in info:
            print(f"{col['cid']:<4} | {col['name']:<20} | {col['type']:<12} | {col['notnull']:<8} | {str(col['dflt_value']):<10} | {col['pk']:<3}")
        print("\n")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

def run_analytical_reports():
    while True:
        print("\n=== Business Analytics Menu ===")
        for key, val in ANALYTICS_QUERIES.items():
            print(f"{key}. {val['title']}")
        print("B. Back to main menu")
        
        choice = input("\nSelect report number: ").strip()
        if choice.lower() == "b":
            break
        elif choice in ANALYTICS_QUERIES:
            query_info = ANALYTICS_QUERIES[choice]
            print(f"\nRunning: {query_info['title']}...")
            conn = get_db()
            cursor = conn.cursor()
            try:
                cursor.execute(query_info["sql"])
                rows = cursor.fetchall()
                print_table(cursor, rows)
            except Exception as e:
                print(f"Error running report: {e}")
            finally:
                conn.close()
        else:
            print("Invalid choice, please select from the menu.")

def test_database():
    print(f"Initializing query validation tests on: {DB_FILE}")
    conn = get_db()
    cursor = conn.cursor()
    
    # 1. Test basic table integrity
    try:
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [r[0] for r in cursor.fetchall()]
        required_tables = ["users", "products", "reviews", "orders", "seller_applications", "reported_avatars", "coupons", "messages"]
        print(f"Found tables: {tables}")
        for rt in required_tables:
            if rt not in tables:
                print(f"FAILED: Table '{rt}' is missing!")
                sys.exit(1)
            else:
                print(f"SUCCESS: Table '{rt}' checked.")
    except Exception as e:
        print(f"Failed to fetch tables list: {e}")
        sys.exit(1)
        
    # 2. Test each predefined analytical query
    print("\nValidating predefined analytical queries...")
    for idx, (key, query_info) in enumerate(ANALYTICS_QUERIES.items(), 1):
        try:
            cursor.execute(query_info["sql"])
            cursor.fetchall()
            print(f"  {idx}. {query_info['title']}: SUCCESS")
        except Exception as e:
            print(f"  {idx}. {query_info['title']}: FAILED! Error: {e}")
            sys.exit(1)
            
    conn.close()
    print("\nAll database schema checks and test reports passed successfully!\n")
    sys.exit(0)

def main():
    parser = argparse.ArgumentParser(description="ShopEase SQLite Database Query Tool")
    parser.add_argument("--test", action="store_true", help="Run database tables integrity checks and test all reports")
    args = parser.parse_args()
    
    if args.test:
        test_database()
        return

    while True:
        print("=========================================")
        print("      ShopEase SQLite Query Tool         ")
        print("=========================================")
        print(f"Database File: {DB_FILE}")
        print("1. Enter Custom SQL Query")
        print("2. List Tables and Row Counts")
        print("3. Run Prepackaged Analytical Reports")
        print("4. Inspect Table Schema")
        print("5. Exit")
        print("=========================================")
        
        choice = input("Enter choice (1-5): ").strip()
        if choice == "1":
            run_custom_query()
        elif choice == "2":
            list_tables()
        elif choice == "3":
            run_analytical_reports()
        elif choice == "4":
            inspect_schema()
        elif choice == "5":
            print("\nExiting. Thank you!")
            break
        else:
            print("\nInvalid option, please choose 1-5.\n")

if __name__ == "__main__":
    main()
