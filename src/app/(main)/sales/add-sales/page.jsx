"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LuUpload, LuSave, LuArrowLeft } from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";
import CustomDatePicker from "../../../../components/ui/CustomDatePicker";

const AddSalesPage = () => {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    date: null,
    openingCash: "",
    purchaseCash: "",
    onlineCash: "",
    physicalCash: "",
    cashTransferred: "",
    closingCash: "",
    totalSale: "",
  });

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date: date,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert("File size must be less than 10MB");
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/png",
        "image/jpeg",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Only PDF, Word, PNG, and JPG files are allowed");
        return;
      }

      setFile(selectedFile);
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
      if (droppedFile.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/png",
        "image/jpeg",
      ];
      if (!allowedTypes.includes(droppedFile.type)) {
        alert("Only PDF, Word, PNG, and JPG files are allowed");
        return;
      }

      setFile(droppedFile);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log("Form submitted:", { formData, file });
    // For now, just show a success message and redirect
    alert("Sale added successfully!");
    router.push("/sales");
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/sales");
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      formData.date !== null &&
      formData.openingCash.trim() !== "" &&
      formData.purchaseCash.trim() !== "" &&
      formData.onlineCash.trim() !== "" &&
      formData.physicalCash.trim() !== "" &&
      formData.cashTransferred.trim() !== "" &&
      formData.closingCash.trim() !== "" &&
      formData.totalSale.trim() !== ""
    );
  };

  return (
    <div className="w-full flex flex-col">
      {/* Sticky Header with Breadcrumb Navigation and Action Buttons */}
      <div className="mb-6 min-w-0">
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2 text-text-primary min-w-0 flex-1">
            <button
              onClick={() => router.push("/sales")}
              className="flex items-center gap-1 text-[#BFBFBF] cursor-pointer hover:text-accent transition-colors flex-shrink-0"
            >
              <span className="text-2xl font-bold">
                <LuArrowLeft />
              </span>
              <h1 className="font-bold text-base sm:text-lg md:text-2xl whitespace-nowrap">
                Sales
              </h1>
            </button>
            <span className="text-text-primary flex-shrink-0">
              <MdKeyboardArrowRight size={20} />
            </span>
            <h1 className="text-base sm:text-lg md:text-2xl font-bold truncate">
              Add Sale
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 flex-shrink-0 ml-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-1.5 sm:px-2 md:px-6 bg-secondary py-2 sm:py-2.5 md:py-3 border border-accent text-accent rounded-lg hover:bg-primary/70 cursor-pointer transition-colors text-xs sm:text-sm md:text-base font-medium whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-sale-form"
              disabled={!isFormValid()}
              className={`flex items-center gap-1 sm:gap-1.5 md:gap-2 px-1.5 sm:px-2 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg transition-colors font-medium text-xs sm:text-sm md:text-base whitespace-nowrap ${
                isFormValid()
                  ? "cursor-pointer bg-accent hover:bg-accent/90 text-white"
                  : "cursor-not-allowed bg-accent text-white"
              }`}
            >
              <LuSave size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline">Save Sale</span>
              <span className="xs:hidden">Save</span>
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
              Add Sale
            </h1>
          </div>

          {/* Scrollable Content Area - matches table scrolling behavior */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar max-h-[650px] md:max-h-[500px] lg:max-h-[510px]">
            <form
              id="add-sale-form"
              onSubmit={handleSubmit}
              className="space-y-5 lg:space-y-6 min-w-0"
            >
              {/* Form Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 min-w-0">
                {/* Date Field */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <CustomDatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    placeholder="Enter Date"
                    dateFormat="dd/MM/yyyy"
                    maxDate={new Date()}
                  />
                </div>

                {/* Opening Cash Field */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Opening Cash <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="openingCash"
                    value={formData.openingCash}
                    onChange={handleInputChange}
                    placeholder="Enter Amount"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                {/* Purchase Cash Field */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Purchase Cash <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="purchaseCash"
                    value={formData.purchaseCash}
                    onChange={handleInputChange}
                    placeholder="Enter Amount"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                {/* Online Cash Field */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Online Cash <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="onlineCash"
                    value={formData.onlineCash}
                    onChange={handleInputChange}
                    placeholder="Enter Amount"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                {/* Physical Cash Field */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Physical Cash <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="physicalCash"
                    value={formData.physicalCash}
                    onChange={handleInputChange}
                    placeholder="Enter Amount"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                {/* Cash Transferred Field */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Cash Transferred <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="cashTransferred"
                    value={formData.cashTransferred}
                    onChange={handleInputChange}
                    placeholder="Enter Amount"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                {/* Closing Cash Field */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Closing Cash <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="closingCash"
                    value={formData.closingCash}
                    onChange={handleInputChange}
                    placeholder="Enter Amount"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                {/* Total Sale Field */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Total Sale <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalSale"
                    value={formData.totalSale}
                    onChange={handleInputChange}
                    placeholder="Enter Amount"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>
              </div>

              {/* File Upload Section */}
              <div className="space-y-2 mt-6 min-w-0">
                <label className="block text-sm font-medium text-text-primary">
                  Upload File
                </label>
                <div
                  className={`relative w-full h-24 lg:h-[98px] border-2 border-dashed rounded-lg transition-colors ${
                    dragActive
                      ? "border-accent bg-accent/10"
                      : "border-[#545454] hover:border-gray-400"
                  } ${file ? "bg-accent/5" : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                    <LuUpload className="w-6 h-6 text-gray-400 mb-2" />
                    {file ? (
                      <div className="text-text-primary">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-400">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-text-primary font-medium">
                          Drag and Drop Files Here /{" "}
                          <span className="text-accent cursor-pointer underline">
                            Choose File
                          </span>
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Supported File Type: PDF, Word, PNG, JPG &nbsp;&nbsp;
                          Max. File Size: 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {file && (
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-red-500 text-sm hover:text-red-400 transition-colors"
                  >
                    Remove file
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSalesPage;
