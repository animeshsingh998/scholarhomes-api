import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDetails } from "../middlewares/utils.js";

//Register User
export const registerUser = async (req, res) => {
  const { type, email, password } = req.body;
  const checkEmail = await User.findOne({ email });
  if (checkEmail) {
    return res.status(400).json({ error: "Email already exists." });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    type,
    email,
    password: hashedPassword,
  };
  const user = new User(newUser);
  try {
    await user.save();
    const token = jwt.sign(
      { _id: user._id, type: user.type },
      process.env.JWT_KEY
    );
    const otherDetails = getDetails(user);
    return res.status(201).cookie("jwt", token).json({ otherDetails, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    try {
      const valid = await bcrypt.compare(password, user.password);
      if (valid) {
        const token = jwt.sign(
          { _id: user._id, isAdmin: user.isAdmin },
          process.env.JWT_KEY
        );
        const otherDetails = getDetails(user);
        return res
          .status(200)
          .cookie("jwt", token)
          .json({ otherDetails, token });
      } else {
        return res.status(400).json({ error: "Invalid Password" });
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  } else {
    return res.status(404).json({ error: "user not found" });
  }
};

//Logout User
export const logoutUser = async (req, res) => {
  try {
    res.status(200).cookie("jwt", null).json("Logged out Successfully.");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, studentId } = req.body;
    const user = await User.findById(req.user._id);
    const updateData = {
      name: name || user.name || "",
      email: email || user.email,
      studentId: studentId || user.studentId || "",
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {new: true});
    res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const giveAdmin = async (req, res) => {
  try {
    const user = await User.findOne({ email: "admin@housing.com" });
    if (!user) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const email = "admin@housing.com";
        const newUser = {
          email,
          password: hashedPassword,
          type: "admin"
        };
      const userr = new User(newUser);
      userr.save();
      return res.status(201).json({message: "Admin made successfully.."});
    } else {
      return res.status(200).json({message: "admin already exists!"});
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
