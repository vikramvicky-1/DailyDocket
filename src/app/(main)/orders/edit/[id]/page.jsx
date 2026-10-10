"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { LuSave, LuArrowLeft } from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";
import CustomDatePicker from "../../../../../components/ui/CustomDatePicker";
import CustomDropdown from "../../../../../components/ui/CustomDropdown";
import AttachmentUploader from "../../../../../components/ui/AttachmentUploader";
import PermissionGuard from "../../../../../components/shared/PermissionGuard";
import { useData } from "../../../../../contexts/DataContext";

const EditOrderPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { orders, updateOrder } = useData();

  // Form state
  const [formData, setFormData] = useState({
    date: new Date(),
    deliveryDate: new Date(),
    orderId: "",
    customerName: "",
    amount: "",
    paymentMode: "Online",
    orderStatus: "Order Received",
  });

  const [billAttachmentUrl, setBillAttachmentUrl] = useState(null);
  const [paymentAttachmentUrl, setPaymentAttachmentUrl] = useState(null);
  const [isUploadingBill, setIsUploadingBill] = useState(false);
  const [isUploadingPayment, setIsUploadingPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isUploadingAny = isUploadingBill || isUploadingPayment;

  const paymentModeOptions = [
    { value: "Online", label: "Online" },
    { value: "Cash", label: "Cash" },
  ];

  const orderStatusOptions = [
    { value: "Order Received", label: "Order Received" },
    { value: "Out for Delivery", label: "Out for Delivery" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  // Load existing order data from MongoDB
  useEffect(() => {
    const loadOrderData = async () => {
      setLoading(true);
      try {
        const found = orders.find(
          (o) => o._id === id || o.id === id || o.orderId === id
        );

        if (found) {
          setFormData({
            date: found.date ? new Date(found.date) : new Date(),
            deliveryDate: found.deliveryDate
              ? new Date(found.deliveryDate)
              : new Date(),
            orderId: found.orderId || "",
            customerName: found.customerName || "",
            amount: (found.totalAmount ?? found.amount ?? 0).toString(),
            paymentMode: found.paymentMode || "Online",
            orderStatus: found.status || "Order Received",
          });
          setBillAttachmentUrl(found.billAttachment);
          setPaymentAttachmentUrl(found.paymentAttachment);
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            date: data.date ? new Date(data.date) : new Date(),
            deliveryDate: data.deliveryDate
              ? new Date(data.deliveryDate)
              : new Date(),
            orderId: data.orderId || "",
            customerName: data.customerName || "",
            amount: (data.totalAmount ?? data.amount ?? 0).toString(),
            paymentMode: data.paymentMode || "Online",
            orderStatus: data.status || "Order Received",
          });
          setBillAttachmentUrl(data.billAttachment);
          setPaymentAttachmentUrl(data.paymentAttachment);
        } else {
          setError("Order record not found");
        }
      } catch (err) {
        console.error("Error loading order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadOrderData();
    }
  }, [id, orders]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid() || submitting || isUploadingAny) return;

    try {
      setSubmitting(true);
      setError("");

      await updateOrder(id, {
        orderId: formData.orderId,
        date: formData.date,
        deliveryDate: formData.deliveryDate,
        customerName: formData.customerName,
        totalAmount: Number(formData.amount) || 0,
        paymentMode: formData.paymentMode,
        status: formData.orderStatus,
        billAttachment: billAttachmentUrl,
        paymentAttachment: paymentAttachmentUrl,
      });

      router.push("/orders");
    } catch (err) {
      console.error("Failed to update order:", err);
      setError(err.message || "Failed to update order in database.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/orders");
  };

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
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-text-primary/70">Loading order details from database...</p>
        </div>
      </div>
    );
  }

  return (
    <PermissionGuard moduleKey="orders" requiredAction="manage">
      <div className="w-full flex flex-col">
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
              disabled={!isFormValid() || submitting || isUploadingAny}
              className={`flex items-center gap-0.5 sm:gap-1 md:gap-2 px-1.5 sm:px-2 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg transition-colors font-medium text-xs sm:text-sm md:text-base whitespace-nowrap ${
                isFormValid() && !submitting && !isUploadingAny
                  ? "cursor-pointer bg-accent hover:bg-accent/90 text-white"
                  : "cursor-not-allowed bg-accent/50 text-white/70"
              }`}
            >
              <LuSave size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>
                {isUploadingAny
                  ? "Uploading..."
                  : submitting
                  ? "Updating..."
                  : "Update Order"}
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
              Edit Order Details
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar max-h-[650px] md:max-h-[500px] lg:min-h-[450px]">
            <form
              id="edit-order-form"
              onSubmit={handleSubmit}
              className="space-y-5 lg:space-y-6 min-w-0"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 min-w-0">
                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Order Date <span className="text-red-500">*</span>
                  </label>
                  <CustomDatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    placeholder="Enter Date"
                    dateFormat="dd/MM/yyyy"
                    maxDate={new Date()}
                  />
                </div>

                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Delivery Date <span className="text-red-500">*</span>
                  </label>
                  <CustomDatePicker
                    selected={formData.deliveryDate}
                    onChange={handleDeliveryDateChange}
                    placeholder="Enter Delivery Date"
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                  />
                </div>

                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Order ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleInputChange}
                    placeholder="e.g. ID846597"
                    required
                    className="w-full h-11 px-5 py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

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
                    className="w-full h-11 px-5 py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                <div className="space-y-2 min-w-0">
                  <label className="block text-sm font-medium text-text-primary">
                    Total Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter Amount"
                    className="w-full h-11 px-5 py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

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

              {/* Attachments Section with live upload loading status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 min-w-0 mt-6">
                <AttachmentUploader
                  label="Bill Attachment"
                  value={billAttachmentUrl}
                  onChange={(url) => setBillAttachmentUrl(url)}
                  onUploadStateChange={setIsUploadingBill}
                  accept=".pdf,.xls,.xlsx,.png,.jpg,.jpeg"
                  helpText="Supported: PDF, Excel, PNG, JPG • Max 12MB"
                  placeholderText="Upload Bill / Drag & Drop"
                />

                <AttachmentUploader
                  label="Payment Receipt Attachment"
                  value={paymentAttachmentUrl}
                  onChange={(url) => setPaymentAttachmentUrl(url)}
                  onUploadStateChange={setIsUploadingPayment}
                  accept=".pdf,.xls,.xlsx,.png,.jpg,.jpeg"
                  helpText="Supported: PDF, Receipt, PNG, JPG • Max 12MB"
                  placeholderText="Upload Payment Receipt / Drag & Drop"
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

export default EditOrderPage;
