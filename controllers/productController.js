import Product from "../models/Product.js";
import Furniture from "../models/Furniture.js";
import User from "../models/User.js";
import Voucher from "../models/Voucher.js";
import { validIdParams } from "../middlewares/utils.js";
import Order from "../models/Order.js";
import Save from "../models/Save.js";

export const createProduct = async (req, res) => {
  const user = await User.findById(req.user._id);
  const userId = user._id;
  const { description, name, category, price, phone, address, image} = req.body;
  try {
    const ProductData = {
      soldBy: userId,
      description,
      name,
      category,
      price,
      phone,
      address,
      image,
    };
    const product = await Product.create(ProductData);
    user.products.push(product._id);
    await user.save();

    return res.status(201).json({ message: "Product Added." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createFurniture = async (req, res) => {
  const user = await User.findById(req.user._id);
  const userId = user._id;
  const { description, name, price, phone, image } = req.body;
  try {
    const ProductData = {
      soldBy: userId,
      type: "furniture",
      description,
      name,
      price,
      phone,
      image,
    };
    const product = await Furniture.create(ProductData);
    user.products.push(product._id);
    await user.save();

    return res.status(201).json({ message: "Product Added." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  const valid = validIdParams(req.params.id);
  if (!valid) {
    return res.status(404).json({ error: "Product not found." });
  }
  try {
    const product = await Product.findOne({ _id: req.params.id }).populate(
      "soldBy"
    );
    if (product) {
      return res.status(200).json(product);
    } else {
      const product = await Furniture.findOne({ _id: req.params.id }).populate(
        "soldBy"
      );
      if (product) {
        return res.status(200).json(product);
      } else {
        return res.status(404).json({ error: "Product not found." });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getMyProducts = async (req, res) => {
  try {
      const products = await Product.find({ soldBy: req.user._id });
      return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const housings = await Product.find({});
    return res.status(200).json(housings);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllFurnitures = async (req, res) => {
  try {
    const furnitures = await Furniture.find({});
    return res.status(200).json(furnitures);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllSaved = async (req, res) => {
  try {
    const saved = await Save.findOne({ userId: req.user._id }).populate("savedHousings savedFurnitures");
    if (!saved) {
      return res.status(404).json([]);
    }
    const savedHousings = saved.savedHousings;
    const savedFurnitures = saved.savedFurnitures;
    return res.status(200).json({savedHousings, savedFurnitures});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  const ownerId = product.soldBy;
  const owner = await User.findById(ownerId);
  // const orders = await Order.find({ ProductId: req.params.id });
  // orders.forEach(async (order) => {
  //   await Order.findByIdAndDelete(order._id);
  // });
  if (product.soldBy.toString() !== req.user._id.toString()) {
    return res.status(401).json({ error: "Unauthorized User." });
  }
  var newProducts = [];
  try {
    owner.products.forEach((prod) => {
      if (prod.toString() !== product._id.toString()) {
        newProducts.push(product);
      }
    });
    owner.products = newProducts;
    await owner.save();
    await product.deleteOne();
    return res.status(200).json({ message: "Product deleted." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//CART

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const user = await User.findById(req.user._id);
    const cartItem = { product: productId, quantity };
    user.cart.push(cartItem);
    await user.save();
    return res.status(200).json({ message: "Product added to cart!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { index } = req.params;
  try {
    const user = await User.findById(req.user._id);
    const newCart = user.cart.filter((item) => {
      return item.product.toString() !== index.toString();
    });
    user.cart = newCart;
    await user.save();
    return res.status(200).json({ message: "Product removed from cart!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const clearUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    return res.status(200).json({ message: "Cart Cleared!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    var newCart = [];
    let idx = 0;
    user.cart.forEach(async (item, id) => {
      const x = await Product.findById(item.product);
      if (!x) {
        const y = await Furniture.findById(item.product);
        newCart.push({ ...y, quantity: item.quantity });
      }
      newCart.push({ ...x, quantity: item.quantity });
      idx = idx + 1;
      if (idx === user.cart.length) {
        let neww = [];
        newCart.forEach((item, id) => {
          if (item._doc) {
            neww.push(item);
          }
        })
        return res.status(200).json(neww);
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const addVoucher = async (req, res) => {
  try {
      const { name, discount } = req.body;
      const voucher = await Voucher.findOne({ name });
      if (!voucher) {
        await Voucher.create({ name, discount });
        return res.status(200).json({ message: "Voucher Added!" });
      } else {
        return res.status(404).json({ error: "Voucher name already Exists!" });
      }
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const checkVoucher = async (req, res) => {
  try {
    const { name } = req.body;
      const voucher = await Voucher.findOne({ name })
      if (voucher) {
          return res.status(200).json({discount: voucher.discount});      
      } else {
          return res.status(404).json({ error: "Voucher Not Valid!" });         
      }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


//Order Controller

export const createOrder = async (req, res) => {
  const { products, totalPrice, address } = req.body;
  let newProducts = [];
  for (let i = 0; i < products.length; i++) {
    newProducts.push({
      productId: products[i]._doc._id,
      quantity: products[i].quantity,
    });  
  }
  let salesId = [];
  for (let i = 0; i < products.length; i++) {
    salesId.push(products[i]._doc.soldBy);
  }
  const user = await User.findById(req.user._id);
  const userId = req.user._id;
  try {
    const order = await Order.create({
      products: newProducts,
      userId,
      totalPrice,
      salesId,
      address,
      status: "pending"
    });
    user.address = address;
    await user.save();
    return res
      .status(201)
      .json({ message: "Order Created Successfully!", order, user });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.user._id);
    order.status = "completed";
    await order.save();
    return res.status(200).json({"message": "order updated!"});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//Sales

export const getMySales = async (req, res) => {
  try {
    const allSales = await Order.find({});
    const mySales = [];
    for (let i = 0; i < allSales.length; i++) {
      if (allSales[i].salesId.includes(req.user._id.toString())) {
        mySales.push(allSales[i]);
      }   
    };
    return res.status(200).json(mySales);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const completeSale = async (req, res) => {
  try {
    const { saleId } = req.body;
    const sale = await Order.findById(saleId);
    sale.salesId = [];
    sale.salesId.push(req.user._id);
    sale.status = "completed";
    await sale.save();
    return res.status(200).json({"message": "Sale Completed!"});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const normalSearch = async (req, res) => {
  try {
    const { query } = req.body;
    const user = await User.findById(req.user._id);
    if (!user.recentSearches.includes(query)) {
      let newSearchers = user.recentSearches || [];
      newSearchers.push(query.query);
      user.recentSearches = newSearchers;
      await user.save();
    }
    const allResult = await Product.find({
      name: { $regex: `${query.query}`, $options: "i" },
    });
    return res.status(200).json({ result: allResult});
  } catch (error) {
    console.log(error)
    return res.status(501).json({ error: error.message });
  }
};

export const normalSearchFur = async (req, res) => {
  try {
    const { query } = req.body;
    const allResult = await Furniture.find({
      name: { $regex: `${query.query}`, $options: "i" },
    });
    return res.status(200).json({ result: allResult});
  } catch (error) {
    console.log(error)
    return res.status(501).json({ error: error.message });
  }
};


export const saveThing = async (req, res) => {
  try {
    const { thingId } = req.body;
    const thingHousing = await Product.findById(thingId);
    const thingFurniture = await Furniture.findById(thingId);
    let saved = await Save.findOne({ userId: req.user._id });
    if (!saved) {
      saved = await Save.create({ userId: req.user._id });
      if (thingHousing) {
        saved.savedHousings.push(thingId);
        await saved.save();
      } else {
        saved.savedFurnitures.push(thingId);
        await saved.save();
      }
    } else {
      if (thingHousing) {
        if (!saved.savedHousings.includes(thingId)) {
          saved.savedHousings.push(thingId);
          await saved.save();
        }
      } else {
        if (!saved.savedFurnitures.includes(thingId)) {
          saved.savedFurnitures.push(thingId);
          await saved.save();
        }
      }
    }
    return res.status(200).json({ message: "Item has been saved"});
  } catch (error) {
    console.log(error)
    return res.status(501).json({ error: error.message });
  }
};

// export const removeSaved = async (req, res) => {
//   try {
//     const id = req.body;
//     const saved = await Save.findOne({ userId: req.user._id });
//     for (let i = 0; i < saved.savedHousings.length; i++) {
//       const element = array[i];
//       if()
//     }
//     return res.status(200).json({ result: allResult });
//   } catch (error) {
//     console.log(error);
//     return res.status(501).json({ error: error.message });
//   }
// };