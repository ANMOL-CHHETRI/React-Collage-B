import { collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, deleteDoc, query, where, increment } from "firebase/firestore";
import { db, auth } from "./firebase";

let isConnected = true;
let connectionListeners = [];

export const onConnectionChange = (listener) => {
  connectionListeners.push(listener);
  listener(isConnected);
  return () => {
    connectionListeners = connectionListeners.filter((l) => l !== listener);
  };
};

const setConnected = (status) => {
  if (isConnected !== status) {
    isConnected = status;
    connectionListeners.forEach((l) => l(isConnected));
  }
};

export const checkBackendHealth = async () => {
  try {
    if (!db) {
      setConnected(false);
      return false;
    }
    await getDoc(doc(db, "_health", "check"));
    setConnected(true);
    return true;
  } catch {
    setConnected(false);
    return false;
  }
};

// Start periodic health checks
checkBackendHealth();
setInterval(checkBackendHealth, 30000);

const mapDoc = (docSnap) => ({ id: docSnap.id, ...docSnap.data() });

const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID || "shopease-nepal-anmol-196e7";
const FUNCTIONS_API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? `http://127.0.0.1:5001/${PROJECT_ID}/us-central1/api/api/v1`
    : `https://us-central1-${PROJECT_ID}.cloudfunctions.net/api/api/v1`);

async function apiFetch(endpoint, options = {}) {
  const user = auth?.currentUser;
  let token = null;
  if (user) {
    try {
      token = await user.getIdToken();
    } catch (err) {
      console.warn("Failed to retrieve Firebase ID token", err);
    }
  }

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${FUNCTIONS_API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Request failed with HTTP status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // ── Unified Backend Express Endpoints ────────────────────────────────────────
  
  // User Profile
  getMyProfile: async () => {
    return apiFetch("/users/me");
  },
  updateMyProfile: async (data) => {
    return apiFetch("/users/me", { method: "PATCH", body: JSON.stringify(data) });
  },

  // Collages
  getCollages: async (params = {}) => {
    const queryStr = new URLSearchParams(params).toString();
    return apiFetch(`/collages${queryStr ? `?${queryStr}` : ""}`);
  },
  getCollage: async (id) => {
    return apiFetch(`/collages/${id}`);
  },
  createCollage: async (data) => {
    return apiFetch("/collages", { method: "POST", body: JSON.stringify(data) });
  },
  updateCollage: async (id, data) => {
    return apiFetch(`/collages/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  },
  deleteCollage: async (id) => {
    return apiFetch(`/collages/${id}`, { method: "DELETE" });
  },

  // Collage Images
  getCollageImages: async (collageId) => {
    return apiFetch(`/collages/${collageId}/images`);
  },
  registerCollageImage: async (collageId, data) => {
    return apiFetch(`/collages/${collageId}/images`, { method: "POST", body: JSON.stringify(data) });
  },
  updateCollageImagePosition: async (collageId, imageId, position) => {
    return apiFetch(`/collages/${collageId}/images/${imageId}/position`, {
      method: "PATCH",
      body: JSON.stringify({ position }),
    });
  },
  deleteCollageImage: async (collageId, imageId) => {
    return apiFetch(`/collages/${collageId}/images/${imageId}`, { method: "DELETE" });
  },

  // Collage Comments
  getCollageComments: async (collageId) => {
    return apiFetch(`/collages/${collageId}/comments`);
  },
  addCollageComment: async (collageId, data) => {
    return apiFetch(`/collages/${collageId}/comments`, { method: "POST", body: JSON.stringify(data) });
  },
  updateCollageComment: async (collageId, commentId, data) => {
    return apiFetch(`/collages/${collageId}/comments/${commentId}`, { method: "PATCH", body: JSON.stringify(data) });
  },
  deleteCollageComment: async (collageId, commentId) => {
    return apiFetch(`/collages/${collageId}/comments/${commentId}`, { method: "DELETE" });
  },

  // Collage Reactions
  getCollageReactions: async (collageId) => {
    return apiFetch(`/collages/${collageId}/reactions`);
  },
  toggleCollageReaction: async (collageId, type = "like") => {
    return apiFetch(`/collages/${collageId}/reactions`, { method: "POST", body: JSON.stringify({ type }) });
  },
  removeCollageReaction: async (collageId) => {
    return apiFetch(`/collages/${collageId}/reactions`, { method: "DELETE" });
  },

  // Projects
  getProjects: async (limit = 20) => {
    return apiFetch(`/projects?limit=${limit}`);
  },
  getProject: async (id) => {
    return apiFetch(`/projects/${id}`);
  },
  createProject: async (data) => {
    return apiFetch("/projects", { method: "POST", body: JSON.stringify(data) });
  },
  updateProject: async (id, data) => {
    return apiFetch(`/projects/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  },
  deleteProject: async (id) => {
    return apiFetch(`/projects/${id}`, { method: "DELETE" });
  },

  // ── Existing Firestore E-Commerce Methods ────────────────────────────────────
  
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

  register: async (name, username, email, password, avatar = null) => {
    if (!db) throw new Error("Firestore database is not initialized. Check your Firebase credentials in .env");
    const q = query(collection(db, "users"), where("username", "==", username));
    const snap = await getDocs(q);
    if (!snap.empty) throw new Error("Username already exists.");

    const newUser = {
      name,
      username,
      email,
      password,
      role: "user",
      violations: 0,
      banned: false,
      address: "",
      phone: "",
      avatar: avatar || null,
      createdAt: new Date().toISOString(),
    };
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
    try {
      const userRef = doc(db, "users", username);
      await updateDoc(userRef, updatedDetails);
      const snap = await getDoc(userRef);
      return { id: snap.id, ...snap.data() };
    } catch (err) {
      console.warn("Firestore updateProfile note (continuing with local update):", err);
      return { id: username, username, ...updatedDetails };
    }
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
  },

  // Audit Logs
  getAuditLogs: async (limit = 20, startAfter = null) => {
    try {
      const token = await auth?.currentUser?.getIdToken();
      const params = new URLSearchParams({ limit: String(limit) });
      if (startAfter) params.append("startAfter", startAfter);

      const res = await fetch(`${FUNCTIONS_API_BASE}/audit-logs?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Audit logs API fetch error, checking Firestore fallback:", e);
    }

    if (!db) return { data: [], hasMore: false };
    try {
      const q = query(collection(db, "auditLogs"));
      const snap = await getDocs(q);
      const data = snap.docs.map(mapDoc).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return { data: data.slice(0, limit), hasMore: data.length > limit };
    } catch {
      return { data: [], hasMore: false };
    }
  },
};
