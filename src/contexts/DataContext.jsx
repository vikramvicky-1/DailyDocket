"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// Context
const DataContext = createContext(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};

export const DataProvider = ({ children }) => {
  // Empty initial data (dummy data removed, all loaded from MongoDB)
  const [sales, setSales] = useState([]);
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch all data from backend MongoDB ─────────────────────────
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [salesRes, ordersRes, expensesRes, usersRes, categoriesRes] =
        await Promise.allSettled([
          fetch("/api/sales", { cache: "no-store" }),
          fetch("/api/orders", { cache: "no-store" }),
          fetch("/api/expenses", { cache: "no-store" }),
          fetch("/api/users", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);

      if (salesRes.status === "fulfilled" && salesRes.value.ok) {
        const salesData = await salesRes.value.json();
        setSales(Array.isArray(salesData) ? salesData : []);
      }
      if (ordersRes.status === "fulfilled" && ordersRes.value.ok) {
        const ordersData = await ordersRes.value.json();
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      }
      if (expensesRes.status === "fulfilled" && expensesRes.value.ok) {
        const expensesData = await expensesRes.value.json();
        setExpenses(Array.isArray(expensesData) ? expensesData : []);
      }
      if (usersRes.status === "fulfilled" && usersRes.value.ok) {
        const usersData = await usersRes.value.json();
        setUsers(Array.isArray(usersData) ? usersData : []);
      }
      if (categoriesRes.status === "fulfilled" && categoriesRes.value.ok) {
        const categoriesData = await categoriesRes.value.json();
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      }
    } catch (err) {
      console.error("Failed to load initial data from MongoDB:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ── SALES CRUD (MongoDB Backed) ─────────────────────────────────
  const addSale = useCallback(async (data) => {
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add sale");
      }
      const newSale = await res.json();
      setSales((prev) => [newSale, ...prev]);
      return newSale;
    } catch (err) {
      console.error("addSale error:", err);
      throw err;
    }
  }, []);

  const updateSale = useCallback(async (id, data) => {
    try {
      const res = await fetch(`/api/sales/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update sale");
      }
      const updated = await res.json();
      setSales((prev) =>
        prev.map((s) => (s._id === id || s.id === id ? updated : s))
      );
      return updated;
    } catch (err) {
      console.error("updateSale error:", err);
      throw err;
    }
  }, []);

  const deleteSale = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/sales/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete sale");
      }
      setSales((prev) => prev.filter((s) => s._id !== id && s.id !== id));
      return true;
    } catch (err) {
      console.error("deleteSale error:", err);
      throw err;
    }
  }, []);

  // ── ORDERS CRUD (MongoDB Backed) ────────────────────────────────
  const addOrder = useCallback(async (data) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add order");
      }
      const newOrder = await res.json();
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      console.error("addOrder error:", err);
      throw err;
    }
  }, []);

  const updateOrder = useCallback(async (id, data) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update order");
      }
      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id || o.id === id || o.orderId === id ? updated : o
        )
      );
      return updated;
    } catch (err) {
      console.error("updateOrder error:", err);
      throw err;
    }
  }, []);

  const deleteOrder = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete order");
      }
      setOrders((prev) =>
        prev.filter((o) => o._id !== id && o.id !== id && o.orderId !== id)
      );
      return true;
    } catch (err) {
      console.error("deleteOrder error:", err);
      throw err;
    }
  }, []);

  // ── EXPENSES CRUD (MongoDB Backed) ──────────────────────────────
  const addExpense = useCallback(async (data) => {
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add expense");
      }
      const newExpense = await res.json();
      setExpenses((prev) => [newExpense, ...prev]);
      return newExpense;
    } catch (err) {
      console.error("addExpense error:", err);
      throw err;
    }
  }, []);

  const updateExpense = useCallback(async (id, data) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update expense");
      }
      const updated = await res.json();
      setExpenses((prev) =>
        prev.map((e) => (e._id === id || e.id === id ? updated : e))
      );
      return updated;
    } catch (err) {
      console.error("updateExpense error:", err);
      throw err;
    }
  }, []);

  const deleteExpense = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete expense");
      }
      setExpenses((prev) => prev.filter((e) => e._id !== id && e.id !== id));
      return true;
    } catch (err) {
      console.error("deleteExpense error:", err);
      throw err;
    }
  }, []);

  // ── USERS CRUD (MongoDB Backed) ─────────────────────────────────
  const addUser = useCallback(async (data) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add user");
      }
      const newUser = await res.json();
      setUsers((prev) => [newUser, ...prev]);
      return newUser;
    } catch (err) {
      console.error("addUser error:", err);
      throw err;
    }
  }, []);

  const updateUser = useCallback(async (id, data) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update user");
      }
      const updated = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u._id === id || u.id === id ? updated : u))
      );
      return updated;
    } catch (err) {
      console.error("updateUser error:", err);
      throw err;
    }
  }, []);

  const deleteUser = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete user");
      }
      setUsers((prev) => prev.filter((u) => u._id !== id && u.id !== id));
      return true;
    } catch (err) {
      console.error("deleteUser error:", err);
      throw err;
    }
  }, []);

  // ── CATEGORIES CRUD ─────────────────────────────────────────────
  const addCategory = useCallback(async (data) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add category");
      }
      const newCategory = await res.json();
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      console.error("addCategory error:", err);
      throw err;
    }
  }, []);

  const deleteCategory = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete category");
      }
      setCategories((prev) =>
        prev.filter((c) => c._id !== id && c.id !== id && c.name !== id)
      );
      return true;
    } catch (err) {
      console.error("deleteCategory error:", err);
      throw err;
    }
  }, []);

  // ── Dashboard summary computed live from state ───────────────────
  const getDashboardSummary = useCallback(() => {
    const totalRevenue = sales.reduce(
      (a, s) => a + (Number(s.totalSales) || Number(s.totalSale) || 0),
      0
    );
    const totalSalesCount = sales.length;
    const totalExpenses = expenses.reduce(
      (a, e) => a + (Number(e.totalAmount) || 0),
      0
    );
    const totalOrders = orders.length;
    const completedOrders = orders.filter((o) => o.status === "Completed").length;
    const cancelledOrders = orders.filter((o) => o.status === "Cancelled").length;
    const pendingExpenses = expenses.filter((e) => e.status === "Pending").length;
    const paidExpenses = expenses.filter((e) => e.status === "Paid").length;
    const profit = totalRevenue - totalExpenses;

    return {
      totalRevenue,
      totalSalesCount,
      totalExpenses,
      totalItemsSold: totalRevenue,
      totalOrders,
      completedOrders,
      cancelledOrders,
      pendingExpenses,
      paidExpenses,
      profit,
      usersCount: users.length,
    };
  }, [sales, orders, expenses, users]);

  // ── Snapshot for the AI chatbot ─────────────────────────────────
  const getDataSnapshot = useCallback(() => {
    return {
      summary: getDashboardSummary(),
      sales: sales.map(
        ({
          id,
          _id,
          date,
          opening,
          openingCash,
          purchase,
          purchaseCash,
          onlinePayment,
          onlineCash,
          cashPayment,
          physicalCash,
          transferred,
          cashTransferred,
          closing,
          closingCash,
          totalSales,
        }) => ({
          id: id || _id,
          date,
          opening: opening ?? openingCash,
          purchase: purchase ?? purchaseCash,
          onlinePayment: onlinePayment ?? onlineCash,
          cashPayment: cashPayment ?? physicalCash,
          transferred: transferred ?? cashTransferred,
          closing: closing ?? closingCash,
          totalSales,
        })
      ),
      orders: orders.map(
        ({
          id,
          _id,
          orderId,
          date,
          customerName,
          deliveryDate,
          paymentMode,
          status,
          totalAmount,
        }) => ({
          id: id || _id,
          orderId,
          date,
          customerName,
          deliveryDate,
          paymentMode,
          status,
          totalAmount,
        })
      ),
      expenses: expenses.map(
        ({
          id,
          _id,
          date,
          category,
          subcategory,
          totalAmount,
          status,
          paymentMode,
        }) => ({
          id: id || _id,
          date,
          category,
          subcategory,
          totalAmount,
          status,
          paymentMode,
        })
      ),
      users: users.map(({ id, _id, fullName, name, emailAddress, email, role }) => ({
        id: id || _id,
        name: fullName || name,
        email: emailAddress || email,
        role,
      })),
      categories: categories.map(({ id, _id, name, subcategories }) => ({
        id: id || _id,
        name,
        subcategories,
      })),
    };
  }, [sales, orders, expenses, users, categories, getDashboardSummary]);

  // ── Execute chatbot action (now async MongoDB calls) ────────────
  const executeAction = useCallback(
    async (action) => {
      try {
        const { type, data } = action;
        switch (type) {
          case "ADD_SALE": {
            const res = await addSale(data);
            return { success: true, result: res };
          }
          case "UPDATE_SALE": {
            const res = await updateSale(data.id || data._id, data);
            return { success: true, result: res };
          }
          case "DELETE_SALE": {
            const res = await deleteSale(data.id || data._id);
            return { success: true, result: res };
          }
          case "ADD_ORDER": {
            const res = await addOrder(data);
            return { success: true, result: res };
          }
          case "UPDATE_ORDER": {
            const res = await updateOrder(data.id || data._id || data.orderId, data);
            return { success: true, result: res };
          }
          case "DELETE_ORDER": {
            const res = await deleteOrder(data.id || data._id || data.orderId);
            return { success: true, result: res };
          }
          case "ADD_EXPENSE": {
            const res = await addExpense(data);
            return { success: true, result: res };
          }
          case "UPDATE_EXPENSE": {
            const res = await updateExpense(data.id || data._id, data);
            return { success: true, result: res };
          }
          case "DELETE_EXPENSE": {
            const res = await deleteExpense(data.id || data._id);
            return { success: true, result: res };
          }
          case "ADD_USER": {
            const res = await addUser(data);
            return { success: true, result: res };
          }
          case "UPDATE_USER": {
            const res = await updateUser(data.id || data._id, data);
            return { success: true, result: res };
          }
          case "DELETE_USER": {
            const res = await deleteUser(data.id || data._id);
            return { success: true, result: res };
          }
          default:
            return { success: false, error: `Unknown action: ${type}` };
        }
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [
      addSale,
      updateSale,
      deleteSale,
      addOrder,
      updateOrder,
      deleteOrder,
      addExpense,
      updateExpense,
      deleteExpense,
      addUser,
      updateUser,
      deleteUser,
    ]
  );

  const value = {
    sales,
    orders,
    expenses,
    users,
    categories,
    loading,
    refreshData: fetchAllData,
    addSale,
    updateSale,
    deleteSale,
    addOrder,
    updateOrder,
    deleteOrder,
    addExpense,
    updateExpense,
    deleteExpense,
    addUser,
    updateUser,
    deleteUser,
    addCategory,
    deleteCategory,
    getDashboardSummary,
    getDataSnapshot,
    executeAction,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataContext;
