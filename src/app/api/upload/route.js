import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate safe unique filename
    const timestamp = Date.now();
    const cleanOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}_${cleanOriginalName}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.writeFile(filePath, buffer);

    return NextResponse.json(
      {
        url: `/uploads/${filename}`,
        name: file.name,
        size: file.size,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: error.message || "File upload failed" },
      { status: 500 }
    );
  }
}
