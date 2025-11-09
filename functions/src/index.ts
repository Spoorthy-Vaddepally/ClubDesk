/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDLC9eI0j9xZ9y1YvNlBB0gl7wtuHaPrN0",
  authDomain: "club-desk.firebaseapp.com",
  projectId: "club-desk",
  storageBucket: "club-desk.firebasestorage.app",
  messagingSenderId: "114822232141",
  appId: "1:114822232141:web:f538926896c05d96df8404"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Import our initialization functions
import { initializeSampleData, clearAllData } from "./initializeData";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Function to initialize sample data for presentation
export const initSampleData = onRequest(async (request, response) => {
  logger.info("Initializing sample data for presentation");
  try {
    await initializeSampleData();
    response.status(200).send("Sample data initialized successfully!");
  } catch (error) {
    logger.error("Error initializing sample data:", error);
    response.status(500).send("Error initializing sample data");
  }
});

// Function to clear all data
export const clearData = onRequest(async (request, response) => {
  logger.info("Clearing all data");
  try {
    await clearAllData();
    response.status(200).send("All data cleared successfully!");
  } catch (error) {
    logger.error("Error clearing data:", error);
    response.status(500).send("Error clearing data");
  }
});