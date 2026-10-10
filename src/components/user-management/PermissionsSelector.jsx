"use client";

import React from "react";
import {
  LuShieldCheck,
  LuEye,
  LuPencilLine,
  LuLayers,
  LuWallet,
  LuUser,
  LuCheck,
  LuAlertCircle,
} from "react-icons/lu";
import { BsBoxSeam } from "react-icons/bs";
import { PiSuitcaseSimpleBold } from "react-icons/pi";
import { MODULE_CONFIG, MODULE_KEYS } from "../../lib/rbac";

const ICONS = {
  sales: LuWallet,
  orders: BsBoxSeam,
  expenses: PiSuitcaseSimpleBold,
  categories: LuLayers,
  userManagement: LuUser,
};

const PermissionsSelector = ({
  permissions = {},
  onChange,
  role = "Staff",
  disabled = false,
  isDefaultAdmin = false,
}) => {
  const isAdmin = role === "Administrator" || isDefaultAdmin;

  // Handle master toggle for a module
  const handleModuleToggle = (modKey) => {
    if (disabled || isAdmin) return;

    const current = permissions[modKey] || { view: false, manage: false };
    const isCurrentlyActive = current.view || current.manage;

    const nextPermissions = {
      ...permissions,
      [modKey]: isCurrentlyActive
        ? { view: false, manage: false }
        : { view: true, manage: false }, // Default to View Only when enabled
    };

    onChange(nextPermissions);
  };

  // Handle sub-checkbox toggle for a module
  const handleSubPermissionToggle = (modKey, type) => {
    if (disabled || isAdmin) return;

    const current = permissions[modKey] || { view: false, manage: false };
    const nextMod = { ...current };

    if (type === "view") {
      if (current.view) {
        // If unchecking view, manage must also be disabled
        nextMod.view = false;
        nextMod.manage = false;
      } else {
        nextMod.view = true;
      }
    } else if (type === "manage") {
      if (current.manage) {
        nextMod.manage = false;
        // Keep view active
        nextMod.view = true;
      } else {
        // Enabling manage automatically enables view
        nextMod.manage = true;
        nextMod.view = true;
      }
    }

    onChange({
      ...permissions,
      [modKey]: nextMod,
    });
  };

  const handleGrantAll = () => {
    if (disabled || isAdmin) return;
    const all = {};
    MODULE_KEYS.forEach((k) => {
      all[k] = { view: true, manage: true };
    });
    onChange(all);
  };

  const handleClearAll = () => {
    if (disabled || isAdmin) return;
    const none = {};
    MODULE_KEYS.forEach((k) => {
      none[k] = { view: false, manage: false };
    });
    onChange(none);
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-700/60">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-text-primary flex items-center gap-2">
            <LuShieldCheck className="text-accent" size={20} />
            <span>Role-Based Tab Permissions (RBAC)</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Select tabs this user can access and assign View Only or Full Manage permissions.
          </p>
        </div>

        {!isAdmin && !disabled && (
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleGrantAll}
              className="text-xs px-2.5 py-1 rounded bg-accent/20 text-accent hover:bg-accent/30 transition-colors font-medium cursor-pointer"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs px-2.5 py-1 rounded bg-secondary border border-gray-600 text-gray-300 hover:text-white hover:bg-hover transition-colors font-medium cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Admin Notice Banner */}
      {isAdmin && (
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 text-purple-200 flex items-start space-x-3">
          <LuShieldCheck className="text-accent flex-shrink-0 mt-0.5" size={22} />
          <div className="text-xs sm:text-sm">
            <p className="font-semibold text-white">
              {isDefaultAdmin
                ? "Protected Default Administrator"
                : "Administrator Role Selected"}
            </p>
            <p className="text-purple-300/80 mt-0.5">
              Administrators hold full unrestricted View and Manage privileges across all tabs, reports, and system settings.
            </p>
          </div>
        </div>
      )}

      {/* Permission Cards Grid */}
      <div className="space-y-3">
        {MODULE_KEYS.map((modKey) => {
          const config = MODULE_CONFIG[modKey];
          const Icon = ICONS[modKey] || LuLayers;
          const current = permissions[modKey] || { view: false, manage: false };
          const isEnabled = isAdmin ? true : Boolean(current.view || current.manage);
          const isManage = isAdmin ? true : Boolean(current.manage);
          const isViewOnly = isEnabled && !isManage;

          return (
            <div
              key={modKey}
              className={`rounded-xl border transition-all ${
                isEnabled
                  ? "bg-secondary/90 border-accent/40 shadow-sm"
                  : "bg-form-bg/60 border-gray-700/50 opacity-80"
              }`}
            >
              {/* Feature Header Row */}
              <div
                className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 ${
                  isAdmin || disabled ? "" : "cursor-pointer"
                }`}
                onClick={() => !isAdmin && !disabled && handleModuleToggle(modKey)}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {/* Master Checkbox */}
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      id={`mod-toggle-${modKey}`}
                      checked={isEnabled}
                      onChange={() => handleModuleToggle(modKey)}
                      disabled={disabled || isAdmin}
                      className="w-4.5 h-4.5 rounded border-gray-600 text-accent focus:ring-accent focus:ring-offset-0 cursor-pointer accent-[#6C5CE7]"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center flex-shrink-0">
                    <Icon size={17} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-text-primary text-sm sm:text-base">
                        {config.name}
                      </span>
                      <span
                        className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border ${
                          isManage
                            ? "bg-green-500/20 text-green-300 border-green-500/40"
                            : isViewOnly
                            ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                            : "bg-gray-700/40 text-gray-400 border-gray-600/40"
                        }`}
                      >
                        {isManage
                          ? "Manage (Full)"
                          : isViewOnly
                          ? "View Only"
                          : "No Access"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {config.description}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-gray-400 hidden sm:block">
                  {isEnabled ? "Enabled" : "Disabled"}
                </div>
              </div>

              {/* Expandable Sub-Checkboxes (Visible only when tab is enabled and not locked by admin) */}
              {isEnabled && !isAdmin && (
                <div className="px-4 pb-4 pt-1 border-t border-gray-700/40 space-y-2.5 animate-fadeIn">
                  <p className="text-xs text-gray-400 font-medium">
                    Configure Access Level for {config.name}:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* View Only Checkbox */}
                    <label
                      className={`flex items-start space-x-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        current.view && !current.manage
                          ? "bg-blue-950/30 border-blue-500/40 text-blue-200"
                          : "bg-primary/40 border-gray-700 hover:border-gray-600 text-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(current.view)}
                        onChange={() => handleSubPermissionToggle(modKey, "view")}
                        disabled={disabled}
                        className="mt-0.5 w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-0 accent-blue-500 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-semibold flex items-center space-x-1.5 text-white">
                          <LuEye size={14} className="text-blue-400" />
                          <span>View Only</span>
                        </span>
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                          Can view table and reports. Add, Edit, and Delete actions are hidden.
                        </p>
                      </div>
                    </label>

                    {/* Manage Checkbox */}
                    <label
                      className={`flex items-start space-x-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        current.manage
                          ? "bg-purple-950/30 border-accent/40 text-purple-200"
                          : "bg-primary/40 border-gray-700 hover:border-gray-600 text-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(current.manage)}
                        onChange={() => handleSubPermissionToggle(modKey, "manage")}
                        disabled={disabled}
                        className="mt-0.5 w-4 h-4 rounded border-gray-600 text-accent focus:ring-0 accent-[#6C5CE7] cursor-pointer"
                      />
                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-semibold flex items-center space-x-1.5 text-white">
                          <LuPencilLine size={14} className="text-accent" />
                          <span>Manage (Full Access)</span>
                        </span>
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                          Full control: can view, create new entries, edit records, and delete records.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PermissionsSelector;
