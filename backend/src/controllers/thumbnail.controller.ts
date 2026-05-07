import { Request, Response } from "express";
import { Thumbnail } from "../models/thumbnail.model.js";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

const stylePrompt = {
  "Bold & Graphic":
    "YouTube thumbnail, bold typography, large readable text, vibrant colors, high contrast, expressive face, dramatic lighting, clickworthy composition, professional thumbnail design",
  "Tech/Futuristic":
    "YouTube thumbnail, futuristic tech style, neon glow, cyberpunk colors, holographic UI, digital grid background, glowing elements, high-tech atmosphere, sleek composition",
  Minimalist:
    "YouTube thumbnail, minimalist design, clean layout, lots of white space, simple typography, limited color palette, modern aesthetic, balanced composition, subtle shadows",
  Photorealistic:
    "YouTube thumbnail, photorealistic image, natural lighting, realistic textures, depth of field, cinematic composition, high detail, sharp focus, professional photography style",
  Illustrated:
    "YouTube thumbnail, illustrated style, cartoon or semi-realistic art, vibrant colors, smooth shading, stylized characters, creative composition, digital painting",
};

const colorSchemeDescription = {
  vibrant: "bright vibrant colors, high saturation, energetic mood, bold contrast, eye-catching palette, lively and dynamic feel",
  sunset: "warm sunset colors, orange red pink gradient, soft glow, dramatic sky tones, warm lighting, cinematic atmosphere",
  ocean: "cool ocean tones, blue and cyan palette, fresh and calm mood, clean gradients, water-inspired colors, refreshing aesthetic",
  forest: "natural green tones, earthy colors, organic feel, calm and grounded mood, nature-inspired palette, soft contrast",
  purple: "rich purple tones, dreamy and mystical vibe, soft glow, fantasy aesthetic, smooth gradients, vibrant yet elegant",
  monochrome: "black white gray tones, minimal contrast, clean and modern look, neutral palette, professional and simple design",
  neon: "neon glowing colors, cyberpunk aesthetic, high contrast, bright highlights on dark background, electric vibrant glow",
  pastel: "soft pastel colors, light tones, gentle and calm mood, low contrast, smooth and airy aesthetic, cute and modern",
};

const aspectRatioDimensions: Record<string, { width: number; height: number }> = {
  "16:9": { width: 1280, height: 720 },
  "4:3":  { width: 1024, height: 768 },
  "1:1":  { width: 1024, height: 1024 },
  "9:16": { width: 720,  height: 1280 },
};

export async function createThumbnail(request: Request, response: Response) {
  try {
    const { userId } = request.session;
    const {
      title,
      prompt: prompt_used,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
      image_url,
      user_prompt,
    } = request.body;

    const thumbnail = await Thumbnail.create({
      userId,
      title,
      prompt_used,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
      image_url,
      user_prompt,
      isGenerating: true,
    });

    let prompt = `ultra high quality YouTube thumbnail, ${stylePrompt[style as keyof typeof stylePrompt]}, subject: ${title}, sharp focus, 8k resolution, hyper detailed, professional design, visually striking composition, optimized for maximum CTR`;

    if (color_scheme) {
      prompt += `, ${colorSchemeDescription[color_scheme as keyof typeof colorSchemeDescription]}`;
    }

    if (text_overlay) {
      prompt += `, bold overlay text that reads: "${text_overlay}", large readable font, strong contrast`;
    }

    if (prompt_used) {
      prompt += `, ${prompt_used}`;
    }

    prompt += `, no watermark, no border, cinematic lighting, professional YouTube thumbnail, eye-catching, click-worthy`;

    // Resolve dimensions
    const { width, height } = aspectRatioDimensions[aspect_ratio] ?? { width: 1280, height: 720 };

    // Call Pollinations
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&model=flux&nologo=true&enhance=true&seed=${Date.now()}`;

    const imgResponse = await fetch(pollinationsUrl);
    if (!imgResponse.ok) {
      throw new Error(`Pollinations error: ${imgResponse.status} ${imgResponse.statusText}`);
    }

    const finalBuffer = Buffer.from(await imgResponse.arrayBuffer());

    // Save → Cloudinary
    const fileName = `finaloutput-${thumbnail._id}.png`;
    const filePath = path.join("images", fileName);

    fs.mkdirSync("images", { recursive: true });
    fs.writeFileSync(filePath, finalBuffer);

    const cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
    });

    thumbnail.image_url = cloudinaryResponse.url;
    thumbnail.isGenerating = false;
    await thumbnail.save();

    response.json({
      message: "Thumbnail created successfully",
      thumbnail,
    });

    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Error creating thumbnail:", error);
    response.status(500).json({ error: "Failed to create thumbnail" });
  }
}

export async function deleteThumbnail(request: Request, response: Response) {
  try {
    const { id } = request.params;
    const { userId } = request.session;

    await Thumbnail.findByIdAndDelete({ _id: id, userId });

    response.json({ message: "Thumbnail deleted successfully" });
  } catch (error) {
    console.error("Error deleting thumbnail:", error);
    response.status(500).json({ error: "Failed to delete thumbnail" });
  }
}