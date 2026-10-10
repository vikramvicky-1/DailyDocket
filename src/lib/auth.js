import jwt from "jsonwebtoken";
import User from "../models/User.js";
import connectToDatabase from "./mongodb.js";

const JWT_SECRET = process.env.JWT_SECRET || "dailydocket-secure-jwt-secret-key-2025";
const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || "admin@dailydocket.com";
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || "admin123";

export function signToken(user) {
  const payload = {
    id: user._id ? user._id.toString() : user.id,
    fullName: user.fullName,
    emailAddress: user.emailAddress,
    role: user.role,
    isDefaultAdmin: Boolean(user.isDefaultAdmin),
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getUserFromRequest(request) {
  try {
    let token = null;

    // 1. Try reading cookie
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const match = cookieHeader.match(/auth_token=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }

    // 2. Try Authorization header
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) return null;

    await connectToDatabase();
    const user = await User.findById(decoded.id).select("-password");
    return user;
  } catch (error) {
    console.error("Error getting user from request:", error);
    return null;
  }
}

/**
 * Ensures an initial administrator exists if no users are in the database.
 */
export async function seedDefaultAdminIfEmpty() {
  try {
    await connectToDatabase();
    const cleanEmail = DEFAULT_ADMIN_EMAIL.toLowerCase();
    let admin = await User.findOne({ emailAddress: cleanEmail });

    const fullPermissions = {
      sales: { view: true, manage: true },
      orders: { view: true, manage: true },
      expenses: { view: true, manage: true },
      categories: { view: true, manage: true },
      userManagement: { view: true, manage: true },
    };

    if (!admin) {
      console.log(`Creating default Administrator: ${cleanEmail}`);
      admin = new User({
        fullName: "System Administrator",
        emailAddress: cleanEmail,
        password: DEFAULT_ADMIN_PASSWORD,
        role: "Administrator",
        profilePicture: "",
        isDefaultAdmin: true,
        permissions: fullPermissions,
      });
      await admin.save();
      console.log("Default Administrator initialized successfully.");
      return admin;
    } else if (!admin.isDefaultAdmin || admin.role !== "Administrator") {
      // Ensure the default admin is locked as Administrator
      admin.isDefaultAdmin = true;
      admin.role = "Administrator";
      admin.permissions = fullPermissions;
      await admin.save();
    }
    return admin;
  } catch (err) {
    console.error("Failed to seed default admin:", err.message);
    return null;
  }
}
