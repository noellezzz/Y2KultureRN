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

export const getAllOrders = async (req, res) => {
  try {
    const users = await User.find({});

    // Extract orders from all users and flatten into a single array
    const allOrders = users.reduce((orders, user) => {
      // Add user info to each order for reference
      const userOrders = user.orders.map((order) => ({
        ...order.toObject(),
        userInfo: {
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      }));

      return [...orders, ...userOrders];
    }, []);

    res.status(200).json({ orders: allOrders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { userId, orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Canceled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the order
    const orderIndex = user.orders.findIndex(
      (order) => order._id.toString() === orderId
    );
    if (orderIndex === -1) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Store the previous status for notification comparison
    const oldStatus = user.orders[orderIndex].status;

    // Update the status
    user.orders[orderIndex].status = status;
    await user.save();

    // Send push notification
    try {
      const pushToken = "ExponentPushToken[hk6sDSESSQet47CWRBfgq1]";

      const notificationMessage = {
        to: pushToken,
        sound: "default",
        title: "Order Status Update",
        body: `Your order has been updated from ${oldStatus} to ${status}`,
        data: {
          orderId: orderId,
          newStatus: status,
          type: "ORDER_DETAILS",
          screen: "(tabs)/orders",
          userId: user._id,
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
      console.log("Push notification sent for order status update");
    } catch (notificationError) {
      console.error("Error sending push notification:", notificationError);
      // Continue with the response even if notification fails
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: user.orders[orderIndex],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
