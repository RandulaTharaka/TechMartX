import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddlerware.js";

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.get("/top", getTopProducts);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

/* When you add a review, you are not updating the product itself or replacing an existing review,
you are creating a new review and appending it to the product’s reviews array.
That’s why the correct HTTP method is POST. */
// POST is used to create a new resource (in this case, a new review) that is added to the collection of reviews for a product.
router.route("/:id/reviews").post(protect, createProductReview);

export default router;
