import { Request, Response } from "express";
import { Thumbnail } from "../models/thumbnail.model.js";
import {
  GenerateContentConfig,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/genai";
import ai from "../config/genai.js";
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
  vibrant:
    "bright vibrant colors, high saturation, energetic mood, bold contrast, eye-catching palette, lively and dynamic feel",

  sunset:
    "warm sunset colors, orange red pink gradient, soft glow, dramatic sky tones, warm lighting, cinematic atmosphere",

  ocean:
    "cool ocean tones, blue and cyan palette, fresh and calm mood, clean gradients, water-inspired colors, refreshing aesthetic",

  forest:
    "natural green tones, earthy colors, organic feel, calm and grounded mood, nature-inspired palette, soft contrast",

  purple:
    "rich purple tones, dreamy and mystical vibe, soft glow, fantasy aesthetic, smooth gradients, vibrant yet elegant",

  monochrome:
    "black white gray tones, minimal contrast, clean and modern look, neutral palette, professional and simple design",

  neon: "neon glowing colors, cyberpunk aesthetic, high contrast, bright highlights on dark background, electric vibrant glow",

  pastel:
    "soft pastel colors, light tones, gentle and calm mood, low contrast, smooth and airy aesthetic, cute and modern",
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

    const model = "gemini-3-pro-image-preview";
    const generationConfig: GenerateContentConfig = {
      maxOutputTokens: 32768,
      temperature: 1,
      topP: 1,
      responseModalities: ["image"],
      imageConfig: {
        aspectRatio: aspect_ratio || "16:9",
        imageSize: "1k",
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_IMAGE_HATE,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_IMAGE_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.OFF,
        },
      ],
    };

    let prompt = ` create a YouTube thumbnail with the following details:
        ${stylePrompt[style as keyof typeof stylePrompt]},
        topic: ${title}
`;
    if (color_scheme) {
      prompt += `color scheme: ${colorSchemeDescription[color_scheme as keyof typeof colorSchemeDescription]}`;
    }

    if (prompt) {
      prompt += `, additional details: ${prompt_used}`;
    }

    prompt += `thumbnail should be ${aspect_ratio} ratio. visually stunning and designed to maximize click-through rates. make it bold ,professional and impossible to ignore`;

    // Call the Gemini API to generate the thumbnail

    const aiResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: generationConfig,
    });
    if (!aiResponse?.candidates?.[0]?.content?.parts) {
      throw new Error("No content generated");
    }

    const parts = aiResponse.candidates[0].content.parts;

    let finalBuffer: Buffer | null = null;

    for (const part of parts) {
      if (part.inlineData?.data) {
        finalBuffer = Buffer.from(part.inlineData.data, "base64");
      }
    }
    const fileName = `finaloutput-${thumbnail._id}.png`;
    const filePath = path.join("images", fileName);

    if (!finalBuffer) {
      throw new Error("No image data found in response");
    }
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
      thumbnail: thumbnail,
    });

    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Error creating thumbnail:", error);
    response.status(500).json({ error: "Failed to create thumbnail" });
  }
}
