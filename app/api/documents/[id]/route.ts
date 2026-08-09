import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Get document endpoint",
  });
}

export async function PATCH() {
  return NextResponse.json({
    message: "Update document endpoint",
  });
}

export async function DELETE() {
  return NextResponse.json({
    message: "Delete document endpoint",
  });
}
