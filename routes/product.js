import express from "express";
import {
  addToCart,
  addVoucher,
  checkVoucher,
  clearUserCart,
  completeSale,
  createFurniture,
  createOrder,
  createProduct,
  deleteProduct,
  getAllFurnitures,
  getAllProducts,
  getAllSaved,
  getMyOrders,
  getMyProducts,
  getMySales,
  getProductById,
  getUserCart,
  normalSearch,
  normalSearchFur,
  removeFromCart,
  saveThing,
  updateOrder,
} from "../controllers/productController.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/create/:token", authenticate, createProduct);
router.post("/createFurniture/:token", authenticate, createFurniture);
router.get("/getMyProducts/:token", authenticate, getMyProducts);
router.delete("/:id/delete/:token", authenticate, deleteProduct);
router.get("/allProducts/:token", authenticate, getAllProducts);
router.get("/allFurnitures/:token", authenticate, getAllFurnitures);
// router.get("/allProducts", authenticate, getAllProducts);
// router.get("/allFurnitures", authenticate, getAllFurnitures);
router.get("/productById/:id", getProductById);
router.post("/normalSearch/:token", authenticate, normalSearch);
router.post("/normalSearchFur/:token",authenticate, normalSearchFur);
router.post("/saveThing/:token", authenticate, saveThing);
router.get("/getAllSaved/:token", authenticate, getAllSaved);
router.post("/addVoucher/:token", authenticate, addVoucher);
router.post("/checkVoucher/:token", authenticate, checkVoucher);
router.post("/addToCart/:token", authenticate, addToCart);
router.get("/getUserCart/:token", authenticate, getUserCart);
router.post("/createOrder/:token", authenticate, createOrder);
router.get("/getMyOrders/:token", authenticate, getMyOrders);
router.get("/getMySales/:token", authenticate, getMySales);
router.post("/completeSale/:token", authenticate, completeSale);
router.put("/updateOrder/:token", authenticate, updateOrder);
router.delete("/removeFromCart/:index/:token", authenticate, removeFromCart);
router.get("/clearUserCart/:token", authenticate, clearUserCart);

export default router;
