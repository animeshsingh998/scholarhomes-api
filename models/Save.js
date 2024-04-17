import mongoose from "mongoose";

const saveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    savedHousings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }],
    savedFurnitures: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Furniture",
    }],
  },
  { timestamps: true }
);

const Save = mongoose.model("Save", saveSchema);
export default Save;
