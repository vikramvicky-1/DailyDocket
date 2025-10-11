"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LuUpload,
  LuPlus,
  LuArrowLeft,
  LuEye,
  LuEyeOff,
  LuX,
} from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";
import CustomDropdown from "../../../../components/ui/CustomDropdown";

const AddNewUserPage = () => {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    password: "",
    role: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Role options
  const roleOptions = [
    { value: "accountant", label: "Accountant" },
    { value: "administrator", label: "Administrator" },
    { value: "staff", label: "Staff" },
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 12 * 1024 * 1024) {
        alert("File size must be less than 12MB");
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/png",
        "image/jpeg",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Only PDF, Excel, PNG, and JPG files are allowed");
        return;
      }

      setProfilePicture(selectedFile);
    }
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.size > 12 * 1024 * 1024) {
        alert("File size must be less than 12MB");
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/png",
        "image/jpeg",
      ];
      if (!allowedTypes.includes(droppedFile.type)) {
        alert("Only PDF, Excel, PNG, and JPG files are allowed");
        return;
      }

      setProfilePicture(droppedFile);
    }
  };

  // Remove uploaded file
  const handleRemoveFile = () => {
    setProfilePicture(null);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { formData, profilePicture });
    alert("User added successfully!");
    router.push("/user-management");
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/user-management");
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      formData.fullName.trim() !== "" &&
      formData.emailAddress.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.role !== ""
    );
  };

  return (
    <div className="w-full flex flex-col">
      {/* Sticky Header with Breadcrumb Navigation and Action Buttons */}
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

          {/* Action Buttons */}
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
              disabled={!isFormValid()}
              className={`flex items-center gap-0.5 sm:gap-1 md:gap-2 px-1.5 sm:px-2 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg transition-colors font-medium text-xs sm:text-sm md:text-base whitespace-nowrap ${
                isFormValid()
                  ? "cursor-pointer bg-accent hover:bg-accent/90 text-white"
                  : "cursor-not-allowed bg-accent text-white"
              }`}
            >
              <LuPlus size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline">Add User</span>
              <span className="xs:hidden xs:text-[10px]">Add User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Form Container - matches table container pattern exactly */}
      <div className="flex-1 min-h-0 ">
        <div className="bg-secondary rounded-xl p-3 sm:p-4 md:p-6 lg:p-5 flex flex-col h-full">
          {/* Static Header Section - will NOT scroll */}
          <div className="pb-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">
              Add User
            </h1>
          </div>

          {/* Scrollable Content Area - matches table scrolling behavior */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar max-h-[500px] md:max-h-[500px] lg:max-h-[450px]">
            <form
              id="add-user-form"
              onSubmit={handleSubmit}
              className="space-y-5 lg:space-y-6 min-w-0"
            >
              {/* Form Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 min-w-0">
                {/* Full Name Field */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Neeti Mohan"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                {/* Email Address Field */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    placeholder="Neetimohan@gmail.com"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                {/* Password Field */}
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
                      {showPassword ? (
                        <LuEyeOff size={18} />
                      ) : (
                        <LuEye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Role Dropdown */}
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

              {/* File Upload Section */}
              <div className="space-y-2 mt-6 min-w-0">
                <label className="block text-sm font-medium text-text-primary">
                  Upload Profile Picture
                </label>
                <div
                  className={`relative w-full h-20 sm:h-24 lg:h-[98px] border-2 border-dashed rounded-lg transition-colors ${
                    dragActive
                      ? "border-accent bg-accent/10"
                      : "border-[#545454] hover:border-gray-400"
                  } ${profilePicture ? "bg-accent/5" : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".pdf,.xls,.xlsx,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center h-full text-center p-2 sm:p-4">
                    <LuUpload className="w-4 sm:w-6 h-4 sm:h-6 text-accent mb-1 sm:mb-2" />
                    <p className="text-xs sm:text-sm text-gray-300">
                      <span className="text-accent cursor-pointer hover:underline">
                        Choose File
                      </span>{" "}
                      <span className="hidden xs:inline">
                        / Drag and Drop Files Here
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1 hidden xs:block">
                      Supported File Type: Excel, pdf • Max. File Size: 12MB
                    </p>
                  </div>
                  {profilePicture && (
                    <div className="absolute bottom-2 left-2 right-2 bg-primary rounded px-2 py-1">
                      <p className="text-xs text-text-primary truncate">
                        {profilePicture.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Show uploaded file with remove option */}
                {profilePicture && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 p-3 bg-primary rounded-lg">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-medium">
                            {profilePicture.name.split(".").pop().toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-text-primary truncate">
                          {profilePicture.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
                      >
                        <LuX size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewUserPage;
