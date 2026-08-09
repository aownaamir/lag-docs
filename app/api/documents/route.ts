import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Document } from "@/lib/models/Document";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json([]);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    await connectDB();

    return NextResponse.json(
      { message: "Create document endpoint" },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 },
    );
  }
}
