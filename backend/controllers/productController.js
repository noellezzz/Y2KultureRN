import Product from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";

export const uploadProduct = async (req, res) => {
  try {
    const { name, description, price, type, status, category, stock } =
      req.body;
    let imageUrl = null;
    let cloudinaryId = null;

    if (req.file) {
      const uploadResponse = await cloudinary.uploader.upload(req.file.path);
      imageUrl = uploadResponse.secure_url;
      cloudinaryId = uploadResponse.public_id;
    }

    const parsedStock = typeof stock === "string" ? JSON.parse(stock) : stock;

    const product = new Product({
      name,
      description,
      price,
      type,
      status,
      category,
      image: imageUrl,
      cloudinaryId,
      stock: parsedStock,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, type, status, category, stock } =
      req.body;
    let imageUrl = null;
    let cloudinaryId = null;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.file) {
      if (product.cloudinaryId) {
        await cloudinary.uploader.destroy(product.cloudinaryId);
      }
      const uploadResponse = await cloudinary.uploader.upload(req.file.path);
      imageUrl = uploadResponse.secure_url;
      cloudinaryId = uploadResponse.public_id;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.type = type || product.type;
    product.status = status || product.status;
    product.category = category || product.category;
    product.stock = stock ? JSON.parse(stock) : product.stock;
    product.image = imageUrl || product.image;
    product.cloudinaryId = cloudinaryId || product.cloudinaryId;

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.cloudinaryId) {
      await cloudinary.uploader.destroy(product.cloudinaryId);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const addPromotion = async (req, res) => {
  try {
    const { name, description, percentOff, dateEnd, status } = req.body;
    const productId = req.params.id;

    // Input validation
    if (!name || !description || !percentOff || !dateEnd) {
      return res.status(400).json({
        message:
          "All promotion fields are required: name, description, percentOff, dateEnd",
      });
    }

    // Validate percentOff is a number between 0 and 100
    const discount = Number(percentOff);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      return res.status(400).json({
        message: "Percent off must be a number between 0 and 100",
      });
    }

    // Validate dateEnd is a valid future date
    const endDate = new Date(dateEnd);
    if (isNaN(endDate.getTime()) || endDate <= new Date()) {
      return res.status(400).json({
        message: "End date must be a valid future date",
      });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create the promotion
    product.promo = {
      name,
      description,
      percentOff: discount,
      dateCreated: new Date(),
      dateEnd: endDate,
      status: status || "inactive",
    };

    // Save the updated product
    await product.save();

    // Send push notification
    try {
      const pushToken = "ExponentPushToken[hk6sDSESSQet47CWRBfgq1]";

      const notificationMessage = {
        to: pushToken,
        sound: "default",
        title: "New Promotion Added",
        body: `${name}: ${percentOff}% off on ${product.name}`,
        data: {
          productId: product._id.toString(),
          promoName: name,
          percentOff: discount,
          type: "PRODUCT_DETAILS",
          screen: "(tabs)/products",
        },
      };

      const sendNotification = async (message) => {
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });
      };

      await sendNotification(notificationMessage);
      console.log("Push notification sent for new promotion");
    } catch (notificationError) {
      console.error("Error sending push notification:", notificationError);
      // Continue with the response even if notification fails
    }

    res.status(200).json({
      message: "Promotion added successfully",
      product,
    });
  } catch (error) {
    console.error("Error adding promotion:", error);
    res.status(500).json({ message: error.message });
  }
};
