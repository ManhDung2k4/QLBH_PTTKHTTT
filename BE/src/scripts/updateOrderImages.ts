import mongoose from "mongoose";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import dotenv from "dotenv";

dotenv.config();

async function updateOrderImages() {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connected to MongoDB");

    const orders = await Order.find({});
    console.log(`Found ${orders.length} orders`);

    let updated = 0;
    for (const order of orders) {
      let hasChanges = false;

      for (const item of order.items) {
        if (!item.productImage) {
          const product = await Product.findById(item.productId);
          if (product && product.thumbnail) {
            item.productImage = product.thumbnail;
            hasChanges = true;
          }
        }
      }

      if (hasChanges) {
        await order.save();
        updated++;
        console.log(`Updated order ${order.orderNumber}`);
      }
    }

    console.log(`✅ Updated ${updated} orders with product images`);
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

updateOrderImages();
