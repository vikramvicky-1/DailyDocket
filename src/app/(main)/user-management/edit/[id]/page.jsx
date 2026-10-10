"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  LuSave,
  LuArrowLeft,
  LuEye,
  LuEyeOff,
} from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";
import CustomDropdown from "../../../../../components/ui/CustomDropdown";
import AttachmentUploader from "../../../../../components/ui/AttachmentUploader";
import PermissionsSelector from "../../../../../components/user-management/PermissionsSelector";
import PermissionGuard from "../../../../../components/shared/PermissionGuard";
import { useData } from "../../../../../contexts/DataContext";

const EditUserPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { users, updateUser } = useData();

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    password: "",
    role: "Staff",
  });

  const [permissions, setPermissions] = useState({
    sales: { view: false, manage: false },
    orders: { view: false, manage: false },
    expenses: { view: false, manage: false },
    categories: { view: false, manage: false },
    userManagement: { view: false, manage: false },
  });
  const [isDefaultAdmin, setIsDefaultAdmin] = useState(false);

  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [isUploadingPic, setIsUploadingPic] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const roleOptions = [
    { value: "Administrator", label: "Administrator" },
    { value: "Staff", label: "Staff" },
    { value: "Accountant", label: "Accountant" },
  ];

  // Load existing user from MongoDB
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const found = users.find((u) => u._id === id || u.id === id);
        if (found) {
          setFormData({
            fullName: found.fullName || found.name || "",
            emailAddress: found.emailAddress || found.email || "",
            password: "",
            role: found.role || "Staff",
          });
          setProfilePictureUrl(found.profilePicture || "");
          if (found.permissions) {
            setPermissions(found.permissions);
          }
          setIsDefaultAdmin(
            Boolean(
              found.isDefaultAdmin ||
                (found.emailAddress &&
                  found.emailAddress.toLowerCase() === "admin@dailydocket.com") ||
                (found.email &&
                  found.email.toLowerCase() === "admin@dailydocket.com")
            )
          );
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/users/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            fullName: data.fullName || data.name || "",
            emailAddress: data.emailAddress || data.email || "",
            password: "",
            role: data.role || "Staff",
          });
          setProfilePictureUrl(data.profilePicture || "");
          if (data.permissions) {
            setPermissions(data.permissions);
          }
          setIsDefaultAdmin(
            Boolean(
              data.isDefaultAdmin ||
                (data.emailAddress &&
                  data.emailAddress.toLowerCase() === "admin@dailydocket.com") ||
                (data.email &&
                  data.email.toLowerCase() === "admin@dailydocket.com")
            )
          );
        } else {
          setError("User record not found");
        }
      } catch (err) {
        console.error("Error loading user:", err);
        setError("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadUserData();
    }
  }, [id, users]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.fullName.trim() ||
      !formData.emailAddress.trim() ||
      submitting ||
      isUploadingPic
    ) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        fullName: formData.fullName,
        emailAddress: formData.emailAddress,
        role: formData.role,
        profilePicture: profilePictureUrl || "",
        permissions,
      };

      // Only send password if updated
      if (formData.password.trim() !== "") {
        payload.password = formData.password.trim();
      }

      await updateUser(id, payload);
      router.push("/user-management");
    } catch (err) {
      console.error("Failed to update user:", err);
      setError(err.message || "Failed to update user details in database.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/user-management");
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-text-primary/70">Loading user details from database...</p>
        </div>
      </div>
    );
  }

  return (
    <PermissionGuard moduleKey="userManagement" requiredAction="manage">
      <div className="w-full flex flex-col">
        <div className="mb-6 min-w-0">
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2 text-text-primary min-w-0 flex-1">
            <button
              onClick={() => router.push("/user-management")}
              className="flex items-center gap-1 text-[#BFBFBF] cursor-pointer hover:text-accent transition-colors flex-shrink-0"
            >
              <span className="text-2xl font-bold">
                <LuArrowLeft />
              </span>
              <h1 className="font-bold text-base sm:text-lg md:text-2xl whitespace-nowrap">
                Users
              </h1>
            </button>
            <span className="text-text-primary flex-shrink-0">
              <MdKeyboardArrowRight size={18} className="sm:w-5 sm:h-5" />
            </span>
            <h1 className="text-base sm:text-lg md:text-2xl font-bold truncate">
              Edit User
            </h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0 ml-1 sm:ml-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-1.5 sm:px-2 md:px-6 bg-secondary py-2 sm:py-2.5 md:py-3 border border-accent text-accent rounded-lg hover:bg-primary/70 cursor-pointer transition-colors text-xs sm:text-sm md:text-base font-medium whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-user-form"
              disabled={submitting || isUploadingPic}
              className={`flex items-center gap-0.5 sm:gap-1 md:gap-2 px-1.5 sm:px-2 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg transition-colors font-medium text-xs sm:text-sm md:text-base whitespace-nowrap ${
                !submitting && !isUploadingPic
                  ? "cursor-pointer bg-accent hover:bg-accent/90 text-white"
                  : "cursor-not-allowed bg-accent/50 text-white/70"
              }`}
            >
              <LuSave size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>
                {isUploadingPic
                  ? "Uploading..."
                  : submitting
                  ? "Updating..."
                  : "Update User"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="flex-1 min-h-0">
        <div className="bg-secondary rounded-xl p-3 sm:p-4 md:p-6 lg:p-5 flex flex-col h-full">
          <div className="pb-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">
              Edit User Details
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar max-h-[500px] md:max-h-[500px] lg:max-h-[450px]">
            <form
              id="edit-user-form"
              onSubmit={handleSubmit}
              className="space-y-5 lg:space-y-6 min-w-0"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 min-w-0">
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Full name"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    placeholder="user@example.com"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Password <span className="text-xs text-gray-400">(leave blank to keep current)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••••"
                      className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 pr-10 sm:pr-12 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 min-w-0">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-text-primary">
                      Role <span className="text-red-500">*</span>
                    </label>
                    {isDefaultAdmin && (
                      <span className="text-[11px] text-amber-400 font-medium">
                        Default Admin Locked
                      </span>
                    )}
                  </div>
                  <CustomDropdown
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    options={roleOptions}
                    placeholder="Select Role"
                    required
                    disabled={isDefaultAdmin}
                  />
                </div>
              </div>

              {/* RBAC Permissions Section */}
              <div className="mt-6 min-w-0">
                <PermissionsSelector
                  permissions={permissions}
                  onChange={setPermissions}
                  role={formData.role}
                  isDefaultAdmin={isDefaultAdmin}
                  disabled={isDefaultAdmin}
                />
              </div>

              {/* Picture Upload with live upload loading status */}
              <div className="mt-6 min-w-0">
                <AttachmentUploader
                  label="Profile Picture"
                  value={profilePictureUrl}
                  onChange={(url) => setProfilePictureUrl(url)}
                  onUploadStateChange={setIsUploadingPic}
                  accept=".png,.jpg,.jpeg,.webp"
                  helpText="Supported: PNG, JPG, JPEG • Max 12MB"
                  placeholderText="Choose Photo / Drag and Drop Photo Here"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </PermissionGuard>
);
};

export default EditUserPage;
