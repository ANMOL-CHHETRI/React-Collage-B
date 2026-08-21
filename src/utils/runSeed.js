/* global process */
import { seedDatabase } from './seedFirebase.js';

seedDatabase()
  .then(() => {
    if (typeof process !== "undefined" && process.exit) {
      process.exit(0);
    }
  })
  .catch((err) => {
    console.error("Seed error: ", err);
    if (typeof process !== "undefined" && process.exit) {
      process.exit(1);
    }
  });
