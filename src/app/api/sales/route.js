import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb.js";
import Sale from "../../../models/Sale.js";
import { checkApiPermission } from "../../../lib/rbac-server.js";

export async function GET(request) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "sales", "view");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const sales = await Sale.find().sort({ date: -1, createdAt: -1 });
    const formatted = sales.map((s) => s.toJSON());
    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("GET /api/sales error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch sales" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "sales", "manage");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const body = await request.json();

    const {
      date,
      openingCash,
      purchaseCash,
      onlineCash,
      physicalCash,
      cashTransferred,
      closingCash,
      totalSale,
      totalSales,
      attachment,
    } = body;

    const parsedDate = date ? new Date(date) : new Date();
    const opening = Number(openingCash) || 0;
    const purchase = Number(purchaseCash) || 0;
    const online = Number(onlineCash) || 0;
    const physical = Number(physicalCash) || 0;
    const transferred = Number(cashTransferred) || 0;
    const closing = Number(closingCash) || 0;
    const total =
      totalSale !== undefined && totalSale !== ""
        ? Number(totalSale)
        : totalSales !== undefined && totalSales !== ""
        ? Number(totalSales)
        : online + physical;

    const newSale = new Sale({
      date: parsedDate,
      openingCash: opening,
      purchaseCash: purchase,
      onlineCash: online,
      physicalCash: physical,
      cashTransferred: transferred,
      closingCash: closing,
      totalSales: total,
      attachment: attachment || null,
    });

    const saved = await newSale.save();
    return NextResponse.json(saved.toJSON(), { status: 201 });
  } catch (error) {
    console.error("POST /api/sales error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create sale" },
      { status: 400 }
    );
  }
}
