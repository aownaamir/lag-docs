import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";
import { getCurrentUserId } from "@/lib/auth";
import mongoose from "mongoose";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;

    if (!userId) {
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

    await connectDB();

    const document = await Document.findOne({
      _id: id,
      $or: [{ owner: userId }, { sharedWith: userId }],
    })
      .populate("owner", "name email")
      .populate("sharedWith", "name email")
      .lean();

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;

    if (!userId) {
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

    const updates: Record<string, string> = {};

    if (typeof body.title === "string") {
      updates.title = body.title.trim() || "Untitled Document";
    }

    if (typeof body.content === "string") {
      updates.content = body.content;
    }

    await connectDB();

    const document = await Document.findOneAndUpdate(
      {
        _id: id,
        $or: [{ owner: userId }, { sharedWith: userId }],
      },
      updates,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("owner", "name email")
      .populate("sharedWith", "name email")
      .lean();

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 },
    );
  }
}
