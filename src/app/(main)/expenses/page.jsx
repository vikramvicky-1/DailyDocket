"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LuPlus } from "react-icons/lu";
import ExpensesTable from "../../../components/expenses/ExpensesTable";
import ExpensesTableSkeleton from "../../../components/expenses/ExpensesTableSkeleton";
import PaymentStatusFilter from "../../../components/expenses/PaymentStatusFilter";
import CategoryFilter from "../../../components/expenses/CategoryFilter";
import { useData } from "../../../contexts/DataContext";
import { useAuth } from "../../../contexts/AuthContext";
import PermissionGuard from "../../../components/shared/PermissionGuard";

const ExpensesPage = () => {
  const router = useRouter();
  const { expenses, loading } = useData();
  const { canManage } = useAuth();
  const canManageExpenses = canManage("expenses");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    let filtered = expenses;
    if (selectedStatus !== "All") {
      filtered = filtered.filter((expense) => expense.status === selectedStatus);
    }
    if (selectedCategory !== "All") {
      filtered = filtered.filter((expense) => expense.category === selectedCategory);
    }
    setFilteredData(filtered);
  }, [expenses, selectedStatus, selectedCategory]);

  const handleAddExpense = () => {
    router.push("/expenses/add-expenses");
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <PermissionGuard moduleKey="expenses" requiredAction="view">
      <div className="w-full max-w-full">
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-text-primary">Expenses</h1>
            <div className="hidden md:flex items-center space-x-4">
              <PaymentStatusFilter
                selectedStatus={selectedStatus}
                onStatusChange={handleStatusChange}
              />
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
              {canManageExpenses && (
                <button
                  onClick={handleAddExpense}
                  className="flex items-center cursor-pointer space-x-2 px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium"
                >
                  <LuPlus size={18} />
                  <span>Add Expense</span>
                </button>
              )}
            </div>
            {canManageExpenses && (
              <button
                onClick={handleAddExpense}
                className="md:hidden flex items-center space-x-2 px-2 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium text-sm"
              >
                <LuPlus size={18} />
                <span>Add Expense</span>
              </button>
            )}
          </div>
          <div className="md:hidden flex items-center justify-start space-x-4">
            <PaymentStatusFilter
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
            />
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </div>
        <div className="flex-1 min-h-0">
          {loading ? (
            <ExpensesTableSkeleton />
          ) : (
            <ExpensesTable expensesData={filteredData} canManage={canManageExpenses} />
          )}
        </div>
      </div>
    </PermissionGuard>
  );
};

export default ExpensesPage;
