import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import * as tf from "@tensorflow/tfjs";
import "./i18n"; // Import konfigurasi i18n

// Initialize TensorFlow.js
tf.ready().then(() => {
  console.log("TensorFlow.js loaded successfully");
});

createRoot(document.getElementById("root")!).render(<App />);