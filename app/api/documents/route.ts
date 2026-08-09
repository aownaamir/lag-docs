import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";
import { getCurrentUserId } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    await connectDB();

    const owned = await Document.find({
      owner: userId,
    })
      .populate("owner", "name email")
      .sort({ updatedAt: -1 })
      .lean();

    const shared = await Document.find({
      sharedWith: userId,
      owner: { $ne: userId },
    })
      .populate("owner", "name email")
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({
      owned,
      shared,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const title =
      typeof body.title === "string" && body.title.trim()
        ? body.title.trim()
        : "Untitled Document";

    const content = typeof body.content === "string" ? body.content : "<p></p>";

    await connectDB();

    const document = await Document.create({
      title,
      content,
      owner: userId,
      sharedWith: [],
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 },
    );
  }
}
