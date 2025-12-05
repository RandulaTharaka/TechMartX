import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/productModel.js"; // adjust path

dotenv.config();
const mongoURI = process.env.MONGO_URI;
const backendRoot =
  process.env.BACKEND_URL ||
  process.env.FRONTEND_BASE_URL ||
  process.env.FRONTEND_BASE_URL_BACKUP ||
  process.env.BACKEND_BASE_URL ||
  process.env.REACT_APP_API_URL ||
  process.env.BACKEND_URL ||
  `http://localhost:${process.env.PORT || 5000}`;

const normalizePath = (pathValue) => {
  if (!pathValue) return pathValue;
  if (/^https?:\/\//i.test(pathValue)) return pathValue; // already URL

  let p = pathValue.replace(/\\/g, "/"); // backslash -> forward
  p = p.replace(/^\/backend/i, ""); // remove backend prefix
  if (!p.startsWith("/")) p = "/" + p;
  return backendRoot.replace(/\/$/, "") + p;
};

const run = async () => {
  try {
    await mongoose.connect(mongoURI);
    const products = await Product.find();
    for (const p of products) {
      const normalized = normalizePath(p.image);
      if (normalized !== p.image) {
        p.image = normalized;
        await p.save();
        console.log(`Updated product ${p._id} image -> ${p.image}`);
      }
    }
    console.log("Done migrating product images");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();
