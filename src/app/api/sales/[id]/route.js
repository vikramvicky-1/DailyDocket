import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb.js";
import Sale from "../../../../models/Sale.js";
import mongoose from "mongoose";
import { checkApiPermission } from "../../../../lib/rbac-server.js";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "sales", "view");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const { id } = await params;

    let sale = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      sale = await Sale.findById(id);
    }

    if (!sale) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    }

    return NextResponse.json(sale.toJSON(), { status: 200 });
  } catch (error) {
    console.error("GET /api/sales/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch sale" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "sales", "manage");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const { id } = await params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Sale ID" }, { status: 400 });
    }

    const updateData = {};
    if (body.date !== undefined) updateData.date = new Date(body.date);
    if (body.openingCash !== undefined) updateData.openingCash = Number(body.openingCash);
    if (body.purchaseCash !== undefined) updateData.purchaseCash = Number(body.purchaseCash);
    if (body.onlineCash !== undefined) updateData.onlineCash = Number(body.onlineCash);
    if (body.physicalCash !== undefined) updateData.physicalCash = Number(body.physicalCash);
    if (body.cashTransferred !== undefined) updateData.cashTransferred = Number(body.cashTransferred);
    if (body.closingCash !== undefined) updateData.closingCash = Number(body.closingCash);
    if (body.totalSale !== undefined || body.totalSales !== undefined) {
      updateData.totalSales = Number(body.totalSale !== undefined ? body.totalSale : body.totalSales);
    }
    if (body.attachment !== undefined) updateData.attachment = body.attachment;

    const updatedSale = await Sale.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedSale) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    }

    return NextResponse.json(updatedSale.toJSON(), { status: 200 });
  } catch (error) {
    console.error("PUT /api/sales/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update sale" },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "sales", "manage");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Sale ID" }, { status: 400 });
    }

    const deleted = await Sale.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Sale deleted successfully", id },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/sales/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete sale" },
      { status: 500 }
    );
  }
}
