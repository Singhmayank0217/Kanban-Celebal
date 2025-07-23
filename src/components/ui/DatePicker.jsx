"use client";

import React, { useState, useRef } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "../icons/Icons";
import { useTheme } from "../../hooks/useTheme";

const DatePicker = ({
  selected,
  onChange,
  placeholderText = "Select a date",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef(null);
  const { isDarkMode } = useTheme();

  const toggleCalendar = () => {
    setIsOpen(!isOpen);
  };
  const handleDateClick = (date) => {
    onChange(date);
    setIsOpen(false);
  };

  const handleClickOutside = (e) => {
    if (calendarRef.current && !calendarRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const generateCalendar = () => {
    const today = new Date();
    const currentMonth = selected ? selected.getMonth() : today.getMonth();
    const currentYear = selected ? selected.getFullYear() : today.getFullYear();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isSelected =
        selected &&
        date.getDate() === selected.getDate() &&
        date.getMonth() === selected.getMonth() &&
        date.getFullYear() === selected.getFullYear();

      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(date)}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm
            ${
              isSelected
                ? "bg-purple-600 text-white"
                : isToday
                ? "border border-purple-600 text-purple-600 dark:text-purple-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleCalendar}
        className="w-full flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-left focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
      >
        <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
        {selected ? format(selected, "PPP") : placeholderText}
      </button>

      {isOpen && (
        <div
          ref={calendarRef}
          className="absolute z-10 mt-1 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 p-3 animate-fade-in transition-colors"
        >
          <div className="mb-2 flex justify-between items-center">
            <button
              type="button"
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              &lt;
            </button>
            <div className="font-medium text-gray-700 dark:text-gray-300">
              {selected
                ? format(selected, "MMMM yyyy")
                : format(new Date(), "MMMM yyyy")}
            </div>
            <button
              type="button"
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              &gt;
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="h-8 w-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">{generateCalendar()}</div>

          <div className="mt-2 flex justify-between">
            <button
              type="button"
              onClick={() => {
                handleDateClick(new Date());
              }}
              className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
            >
              Today
            </button>

            {selected && (
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setIsOpen(false);
                }}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
