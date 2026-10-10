"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuPencil, LuTrash2, LuX } from "react-icons/lu";
import { TbEdit } from "react-icons/tb";

const UserMobileCard = ({ user, index, onEdit, onDelete, canManage = true }) => {
  const isDefaultAdmin = Boolean(
    user.isDefaultAdmin || user.email?.toLowerCase() === "admin@dailydocket.com"
  );
  const getRoleBadge = (role) => {
    const roleConfig = {
      Administrator: { bg: "bg-red-600", text: "text-white" },
      Staff: { bg: "bg-blue-600", text: "text-white" },
      Accountant: { bg: "bg-yellow-600", text: "text-white" },
    };

    const config = roleConfig[role] || {
      bg: "bg-gray-600",
      text: "text-white",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {role}
      </span>
    );
  };

  const handleEdit = () => {
    if (onEdit) onEdit(user, index);
  };

  const handleDelete = () => {
    if (onDelete && !isDefaultAdmin) onDelete(user, index);
  };

  return (
    <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-4 shadow-lg border border-primary/30">
      {/* Header with User Name and Actions */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-white text-lg font-bold">{user.name || user.fullName}</span>
            {isDefaultAdmin && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                Primary Admin
              </span>
            )}
          </div>
          <span className="text-gray-300 text-sm font-medium">
            {user.email}
          </span>
        </div>
        {canManage && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="Edit User"
            >
              <TbEdit size={18} className="text-white" />
            </button>
            {!isDefaultAdmin && (
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                title="Delete User"
              >
                <LuTrash2 size={18} className="text-white" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Data Grid - Single row for role */}
      <div className="grid grid-cols-1 gap-3 mb-4">
        {/* Role */}
        <div className="space-y-1">
          <span className="text-gray-300 text-xs">Role</span>
          <div className="text-white text-sm font-medium">
            {getRoleBadge(user.role)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMobileCard;
