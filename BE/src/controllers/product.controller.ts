import { Types } from "mongoose";
import { Product } from "../models/product.model";
import { Request, Response } from "express";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const {
      search,
      brand,
      minPrice,
      maxPrice,
      ram,
      rom,
      sortBy,
      order,
      page = 1,
      limit = 100, // Mặc định 100 cho client, admin có thể dùng page
    } = req.query;

    // Tạo filter object
    const filter: any = { isActive: true };

    // Tìm kiếm theo tên
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Lọc theo hãng
    if (brand && brand !== "all") {
      filter.brand = brand;
    }

    // Lọc theo giá
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Lọc theo RAM
    if (ram && ram !== "all") {
      filter.ram = { $regex: ram, $options: "i" };
    }

    // Lọc theo ROM/Bộ nhớ
    if (rom && rom !== "all") {
      filter.rom = { $regex: rom, $options: "i" };
    }

    // Sắp xếp
    let sort: any = { createdAt: -1 }; // Mặc định: mới nhất
    if (sortBy === "price") {
      sort = { price: order === "desc" ? -1 : 1 };
    } else if (sortBy === "rating") {
      sort = { rating: -1 };
    } else if (sortBy === "name") {
      sort = { title: order === "desc" ? -1 : 1 };
    }

    // Phân trang
    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, data: savedProduct });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { _id, ...updateData } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error: any) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById({
      _id: new Types.ObjectId(id),
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("Deleting product with ID:", id);
    const deletedProduct = await Product.findByIdAndDelete({
      _id: new Types.ObjectId(id),
    });
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
    console.error("Error deleting product:", error);
  }
};

// Import dữ liệu điện thoại từ file JSON
export const importPhoneData = async (req: Request, res: Response) => {
  try {
    const fs = await import("fs");
    const path = await import("path");

    const dataPath = path.join(__dirname, "../../shop.products.phones.json");
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    // Xóa dữ liệu cũ (nếu muốn)
    // await Product.deleteMany({});

    await Product.insertMany(data);
    res.status(200).json({
      success: true,
      message: `Imported ${data.length} products successfully`,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy sản phẩm sắp hết hàng
export const getLowStockProducts = async (req: Request, res: Response) => {
  try {
    const { threshold = 10 } = req.query;

    const products = await Product.find({
      stock: { $lte: Number(threshold), $gt: 0 },
    }).sort({ stock: 1 });

    res.status(200).json({ success: true, data: products });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
