import express, { Request, Response } from "express";
import path from "path";
import mongoose from "mongoose";
import Offer from "./models/Offer";

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Mongo connection (CodeGrade uses this)
const mongoDB: string = "mongodb://127.0.0.1:27017/testdb";

mongoose
  .connect(mongoDB)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: unknown) => console.error("MongoDB connection error:", err));

// Optional: serve front page
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// ===============
//  POST /upload
// ===============
app.post("/upload", async (req: Request, res: Response) => {
  try {
    const { title, description, price } = req.body;

    if (!title || !description || typeof price === "undefined") {
      return res.status(400).send("Title, description and price are required.");
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice)) {
      return res.status(400).send("Price must be a number.");
    }

    const offer = new Offer({
      title,
      description,
      price: numericPrice,
    });

    await offer.save();

    res.status(201).send("Offer created successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving offer.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
