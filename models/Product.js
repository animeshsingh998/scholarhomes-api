import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: String,
    image: String,
    price: Number,
    phone: String,
    address: String,
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
