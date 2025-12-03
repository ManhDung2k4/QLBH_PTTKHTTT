import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { User } from "../models/user.model";
import { Product } from "../models/product.model";
import { Types } from "mongoose";
import bcrypt from "bcrypt";

// Tạo đơn hàng mới
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customer, items, paymentMethod, note } = req.body;

    // Kiểm tra tồn kho và tính tổng tiền
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.title}. Available: ${product.stock}`,
        });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        productId: product._id,
        productName: product.title,
        productImage: product.thumbnail,
        price: product.price,
        quantity: item.quantity,
        subtotal: subtotal,
      });
    }

    // Tìm hoặc tạo user với role='user' (khách hàng)
    let userDoc = await User.findOne({ phone: customer.phone, role: "user" });
    if (!userDoc) {
      // Tạo username tự động từ phone
      const username = `user_${customer.phone}`;
      // Tạo password mặc định (nên yêu cầu user đổi sau)
      const hashedPassword = await bcrypt.hash(customer.phone.slice(-4), 10);

      userDoc = new User({
        username: username,
        password: hashedPassword,
        fullName: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        role: "user",
      });
    } else {
      // Cập nhật thông tin khách hàng nếu đã tồn tại
      userDoc.fullName = customer.name;
      userDoc.email = customer.email || userDoc.email;
      userDoc.address = customer.address || userDoc.address;
    }

    // Tạo mã đơn hàng
    const count = await Order.countDocuments();
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(
      date.getMonth() + 1
    ).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
    const orderNumber = `ORD${dateStr}${String(count + 1).padStart(4, "0")}`;

    // Tạo đơn hàng
    const order = new Order({
      orderNumber: orderNumber,
      userId: userDoc._id,
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
      },
      items: orderItems,
      totalAmount: totalAmount,
      finalAmount: totalAmount,
      paymentMethod: paymentMethod || "cash",
      note: note,
      createdBy: req.body.userId,
    });

    await order.save();

    // Cập nhật tồn kho
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Cập nhật thông tin thống kê khách hàng
    userDoc.totalOrders = (userDoc.totalOrders || 0) + 1;
    userDoc.totalSpent = (userDoc.totalSpent || 0) + totalAmount;
    userDoc.lastOrderDate = new Date();
    await userDoc.save();

    res.status(201).json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách đơn hàng với phân trang
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, phone, orderNumber } = req.query;

    const filter: any = {};
    if (status && status !== "all") filter.orderStatus = status;
    if (phone) filter["customer.phone"] = { $regex: phone, $options: "i" };
    if (orderNumber)
      filter.orderNumber = { $regex: orderNumber, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("createdBy", "username");

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết đơn hàng
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate("createdBy", "username");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus, paymentStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Hủy đơn hàng (hoàn trả tồn kho)
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus === "delivered") {
      return res.status(400).json({ message: "Cannot cancel delivered order" });
    }

    // Hoàn trả tồn kho
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    order.orderStatus = "cancelled";
    await order.save();

    // Cập nhật thông tin khách hàng (User)
    if (order.customer && order.customer.phone) {
      await User.findOneAndUpdate(
        { phone: order.customer.phone, role: "user" },
        {
          $inc: {
            totalOrders: -1,
            totalSpent: -order.finalAmount,
          },
        }
      );
    }

    res.status(200).json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Thống kê đơn hàng
export const getOrderStats = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const filter: any = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    const stats = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$finalAmount" },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "pending"] }, 1, 0] },
          },
          completedOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0] },
          },
        },
      },
    ]);

    res.status(200).json({ success: true, data: stats[0] || {} });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Thống kê sản phẩm bán chạy
export const getBestSellingProducts = async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          productName: { $first: "$items.productName" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.subtotal" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          productName: 1,
          productImage: "$productInfo.thumbnail",
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: Number(limit) },
    ]);

    res.status(200).json({ success: true, data: products });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Thống kê doanh thu theo thời gian
export const getRevenueByPeriod = async (req: Request, res: Response) => {
  try {
    const { period = "day", startDate, endDate } = req.query;

    const filter: any = { orderStatus: { $ne: "cancelled" } };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    let groupBy: any = {};
    if (period === "day") {
      groupBy = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };
    } else if (period === "month") {
      groupBy = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      };
    } else if (period === "year") {
      groupBy = { year: { $year: "$createdAt" } };
    }

    const revenue = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: groupBy,
          totalRevenue: { $sum: "$finalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } },
    ]);

    res.status(200).json({ success: true, data: revenue });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
