let isConnected = false;
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

// Check health of backend API
export const checkBackendHealth = async () => {
  try {
    const res = await fetch("/api/health");
    if (res.ok) {
      setConnected(true);
      return true;
    }
  } catch (e) {
    // Fail silently, triggers offline state
  }
  setConnected(false);
  return false;
};

// Start periodic health checks
checkBackendHealth();
setInterval(checkBackendHealth, 10000);

async function request(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errData = await response.json().catch(() => ({ detail: "API Error" }));
      throw new Error(errData.detail || "Server error occurred");
    }
    setConnected(true);
    return await response.json();
  } catch (err) {
    // If it's a network error, set connection to offline
    if (err instanceof TypeError || (err.message && err.message.includes("fetch"))) {
      setConnected(false);
    }
    throw err;
  }
}

export const api = {
  // Authentication
  login: (username, password) => request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  }),
  register: (name, username, email, password) => request("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, username, email, password })
  }),
  changePassword: (role, currentPassword, newPassword, username) => request("/api/auth/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, currentPassword, newPassword, username })
  }),
  updateProfile: (username, updatedDetails) => request("/api/auth/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, ...updatedDetails })
  }),

  // Products
  getProducts: () => request("/api/products"),
  createProduct: (product) => request("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  }),
  updateProduct: (id, updates) => request(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates)
  }),
  deleteProduct: (id) => request(`/api/products/${id}`, {
    method: "DELETE"
  }),

  // Reviews
  getReviews: (productId) => request(`/api/reviews/${productId}`),
  addReview: (productId, review) => request(`/api/reviews/${productId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review)
  }),

  // Orders
  getOrders: (username = null) => {
    const url = username ? `/api/orders?username=${encodeURIComponent(username)}` : "/api/orders";
    return request(url);
  },
  createOrder: (order) => request("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order)
  }),
  updateOrderStatus: (id, status) => request(`/api/orders/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  }),

  // Seller Applications
  applySeller: (details) => request("/api/seller/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(details)
  }),
  getSellerApplications: () => request("/api/seller/applications"),
  reviewSellerApplication: (username, status) => request(`/api/seller/applications/${username}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  }),

  // Reported Avatars
  reportAvatar: (username, avatar) => request("/api/avatars/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, avatar })
  }),
  getReportedAvatars: () => request("/api/avatars/reported"),
  dismissAvatarReport: (username) => request(`/api/avatars/reported/${username}/dismiss`, {
    method: "POST"
  }),
  removeReportedAvatar: (username) => request(`/api/avatars/reported/${username}/remove`, {
    method: "DELETE"
  }),

  // Administrative / Users
  getUsers: () => request("/api/users"),
  updateUserViolations: (username, delta) => request("/api/users/violations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, delta })
  }),
  setExactUserViolations: (username, count) => request("/api/users/violations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, count })
  }),
  toggleUserBan: (username) => request("/api/users/ban", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  }),
  adminResetUserPassword: (username) => request("/api/users/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  }),
  promoteToSubAdmin: (username) => request("/api/users/promote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  }),

  // Coupons
  getCoupons: () => request("/api/coupons"),
  createCoupon: (coupon) => request("/api/coupons", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(coupon)
  }),
  deleteCoupon: (code) => request(`/api/coupons/${code}`, {
    method: "DELETE"
  }),

  // Messages
  getMessages: () => request("/api/messages"),
  createMessage: (msg) => request("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(msg)
  })
};
