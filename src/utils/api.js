import { collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, deleteDoc, query, where, increment } from "firebase/firestore";
import { db } from "./firebase";

let isConnected = true;
let connectionListeners = [];

export const onConnectionChange = (listener) => {
  connectionListeners.push(listener);
  listener(isConnected);
  return () => {
    connectionListeners = connectionListeners.filter(l => l !== listener);
  };
};

const setConnected = (status) => {
  if (isConnected !== status) {
    isConnected = status;
    connectionListeners.forEach(l => l(isConnected));
  }
};

export const checkBackendHealth = async () => {
  try {
    if (!db) {
      setConnected(false);
      return false;
    }
    // A simple read to verify connection
    await getDoc(doc(db, "_health", "check"));
    setConnected(true);
    return true;
  } catch (e) {
    setConnected(false);
    return false;
  }
};

// Start periodic health checks
checkBackendHealth();
setInterval(checkBackendHealth, 30000);

const mapDoc = (docSnap) => ({ id: docSnap.id, ...docSnap.data() });

export const api = {
  // Authentication
  login: async (username, password) => {
    if (!db) throw new Error("Firestore database is not initialized. Check your Firebase credentials in .env");
    const q = query(collection(db, "users"), where("username", "==", username));
    const snap = await getDocs(q);
    if (snap.empty) throw new Error("Invalid user credentials");
    const userDoc = snap.docs[0];
    const userData = userDoc.data();
    if (userData.password !== password) throw new Error("Invalid user credentials");
    if (userData.banned) throw new Error("Your account has been banned due to violations.");
    return { id: userDoc.id, ...userData };
  },
  
  register: async (name, username, email, password) => {
    if (!db) throw new Error("Firestore database is not initialized. Check your Firebase credentials in .env");
    const q = query(collection(db, "users"), where("username", "==", username));
    const snap = await getDocs(q);
    if (!snap.empty) throw new Error("Username already exists.");
    
    const newUser = { name, username, email, password, role: "user", violations: 0, banned: false, address: "", phone: "", avatar: null, createdAt: new Date().toISOString() };
    const docRef = doc(collection(db, "users"), username);
    await setDoc(docRef, newUser);
    return { id: username, ...newUser };
  },
  
  changePassword: async (role, currentPassword, newPassword, username) => {
    if (!db) throw new Error("Firestore database is not initialized.");
    if (!username) throw new Error("Username required");
    const userRef = doc(db, "users", username);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("User not found");
    if (userSnap.data().password !== currentPassword) throw new Error("Current password is incorrect");
    
    await updateDoc(userRef, { password: newPassword });
    return { success: true, message: "Password updated successfully" };
  },
  
  updateProfile: async (username, updatedDetails) => {
    if (!db) return updatedDetails;
    const userRef = doc(db, "users", username);
    await updateDoc(userRef, updatedDetails);
    const snap = await getDoc(userRef);
    return { id: snap.id, ...snap.data() };
  },

  // Products
  getProducts: async () => {
    if (!db) return [];
    const snap = await getDocs(collection(db, "products"));
    return snap.docs.map(mapDoc).sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));
  },
  
  createProduct: async (product) => {
    if (!db) throw new Error("Firestore database is not initialized.");
    const newProduct = { ...product, createdAt: new Date().toISOString() };
    const docRef = await addDoc(collection(db, "products"), newProduct);
    return { id: docRef.id, ...newProduct };
  },
  
  updateProduct: async (id, updates) => {
    if (!db) throw new Error("Firestore database is not initialized.");
    const prodRef = doc(db, "products", id);
    await updateDoc(prodRef, updates);
    const snap = await getDoc(prodRef);
    return { id: snap.id, ...snap.data() };
  },
  
  deleteProduct: async (id) => {
    if (!db) throw new Error("Firestore database is not initialized.");
    await deleteDoc(doc(db, "products", id));
    return true;
  },

  // Reviews
  getReviews: async (productId) => {
    if (!db) return [];
    const q = query(collection(db, "reviews"), where("productId", "==", productId));
    const snap = await getDocs(q);
    return snap.docs.map(mapDoc).sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));
  },
  
  addReview: async (productId, review) => {
    if (!db) throw new Error("Firestore database is not initialized.");
    const newReview = { ...review, productId, createdAt: new Date().toISOString() };
    const docRef = await addDoc(collection(db, "reviews"), newReview);
    return { id: docRef.id, ...newReview };
  },

  // Orders
  getOrders: async (username = null) => {
    if (!db) return [];
    let q = collection(db, "orders");
    if (username) {
      q = query(q, where("username", "==", username));
    }
    const snap = await getDocs(q);
    const orders = snap.docs.map(mapDoc);
    return orders.sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));
  },
  
  createOrder: async (order) => {
    if (!db) throw new Error("Firestore database is not initialized.");
    const newOrder = { ...order, createdAt: new Date().toISOString() };
    const docRef = await addDoc(collection(db, "orders"), newOrder);
    return { id: docRef.id, ...newOrder };
  },
  
  updateOrderStatus: async (id, status) => {
    if (!db) throw new Error("Firestore database is not initialized.");
    await updateDoc(doc(db, "orders", id), { status });
    return true;
  },

  // Seller Applications
  applySeller: async (details) => {
    if (!db) throw new Error("Firestore database is not initialized.");
    const newDetails = { ...details, status: "Pending", createdAt: new Date().toISOString() };
    const docRef = await addDoc(collection(db, "sellerApplications"), newDetails);
    return { id: docRef.id, ...newDetails };
  },
  
  getSellerApplications: async () => {
    if (!db) return [];
    const snap = await getDocs(collection(db, "sellerApplications"));
    return snap.docs.map(mapDoc).sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));
  },
  
  reviewSellerApplication: async (username, status) => {
    if (!db) throw new Error("Firestore database is not initialized.");
    const q = query(collection(db, "sellerApplications"), where("username", "==", username));
    const snap = await getDocs(q);
    if (snap.empty) throw new Error("Application not found");
    const appDoc = snap.docs[0];
    await updateDoc(appDoc.ref, { status });
    return { id: appDoc.id, ...appDoc.data(), status };
  },

  // Reported Avatars
  reportAvatar: async (username, avatar) => {
    if (!db) throw new Error("Firestore database is not initialized.");
    const docRef = await addDoc(collection(db, "reportedAvatars"), { username, avatar, date: new Date().toISOString() });
    return { id: docRef.id, username, avatar };
  },
  
  getReportedAvatars: async () => {
    if (!db) return [];
    const snap = await getDocs(collection(db, "reportedAvatars"));
    return snap.docs.map(mapDoc).sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));
  },
  
  dismissAvatarReport: async (username) => {
    if (!db) return true;
    const q = query(collection(db, "reportedAvatars"), where("username", "==", username));
    const snap = await getDocs(q);
    for (const docSnap of snap.docs) {
      await deleteDoc(docSnap.ref);
    }
    return true;
  },
  
  removeReportedAvatar: async (username) => {
    if (!db) return true;
    await api.dismissAvatarReport(username);
    await updateDoc(doc(db, "users", username), { avatar: null });
    return true;
  },

  // Administrative / Users
  getUsers: async () => {
    if (!db) return [];
    const snap = await getDocs(collection(db, "users"));
    return snap.docs.map(mapDoc).sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));
  },
  
  updateUserViolations: async (username, delta) => {
    if (!db) return null;
    const userRef = doc(db, "users", username);
    await updateDoc(userRef, { violations: increment(delta) });
    const snap = await getDoc(userRef);
    return mapDoc(snap);
  },
  
  setExactUserViolations: async (username, count) => {
    if (!db) return null;
    const userRef = doc(db, "users", username);
    await updateDoc(userRef, { violations: count });
    const snap = await getDoc(userRef);
    return mapDoc(snap);
  },
  
  toggleUserBan: async (username) => {
    if (!db) return null;
    const userRef = doc(db, "users", username);
    const snap = await getDoc(userRef);
    const currentStatus = snap.data().banned;
    await updateDoc(userRef, { banned: !currentStatus });
    const newSnap = await getDoc(userRef);
    return mapDoc(newSnap);
  },
  
  adminResetUserPassword: async (username) => {
    if (!db) throw new Error("Firestore database is not initialized.");
    const userRef = doc(db, "users", username);
    await updateDoc(userRef, { password: "shopease123" });
    return true;
  },
  
  promoteToSubAdmin: async (username) => {
    if (!db) throw new Error("Firestore database is not initialized.");
    const userRef = doc(db, "users", username);
    await updateDoc(userRef, { role: "sub-admin" });
    return true;
  },

  // Coupons
  getCoupons: async () => {
    if (!db) return [];
    const snap = await getDocs(collection(db, "coupons"));
    return snap.docs.map(mapDoc).sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));
  },
  
  createCoupon: async (coupon) => {
    if (!db) throw new Error("Firestore database is not initialized.");
    const newCoupon = { ...coupon, createdAt: new Date().toISOString() };
    const docRef = await addDoc(collection(db, "coupons"), newCoupon);
    return { id: docRef.id, ...newCoupon };
  },
  
  deleteCoupon: async (code) => {
    if (!db) return true;
    const q = query(collection(db, "coupons"), where("code", "==", code));
    const snap = await getDocs(q);
    for (const docSnap of snap.docs) {
      await deleteDoc(docSnap.ref);
    }
    return true;
  },

  // Messages
  getMessages: async () => {
    if (!db) return [];
    const snap = await getDocs(collection(db, "messages"));
    return snap.docs.map(mapDoc).sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));
  },
  
  createMessage: async (msg) => {
    if (!db) throw new Error("Firestore database is not initialized.");
    const newMsg = { ...msg, createdAt: new Date().toISOString() };
    const docRef = await addDoc(collection(db, "messages"), newMsg);
    return { id: docRef.id, ...newMsg };
  }
};
