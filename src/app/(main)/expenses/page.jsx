"use client";

import React, { useState, useEffect } from "react";
import { LuPlus } from "react-icons/lu";
import ExpensesTable from "../../../components/expenses/ExpensesTable";
import ExpensesTableSkeleton from "../../../components/expenses/ExpensesTableSkeleton";
import PaymentStatusFilter from "../../../components/expenses/PaymentStatusFilter";
import CategoryFilter from "../../../components/expenses/CategoryFilter";

// Mock data for demonstration
const mockExpensesData = [
  {
    date: "2025-09-25T10:30:00",
    category: "Masala Materials",
    subcategory: "Agatha Christie",
    totalAmount: 5890,
    status: "Paid",
    paymentMode: "Online",
    billAttachment: null,
    remarks: "-",
  },
  {
    date: "2025-09-24T14:15:00",
    category: "Powder",
    subcategory: "James Dotty",
    totalAmount: 6890,
    status: "Paid",
    paymentMode: "Online",
    billAttachment: null,
    remarks: "-",
  },
  {
    date: "2025-09-23T09:45:00",
    category: "Snacks",
    subcategory: "Lewis Sabuda",
    totalAmount: 3890,
    status: "Pending",
    paymentMode: "Online",
    billAttachment: null,
    remarks: "-",
  },
  {
    date: "2025-09-22T16:20:00",
    category: "Snacks",
    subcategory: "John Barrow",
    totalAmount: 7890,
    status: "Paid",
    paymentMode: "Online",
    billAttachment: "bill.pdf",
    remarks: "-",
  },
  {
    date: "2025-09-22T11:10:00",
    category: "Snacks",
    subcategory: "John Barrow",
    totalAmount: 7890,
    status: "Paid",
    paymentMode: "Online",
    billAttachment: null,
    remarks: "-",
  },
  {
    date: "2025-09-22T13:25:00",
    category: "Snacks",
    subcategory: "John Barrow",
    totalAmount: 7890,
    status: "Paid",
    paymentMode: "Online",
    billAttachment: null,
    remarks: "-",
  },
  {
    date: "2025-09-22T08:55:00",
    category: "Snacks",
    subcategory: "John Barrow",
    totalAmount: 7890,
    status: "Paid",
    paymentMode: "Online",
    billAttachment: "bill.pdf",
    remarks: "-",
  },
  {
    date: "2025-09-21T12:40:00",
    category: "Vegetables",
    subcategory: "Sarah Johnson",
    totalAmount: 4520,
    status: "Pending",
    paymentMode: "Cash",
    billAttachment: null,
    remarks: "-",
  },
];

const ExpensesPage = () => {
  const [expensesData, setExpensesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setExpensesData(mockExpensesData);
      setFilteredData(mockExpensesData);
      setLoading(false);
    };

    loadData();
  }, []);

  // Filter data based on selected status and category
  useEffect(() => {
    let filtered = expensesData;

    if (selectedStatus !== "All") {
      filtered = filtered.filter(
        (expense) => expense.status === selectedStatus
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (expense) => expense.category === selectedCategory
      );
    }

    setFilteredData(filtered);
  }, [expensesData, selectedStatus, selectedCategory]);

  const handleAddExpense = () => {
    console.log("Add expense clicked");
    // Add expense functionality will be implemented later
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="w-full max-w-full">
      {/* Page Header */}
      <div className="flex mb-6 flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold mb-6 text-text-primary">Expenses</h1>
        <div className="flex items-center space-x-4">
          <PaymentStatusFilter
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
          />
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          <button
            onClick={handleAddExpense}
            className="flex items-center space-x-2 px-2 md:px-6 py-2.5 md:py-3 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium text-sm md:text-base"
          >
            <LuPlus size={18} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-secondary shadow-md rounded-xl p-2 sm:p-4 md:p-5 lg:p-6 space-y-2 overflow-hidden w-full">
        {loading ? (
          <ExpensesTableSkeleton />
        ) : (
          <ExpensesTable expensesData={filteredData} />
        )}
      </div>
    </div>
  );
};

export default ExpensesPage;
