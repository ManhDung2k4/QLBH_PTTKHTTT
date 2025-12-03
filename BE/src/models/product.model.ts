import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    thumbnail: { type: String, required: true },
    images: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    slug: { type: String, required: true, unique: true },
    // Thông tin đặc thù điện thoại
    brand: { type: String, required: true }, // Hãng: Apple, Samsung, Xiaomi...
    category: { type: String, default: "smartphone" },
    screen: { type: String }, // Kích thước màn hình
    os: { type: String }, // Hệ điều hành
    camera: { type: String }, // Camera
    cameraFront: { type: String }, // Camera trước
    cpu: { type: String }, // CPU
    ram: { type: String }, // RAM
    rom: { type: String }, // Bộ nhớ trong
    battery: { type: String }, // Pin
    sim: { type: String }, // SIM
    weight: { type: String }, // Trọng lượng
    colors: { type: [String], default: [] }, // Màu sắc
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema, "products");
