import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb.js";
import User from "../../../../models/User.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { isDefaultAdminUser } from "../../../../lib/rbac.js";
import { checkApiPermission } from "../../../../lib/rbac-server.js";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "userManagement", "view");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const json = user.toJSON();
    json.name = json.fullName;
    json.email = json.emailAddress;
    json.isDefaultAdmin = isDefaultAdminUser(user);

    return NextResponse.json(json, { status: 200 });
  } catch (error) {
    console.error("GET /api/users/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "userManagement", "manage");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const { id } = await params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isDefAdmin = isDefaultAdminUser(user);

    if (body.fullName !== undefined || body.name !== undefined) {
      user.fullName = (body.fullName || body.name).trim();
    }

    if (body.emailAddress !== undefined || body.email !== undefined) {
      const newEmail = (body.emailAddress || body.email).trim().toLowerCase();
      if (newEmail !== user.emailAddress) {
        // Prevent changing default admin's email if it would break system identity
        if (isDefAdmin) {
          return NextResponse.json(
            { error: "The default system administrator email address cannot be changed." },
            { status: 403 }
          );
        }
        const existing = await User.findOne({ emailAddress: newEmail });
        if (existing && existing._id.toString() !== id) {
          return NextResponse.json(
            { error: "A user with this email address already exists" },
            { status: 409 }
          );
        }
        user.emailAddress = newEmail;
      }
    }

    // Role handling
    if (isDefAdmin) {
      // Default admin must always remain Administrator
      user.role = "Administrator";
      user.permissions = {
        sales: { view: true, manage: true },
        orders: { view: true, manage: true },
        expenses: { view: true, manage: true },
        categories: { view: true, manage: true },
        userManagement: { view: true, manage: true },
      };
    } else {
      if (body.role !== undefined) {
        let finalRole = body.role;
        const roleLower = finalRole.toLowerCase();
        if (roleLower === "administrator") finalRole = "Administrator";
        else if (roleLower === "accountant") finalRole = "Accountant";
        else finalRole = "Staff";
        user.role = finalRole;
      }

      if (user.role === "Administrator") {
        user.permissions = {
          sales: { view: true, manage: true },
          orders: { view: true, manage: true },
          expenses: { view: true, manage: true },
          categories: { view: true, manage: true },
          userManagement: { view: true, manage: true },
        };
      } else if (body.permissions !== undefined) {
        user.permissions = body.permissions;
      }
    }

    if (body.profilePicture !== undefined) {
      user.profilePicture = body.profilePicture;
    }

    // Only update password if a non-empty password is sent
    if (body.password && body.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(body.password.trim(), salt);
    }

    await user.save();

    const json = user.toJSON();
    json.name = json.fullName;
    json.email = json.emailAddress;
    json.isDefaultAdmin = isDefAdmin;

    return NextResponse.json(json, { status: 200 });
  } catch (error) {
    console.error("PUT /api/users/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "userManagement", "manage");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // CRITICAL: Block deleting the default administrator permanently!
    if (isDefaultAdminUser(userToDelete)) {
      return NextResponse.json(
        { error: "The default system administrator is protected and cannot be deleted." },
        { status: 403 }
      );
    }

    // Prevent deleting the last Administrator
    if (userToDelete.role === "Administrator") {
      const adminCount = await User.countDocuments({ role: "Administrator" });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the only administrator account." },
          { status: 400 }
        );
      }
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "User deleted successfully", id },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/users/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
