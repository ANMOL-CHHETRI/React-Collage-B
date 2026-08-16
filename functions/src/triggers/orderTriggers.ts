import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { db } from "../config/firebaseAdmin.js";

/**
 * Background Trigger: Runs on order document creation
 * Decrements product stock, validates coupon code, and updates order status.
 */
export const processNewOrder = onDocumentCreated("orders/{orderId}", async (event) => {
  const snap = event.data;
  if (!snap) return null;

  const orderData = snap.data();
  const { items, couponCode } = orderData;

  if (!items || !Array.isArray(items)) {
    console.error(`Order ${event.params.orderId} items list is empty or invalid.`);
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

      const currentStock = productSnap.data()?.stock || 0;
      const purchaseQty = item.quantity || 1;

      if (currentStock < purchaseQty) {
        await snap.ref.update({ status: "Failed - Out of Stock" });
        console.error(`Insufficient stock for product ID ${item.id}: ${productSnap.data()?.name}`);
        return null;
      }

      batch.update(productRef, {
        stock: currentStock - purchaseQty,
      });
    }

    // 2. Process Coupon discount if applied
    if (couponCode) {
      const couponRef = db.collection("coupons").doc(couponCode);
      const couponSnap = await couponRef.get();
      if (!couponSnap.exists) {
        console.warn(`Attempted invalid coupon use: ${couponCode}`);
      } else {
        console.log(`Applied coupon ${couponCode} for order ${event.params.orderId}`);
      }
    }

    // Commit stock updates
    await batch.commit();

    // Update order status to 'To Ship' after inventory checks pass
    await snap.ref.update({ status: "To Ship" });
    console.log(`Order ${event.params.orderId} processed successfully.`);
  } catch (err: any) {
    console.error("Order processing failed: ", err.message);
    await snap.ref.update({ status: "Error", statusReason: err.message });
  }

  return null;
});
