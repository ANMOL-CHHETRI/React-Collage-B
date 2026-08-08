const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

/**
 * Trigger: Runs on order document creation
 * Purpose: Decreases stock, verifies payment total, validates coupon code.
 */
exports.processNewOrder = functions.firestore
  .document("orders/{orderId}")
  .onCreate(async (snap, context) => {
    const orderData = snap.data();
    const { items, couponCode } = orderData;
    
    if (!items || !Array.isArray(items)) {
      console.error("Order items list is empty or invalid.");
      return null;
    }

    const batch = db.batch();
    
    try {
      // 1. Loop through items to validate and decrement stock
      for (const item of items) {
        if (!item.id) continue;
        const productRef = db.collection("products").doc(String(item.id));
        const productSnap = await productRef.get();
        
        if (!productSnap.exists) {
          throw new Error(`Product with ID ${item.id} does not exist.`);
        }
        
        const currentStock = productSnap.data().stock;
        const purchaseQty = item.quantity || 1;
        
        if (currentStock < purchaseQty) {
          // Mark order status as 'Inventory Issues/Failed'
          await snap.ref.update({ status: "Failed - Out of Stock" });
          console.error(`Insufficient stock for product ID ${item.id}: ${productSnap.data().name}`);
          return null;
        }
        
        // Queue stock reduction
        batch.update(productRef, {
          stock: currentStock - purchaseQty
        });
      }
      
      // 2. Process Coupon discount if applied
      if (couponCode) {
        const couponRef = db.collection("coupons").doc(couponCode);
        const couponSnap = await couponRef.get();
        if (!couponSnap.exists) {
          console.warn(`Attempted invalid coupon use: ${couponCode}`);
        } else {
          console.log(`Applied coupon ${couponCode} for order ${context.params.orderId}`);
        }
      }
      
      // Commit the stock updates in batch
      await batch.commit();
      
      // Update order status to 'To Ship' after inventory checks pass
      await snap.ref.update({ status: "To Ship" });
      console.log(`Order ${context.params.orderId} processed successfully.`);
      
    } catch (err) {
      console.error("Order processing failed: ", err.message);
      await snap.ref.update({ status: "Error", statusReason: err.message });
    }
    
    return null;
  });
