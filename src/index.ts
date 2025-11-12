import * as dotenv from "dotenv";
import { runCleanUp } from "./services/cleanup-service";
import express from "express";
import { triggerRelay } from "./services/api-service";

const APP_HEARTBEAT_MS = 10000; // 10 seconds
const PORT = 8000;

dotenv.config();

let visitors: any[] = [];

// Start firebase listener
function initializeFirebaseApp(): void {}

function listenToFirestoreCollections(): void {
  listenToVisitors();
}

function listenToVisitors(): void {
  console.log("Listening to Visitors collection");

  // Stub data - To replace with real-time listener to Firestore collection
  visitors = [
    { id: "abc123", name: "Alice" },
    { id: "xyz456", name: "Bob" },
  ];
}

initializeFirebaseApp();
listenToFirestoreCollections();
// End firebase listener

// Start Express API Server
const app = express();
app.use(express.json());

app.listen(PORT, () => {
  console.log(`API server is running on port ${PORT}`);
});

function onReceiveQrCode(qrCode: string) {
  // Stub QR code checking - The real checking is more complicated than this
  return visitors.some((visitor) => visitor.id === qrCode);
}

// To call, use: http://localhost:8000/onQrScanned?qrCode=YOUR_QR_CODE
app.get("/onQrScanned", (req, res) => {
  try {
    const qrCode = req.query.qrCode;

    if (!qrCode) throw new Error("Missing qrCode parameter");

    const isQrValid = onReceiveQrCode(`${qrCode}`);

    if (!isQrValid) throw new Error("Invalid qrCode");

    triggerRelay(true);

    res.status(200).json({
      isSuccess: true,
      message: `Received QR code: ${qrCode}`,
    });
  } catch (error: any) {
    res.status(400).json({
      isSuccess: false,
      message: error?.message ?? "Failed to process request",
    });
  }
});
// End Express API Server

// Start Clean-up Handlers
const terminateProgram = async () => {
  await runCleanUp();
  process.exit(0);
};

process.once("SIGINT", terminateProgram);
process.once("SIGTERM", terminateProgram);
// End Clean-up Handlers

setInterval(() => {
  console.log("Program is running... This is a updated message");
}, APP_HEARTBEAT_MS);
