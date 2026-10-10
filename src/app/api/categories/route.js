import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb.js";
import Category from "../../../models/Category.js";
import { checkApiPermission } from "../../../lib/rbac-server.js";

const DEFAULT_CATEGORIES = [
  { name: "Masala Materials", subcategories: ["Spices", "Chili", "Turmeric"] },
  { name: "Powder", subcategories: ["Rice Powder", "Flour", "Corn Starch"] },
  { name: "Snacks", subcategories: ["Chips", "Namkeen", "Biscuits"] },
  { name: "Vegetables", subcategories: ["Potatoes", "Onions", "Tomatoes"] },
  { name: "Packaging", subcategories: ["Boxes", "Pouches", "Tape"] },
  { name: "Utilities", subcategories: ["Electricity", "Water", "Gas"] },
];

export async function GET(request) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "categories", "view");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    let categories = await Category.find().sort({ name: 1 });

    if (categories.length === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES);
      categories = await Category.find().sort({ name: 1 });
    }

    return NextResponse.json(
      categories.map((c) => c.toJSON()),
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "categories", "manage");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const body = await request.json();
    const { name, subcategories } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const cleanName = name.trim();
    const existing = await Category.findOne({ name: cleanName });
    if (existing) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 409 }
      );
    }

    const newCategory = new Category({
      name: cleanName,
      subcategories: Array.isArray(subcategories) ? subcategories : [],
    });

    const saved = await newCategory.save();
    return NextResponse.json(saved.toJSON(), { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create category" },
      { status: 400 }
    );
  }
}
