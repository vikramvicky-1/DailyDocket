import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: [true, "Order ID is required"],
      trim: true,
      index: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    deliveryDate: {
      type: Date,
      required: [true, "Delivery date is required"],
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      default: 0,
    },
    paymentMode: {
      type: String,
      required: [true, "Payment mode is required"],
      default: "Online",
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      default: "Order Received",
    },
    billAttachment: {
      type: String,
      default: null,
    },
    paymentAttachment: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.amount = ret.totalAmount;
        return ret;
      },
    },
  }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
