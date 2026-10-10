"use client";

import React, { useMemo } from "react";
import { LuWallet, LuCreditCard, LuBanknote, LuArrowRightLeft } from "react-icons/lu";

const CashFlowWidget = ({ sales = [], orders = [] }) => {
  const {
    onlineSales,
    cashSales,
    transferredCash,
    onlineOrders,
    cashOrders,
    totalInflow,
  } = useMemo(() => {
    let onlineS = 0;
    let cashS = 0;
    let transfer = 0;

    sales.forEach((s) => {
      onlineS += Number(s.onlinePayment) || Number(s.onlineCash) || 0;
      cashS += Number(s.cashPayment) || Number(s.physicalCash) || 0;
      transfer += Number(s.transferred) || Number(s.cashTransferred) || 0;
    });

    let onlineO = 0;
    let cashO = 0;

    orders.forEach((o) => {
      const amt = Number(o.totalAmount) || Number(o.amount) || 0;
      if (o.paymentMode?.toLowerCase() === "cash") {
        cashO += amt;
      } else {
        onlineO += amt;
      }
    });

    const total = onlineS + cashS + onlineO + cashO;

    return {
      onlineSales: onlineS,
      cashSales: cashS,
      transferredCash: transfer,
      onlineOrders: onlineO,
      cashOrders: cashO,
      totalInflow: total,
    };
  }, [sales, orders]);

  const totalDigital = onlineSales + onlineOrders;
  const totalPhysical = cashSales + cashOrders;

  const digitalPercent = totalInflow > 0 ? (totalDigital / totalInflow) * 100 : 0;
  const physicalPercent = totalInflow > 0 ? (totalPhysical / totalInflow) * 100 : 0;

  const formatCurrency = (val) =>
    `₹ ${(val || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="bg-secondary/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-[#545454]/40 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-700/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
              <LuWallet size={18} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-text-primary">
              Payment & Cash Flow Health
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            Total {formatCurrency(totalInflow)}
          </span>
        </div>

        {/* Liquid split bar */}
        <div className="my-4">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-violet-300 flex items-center gap-1.5">
              <LuCreditCard size={13} />
              Online Digital ({digitalPercent.toFixed(1)}%)
            </span>
            <span className="text-amber-300 flex items-center gap-1.5">
              <LuBanknote size={13} />
              Physical Cash ({physicalPercent.toFixed(1)}%)
            </span>
          </div>

          <div className="w-full h-3.5 bg-gray-800 rounded-full overflow-hidden flex p-0.5 border border-gray-700/60 shadow-inner">
            <div
              style={{ width: `${digitalPercent}%` }}
              className="h-full bg-gradient-to-r from-violet-600 to-indigo-400 rounded-l-full transition-all duration-500"
              title={`Digital: ${formatCurrency(totalDigital)}`}
            />
            <div
              style={{ width: `${physicalPercent}%` }}
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-r-full transition-all duration-500"
              title={`Cash: ${formatCurrency(totalPhysical)}`}
            />
          </div>
        </div>

        {/* 3 Detail Metric Blocks */}
        <div className="grid grid-cols-3 gap-2.5 my-3">
          <div className="bg-form-bg/70 rounded-2xl p-3 border border-violet-500/20 text-left">
            <span className="text-[11px] text-violet-400 font-semibold block">Digital Inflow</span>
            <span className="text-sm sm:text-base font-bold text-text-primary block mt-0.5">
              {formatCurrency(totalDigital)}
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">UPI, QR, Cards</span>
          </div>

          <div className="bg-form-bg/70 rounded-2xl p-3 border border-amber-500/20 text-left">
            <span className="text-[11px] text-amber-400 font-semibold block">Cash Register</span>
            <span className="text-sm sm:text-base font-bold text-text-primary block mt-0.5">
              {formatCurrency(totalPhysical)}
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">In-Hand Notes</span>
          </div>

          <div className="bg-form-bg/70 rounded-2xl p-3 border border-emerald-500/20 text-left">
            <span className="text-[11px] text-emerald-400 font-semibold block">Transferred</span>
            <span className="text-sm sm:text-base font-bold text-text-primary block mt-0.5">
              {formatCurrency(transferredCash)}
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">Deposited to Bank</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-700/40 text-[11px] text-text-primary/60 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <LuArrowRightLeft size={13} className="text-accent" />
          Bank reconciliation rate:
        </span>
        <span className="font-semibold text-emerald-400">
          {totalPhysical > 0
            ? `${((transferredCash / totalPhysical) * 100).toFixed(0)}% deposited`
            : "100% balanced"}
        </span>
      </div>
    </div>
  );
};

export default CashFlowWidget;
