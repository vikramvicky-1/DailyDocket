import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb.js";
import Expense from "../../../models/Expense.js";
import { checkApiPermission } from "../../../lib/rbac-server.js";

export async function GET(request) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "expenses", "view");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const expenses = await Expense.find().sort({ date: -1, createdAt: -1 });
    const formatted = expenses.map((e) => e.toJSON());
    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("GET /api/expenses error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "expenses", "manage");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const body = await request.json();

    const {
      date,
      category,
      subcategory,
      totalAmount,
      amount,
      status,
      paymentMode,
      billAttachment,
      remarks,
    } = body;

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    const parsedDate = date ? new Date(date) : new Date();
    const numericAmount =
      totalAmount !== undefined && totalAmount !== ""
        ? Number(totalAmount)
        : amount !== undefined && amount !== ""
        ? Number(amount)
        : 0;

    let finalStatus = status || "Paid";
    if (finalStatus.toLowerCase() === "paid") finalStatus = "Paid";
    if (finalStatus.toLowerCase() === "pending") finalStatus = "Pending";

    let finalMode = paymentMode || "Online";
    if (finalMode.toLowerCase() === "online") finalMode = "Online";
    if (finalMode.toLowerCase() === "cash") finalMode = "Cash";

    const newExpense = new Expense({
      date: parsedDate,
      category: category.trim(),
      subcategory: subcategory ? subcategory.trim() : "",
      totalAmount: numericAmount,
      status: finalStatus,
      paymentMode: finalMode,
      billAttachment: billAttachment || null,
      remarks: remarks || "-",
    });

    const saved = await newExpense.save();
    return NextResponse.json(saved.toJSON(), { status: 201 });
  } catch (error) {
    console.error("POST /api/expenses error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create expense" },
      { status: 400 }
    );
  }
}
