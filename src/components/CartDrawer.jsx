import { useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { provincesData } from "../data/provincesData";

// Local ImageWithSkeleton for cart items
const ImageWithSkeleton = ({ src, alt, className, fallbackSrc }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(!src);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
      )}
      <img
        ref={imgRef}
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        src={
          error
            ? fallbackSrc ||
              "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg"
            : src ||
              "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg"
        }
        alt={alt}
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
          loaded || error ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
      />
    </div>
  );
};

const CartDrawer = () => {
  const { user } = useAuth();
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [checkoutStep, setCheckoutStep] = useState(false);
  const [fullName, setFullName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [provinceValue, setProvinceValue] = useState("bagmati");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null);

  const [prevUser, setPrevUser] = useState(user);
  if (user !== prevUser) {
    setPrevUser(user);
    if (user?.name) {
      setFullName(user.name);
    }
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setOrderError("");
    setIsPlacingOrder(true);

    if (
      !fullName.trim() ||
      !phone.trim() ||
      !provinceValue ||
      !city.trim() ||
      !address.trim()
    ) {
      setOrderError("Please fill out all required receiver details.");
      setIsPlacingOrder(false);
      return;
    }

    const phoneRegex = /^(?:\+977[- ]?)?(?:98|97|96)\d{8}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ""))) {
      setOrderError("Please enter a valid 10-digit Nepali mobile number.");
      setIsPlacingOrder(false);
      return;
    }

    setTimeout(() => {
      const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
      const estDays = provincesData[provinceValue]?.estDelivery || "2-4 Days";
      const shippingFee = provincesData[provinceValue]?.shippingFee || 0;
      const grandTotal = cartSubtotal + shippingFee;

      const simulatedOrder = {
        orderId,
        username: user?.username,
        fullName,
        phone,
        address,
        city,
        provinceName: provincesData[provinceValue]?.name || "Bagmati",
        items: [...cartItems],
        subtotal: cartSubtotal,
        shipping: shippingFee,
        total: grandTotal,
        estDays,
        status: "Processing",
        date: new Date().toISOString()
      };

      try {
        const rawOrders = JSON.parse(localStorage.getItem("shopease_orders"));
        const existingOrders = Array.isArray(rawOrders) ? rawOrders : [];
        localStorage.setItem("shopease_orders", JSON.stringify([simulatedOrder, ...existingOrders]));
      } catch (err) {
        console.error("Error saving order:", err);
      }

      setOrderSuccess(simulatedOrder);
      clearCart();
      setIsPlacingOrder(false);
      setCheckoutStep(false);
      setIsCartOpen(false); // Close the drawer, keep the success modal open
    }, 1500);
  };

  return (
    <>
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => {
              if (!checkoutStep) setIsCartOpen(false);
            }}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white dark:bg-slate-950 border-l border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col transform transition duration-300 animate-in slide-in-from-right duration-300">
              <div className="px-6 py-5 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {checkoutStep
                    ? "Receiver Details (COD)"
                    : `My Cart (${cartCount})`}
                </h2>
                <button
                  onClick={() => {
                    if (checkoutStep) setCheckoutStep(false);
                    else setIsCartOpen(false);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
                >
                  <svg
                    className="w-5.5 h-5.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                {checkoutStep ? (
                  <form onSubmit={handlePlaceOrder} className="space-y-4 pt-2">
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 text-xs text-amber-800 leading-relaxed font-medium mb-4">
                      <strong>Payment Mode: Cash on Delivery (COD)</strong>
                      <br />
                      You will pay cash to the courier agent upon receiving your
                      order at your shipping address.
                    </div>

                    {orderError && (
                      <div className="bg-red-50 text-red-700 border border-red-200 p-2.5 rounded-lg text-xs font-semibold">
                        {orderError}
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase block">
                        Receiver Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full text-xs border border-slate-200 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500 text-slate-700 bg-slate-50 focus:bg-white transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase block">
                        Phone Number (Nepal)
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98XXXXXXXX"
                        className="w-full text-xs border border-slate-200 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500 text-slate-700 bg-slate-50 focus:bg-white transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                        Delivery Province
                      </label>
                      <select
                        value={provinceValue}
                        onChange={(e) => {
                          setProvinceValue(e.target.value);
                        }}
                        className="w-full text-xs border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 transition cursor-pointer"
                      >
                        {Object.values(provincesData).map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                          City / Town
                        </label>
                        <select
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full text-xs border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 transition cursor-pointer"
                        >
                          {provincesData[provinceValue]?.cities?.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                          Zip / Postcode
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 44600"
                          className="w-full text-xs border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase block">
                        Street Address
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House no, Street name, Tole, Landmark"
                        className="w-full text-xs border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 focus:outline-none focus:border-amber-500 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 transition"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isPlacingOrder}
                      className="w-full bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl shadow-lg transition duration-200 mt-6 cursor-pointer disabled:opacity-70 flex items-center justify-center"
                    >
                      {isPlacingOrder ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Processing...
                        </>
                      ) : (
                        "Confirm Order (Cash on Delivery)"
                      )}
                    </button>
                  </form>
                ) : cartItems.length === 0 ? (
                  <div className="text-center py-20 space-y-4">
                    <svg
                      className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                      Your cart is empty
                    </h3>
                    <p className="text-slate-400 dark:text-slate-500 text-xs max-w-[240px] mx-auto">
                      Explore Nepalese crafts, garments, and tea to add them
                      here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-3 border border-slate-100 dark:border-slate-800 rounded-xl hover:shadow-sm transition"
                      >
                        <ImageWithSkeleton
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover bg-slate-50 dark:bg-slate-900 shrink-0"
                        />

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug line-clamp-1">
                              {item.name}
                            </h4>
                            <span className="text-xs font-extrabold text-amber-600 block mt-0.5">
                              Rs. {item.price.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="px-2 py-0.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900 rounded-l-lg transition cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="px-2 py-0.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900 rounded-r-lg transition cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-[10px] font-bold text-red-500 hover:text-red-700 transition cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && !checkoutStep && (
                <div className="px-6 py-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">
                      Subtotal
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      Rs. {cartSubtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 font-medium">
                    <span>
                      Shipping calculated at checkout. Delivery across Nepal.
                    </span>
                  </div>
                  <button
                    onClick={() => setCheckoutStep(true)}
                    className="w-full bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 font-bold py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 shadow-md transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Proceed to Delivery (COD)
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {checkoutStep && (
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      Cart Subtotal:
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Rs. {cartSubtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      Shipping ({provincesData[provinceValue].name}):
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Rs. {provincesData[provinceValue].shippingFee}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 dark:border-slate-800/80 pt-2 text-sm font-extrabold">
                    <span className="text-slate-800 dark:text-slate-200">
                      Grand Total (COD):
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                      Rs.{" "}
                      {(
                        cartSubtotal + provincesData[provinceValue].shippingFee
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {orderSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setOrderSuccess(null)}
          />

          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative transform transition duration-300 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4"
                />
              </svg>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white text-center leading-tight">
              Order Placed Successfully!
            </h3>
            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-1 font-semibold">
              Order ID:{" "}
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                {orderSuccess.orderId}
              </span>
            </p>

            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4.5 border border-slate-100 dark:border-slate-800 text-xs space-y-2 mt-5">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800 pb-1.5 mb-2.5">
                Receiver Details & Delivery Summary
              </h4>
              <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                <div>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase">
                    Receiver Name
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {orderSuccess.fullName}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase">
                    Contact Phone
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {orderSuccess.phone}
                  </span>
                </div>
              </div>
              <div className="pt-2 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase">
                  Delivery Location
                </span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {orderSuccess.address}, {orderSuccess.city},{" "}
                  {orderSuccess.provinceName}
                </span>
              </div>
              <div className="pt-2 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase">
                    Payment Method
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Cash on Delivery (COD)
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase">
                    Estimated Delivery
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {orderSuccess.estDays}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm font-bold pt-4 px-1 border-t border-slate-200 dark:border-slate-800 mt-5">
              <span className="text-slate-700 dark:text-slate-300">
                Total Invoice (NPR)
              </span>
              <span className="text-amber-600 dark:text-amber-400 text-base font-extrabold">
                Rs. {orderSuccess.total.toLocaleString()}
              </span>
            </div>

            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal text-center mt-6">
              Our support desk will call you at{" "}
              <strong className="text-slate-600 dark:text-slate-300">
                {orderSuccess.phone}
              </strong>{" "}
              within 12 hours to verify your delivery address before dispatching
              the rider.
            </p>

            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold py-2.5 rounded-xl shadow-md transition duration-200 mt-5 cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CartDrawer;
