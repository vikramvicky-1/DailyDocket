"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { LuUpload, LuSave, LuArrowLeft, LuX } from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";
import CustomDatePicker from "../../../../../components/ui/CustomDatePicker";
import CustomDropdown from "../../../../../components/ui/CustomDropdown";

const EditOrderPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // Form state
  const [formData, setFormData] = useState({
    date: null,
    deliveryDate: null,
    orderId: "",
    customerName: "",
    amount: "",
    paymentMode: "",
    orderStatus: "",
  });

  const [billFile, setBillFile] = useState(null);
  const [paymentFile, setPaymentFile] = useState(null);
  const [billDragActive, setBillDragActive] = useState(false);
  const [paymentDragActive, setPaymentDragActive] = useState(false);
  const [loading, setLoading] = useState(true);

  // Payment mode options
  const paymentModeOptions = [
    { value: "online", label: "Online" },
    { value: "cash", label: "Cash" },
  ];

  // Order status options
  const orderStatusOptions = [
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "out-for-delivery", label: "Out for Delivery" },
    { value: "order-received", label: "Order Received" },
  ];

  // Mock data - In real app, this would come from API
  const mockOrderData = {
    date: new Date("2025-09-25"),
    deliveryDate: new Date("2025-09-27"),
    orderId: "ID846597",
    customerName: "Agatha Christie",
    amount: "5890",
    paymentMode: "cash",
    orderStatus: "order-received",
  };

  // Load existing order data
  useEffect(() => {
    const loadOrderData = async () => {
      setLoading(true);
      // In real app, fetch data based on id
      setFormData(mockOrderData);
      setLoading(false);
    };

    if (id) {
      loadOrderData();
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

  // Handle date changes
  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date: date,
    }));
  };

  const handleDeliveryDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      deliveryDate: date,
    }));
  };

  // Handle file upload for bill
  const handleBillFileChange = (e) => {
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
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Only PDF and Excel files are allowed");
        return;
      }

      setBillFile(selectedFile);
    }
  };

  // Handle file upload for payment
  const handlePaymentFileChange = (e) => {
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
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Only PDF and Excel files are allowed");
        return;
      }

      setPaymentFile(selectedFile);
    }
  };

  // Handle drag and drop for bill
  const handleBillDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setBillDragActive(true);
    } else if (e.type === "dragleave") {
      setBillDragActive(false);
    }
  };

  const handleBillDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setBillDragActive(false);

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
      ];
      if (!allowedTypes.includes(droppedFile.type)) {
        alert("Only PDF and Excel files are allowed");
        return;
      }

      setBillFile(droppedFile);
    }
  };

  // Handle drag and drop for payment
  const handlePaymentDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setPaymentDragActive(true);
    } else if (e.type === "dragleave") {
      setPaymentDragActive(false);
    }
  };

  const handlePaymentDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPaymentDragActive(false);

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
      ];
      if (!allowedTypes.includes(droppedFile.type)) {
        alert("Only PDF and Excel files are allowed");
        return;
      }

      setPaymentFile(droppedFile);
    }
  };

  // Remove uploaded files
  const handleRemoveBillFile = () => {
    setBillFile(null);
  };

  const handleRemovePaymentFile = () => {
    setPaymentFile(null);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { formData, billFile, paymentFile });
    alert("Order updated successfully!");
    router.push("/orders");
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/orders");
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      formData.date !== null &&
      formData.deliveryDate !== null &&
      formData.orderId.trim() !== "" &&
      formData.customerName.trim() !== "" &&
      formData.paymentMode !== "" &&
      formData.orderStatus !== ""
    );
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col">
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-text-primary/70">Loading order data...</p>
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
              onClick={() => router.push("/orders")}
              className="flex items-center gap-1 text-[#BFBFBF] cursor-pointer hover:text-accent transition-colors flex-shrink-0"
            >
              <span className="text-2xl font-bold">
                <LuArrowLeft />
              </span>
              <h1 className="font-bold text-base sm:text-lg md:text-2xl whitespace-nowrap">
                Orders
              </h1>
            </button>
            <span className="text-text-primary flex-shrink-0">
              <MdKeyboardArrowRight size={18} className="sm:w-5 sm:h-5" />
            </span>
            <h1 className="text-base sm:text-lg md:text-2xl font-bold truncate">
              Edit Order
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
              form="edit-order-form"
              disabled={!isFormValid()}
              className={`flex items-center gap-0.5 sm:gap-1 md:gap-2 px-1.5 sm:px-2 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg transition-colors font-medium text-xs sm:text-sm md:text-base whitespace-nowrap ${
                isFormValid()
                  ? "cursor-pointer bg-accent hover:bg-accent/90 text-white"
                  : "cursor-not-allowed bg-accent text-white"
              }`}
            >
              <LuSave size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline">Update Order</span>
              <span className="xs:hidden">Update</span>
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
              Edit Order
            </h1>
          </div>

          {/* Scrollable Content Area - matches table scrolling behavior */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar max-h-[650px] md:max-h-[500px] lg:min-h-[450px]">
            <form
              id="edit-order-form"
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

                {/* Delivery Date Field */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Delivery Date <span className="text-red-500">*</span>
                  </label>
                  <CustomDatePicker
                    selected={formData.deliveryDate}
                    onChange={handleDeliveryDateChange}
                    placeholder="Enter Date"
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                  />
                </div>

                {/* Order ID Field */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Order ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleInputChange}
                    placeholder="Enter Order id"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                {/* Customer Name Field */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Enter Customer Name"
                    required
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                {/* Amount Field */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter Amount"
                    className="w-full h-10 sm:h-11 px-3 sm:px-5 py-2 sm:py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>
                {/* Order Status Dropdown */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Order Status <span className="text-red-500">*</span>
                  </label>
                  <CustomDropdown
                    name="orderStatus"
                    value={formData.orderStatus}
                    onChange={handleInputChange}
                    options={orderStatusOptions}
                    placeholder="Select Status"
                    required
                  />
                </div>

                {/* Payment Mode Dropdown */}
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Payment Mode <span className="text-red-500">*</span>
                  </label>
                  <CustomDropdown
                    name="paymentMode"
                    value={formData.paymentMode}
                    onChange={handleInputChange}
                    options={paymentModeOptions}
                    placeholder="Select Payment Mode"
                    required
                  />
                </div>
              </div>

              {/* File Upload Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 min-w-0 mt-6">
                {/* Bill Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-primary">
                    Upload Bill
                  </label>
                  <div
                    className={`relative w-full h-20 sm:h-24 lg:h-[98px] border-2 border-dashed rounded-lg transition-colors ${
                      billDragActive
                        ? "border-accent bg-accent/10"
                        : "border-[#545454] hover:border-gray-400"
                    } ${billFile ? "bg-accent/5" : ""}`}
                    onDragEnter={handleBillDrag}
                    onDragLeave={handleBillDrag}
                    onDragOver={handleBillDrag}
                    onDrop={handleBillDrop}
                  >
                    <input
                      type="file"
                      accept=".pdf,.xls,.xlsx"
                      onChange={handleBillFileChange}
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
                      <p className="text-[10px] sm:text-xs text-gray-400 mt-1 leading-tight">
                        Excel, pdf • Max. 12MB
                      </p>
                    </div>
                  </div>

                  {billFile && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 p-3 bg-primary rounded-lg">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-medium">
                              {billFile.name.split(".").pop().toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-text-primary truncate">
                            {billFile.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveBillFile}
                          className="text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <LuX size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-primary">
                    Upload Payment
                  </label>
                  <div
                    className={`relative w-full h-20 sm:h-24 lg:h-[98px] border-2 border-dashed rounded-lg transition-colors ${
                      paymentDragActive
                        ? "border-accent bg-accent/10"
                        : "border-[#545454] hover:border-gray-400"
                    } ${paymentFile ? "bg-accent/5" : ""}`}
                    onDragEnter={handlePaymentDrag}
                    onDragLeave={handlePaymentDrag}
                    onDragOver={handlePaymentDrag}
                    onDrop={handlePaymentDrop}
                  >
                    <input
                      type="file"
                      accept=".pdf,.xls,.xlsx"
                      onChange={handlePaymentFileChange}
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
                      <p className="text-[10px] sm:text-xs text-gray-400 mt-1 leading-tight">
                        Excel, pdf • Max. 12MB
                      </p>
                    </div>
                  </div>

                  {paymentFile && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 p-3 bg-primary rounded-lg">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-medium">
                              {paymentFile.name.split(".").pop().toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-text-primary truncate">
                            {paymentFile.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemovePaymentFile}
                          className="text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <LuX size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrderPage;
