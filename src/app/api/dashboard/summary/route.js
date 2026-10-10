import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb.js";
import Sale from "../../../../models/Sale.js";
import Order from "../../../../models/Order.js";
import Expense from "../../../../models/Expense.js";
import User from "../../../../models/User.js";

export async function GET() {
  try {
    await connectToDatabase();

    const [salesStats, expenseStats, totalSalesCount, orders, usersCount] =
      await Promise.all([
        Sale.aggregate([
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalSales" },
            },
          },
        ]),
        Expense.aggregate([
          {
            $group: {
              _id: "$status",
              total: { $sum: "$totalAmount" },
              count: { $sum: 1 },
            },
          },
        ]),
        Sale.countDocuments(),
        Order.find().select("status totalAmount"),
        User.countDocuments(),
      ]);

    const totalRevenue = salesStats[0]?.totalRevenue || 0;

    let totalExpenses = 0;
    let paidExpenses = 0;
    let pendingExpenses = 0;

    for (const stat of expenseStats) {
      totalExpenses += stat.total || 0;
      if (stat._id === "Paid") paidExpenses = stat.count;
      if (stat._id === "Pending") pendingExpenses = stat.count;
    }

    const totalOrders = orders.length;
    const completedOrders = orders.filter((o) => o.status === "Completed").length;
    const cancelledOrders = orders.filter((o) => o.status === "Cancelled").length;
    const profit = totalRevenue - totalExpenses;

    return NextResponse.json(
      {
        totalRevenue,
        totalSalesCount,
        totalExpenses,
        totalItemsSold: totalRevenue,
        totalOrders,
        completedOrders,
        cancelledOrders,
        pendingExpenses,
        paidExpenses,
        profit,
        profitMargin:
          totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) + "%" : "0%",
        usersCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/dashboard/summary error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to calculate dashboard summary" },
      { status: 500 }
    );
  }
}
