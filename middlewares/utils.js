import User from "../models/User.js";
import { furnitureData, housingsData, userData } from "../data/data.js";
import bcrypt from "bcryptjs";
import Product from "../models/Product.js";
import Furniture from "../models/Furniture.js";

export const getDetails = (user) => {
  const { password, ...otherDetails } = user._doc;
  return otherDetails;
};

export const validIdParams = (id) => {
  if (id.length < 24) {
    return false;
  } else {
    return true;
  }
};

export const setAdmin = async () => {
  const usrr = await User.findOne({ email: "admin@housing.com" });
  if (!usrr) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const newUser = {
      type: "admin",
      email: "admin@housing.com",
      password: hashedPassword,
    };
    const createdUser = new User(newUser);
    await createdUser.save();
  }
}

export const setDefaultUsers = async () => {
  try {
    userData.forEach(async(user, id) => {
      const usrr = await User.findOne({ email: user.email });
      if (!usrr) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = {
          type: user.type || "user",
          email: user.email,
          password: hashedPassword,
          studentId: user.studentId,
        };
        const createdUser = new User(newUser);
        await createdUser.save();
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export const setDefaultHousings = async () => {
  try {
    housingsData.forEach(async(user, id) => {
      const usrr = await Product.findOne({ name: user.name });
      const admin = await User.findOne({ email: "admin@housing.com" });
      if (!usrr) {
        const newHousing = {
          category: user.category,
          soldBy: admin._id,
          name: user.name,
          description: user.description,
          price: user.price,
          phone: user.phone,
          image: user.image,
          address: user.address,
        };
        const createdHousing = new Product(newHousing);
        admin.products.push(createdHousing._id);
        await admin.save();
        await createdHousing.save();
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export const setDefaultFurnitures = async () => {
  try {
    furnitureData.forEach(async(user, id) => {
      const usrr = await Product.findOne({ name: user.name });
      const admin = await User.findOne({ email: "admin@housing.com" });
      if (!usrr) {
        const newFurniture = {
          type: "furniture",
          soldBy: admin._id,
          name: user.name,
          description: user.description,
          price: user.price,
          phone: user.phone,
          image: user.image,
        };
        const createdFurniture = new Furniture(newFurniture);
        admin.products.push(createdFurniture._id);
        await admin.save();
        await createdFurniture.save();
      }
    })
  } catch (error) {
    console.log(error)
  }
}
