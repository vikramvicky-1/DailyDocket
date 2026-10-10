"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LuPlus,
  LuArrowLeft,
  LuEye,
  LuEyeOff,
} from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";
import CustomDropdown from "../../../../components/ui/CustomDropdown";
import AttachmentUploader from "../../../../components/ui/AttachmentUploader";
import PermissionsSelector from "../../../../components/user-management/PermissionsSelector";
import PermissionGuard from "../../../../components/shared/PermissionGuard";
import { useData } from "../../../../contexts/DataContext";

const AddNewUserPage = () => {
  const router = useRouter();
  const { addUser } = useData();

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    password: "",
    role: "Staff",
  });

  const [permissions, setPermissions] = useState({
    sales: { view: true, manage: false },
    orders: { view: true, manage: false },
    expenses: { view: false, manage: false },
    categories: { view: false, manage: false },
    userManagement: { view: false, manage: false },
  });

  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [isUploadingPic, setIsUploadingPic] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Role options (standardized capitalization)
  const roleOptions = [
    { value: "Administrator", label: "Administrator" },
    { value: "Staff", label: "Staff" },
    { value: "Accountant", label: "Accountant" },
  ];

  // Handle form input changes
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

  // Handle form submission to MongoDB
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid() || submitting || isUploadingPic) return;

    try {
      setSubmitting(true);
      setError("");

      await addUser({
        fullName: formData.fullName,
        emailAddress: formData.emailAddress,
        password: formData.password,
        role: formData.role,
        profilePicture: profilePictureUrl || "",
        permissions,
      });

      router.push("/user-management");
    } catch (err) {
      console.error("Failed to add user:", err);
      setError(err.message || "Failed to create user in database.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/user-management");
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim() !== "" &&
      formData.emailAddress.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.role !== ""
    );
  };

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
              Add User
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
              form="add-user-form"
              disabled={!isFormValid() || submitting || isUploadingPic}
              className={`flex items-center gap-0.5 sm:gap-1 md:gap-2 px-1.5 sm:px-2 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg transition-colors font-medium text-xs sm:text-sm md:text-base whitespace-nowrap ${
                isFormValid() && !submitting && !isUploadingPic
                  ? "cursor-pointer bg-accent hover:bg-accent/90 text-white"
                  : "cursor-not-allowed bg-accent/50 text-white/70"
              }`}
            >
              <LuPlus size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>
                {isUploadingPic
                  ? "Uploading..."
                  : submitting
                  ? "Adding..."
                  : "Add User"}
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
              User Details
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              The user can sign in with this email and password.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar max-h-[500px] md:max-h-[500px] lg:max-h-[450px]">
            <form
              id="add-user-form"
              onSubmit={handleSubmit}
              className="space-y-5 lg:space-y-6 min-w-0"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 min-w-0">
                {/* Full Name */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Neeti Mohan"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                {/* Email Address */}
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

                {/* Password */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••••"
                      required
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

                {/* Role */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <CustomDropdown
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    options={roleOptions}
                    placeholder="Select Role"
                    required
                  />
                </div>
              </div>

              {/* RBAC Permissions Section */}
              <div className="mt-6 min-w-0">
                <PermissionsSelector
                  permissions={permissions}
                  onChange={setPermissions}
                  role={formData.role}
                />
              </div>

              {/* Profile Picture Upload with live upload loading status */}
              <div className="mt-6 min-w-0">
                <AttachmentUploader
                  label="Upload Profile Picture"
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

export default AddNewUserPage;
