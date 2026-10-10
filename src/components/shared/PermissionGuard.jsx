"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LuShieldAlert, LuArrowLeft } from "react-icons/lu";
import { useAuth } from "../../contexts/AuthContext";
import { MODULE_CONFIG } from "../../lib/rbac";

const PermissionGuard = ({
  moduleKey,
  requiredAction = "view",
  children,
}) => {
  const router = useRouter();
  const { hasPermission, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[350px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto" />
      </div>
    );
  }

  const isPermitted = user && hasPermission(moduleKey, requiredAction);

  if (!isPermitted) {
    const modName = MODULE_CONFIG[moduleKey]?.name || moduleKey;

    return (
      <div className="w-full flex items-center justify-center min-h-[450px] p-4">
        <div className="max-w-md w-full bg-secondary border border-red-500/30 rounded-2xl p-6 sm:p-8 text-center shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
            <LuShieldAlert size={32} />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-white">Access Restricted</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              You do not have permission to{" "}
              <span className="font-semibold text-red-400">
                {requiredAction === "manage" ? "manage" : "view"}
              </span>{" "}
              the <span className="text-white font-medium">{modName}</span> module.
            </p>
          </div>

          <p className="text-xs text-gray-500">
            If you need access to this feature, please contact your System Administrator.
          </p>

          <div className="pt-2">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent/90 text-white font-medium text-sm transition-colors cursor-pointer"
            >
              <LuArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;
