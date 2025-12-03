import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Order } from "../models/order.model";

// Lấy danh sách khách hàng với phân trang (User có role='user')
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const filter: any = { role: "user" };
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const customers = await User.find(filter)
      .select("-password")
      .sort({ totalSpent: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: customers,
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

// Lấy thông tin khách hàng theo số điện thoại
export const getCustomerByPhone = async (req: Request, res: Response) => {
  try {
    const { phone } = req.params;

    const customer = await User.findOne({ phone, role: "user" }).select(
      "-password"
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ success: true, data: customer });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy lịch sử mua hàng của khách hàng
export const getCustomerOrderHistory = async (req: Request, res: Response) => {
  try {
    const { phone } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find({ "customer.phone": phone })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments({ "customer.phone": phone });

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

// Cập nhật thông tin khách hàng
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, email, address } = req.body;

    const customer = await User.findOneAndUpdate(
      { _id: id, role: "user" },
      { fullName, email, address },
      { new: true }
    ).select("-password");

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ success: true, data: customer });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa khách hàng
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id, role: "user" });
    if (!user) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Kiểm tra xem khách hàng có đơn hàng không
    const orderCount = await Order.countDocuments({
      "customer.phone": user.phone,
    });

    if (orderCount > 0) {
      return res.status(400).json({
        message: "Cannot delete customer with existing orders",
      });
    }

    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Customer deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Thống kê khách hàng
export const getCustomerStats = async (req: Request, res: Response) => {
  try {
    // Lấy thống kê từ Order (tổng doanh thu, số đơn hàng, số khách hàng unique)
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$finalAmount" },
          totalOrders: { $sum: 1 },
          uniqueCustomers: { $addToSet: "$customer.phone" },
        },
      },
    ]);

    const totalRevenue = orderStats[0]?.totalRevenue || 0;
    const totalOrders = orderStats[0]?.totalOrders || 0;
    const totalCustomers = orderStats[0]?.uniqueCustomers?.length || 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Top khách hàng VIP (dựa trên tổng chi tiêu từ orders)
    const topCustomers = await Order.aggregate([
      {
        $group: {
          _id: "$customer.phone",
          customerName: { $first: "$customer.name" },
          customerPhone: { $first: "$customer.phone" },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$finalAmount" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          fullName: "$customerName",
          phone: "$customerPhone",
          totalOrders: 1,
          totalSpent: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalCustomers,
          totalRevenue,
          avgOrderValue,
          avgOrdersPerCustomer:
            totalCustomers > 0 ? totalOrders / totalCustomers : 0,
        },
        topCustomers: topCustomers,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
