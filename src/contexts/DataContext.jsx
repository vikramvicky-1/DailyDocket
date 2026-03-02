"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

// ─── Initial Mock Data ────────────────────────────────────────────
const initialSalesData = [
    { id: 1, date: "2025-09-25T10:30:00", opening: 890, purchase: 1890, onlinePayment: 5890, cashPayment: 1890, transferred: 1890, closing: 50, attachment: null, totalSales: 11000 },
    { id: 2, date: "2025-09-24T14:15:00", opening: 678, purchase: 1890, onlinePayment: 6890, cashPayment: 2890, transferred: 890, closing: 50, attachment: null, totalSales: 6000 },
    { id: 3, date: "2025-09-23T09:45:00", opening: 976, purchase: 1890, onlinePayment: 3890, cashPayment: 4890, transferred: 2546, closing: 50, attachment: null, totalSales: 12947 },
    { id: 4, date: "2025-09-22T16:20:00", opening: 268, purchase: 1890, onlinePayment: 7890, cashPayment: 3890, transferred: 2890, closing: 50, attachment: null, totalSales: 20343 },
    { id: 5, date: "2025-09-21T11:10:00", opening: 875, purchase: 1890, onlinePayment: 8890, cashPayment: 1890, transferred: 1890, closing: 50, attachment: null, totalSales: 11000 },
];

const initialOrdersData = [
    { id: 1, orderId: "ID846597", date: "2025-09-25T10:30:00", customerName: "Agatha Christie", deliveryDate: "2025-09-27T10:30:00", paymentMode: "Cash", billAttachment: null, paymentAttachment: null, status: "Order Received", totalAmount: 5890 },
    { id: 2, orderId: "ID897439", date: "2025-09-24T14:15:00", customerName: "James Dotty", deliveryDate: "2025-09-29T14:15:00", paymentMode: "Card", billAttachment: null, paymentAttachment: null, status: "Out for Delivery", totalAmount: 6890 },
    { id: 3, orderId: "ID648397", date: "2025-09-23T09:45:00", customerName: "Lewis Sabuda", deliveryDate: "2025-10-01T09:45:00", paymentMode: "UPI", billAttachment: null, paymentAttachment: null, status: "Cancelled", totalAmount: 3890 },
    { id: 4, orderId: "ID892164", date: "2025-09-22T16:20:00", customerName: "John Barrow", deliveryDate: "2025-10-04T16:20:00", paymentMode: "UPI", billAttachment: "bill.pdf", paymentAttachment: "payment.pdf", status: "Completed", totalAmount: 7890 },
    { id: 5, orderId: "ID756321", date: "2025-09-21T11:10:00", customerName: "Sarah Johnson", deliveryDate: "2025-09-26T11:10:00", paymentMode: "Card", billAttachment: null, paymentAttachment: null, status: "Order Received", totalAmount: 4520 },
    { id: 6, orderId: "ID634789", date: "2025-09-20T13:25:00", customerName: "Michael Smith", deliveryDate: "2025-09-28T13:25:00", paymentMode: "Cash", billAttachment: "bill.pdf", paymentAttachment: null, status: "Out for Delivery", totalAmount: 8950 },
    { id: 7, orderId: "ID512467", date: "2025-09-19T08:55:00", customerName: "Emma Wilson", deliveryDate: "2025-09-30T08:55:00", paymentMode: "UPI", billAttachment: null, paymentAttachment: "payment.pdf", status: "Completed", totalAmount: 3200 },
    { id: 8, orderId: "ID398245", date: "2025-09-18T12:40:00", customerName: "David Brown", deliveryDate: "2025-10-02T12:40:00", paymentMode: "Card", billAttachment: null, paymentAttachment: null, status: "Cancelled", totalAmount: 5670 },
];

const initialExpensesData = [
    { id: 1, date: "2025-09-25T10:30:00", category: "Masala Materials", subcategory: "Agatha Christie", totalAmount: 5890, status: "Paid", paymentMode: "Online", billAttachment: null, remarks: "-" },
    { id: 2, date: "2025-09-24T14:15:00", category: "Powder", subcategory: "James Dotty", totalAmount: 6890, status: "Paid", paymentMode: "Online", billAttachment: null, remarks: "-" },
    { id: 3, date: "2025-09-23T09:45:00", category: "Snacks", subcategory: "Lewis Sabuda", totalAmount: 3890, status: "Pending", paymentMode: "Online", billAttachment: null, remarks: "-" },
    { id: 4, date: "2025-09-22T16:20:00", category: "Snacks", subcategory: "John Barrow", totalAmount: 7890, status: "Paid", paymentMode: "Online", billAttachment: "bill.pdf", remarks: "-" },
    { id: 5, date: "2025-09-22T11:10:00", category: "Snacks", subcategory: "John Barrow", totalAmount: 7890, status: "Paid", paymentMode: "Online", billAttachment: null, remarks: "-" },
    { id: 6, date: "2025-09-22T13:25:00", category: "Snacks", subcategory: "John Barrow", totalAmount: 7890, status: "Paid", paymentMode: "Online", billAttachment: null, remarks: "-" },
    { id: 7, date: "2025-09-22T08:55:00", category: "Snacks", subcategory: "John Barrow", totalAmount: 7890, status: "Paid", paymentMode: "Online", billAttachment: "bill.pdf", remarks: "-" },
    { id: 8, date: "2025-09-21T12:40:00", category: "Vegetables", subcategory: "Sarah Johnson", totalAmount: 4520, status: "Pending", paymentMode: "Cash", billAttachment: null, remarks: "-" },
];

const initialUsersData = [
    { id: 1, name: "Aarav Mehta", email: "Aarav@gmail.com", role: "Administrator" },
    { id: 2, name: "Riya Kapoor", email: "Riya@gmail.com", role: "Staff" },
    { id: 3, name: "Kabir Sharma", email: "Kabir@gmail.com", role: "Staff" },
    { id: 4, name: "Sneha Iyer", email: "Sneha@gmail.com", role: "Accountant" },
    { id: 5, name: "Aditya Nair", email: "Aditya@gmail.com", role: "Accountant" },
];

// ─── Context ──────────────────────────────────────────────────────
const DataContext = createContext(null);

export const useData = () => {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error("useData must be used within DataProvider");
    return ctx;
};

// ─── Helper: next ID ──────────────────────────────────────────────
const nextId = (arr) => (arr.length === 0 ? 1 : Math.max(...arr.map((i) => i.id)) + 1);

// ─── Provider ─────────────────────────────────────────────────────
export const DataProvider = ({ children }) => {
    const [sales, setSales] = useState(initialSalesData);
    const [orders, setOrders] = useState(initialOrdersData);
    const [expenses, setExpenses] = useState(initialExpensesData);
    const [users, setUsers] = useState(initialUsersData);

    // ── SALES CRUD ────────────────────────────────────────────────
    const addSale = useCallback((data) => {
        const entry = { ...data, id: nextId(sales) };
        setSales((prev) => [entry, ...prev]);
        return entry;
    }, [sales]);

    const updateSale = useCallback((id, data) => {
        setSales((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    }, []);

    const deleteSale = useCallback((id) => {
        setSales((prev) => prev.filter((s) => s.id !== id));
    }, []);

    // ── ORDERS CRUD ───────────────────────────────────────────────
    const addOrder = useCallback((data) => {
        const entry = { ...data, id: nextId(orders) };
        setOrders((prev) => [entry, ...prev]);
        return entry;
    }, [orders]);

    const updateOrder = useCallback((id, data) => {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)));
    }, []);

    const deleteOrder = useCallback((id) => {
        setOrders((prev) => prev.filter((o) => o.id !== id));
    }, []);

    // ── EXPENSES CRUD ─────────────────────────────────────────────
    const addExpense = useCallback((data) => {
        const entry = { ...data, id: nextId(expenses) };
        setExpenses((prev) => [entry, ...prev]);
        return entry;
    }, [expenses]);

    const updateExpense = useCallback((id, data) => {
        setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
    }, []);

    const deleteExpense = useCallback((id) => {
        setExpenses((prev) => prev.filter((e) => e.id !== id));
    }, []);

    // ── USERS CRUD ────────────────────────────────────────────────
    const addUser = useCallback((data) => {
        const entry = { ...data, id: nextId(users) };
        setUsers((prev) => [entry, ...prev]);
        return entry;
    }, [users]);

    const updateUser = useCallback((id, data) => {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
    }, []);

    const deleteUser = useCallback((id) => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
    }, []);

    // ── Dashboard summary ─────────────────────────────────────────
    const getDashboardSummary = useCallback(() => {
        const totalRevenue = sales.reduce((a, s) => a + (s.totalSales || 0), 0);
        const totalSalesCount = sales.length;
        const totalExpenses = expenses.reduce((a, e) => a + (e.totalAmount || 0), 0);
        const totalItemsSold = sales.reduce((a, s) => a + (s.totalSales || 0), 0);
        const totalOrders = orders.length;
        const completedOrders = orders.filter((o) => o.status === "Completed").length;
        const cancelledOrders = orders.filter((o) => o.status === "Cancelled").length;
        const pendingExpenses = expenses.filter((e) => e.status === "Pending").length;
        const paidExpenses = expenses.filter((e) => e.status === "Paid").length;
        return {
            totalRevenue,
            totalSalesCount,
            totalExpenses,
            totalItemsSold,
            totalOrders,
            completedOrders,
            cancelledOrders,
            pendingExpenses,
            paidExpenses,
            profit: totalRevenue - totalExpenses,
            usersCount: users.length,
        };
    }, [sales, orders, expenses, users]);

    // ── Snapshot for the AI chatbot ───────────────────────────────
    const getDataSnapshot = useCallback(() => {
        return {
            summary: getDashboardSummary(),
            sales: sales.map(({ id, date, opening, purchase, onlinePayment, cashPayment, transferred, closing, totalSales }) => ({
                id, date, opening, purchase, onlinePayment, cashPayment, transferred, closing, totalSales,
            })),
            orders: orders.map(({ id, orderId, date, customerName, deliveryDate, paymentMode, status, totalAmount }) => ({
                id, orderId, date, customerName, deliveryDate, paymentMode, status, totalAmount,
            })),
            expenses: expenses.map(({ id, date, category, subcategory, totalAmount, status, paymentMode }) => ({
                id, date, category, subcategory, totalAmount, status, paymentMode,
            })),
            users: users.map(({ id, name, email, role }) => ({ id, name, email, role })),
        };
    }, [sales, orders, expenses, users, getDashboardSummary]);

    // ── Execute chatbot action ────────────────────────────────────
    const executeAction = useCallback((action) => {
        try {
            const { type, data } = action;
            switch (type) {
                case "ADD_SALE": return { success: true, result: addSale(data) };
                case "UPDATE_SALE": return { success: true, result: (updateSale(data.id, data), "Updated") };
                case "DELETE_SALE": return { success: true, result: (deleteSale(data.id), "Deleted") };
                case "ADD_ORDER": return { success: true, result: addOrder(data) };
                case "UPDATE_ORDER": return { success: true, result: (updateOrder(data.id, data), "Updated") };
                case "DELETE_ORDER": return { success: true, result: (deleteOrder(data.id), "Deleted") };
                case "ADD_EXPENSE": return { success: true, result: addExpense(data) };
                case "UPDATE_EXPENSE": return { success: true, result: (updateExpense(data.id, data), "Updated") };
                case "DELETE_EXPENSE": return { success: true, result: (deleteExpense(data.id), "Deleted") };
                case "ADD_USER": return { success: true, result: addUser(data) };
                case "UPDATE_USER": return { success: true, result: (updateUser(data.id, data), "Updated") };
                case "DELETE_USER": return { success: true, result: (deleteUser(data.id), "Deleted") };
                default: return { success: false, error: `Unknown action: ${type}` };
            }
        } catch (err) {
            return { success: false, error: err.message };
        }
    }, [addSale, updateSale, deleteSale, addOrder, updateOrder, deleteOrder, addExpense, updateExpense, deleteExpense, addUser, updateUser, deleteUser]);

    const value = {
        sales, orders, expenses, users,
        addSale, updateSale, deleteSale,
        addOrder, updateOrder, deleteOrder,
        addExpense, updateExpense, deleteExpense,
        addUser, updateUser, deleteUser,
        getDashboardSummary, getDataSnapshot, executeAction,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataContext;
