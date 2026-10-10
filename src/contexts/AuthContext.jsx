"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  hasPermission as evalPermission,
  getUserPermissions,
  isDefaultAdminUser,
} from "../lib/rbac.js";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Verify active session on initial load
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle route protection
  useEffect(() => {
    if (loading) return;

    const isLoginPage = pathname === "/login";
    if (!user && !isLoginPage) {
      router.push("/login");
    } else if (user && isLoginPage) {
      router.push("/");
    }
  }, [user, loading, pathname, router]);

  // Login action
  const login = async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }

      setUser(data.user);
      router.push("/");
      return { success: true, user: data.user };
    } catch (err) {
      return {
        success: false,
        error: err.message || "Network error. Please try again.",
      };
    }
  };

  // Logout action
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  const isAdmin = Boolean(user?.role === "Administrator" || isDefaultAdminUser(user));
  const isDefaultAdmin = isDefaultAdminUser(user);

  const checkUserPermission = useCallback(
    (moduleKey, action = "view") => {
      return evalPermission(user, moduleKey, action);
    },
    [user]
  );

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin,
    isDefaultAdmin,
    permissions: getUserPermissions(user),
    hasPermission: checkUserPermission,
    canAccess: (moduleKey) => checkUserPermission(moduleKey, "view"),
    canManage: (moduleKey) => checkUserPermission(moduleKey, "manage"),
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
