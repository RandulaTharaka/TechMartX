import cors from "cors";
import path from "path";
import express from "express"; // "type: module"
import dotenv from "dotenv";
dotenv.config();
import process from "process";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser"; // for parsing cookies in requests
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const port = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

const app = express();

// CORS: allow requests only from your deployed frontend (safer than *)
// Build allowed origins (from environment or hard-coded dev default)
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://www.techmartx.store", // e.g., https://techmartx-frontend.onrender.com
  "http://localhost:3000", // dev local frontend
].filter(Boolean); // remove falsey values such as undefined, "" from the array. eg: if process.env.FRONTEND_URL not set (undefined) it removes from array and keep localhost:3000

// CORS middleware using a dynamic origin check
app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      // allow non-browser requests such as curl/postman (incomingOrigin undefined)
      if (!incomingOrigin) return callback(null, true);
      if (allowedOrigins.indexOf(incomingOrigin) !== -1)
        return callback(null, true);
      callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);

// Preflight handling (OPTIONS) for all routes using same logic
app.options(
  "*",
  cors({
    origin: (incomingOrigin, callback) => {
      if (!incomingOrigin) return callback(null, true);
      if (allowedOrigins.indexOf(incomingOrigin) !== -1)
        return callback(null, true);
      callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json()); // parses application/json (like  API requests with JSON payloads)
app.use(express.urlencoded({ extended: true })); // parses url encoded data (like form submissions)

// Add a simple health endpoint
app.get("/api/health", (req, res) => res.json({ status: "OK" }));

// Cookie parser middleware
app.use(cookieParser()); // parses cookies attached to the client request object

// Routers
app.use("/api/products", productRoutes); //  It tells the Express application to use the productRoutes router for any incoming HTTP requests that start with the path /api/products.
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// Pay Pal
app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// Upload image
app.use("/api/upload", uploadRoutes);
const __dirname = path.resolve(); // path.resolve() returns the absolute path to the current working directory.

// Allows user(frontend) to access uploaded files via a public URL
// Serve static files from the uploads directory.
// express.static(...) is middleware that serves files directly (like images, PDFs, etc.)
// path.join(__dirname, "/uploads") creates the absolute path to your uploads folder
// If you type /uploads/filename.jpg in your browser, Express will look for a file called filename.jpg inside the uploads folder in your project root.
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Access uploaded image

if (process.env.NODE_ENV === "production") {
  // set static folder
  // Serve static files from the frontend build directory
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  // any route that is not api will be redirected to index.html
  // This serves the index.html file for any route that doesn't match an API route, allowing the frontend to handle routing.
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send(`API is running...`);
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
