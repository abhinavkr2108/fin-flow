"use client";
import { CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import CalendarCell from "./calendar-cell";

type Navigate = "prev" | "next";
export default function CalendarBody() {
  const today = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [currentDate, setCurrentDate] = useState(new Date());

  const navigateMonth = (navigate: Navigate) => {
    const newDate = new Date(currentDate);
    if (navigate === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <CardContent>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          >
            Today
          </button>
          <button
            onClick={() => navigateMonth("next")}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {dayNames.map((day, idx) => (
          <div
            key={idx}
            className="p-4 text-center text-sm font-medium text-slate-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <CalendarCell currentDate={currentDate} />
    </CardContent>
  );
}
