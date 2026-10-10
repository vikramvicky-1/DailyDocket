import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb.js";
import Order from "../../../../models/Order.js";
import mongoose from "mongoose";
import { checkApiPermission } from "../../../../lib/rbac-server.js";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "orders", "view");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const { id } = await params;

    let order = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order.toJSON(), { status: 200 });
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "orders", "manage");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const { id } = await params;
    const body = await request.json();

    let query = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { orderId: id };
    }

    const updateData = {};
    if (body.date !== undefined) updateData.date = new Date(body.date);
    if (body.deliveryDate !== undefined) updateData.deliveryDate = new Date(body.deliveryDate);
    if (body.customerName !== undefined) updateData.customerName = body.customerName.trim();
    if (body.orderId !== undefined) updateData.orderId = body.orderId.trim();
    if (body.totalAmount !== undefined || body.amount !== undefined) {
      updateData.totalAmount = Number(body.totalAmount !== undefined ? body.totalAmount : body.amount);
    }

    if (body.paymentMode !== undefined) {
      let finalMode = body.paymentMode;
      if (finalMode.toLowerCase() === "online") finalMode = "Online";
      if (finalMode.toLowerCase() === "cash") finalMode = "Cash";
      updateData.paymentMode = finalMode;
    }

    if (body.status !== undefined || body.orderStatus !== undefined) {
      let finalStatus = body.status || body.orderStatus;
      const statusMap = {
        completed: "Completed",
        cancelled: "Cancelled",
        "out-for-delivery": "Out for Delivery",
        "order-received": "Order Received",
      };
      if (statusMap[finalStatus.toLowerCase()]) {
        finalStatus = statusMap[finalStatus.toLowerCase()];
      }
      updateData.status = finalStatus;
    }

    if (body.billAttachment !== undefined) updateData.billAttachment = body.billAttachment;
    if (body.paymentAttachment !== undefined) updateData.paymentAttachment = body.paymentAttachment;

    const updated = await Order.findOneAndUpdate(query, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updated.toJSON(), { status: 200 });
  } catch (error) {
    console.error("PUT /api/orders/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update order" },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "orders", "manage");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const { id } = await params;

    let query = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { orderId: id };
    }

    const deleted = await Order.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order deleted successfully", id },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/orders/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete order" },
      { status: 500 }
    );
  }
}
