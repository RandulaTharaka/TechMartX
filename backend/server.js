import express from "express"; // "type: module"
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // for parsing cookies in requests
dotenv.config();
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const port = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

const app = express();

// Body parser middleware
app.use(express.json()); // parses application/json (like  API requests with JSON payloads)
app.use(express.urlencoded({ extended: true })); // parses url encoded data (like form submissions)

// Cookie parser middleware
app.use(cookieParser()); // parses cookies attached to the client request object

app.get(`/`, (req, res) => {
  res.send(`API is running...`);
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
