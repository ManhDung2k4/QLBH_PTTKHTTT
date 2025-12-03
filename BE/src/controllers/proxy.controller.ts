import { Request, Response } from "express";
import axios from "axios";

export const proxyImage = async (req: Request, res: Response) => {
  try {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ message: "URL parameter is required" });
    }

    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://www.thegioididong.com/",
      },
      timeout: 10000,
    });

    const contentType = response.headers["content-type"];
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(response.data);
  } catch (error: any) {
    console.error("Proxy image error:", error.message);
    res.status(500).json({ message: "Failed to fetch image" });
  }
};
