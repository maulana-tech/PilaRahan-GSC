import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import * as tf from "@tensorflow/tfjs";

// Initialize TensorFlow.js
tf.ready().then(() => {
  console.log("TensorFlow.js loaded successfully");
});

createRoot(document.getElementById("root")!).render(<App />);
