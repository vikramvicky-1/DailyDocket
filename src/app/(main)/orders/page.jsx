import React from "react";

const OrdersPage = () => {
  return (
    <div className="text-text-primary">
      <h1 className="text-3xl font-bold text-accent mb-4">Orders</h1>
      <p className="text-lg">Welcome to the Orders management!</p>
      <div className="mt-6 bg-secondary p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Orders Overview</h2>
        <p>
          This is where you can manage customer orders, track shipments, and
          handle order processing.
        </p>
      </div>
    </div>
  );
};

export default OrdersPage;
