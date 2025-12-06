import mongoose, { Document, Schema } from "mongoose";

export interface IOffer extends Document {
  title: string;
  description: string;
  price: number;
}

const OfferSchema = new Schema<IOffer>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

const Offer = mongoose.model<IOffer>("Offer", OfferSchema);

export default Offer;
