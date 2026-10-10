import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb.js";
import Order from "../../../models/Order.js";
import { checkApiPermission } from "../../../lib/rbac-server.js";

export async function GET(request) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "orders", "view");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const orders = await Order.find().sort({ date: -1, createdAt: -1 });
    const formatted = orders.map((o) => o.toJSON());
    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "orders", "manage");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const body = await request.json();

    const {
      orderId,
      date,
      deliveryDate,
      customerName,
      amount,
      totalAmount,
      paymentMode,
      orderStatus,
      status,
      billAttachment,
      paymentAttachment,
    } = body;

    if (!customerName) {
      return NextResponse.json(
        { error: "Customer name is required" },
        { status: 400 }
      );
    }

    const genOrderId =
      orderId && orderId.trim() !== ""
        ? orderId.trim()
        : `ID${Math.floor(100000 + Math.random() * 900000)}`;

    const parsedDate = date ? new Date(date) : new Date();
    const parsedDelivery = deliveryDate
      ? new Date(deliveryDate)
      : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

    const numericAmount =
      totalAmount !== undefined && totalAmount !== ""
        ? Number(totalAmount)
        : amount !== undefined && amount !== ""
        ? Number(amount)
        : 0;

    // Normalize order status (e.g. "completed" -> "Completed", "order-received" -> "Order Received")
    let finalStatus = status || orderStatus || "Order Received";
    const statusMap = {
      completed: "Completed",
      cancelled: "Cancelled",
      "out-for-delivery": "Out for Delivery",
      "order-received": "Order Received",
    };
    if (statusMap[finalStatus.toLowerCase()]) {
      finalStatus = statusMap[finalStatus.toLowerCase()];
    }

    // Normalize payment mode (e.g. "online" -> "Online", "cash" -> "Cash")
    let finalMode = paymentMode || "Online";
    if (finalMode.toLowerCase() === "online") finalMode = "Online";
    if (finalMode.toLowerCase() === "cash") finalMode = "Cash";

    const newOrder = new Order({
      orderId: genOrderId,
      date: parsedDate,
      deliveryDate: parsedDelivery,
      customerName: customerName.trim(),
      totalAmount: numericAmount,
      paymentMode: finalMode,
      status: finalStatus,
      billAttachment: billAttachment || null,
      paymentAttachment: paymentAttachment || null,
    });

    const saved = await newOrder.save();
    return NextResponse.json(saved.toJSON(), { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 400 }
    );
  }
}
