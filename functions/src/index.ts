import { onRequest } from "firebase-functions/v2/https";
import { app } from "./app.js";
import { processNewOrder } from "./triggers/orderTriggers.js";

// Export Express API v2 Cloud Function
export const api = onRequest(
  {
    region: "us-central1",
    cors: true,
    maxInstances: 10,
  },
  app
);

// Export Background Order Trigger
export { processNewOrder };
