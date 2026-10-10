import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    emailAddress: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["Administrator", "Staff", "Accountant"],
      default: "Staff",
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    permissions: {
      sales: {
        view: { type: Boolean, default: false },
        manage: { type: Boolean, default: false },
      },
      orders: {
        view: { type: Boolean, default: false },
        manage: { type: Boolean, default: false },
      },
      expenses: {
        view: { type: Boolean, default: false },
        manage: { type: Boolean, default: false },
      },
      categories: {
        view: { type: Boolean, default: false },
        manage: { type: Boolean, default: false },
      },
      userManagement: {
        view: { type: Boolean, default: false },
        manage: { type: Boolean, default: false },
      },
    },
    isDefaultAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password if modified
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Helper method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Exclude password in JSON responses
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Check if model already compiled to avoid OverwriteModelError in Next.js hot reload
export default mongoose.models.User || mongoose.model("User", UserSchema);
