import { User } from "../models/user.model";
import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username, isActive: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users with pagination
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const skip = (page - 1) * limit;

    const searchQuery = search
      ? {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(searchQuery)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password, fullName, email, phone, address, role } =
      req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if phone already exists (for users with role='user')
    if (phone && role === "user") {
      const existingPhone = await User.findOne({ phone, role: "user" });
      if (existingPhone) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
    }

    const newUser = new User({
      username,
      password,
      fullName,
      email,
      phone,
      address,
      role: role || "user",
      isActive: true,
    });

    await newUser.save();

    const userResponse: any = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ success: true, data: userResponse });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, address, role, isActive } = req.body;

    // Check if phone already exists for other users (for users with role='user')
    if (phone && role === "user") {
      const existingPhone = await User.findOne({
        phone,
        role: "user",
        _id: { $ne: req.params.id },
      });
      if (existingPhone) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, email, phone, address, role, isActive },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== oldPassword) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (soft delete)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deactivated successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
