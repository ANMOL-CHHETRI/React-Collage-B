import { collection, getDocs, writeBatch, doc } from "firebase/firestore"
import { db } from "./firebase"
import { defaultProducts } from "../data/productsData"

const defaultCategories = [
  {
    name: "Traditional Apparel",
    image: "https://i.pinimg.com/736x/89/47/66/8947664cc2390cac2bdac2b4e9ee030b.jpg"
  },
  {
    name: "Organic Tea & Coffee",
    image: "https://i.pinimg.com/736x/56/d0/7f/56d07fba8ab764c361db3999425b48f1.jpg"
  },
  {
    name: "Local Handicrafts",
    image: "https://i.pinimg.com/736x/f2/df/28/f2df28734e8b2f896da2e4c7cad2f354.jpg"
  },
  {
    name: "Herbs & Spices",
    image: "https://i.pinimg.com/736x/28/c6/48/28c648b0a74979111f737955b05d05cd.jpg"
  }
]

const defaultTestimonials = [
  {
    name: "Aarav Sharma",
    location: "Kathmandu",
    text: "Ordered a handwoven Dhaka Topi and Himalayan Coffee. The delivery took just 4 hours in Lalitpur. Outstanding quality and pure Nepalese authenticity!",
    rating: 5,
    avatar: "AS"
  },
  {
    name: "Prerana Giri",
    location: "Pokhara",
    text: "The Himalayan Orthodox tea is incredibly fragrant. I chose Cash on Delivery, and the courier rider was polite. Will order again!",
    rating: 5,
    avatar: "PG"
  }
]

const defaultUsers = [
  {
    name: "ShopEase Admin",
    username: "admin",
    email: "admin@shopease.com",
    password: "admin",
    role: "admin",
    violations: 0,
    banned: false,
    address: "",
    phone: "",
    avatar: null
  },
  {
    name: "Test User",
    username: "user",
    email: "user@shopease.com",
    password: "user",
    role: "user",
    violations: 0,
    banned: false,
    address: "",
    phone: "",
    avatar: null
  }
]

const defaultOrders = [
  {
    orderId: "#ORD-9281",
    username: "user",
    fullName: "Ram Sharma",
    storeName: "ShopEase Nepal",
    status: "Pending",
    date: new Date().toISOString(),
    amount: "Rs. 2,800",
    items: [
      { name: "Gunyu Cholo", price: 2800, quantity: 1, image: "https://i.pinimg.com/736x/89/47/66/8947664cc2390cac2bdac2b4e9ee030b.jpg" }
    ]
  },
  {
    orderId: "#ORD-4192",
    username: "user",
    fullName: "Sita Khadka",
    storeName: "ShopEase Nepal",
    status: "Delivered",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    amount: "Rs. 1,200",
    items: [
      { name: "Premium Dhaka Topi", price: 1200, quantity: 1, image: "https://i.pinimg.com/736x/28/c6/48/28c648b0a74979111f737955b05d05cd.jpg" }
    ]
  }
]

export const seedDatabase = async () => {
  if (!db) {
    console.warn("Firestore db is not initialized, skipping database seeding.")
    return
  }
  try {
    // 1. Seed Categories
    const categoriesCol = collection(db, "categories")
    const categoriesSnap = await getDocs(categoriesCol)
    if (categoriesSnap.empty) {
      console.log("Seeding categories into Firestore...")
      const batch = writeBatch(db)
      defaultCategories.forEach((cat) => {
        const docRef = doc(categoriesCol)
        batch.set(docRef, cat)
      })
      await batch.commit()
      console.log("Categories seeded successfully.")
    }

    // 2. Seed Products
    const productsCol = collection(db, "products")
    const productsSnap = await getDocs(productsCol)
    if (productsSnap.empty) {
      console.log("Seeding products into Firestore...")
      const batch = writeBatch(db)
      defaultProducts.forEach((prod) => {
        const docRef = doc(productsCol, String(prod.id))
        batch.set(docRef, prod)
      })
      await batch.commit()
      console.log("Products seeded successfully.")
    }

    // 3. Seed Testimonials
    const testimonialsCol = collection(db, "testimonials")
    const testimonialsSnap = await getDocs(testimonialsCol)
    if (testimonialsSnap.empty) {
      console.log("Seeding testimonials into Firestore...")
      const batch = writeBatch(db)
      defaultTestimonials.forEach((test) => {
        const docRef = doc(testimonialsCol)
        batch.set(docRef, test)
      })
      await batch.commit()
      console.log("Testimonials seeded successfully.")
    }

    // 4. Seed Users (Admin/Test User)
    const usersCol = collection(db, "users")
    const usersSnap = await getDocs(usersCol)
    if (usersSnap.empty) {
      console.log("Seeding default users into Firestore...")
      const batch = writeBatch(db)
      defaultUsers.forEach((usr) => {
        const docRef = doc(usersCol, usr.username)
        batch.set(docRef, usr)
      })
      await batch.commit()
      console.log("Users seeded successfully.")
    }

    // 5. Seed Orders
    const ordersCol = collection(db, "orders")
    const ordersSnap = await getDocs(ordersCol)
    if (ordersSnap.empty) {
      console.log("Seeding default orders into Firestore...")
      const batch = writeBatch(db)
      defaultOrders.forEach((ord) => {
        const docRef = doc(ordersCol)
        batch.set(docRef, ord)
      })
      await batch.commit()
      console.log("Orders seeded successfully.")
    }

  } catch (error) {
    console.error("Error seeding database: ", error)
  }
}
