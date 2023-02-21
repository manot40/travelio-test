import mongoose, { Schema, model, type Document, type Model } from 'mongoose';

const FavoriteSchema = new Schema(
  {
    title: { type: String, required: true },
    authors: { type: [String] },
    publisher: { type: String },
    publishedDate: { type: Date },
    description: { type: String },
    ratingsCount: { type: Number },
    averageRating: { type: Number },
    image: { type: String },
  },
  { timestamps: true }
);

export type DFavorite = Document & Favorite;

export const Favorite: Model<DFavorite> = mongoose.models.Favorite || model('Favorite', FavoriteSchema);
