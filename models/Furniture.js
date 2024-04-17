import mongoose from "mongoose";

const furnitureSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image: String,
    price: Number,
    phone: String,
    type: String,
  },
  { timestamps: true }
);

const Furniture = mongoose.model("Furniture", furnitureSchema);
export default Furniture;
