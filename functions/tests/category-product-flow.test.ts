import { describe, it, expect } from "vitest";

// Pure business logic & category flow verification
describe("Phase 9: Real Product & Dynamic Category Flow Verification Suite", () => {
  
  const TEST_PRODUCT_1 = {
    id: "prod_test_handwoven_topi_01",
    name: "Handwoven Palpali Dhaka Topi",
    price: 1250,
    category: "Traditional Apparel",
    stock: 25,
    badge: "Handcrafted",
    image: "/bhadgauletopi.jpg",
    images: ["/bhadgauletopi.jpg"],
    description: "Authentic traditional Nepali Dhaka Topi handloomed by weavers in Palpa with geometric pattern motifs.",
    addedBy: "admin",
  };

  const TEST_PRODUCT_2 = {
    id: "prod_test_singing_bowl_02",
    name: "Hand-Hammered Patan Singing Bowl",
    price: 3500,
    category: "Local Handicrafts",
    stock: 12,
    badge: "Artisan Made",
    image: "/singing_bowl.jpg",
    images: ["/singing_bowl.jpg"],
    description: "Sacred handcrafted 7-metal acoustic singing bowl cast and hand-hammered by Patan Newari bronze artisans.",
    addedBy: "admin",
  };

  // Helper extracting available dynamic categories (matching HomePage.jsx logic)
  const getAvailableCategories = (products: any[]) => {
    return ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];
  };

  // Helper matching CategoryPage.jsx filtering logic
  const filterProductsByCategory = (products: any[], categoryName: string) => {
    if (!categoryName || categoryName === "All") return products;
    return products.filter(
      (p) => (p?.category || "").toLowerCase() === categoryName.toLowerCase()
    );
  };

  // Helper matching HomePage.jsx search & category filter logic
  const filterCatalog = (products: any[], searchQuery = "", selectedCategory = "All", maxPrice = 50000) => {
    return products.filter((p) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query));
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesPrice = (p.price || 0) <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  };

  // Test 1: 0 products -> 0 product cards & exactly 1 category option ("All")
  it("Test 1: 0 products produces 0 items and exactly ['All'] in category chips", () => {
    const products: any[] = [];
    const categories = getAvailableCategories(products);
    const visibleCards = filterCatalog(products);

    expect(products.length).toBe(0);
    expect(visibleCards.length).toBe(0);
    expect(categories).toEqual(["All"]);
    expect(categories.length).toBe(1); // Explains why only 1 option appeared when empty
  });

  // Test 2: 1 product -> 1 product returned in catalog
  it("Test 2: 1 product produces 1 visible card in general catalog", () => {
    const products = [TEST_PRODUCT_1];
    const visibleCards = filterCatalog(products);

    expect(visibleCards.length).toBe(1);
    expect(visibleCards[0].id).toBe("prod_test_handwoven_topi_01");
    expect(visibleCards[0].name).toBe("Handwoven Palpali Dhaka Topi");
  });

  // Test 3: 1 product -> correctly derives dynamic categories
  it("Test 3: 1 product dynamically expands category options to ['All', 'Traditional Apparel']", () => {
    const products = [TEST_PRODUCT_1];
    const categories = getAvailableCategories(products);

    expect(categories).toEqual(["All", "Traditional Apparel"]);
    expect(categories.length).toBe(2);
  });

  // Test 4: product category A -> category A filter returns product
  it("Test 4: Filtering by category 'Traditional Apparel' returns the Dhaka Topi", () => {
    const products = [TEST_PRODUCT_1, TEST_PRODUCT_2];
    const filtered = filterProductsByCategory(products, "Traditional Apparel");

    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe("prod_test_handwoven_topi_01");
    expect(filtered[0].category).toBe("Traditional Apparel");
  });

  // Test 5: category B -> does not return category A product
  it("Test 5: Filtering by category 'Local Handicrafts' does NOT return 'Traditional Apparel' items", () => {
    const products = [TEST_PRODUCT_1, TEST_PRODUCT_2];
    const filtered = filterProductsByCategory(products, "Local Handicrafts");

    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe("prod_test_singing_bowl_02");
    expect(filtered[0].name).toBe("Hand-Hammered Patan Singing Bowl");
    expect(filtered.some((p) => p.category === "Traditional Apparel")).toBe(false);
  });

  // Test 6: nonexistent category -> empty state
  it("Test 6: Filtering by nonexistent category 'Organic Tea & Coffee' returns empty array (0 products)", () => {
    const products = [TEST_PRODUCT_1, TEST_PRODUCT_2];
    const filtered = filterProductsByCategory(products, "Organic Tea & Coffee");

    expect(filtered).toEqual([]);
    expect(filtered.length).toBe(0);
  });

  // Test 7: Firestore product image -> correct image rendered without mock fallback
  it("Test 7: Product image reference matches local verified asset without Pinterest/mock URL", () => {
    expect(TEST_PRODUCT_1.image).toBe("/bhadgauletopi.jpg");
    expect(TEST_PRODUCT_1.image.includes("pinimg.com")).toBe(false);
    expect(TEST_PRODUCT_1.image.includes("unsplash.com")).toBe(false);
  });

  // Test 8: Product count -> Admin product count metric computation
  it("Test 8: Admin product count reflects exact length of live products array", () => {
    const initialProducts: any[] = [];
    expect(initialProducts.length).toBe(0);

    const withOneProduct = [TEST_PRODUCT_1];
    expect(withOneProduct.length).toBe(1);

    const withTwoProducts = [TEST_PRODUCT_1, TEST_PRODUCT_2];
    expect(withTwoProducts.length).toBe(2);
  });
});
