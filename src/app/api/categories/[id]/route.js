import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb.js";
import Category from "../../../../models/Category.js";
import mongoose from "mongoose";
import { checkApiPermission } from "../../../../lib/rbac-server.js";

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "categories", "manage");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const { id } = await params;

    let query = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { name: id };
    }

    const deleted = await Category.findOneAndDelete(query);
    if (!deleted) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Category deleted successfully", id },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/categories/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
