import React from "react";

const ExpensesPage = () => {
  return (
    <div className="text-text-primary">
      <h1 className="text-3xl font-bold text-accent mb-4">Expenses</h1>
      <p className="text-lg">Welcome to the Expenses tracker!</p>
      <div className="mt-6 bg-secondary p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Expenses Overview</h2>
        <p>
          This is where you can track business expenses, manage budgets, and
          generate expense reports.
        </p>
      </div>
    </div>
  );
};

export default ExpensesPage;
