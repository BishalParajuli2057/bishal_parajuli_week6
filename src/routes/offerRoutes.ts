import express, { Request, Response } from "express";
import Offer from "../models/Offer";
import Image from "../models/Image";
import { upload } from "../middleware/upload";

const router = express.Router();

// POST route to create a new offer
router.post(
  "/upload",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const { title, description, price } = req.body;

      // Validate required fields
      if (!title || !description || !price) {
        return res
          .status(400)
          .json({ error: "Title, description, and price are required" });
      }

      let imageId: string | undefined;

      // If image was uploaded, save it to database
      if (req.file) {
        const imagePath = `public/images/${req.file.filename}`;

        const newImage = new Image({
          filename: req.file.filename,
          path: imagePath,
        });

        const savedImage = await newImage.save();
        imageId = savedImage._id.toString();
      }

      // Create new offer
      const newOffer = new Offer({
        title,
        description,
        price: Number(price),
        ...(imageId && { imageId }),
      });

      const savedOffer = await newOffer.save();

      res.status(201).json({
        message: "Offer created successfully",
        offer: savedOffer,
      });
    } catch (error) {
      console.error("Error creating offer:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// GET route to fetch all offers with image data
router.get("/offers", async (req: Request, res: Response) => {
  try {
    const offers = await Offer.find();

    // Map offers to include image path
    const offersWithImages = await Promise.all(
      offers.map(async (offer) => {
        let imagePath = null;

        if (offer.imageId) {
          const image = await Image.findById(offer.imageId);
          if (image) {
            imagePath = image.path;
          }
        }

        return {
          title: offer.title,
          description: offer.description,
          price: offer.price,
          imagePath: imagePath ? imagePath : null,
        };
      })
    );

    res.status(200).json(offersWithImages);
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
