import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb.js";
import User from "../../../models/User.js";
import { seedDefaultAdminIfEmpty } from "../../../lib/auth.js";
import { isDefaultAdminUser } from "../../../lib/rbac.js";
import { checkApiPermission } from "../../../lib/rbac-server.js";

export async function GET(request) {
  try {
    await connectToDatabase();
    await seedDefaultAdminIfEmpty();

    const permCheck = await checkApiPermission(request, "userManagement", "view");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const users = await User.find().sort({ createdAt: -1 });
    const formatted = users.map((u) => {
      const json = u.toJSON();
      // Keep compatibility with frontend properties:
      json.name = json.fullName;
      json.email = json.emailAddress;
      json.isDefaultAdmin = isDefaultAdminUser(u);
      return json;
    });

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const permCheck = await checkApiPermission(request, "userManagement", "manage");
    if (!permCheck.authorized) {
      return permCheck.response;
    }

    const body = await request.json();

    const {
      fullName,
      name,
      emailAddress,
      email,
      password,
      role,
      profilePicture,
      permissions,
    } = body;

    const finalName = (fullName || name || "").trim();
    const finalEmail = (emailAddress || email || "").trim().toLowerCase();

    if (!finalName) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }
    if (!finalEmail) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    }
    if (!password || password.trim() === "") {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    // Check if user already exists
    const existing = await User.findOne({ emailAddress: finalEmail });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email address already exists" },
        { status: 409 }
      );
    }

    // Normalize role: "Administrator", "Staff", "Accountant"
    let finalRole = role || "Staff";
    const roleLower = finalRole.toLowerCase();
    if (roleLower === "administrator") finalRole = "Administrator";
    else if (roleLower === "accountant") finalRole = "Accountant";
    else finalRole = "Staff";

    // Set permissions based on role or custom configuration
    let finalPermissions = permissions || {};
    if (finalRole === "Administrator") {
      finalPermissions = {
        sales: { view: true, manage: true },
        orders: { view: true, manage: true },
        expenses: { view: true, manage: true },
        categories: { view: true, manage: true },
        userManagement: { view: true, manage: true },
      };
    }

    const newUser = new User({
      fullName: finalName,
      emailAddress: finalEmail,
      password: password.trim(),
      role: finalRole,
      profilePicture: profilePicture || "",
      permissions: finalPermissions,
      isDefaultAdmin: false,
    });

    const saved = await newUser.save();
    const res = saved.toJSON();
    res.name = res.fullName;
    res.email = res.emailAddress;
    res.isDefaultAdmin = false;

    return NextResponse.json(res, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: 400 }
    );
  }
}
