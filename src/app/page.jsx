import React from "react";

const DashboardPage = () => {
  return (
    <div className="text-text-primary">
      <h1 className="text-3xl font-bold text-accent mb-4">Dashboard</h1>
      <p className="text-lg">Welcome to DailyDocket!</p>
      <div className="mt-6 bg-secondary p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
        <p>This is your main dashboard where you can see an overview of your business metrics and quick access to key features.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
