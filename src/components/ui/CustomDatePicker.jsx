"use client";

import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LuChevronLeft, LuChevronRight, LuCalendar } from "react-icons/lu";

// Custom input component
const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <div
    className="w-full h-11 px-5 py-2.5 bg-form-bg border border-[#545454] rounded-lg text-text-primary placeholder:text-gray-400 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-colors cursor-pointer flex items-center min-w-0"
    onClick={onClick}
    ref={ref}
  >
    <LuCalendar className="w-5 h-5 text-gray-400 flex-shrink-0 mr-2" />
    <span
      className={`truncate flex-1 ${
        value ? "text-text-primary" : "text-gray-400"
      }`}
    >
      {value || placeholder}
    </span>
  </div>
));

CustomInput.displayName = "CustomInput";

// Custom header component
const CustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => (
  <div className="flex items-center justify-between px-2 py-2">
    <button
      onClick={decreaseMonth}
      disabled={prevMonthButtonDisabled}
      className="p-1 hover:bg-accent/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      type="button"
    >
      <LuChevronLeft className="w-5 h-5 text-text-primary" />
    </button>

    <span className="text-lg font-semibold text-text-primary">
      {date.toLocaleString("default", { month: "long", year: "numeric" })}
    </span>

    <button
      onClick={increaseMonth}
      disabled={nextMonthButtonDisabled}
      className="p-1 hover:bg-accent/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      type="button"
    >
      <LuChevronRight className="w-5 h-5 text-text-primary" />
    </button>
  </div>
);

const CustomDatePicker = ({
  selected,
  onChange,
  placeholder = "Select Date",
  ...props
}) => {
  return (
    <div className="date-picker-wrapper relative w-full min-w-0">
      <DatePicker
        selected={selected}
        onChange={onChange}
        customInput={<CustomInput placeholder={placeholder} />}
        renderCustomHeader={(props) => <CustomHeader {...props} />}
        calendarClassName="custom-calendar"
        popperClassName="date-picker-popper"
        showPopperArrow={false}
        popperPlacement="bottom-start"
        wrapperClassName="w-full"
        {...props}
      />

      <style jsx global>{`
        .date-picker-wrapper .react-datepicker-wrapper {
          width: 100% !important;
        }

        .date-picker-wrapper .react-datepicker__input-container {
          width: 100% !important;
        }

        .custom-calendar {
          border: none !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
          font-family: inherit !important;
          background: var(--color-secondary) !important;
          border: 1px solid #545454 !important;
        }

        .date-picker-popper {
          z-index: 9999 !important;
        }

        .react-datepicker__month-container {
          border-radius: 12px !important;
          background: var(--color-secondary) !important;
        }

        .react-datepicker__header {
          background: var(--color-secondary) !important;
          border-bottom: 1px solid #545454 !important;
          border-radius: 12px 12px 0 0 !important;
          padding: 8px 0 !important;
        }

        .react-datepicker__current-month {
          display: none !important;
        }

        .react-datepicker__day-names {
          padding: 8px 0 !important;
          margin-bottom: 8px !important;
        }

        .react-datepicker__day-name {
          color: var(--color-text-primary) !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          width: 32px !important;
          height: 32px !important;
          line-height: 32px !important;
          margin: 2px !important;
        }

        .react-datepicker__week {
          display: flex !important;
          justify-content: center !important;
        }

        .react-datepicker__day {
          width: 32px !important;
          height: 32px !important;
          line-height: 32px !important;
          margin: 2px !important;
          border-radius: 8px !important;
          color: var(--color-text-primary) !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        .react-datepicker__day:hover {
          background: rgba(147, 129, 255, 0.1) !important;
          border-radius: 8px !important;
        }

        .react-datepicker__day--selected {
          background: var(--color-accent) !important;
          color: white !important;
          font-weight: 600 !important;
        }

        .react-datepicker__day--selected:hover {
          background: var(--color-accent) !important;
          opacity: 0.9 !important;
        }

        .react-datepicker__day--today {
          background: var(--color-primary) !important;
          color: var(--color-accent) !important;
          font-weight: 600 !important;
        }

        .react-datepicker__day--today:hover {
          background: var(--color-accent) !important;
          opacity: 0.9 !important;
        }

        .react-datepicker__day--selected.react-datepicker__day--today {
          background: var(--color-accent) !important;
        }

        .react-datepicker__day--outside-month {
          color: #6b7280 !important;
        }

        .react-datepicker__day--disabled {
          color: #6b7280 !important;
          cursor: not-allowed !important;
        }

        .react-datepicker__day--disabled:hover {
          background: transparent !important;
        }

        .react-datepicker__month {
          padding: 8px !important;
          background: var(--color-secondary) !important;
        }

        .react-datepicker__triangle {
          display: none !important;
        }

        .react-datepicker-popper[data-placement^="bottom"] {
          margin-top: 8px !important;
        }

        .react-datepicker-popper[data-placement^="top"] {
          margin-bottom: 8px !important;
        }
      `}</style>
    </div>
  );
};

export default CustomDatePicker;
