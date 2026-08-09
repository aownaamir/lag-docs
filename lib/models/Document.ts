import mongoose, { Schema, Document as MongooseDocument } from "mongoose";

export interface IDocument extends MongooseDocument {
  title: string;
  content: string;
  owner: mongoose.Types.ObjectId;
  sharedWith: mongoose.Types.ObjectId[];
}

const documentSchema = new Schema<IDocument>(
  {
    title: {
      type: String,
      required: true,
      default: "Untitled Document",
    },

    content: {
      type: String,
      default: "",
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sharedWith: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Document =
  mongoose.models.Document ||
  mongoose.model<IDocument>("Document", documentSchema);
