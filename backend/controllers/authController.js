import User from "../models/userModel.js";
import admin from "../utils/firebaseConfig.js";
import cloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

export const loginOrRegister = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("Received token:", token);
    if (!token) {
      return res
        .status(400)
        .json({ message: "Token and phone number are required" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, picture } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      const { firstName, lastName } = req.body;

      const uploadResponse = picture
        ? await cloudinary.uploader.upload(picture, { folder: "users" })
        : { secure_url: null, public_id: null };

      user = new User({
        email,
        firstName,
        lastName,
        image: uploadResponse.secure_url,
        cloudinaryId: uploadResponse.public_id,
      });

      await user.save();
    }

    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ user, token: jwtToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    let updates = req.body;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle image update
    if (updates.image) {
      if (user.cloudinaryId) {
        await cloudinary.uploader.destroy(user.cloudinaryId);
      }

      const uploadResponse = await cloudinary.uploader.upload(updates.image, {
        folder: "users",
      });

      updates.image = uploadResponse.secure_url;
      updates.cloudinaryId = uploadResponse.public_id;
    }

    // Add new order if present
    if (updates.newOrder) {
      user.orders.push(updates.newOrder);
      delete updates.newOrder; // prevent newOrder from interfering with top-level updates
    }

    // Apply other updates
    Object.assign(user, updates);
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
