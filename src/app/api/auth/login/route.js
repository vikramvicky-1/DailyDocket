import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb.js";
import User from "../../../../models/User.js";
import { signToken, seedDefaultAdminIfEmpty } from "../../../../lib/auth.js";

export async function POST(request) {
  try {
    await connectToDatabase();
    await seedDefaultAdminIfEmpty();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ emailAddress: cleanEmail });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken(user);
    const userSafe = user.toJSON();
    userSafe.name = userSafe.fullName;
    userSafe.email = userSafe.emailAddress;
    userSafe.isDefaultAdmin = Boolean(
      user.isDefaultAdmin ||
        (user.emailAddress && user.emailAddress.toLowerCase() === "admin@dailydocket.com")
    );

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: userSafe,
        token,
      },
      { status: 200 }
    );

    // Set HTTP-only auth cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during login" },
      { status: 500 }
    );
  }
}
