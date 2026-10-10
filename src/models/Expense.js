import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },
    subcategory: {
      type: String,
      default: "",
      trim: true,
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      default: 0,
    },
    status: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Paid",
      required: true,
    },
    paymentMode: {
      type: String,
      default: "Online",
      required: true,
    },
    billAttachment: {
      type: String,
      default: null,
    },
    remarks: {
      type: String,
      default: "-",
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        return ret;
      },
    },
  }
);

export default mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);
