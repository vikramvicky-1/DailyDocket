import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb.js";
import Expense from "../../../../models/Expense.js";
import mongoose from "mongoose";
import { checkApiPermission } from "../../../../lib/rbac-server.js";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "expenses", "view");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Expense ID" }, { status: 400 });
    }

    const expense = await Expense.findById(id);

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(expense.toJSON(), { status: 200 });
  } catch (error) {
    console.error("GET /api/expenses/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch expense" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "expenses", "manage");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const { id } = await params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Expense ID" }, { status: 400 });
    }

    const updateData = {};
    if (body.date !== undefined) updateData.date = new Date(body.date);
    if (body.category !== undefined) updateData.category = body.category.trim();
    if (body.subcategory !== undefined) updateData.subcategory = body.subcategory.trim();
    if (body.totalAmount !== undefined || body.amount !== undefined) {
      updateData.totalAmount = Number(body.totalAmount !== undefined ? body.totalAmount : body.amount);
    }

    if (body.status !== undefined) {
      let finalStatus = body.status;
      if (finalStatus.toLowerCase() === "paid") finalStatus = "Paid";
      if (finalStatus.toLowerCase() === "pending") finalStatus = "Pending";
      updateData.status = finalStatus;
    }

    if (body.paymentMode !== undefined) {
      let finalMode = body.paymentMode;
      if (finalMode.toLowerCase() === "online") finalMode = "Online";
      if (finalMode.toLowerCase() === "cash") finalMode = "Cash";
      updateData.paymentMode = finalMode;
    }

    if (body.billAttachment !== undefined) updateData.billAttachment = body.billAttachment;
    if (body.remarks !== undefined) updateData.remarks = body.remarks;

    const updated = await Expense.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(updated.toJSON(), { status: 200 });
  } catch (error) {
    console.error("PUT /api/expenses/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update expense" },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "expenses", "manage");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Expense ID" }, { status: 400 });
    }

    const deleted = await Expense.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Expense deleted successfully", id },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/expenses/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete expense" },
      { status: 500 }
    );
  }
}
