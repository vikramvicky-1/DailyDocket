import { NextResponse } from "next/server";
import { getUserFromRequest, seedDefaultAdminIfEmpty } from "../../../../lib/auth.js";

export async function GET(request) {
  try {
    await seedDefaultAdminIfEmpty();
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const userSafe = user.toJSON();
    userSafe.name = userSafe.fullName;
    userSafe.email = userSafe.emailAddress;
    userSafe.isDefaultAdmin = Boolean(
      user.isDefaultAdmin ||
        (user.emailAddress && user.emailAddress.toLowerCase() === "admin@dailydocket.com")
    );

    return NextResponse.json({ authenticated: true, user: userSafe }, { status: 200 });
  } catch (error) {
    console.error("Auth me API error:", error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }
}
