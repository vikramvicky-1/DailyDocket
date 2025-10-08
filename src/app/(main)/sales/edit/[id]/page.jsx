"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { LuUpload, LuSave, LuArrowLeft, LuX } from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";
import CustomDatePicker from "../../../../../components/ui/CustomDatePicker";

const EditSalePage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

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
  const [loading, setLoading] = useState(true);

  // Mock data - In real app, this would come from API
  const mockSaleData = {
    date: new Date("2025-09-25"),
    openingCash: "890",
    purchaseCash: "1890",
    onlineCash: "5890",
    physicalCash: "1890",
    cashTransferred: "1890",
    closingCash: "50",
    totalSale: "11000",
    attachment: null,
  };

  // Load existing sale data
  useEffect(() => {
    const loadSaleData = async () => {
      setLoading(true);
      // In real app, fetch data based on id
      setFormData(mockSaleData);
      setLoading(false);
    };

    if (id) {
      loadSaleData();
    }
  }, [id]);

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

  // Remove uploaded file
  const handleRemoveFile = () => {
    setFile(null);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log("Form submitted:", { formData, file });
    // For now, just show a success message and redirect
    alert("Sale updated successfully!");
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

  if (loading) {
    return (
      <div className="w-full flex flex-col">
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-text-primary/70">Loading sale data...</p>
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="font-bold md:text-2xl text-xl whitespace-nowrap">
                Sales
              </h1>
            </button>
            <span className="text-text-primary flex-shrink-0">
              <MdKeyboardArrowRight size={20} />
            </span>
            <h1 className="md:text-2xl text-xl font-bold truncate">
              Edit Sale
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 ml-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-2 md:px-6 bg-secondary py-2.5 md:py-3 border border-accent text-accent rounded-lg hover:bg-primary/70 cursor-pointer transition-colors text-sm md:text-base font-medium whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-sale-form"
              disabled={!isFormValid()}
              className={`flex items-center gap-1 md:gap-2 px-2 md:px-6 py-2.5 md:py-3 rounded-lg transition-colors font-medium text-sm md:text-base whitespace-nowrap ${
                isFormValid()
                  ? "cursor-pointer bg-accent hover:bg-accent/90 text-white"
                  : "cursor-not-allowed bg-accent text-white"
              }`}
            >
              <LuSave size={18} />
              <span>Update Sale</span>
            </button>
          </div>
        </div>
      </div>

      {/* Form Container - matches table container pattern exactly */}
      <div className="flex-1 min-h-0 ">
        <div className="bg-secondary rounded-xl p-4 sm:p-6 lg:p-5 flex flex-col h-full">
          {/* Static Header Section - will NOT scroll */}
          <div className="pb-4">
            <h1 className="md:text-2xl text-xl font-bold text-text-primary">
              Edit Sale
            </h1>
          </div>

          {/* Scrollable Content Area - matches table scrolling behavior */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar max-h-[650px] md:max-h-[500px] lg:max-h-[510px]">
            <form
              id="edit-sale-form"
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
                    className="w-full h-11 px-5 py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
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
                    className="w-full h-11 px-5 py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
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
                    className="w-full h-11 px-5 py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
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
                    className="w-full h-11 px-5 py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
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
                    className="w-full h-11 px-5 py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
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
                    className="w-full h-11 px-5 py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
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
                    className="w-full h-11 px-5 py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
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
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <LuUpload className="w-6 h-6 text-accent mb-2" />
                    <p className="text-sm text-gray-300">
                      <span className="text-accent cursor-pointer hover:underline">
                        Choose File
                      </span>{" "}
                      / Drag and Drop Files Here
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Supported File Type: PDF, Word, PNG, JPG • Max. File Size:
                      10MB
                    </p>
                  </div>
                  {file && (
                    <div className="absolute bottom-2 left-2 right-2 bg-primary rounded px-2 py-1">
                      <p className="text-xs text-text-primary truncate">
                        {file.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Show uploaded file with remove option */}
                {file && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 p-3 bg-primary rounded-lg">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-medium">
                            {file.name.split(".").pop().toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-text-primary truncate">
                          {file.name}
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

export default EditSalePage;
