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
    const q = query(collection(db, "users"), where("username", "==", username));
    const snap = await getDocs(q);
    if (!snap.empty) throw new Error("Username already exists.");
    
    const newUser = { name, username, email, password, role: "user", violations: 0, banned: false, address: "", phone: "", avatar: null };
    const docRef = doc(collection(db, "users"), username); // use username as doc ID for easy lookup
    await setDoc(docRef, newUser);
    return { id: username, ...newUser };
  },
  
  changePassword: async (role, currentPassword, newPassword, username) => {
    if (!username) throw new Error("Username required");
    const userRef = doc(db, "users", username);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("User not found");
    if (userSnap.data().password !== currentPassword) throw new Error("Current password is incorrect");
    
    await updateDoc(userRef, { password: newPassword });
    return { success: true, message: "Password updated successfully" };
  },
  
  updateProfile: async (username, updatedDetails) => {
    const userRef = doc(db, "users", username);
    await updateDoc(userRef, updatedDetails);
    const snap = await getDoc(userRef);
    return { id: snap.id, ...snap.data() };
  },

  // Products
  getProducts: async () => {
    const snap = await getDocs(collection(db, "products"));
    return snap.docs.map(mapDoc);
  },
  
  createProduct: async (product) => {
    const docRef = await addDoc(collection(db, "products"), product);
    return { id: docRef.id, ...product };
  },
  
  updateProduct: async (id, updates) => {
    const prodRef = doc(db, "products", id);
    await updateDoc(prodRef, updates);
    const snap = await getDoc(prodRef);
    return { id: snap.id, ...snap.data() };
  },
  
  deleteProduct: async (id) => {
    await deleteDoc(doc(db, "products", id));
    return true;
  },

  // Reviews
  getReviews: async (productId) => {
    const q = query(collection(db, "reviews"), where("productId", "==", productId));
    const snap = await getDocs(q);
    return snap.docs.map(mapDoc);
  },
  
  addReview: async (productId, review) => {
    const docRef = await addDoc(collection(db, "reviews"), { ...review, productId });
    return { id: docRef.id, ...review, productId };
  },

  // Orders
  getOrders: async (username = null) => {
    let q = collection(db, "orders");
    if (username) {
      q = query(q, where("username", "==", username));
    }
    const snap = await getDocs(q);
    return snap.docs.map(mapDoc);
  },
  
  createOrder: async (order) => {
    const docRef = await addDoc(collection(db, "orders"), order);
    return { id: docRef.id, ...order };
  },
  
  updateOrderStatus: async (id, status) => {
    await updateDoc(doc(db, "orders", id), { status });
    return true;
  },

  // Seller Applications
  applySeller: async (details) => {
    const docRef = await addDoc(collection(db, "sellerApplications"), { ...details, status: "Pending" });
    return { id: docRef.id, ...details, status: "Pending" };
  },
  
  getSellerApplications: async () => {
    const snap = await getDocs(collection(db, "sellerApplications"));
    return snap.docs.map(mapDoc);
  },
  
  reviewSellerApplication: async (username, status) => {
    const q = query(collection(db, "sellerApplications"), where("username", "==", username));
    const snap = await getDocs(q);
    if (snap.empty) throw new Error("Application not found");
    const appDoc = snap.docs[0];
    await updateDoc(appDoc.ref, { status });
    return { id: appDoc.id, ...appDoc.data(), status };
  },

  // Reported Avatars
  reportAvatar: async (username, avatar) => {
    const docRef = await addDoc(collection(db, "reportedAvatars"), { username, avatar, date: new Date().toISOString() });
    return { id: docRef.id, username, avatar };
  },
  
  getReportedAvatars: async () => {
    const snap = await getDocs(collection(db, "reportedAvatars"));
    return snap.docs.map(mapDoc);
  },
  
  dismissAvatarReport: async (username) => {
    const q = query(collection(db, "reportedAvatars"), where("username", "==", username));
    const snap = await getDocs(q);
    for (const docSnap of snap.docs) {
      await deleteDoc(docSnap.ref);
    }
    return true;
  },
  
  removeReportedAvatar: async (username) => {
    await api.dismissAvatarReport(username);
    await updateDoc(doc(db, "users", username), { avatar: null });
    return true;
  },

  // Administrative / Users
  getUsers: async () => {
    const snap = await getDocs(collection(db, "users"));
    return snap.docs.map(mapDoc);
  },
  
  updateUserViolations: async (username, delta) => {
    const userRef = doc(db, "users", username);
    await updateDoc(userRef, { violations: increment(delta) });
    const snap = await getDoc(userRef);
    return mapDoc(snap);
  },
  
  setExactUserViolations: async (username, count) => {
    const userRef = doc(db, "users", username);
    await updateDoc(userRef, { violations: count });
    const snap = await getDoc(userRef);
    return mapDoc(snap);
  },
  
  toggleUserBan: async (username) => {
    const userRef = doc(db, "users", username);
    const snap = await getDoc(userRef);
    const currentStatus = snap.data().banned;
    await updateDoc(userRef, { banned: !currentStatus });
    const newSnap = await getDoc(userRef);
    return mapDoc(newSnap);
  },
  
  adminResetUserPassword: async (username) => {
    const userRef = doc(db, "users", username);
    await updateDoc(userRef, { password: "shopease123" });
    return true;
  },
  
  promoteToSubAdmin: async (username) => {
    const userRef = doc(db, "users", username);
    await updateDoc(userRef, { role: "sub-admin" });
    return true;
  },

  // Coupons
  getCoupons: async () => {
    const snap = await getDocs(collection(db, "coupons"));
    return snap.docs.map(mapDoc);
  },
  
  createCoupon: async (coupon) => {
    const docRef = await addDoc(collection(db, "coupons"), coupon);
    return { id: docRef.id, ...coupon };
  },
  
  deleteCoupon: async (code) => {
    const q = query(collection(db, "coupons"), where("code", "==", code));
    const snap = await getDocs(q);
    for (const docSnap of snap.docs) {
      await deleteDoc(docSnap.ref);
    }
    return true;
  },

  // Messages
  getMessages: async () => {
    const snap = await getDocs(collection(db, "messages"));
    return snap.docs.map(mapDoc);
  },
  
  createMessage: async (msg) => {
    const docRef = await addDoc(collection(db, "messages"), msg);
    return { id: docRef.id, ...msg };
  }
};
