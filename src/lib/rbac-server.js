import { NextResponse } from "next/server";
import { getUserFromRequest } from "./auth.js";
import { hasPermission, MODULE_CONFIG } from "./rbac.js";

/**
 * Server-side helper to enforce RBAC permissions inside API route handlers
 */
export async function checkApiPermission(request, moduleKey, action = "view") {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return {
        authorized: false,
        user: null,
        response: NextResponse.json(
          { error: "Authentication required to access this resource" },
          { status: 401 }
        ),
      };
    }

    if (!hasPermission(user, moduleKey, action)) {
      return {
        authorized: false,
        user,
        response: NextResponse.json(
          {
            error: `Access denied: You do not have permission to ${action} ${
              MODULE_CONFIG[moduleKey]?.name || moduleKey
            }.`,
          },
          { status: 403 }
        ),
      };
    }

    return { authorized: true, user, response: null };
  } catch (error) {
    console.error("checkApiPermission error:", error);
    return {
      authorized: false,
      user: null,
      response: NextResponse.json(
        { error: "Permission check encountered an internal error" },
        { status: 500 }
      ),
    };
  }
}
