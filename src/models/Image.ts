import { Document } from "mongoose";
import mongoose from "mongoose";

export interface IImage extends Document {
  filename: string;
  path: string;
}

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IImage>("Image", imageSchema);
