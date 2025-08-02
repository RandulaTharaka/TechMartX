import path from "path";
import express from "express"; // "type: module"
import cookieParser from "cookie-parser"; // for parsing cookies in requests
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const port = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

const app = express();

// Body parser middleware
app.use(express.json()); // parses application/json (like  API requests with JSON payloads)
app.use(express.urlencoded({ extended: true })); // parses url encoded data (like form submissions)

// Cookie parser middleware
app.use(cookieParser()); // parses cookies attached to the client request object

app.use("/api/products", productRoutes); //  It tells the Express application to use the productRoutes router for any incoming HTTP requests that start with the path /api/products.
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// Pay Pal
app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// Upload image
app.use("/api/upload", uploadRoutes);

// Access uploaded image
const __dirname = path.resolve(); // path.resolve() returns the absolute path to the current working directory.

// Allows user(frontend) to access uploaded files via a public URL
// Serve static files from the uploads directory.
// express.static(...) is middleware that serves files directly (like images, PDFs, etc.)
// path.join(__dirname, "/uploads") creates the absolute path to your uploads folder
// If you type /uploads/filename.jpg in your browser, Express will look for a file called filename.jpg inside the uploads folder in your project root.
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  // set static folder
  // Serve static files from the frontend build directory
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  // any route that is not api will be redirected to index.html
  // This serves the index.html file for any route that doesn't match an API route, allowing the frontend to handle routing.
  app.get("/*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get(`/`, (req, res) => {
    res.send(`API is running...`);
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
