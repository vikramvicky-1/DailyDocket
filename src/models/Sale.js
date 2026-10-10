import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    openingCash: {
      type: Number,
      required: [true, "Opening cash is required"],
      default: 0,
    },
    purchaseCash: {
      type: Number,
      required: [true, "Purchase cash is required"],
      default: 0,
    },
    onlineCash: {
      type: Number,
      required: [true, "Online cash is required"],
      default: 0,
    },
    physicalCash: {
      type: Number,
      required: [true, "Physical cash is required"],
      default: 0,
    },
    cashTransferred: {
      type: Number,
      required: [true, "Cash transferred is required"],
      default: 0,
    },
    closingCash: {
      type: Number,
      required: [true, "Closing cash is required"],
      default: 0,
    },
    totalSales: {
      type: Number,
      required: [true, "Total sale is required"],
      default: 0,
    },
    attachment: {
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
        // also keep compatibility for frontend properties
        ret.opening = ret.openingCash;
        ret.purchase = ret.purchaseCash;
        ret.onlinePayment = ret.onlineCash;
        ret.cashPayment = ret.physicalCash;
        ret.transferred = ret.cashTransferred;
        ret.closing = ret.closingCash;
        return ret;
      },
    },
  }
);

export default mongoose.models.Sale || mongoose.model("Sale", SaleSchema);
