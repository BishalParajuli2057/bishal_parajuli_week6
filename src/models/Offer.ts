import { Document } from "mongoose";
import mongoose from "mongoose";

export interface IOffer extends Document {
  title: string;
  description: string;
  price: number;
  imageId?: string;
}

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageId: {
    type: String,
    required: false,
  },
});

export default mongoose.model<IOffer>("Offer", offerSchema);
