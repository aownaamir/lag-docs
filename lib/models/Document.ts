import mongoose, { Schema } from "mongoose";

const DocumentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Untitled Document",
      trim: true,
    },

    content: {
      type: String,
      default: "<p></p>",
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
  mongoose.models.Document || mongoose.model("Document", DocumentSchema);
