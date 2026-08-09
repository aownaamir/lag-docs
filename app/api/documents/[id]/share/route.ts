import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";
import { User } from "@/lib/models/User";
import { getCurrentUserId } from "@/lib/auth";
import mongoose from "mongoose";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Params) {
  try {
    const ownerId = await getCurrentUserId();
    const { id } = await params;

    if (!ownerId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid document ID" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const userId = body.userId;

    if (
      typeof userId !== "string" ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    if (ownerId === userId) {
      return NextResponse.json(
        { error: "You already own this document" },
        { status: 400 },
      );
    }

    await connectDB();

    const document = await Document.findOne({
      _id: id,
      owner: ownerId,
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const alreadyShared = document.sharedWith.some(
      (sharedUserId: mongoose.Types.ObjectId) =>
        sharedUserId.toString() === userId,
    );

    if (!alreadyShared) {
      document.sharedWith.push(new mongoose.Types.ObjectId(userId));

      await document.save();
    }

    const updatedDocument = await Document.findById(document._id)
      .populate("owner", "name email")
      .populate("sharedWith", "name email")
      .lean();

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to share document" },
      { status: 500 },
    );
  }
}
