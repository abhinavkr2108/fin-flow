"use client";
import { CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import CalendarCell from "./calendar-cell";

type Navigate = "prev" | "next";
export default function CalendarBody() {
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 cursor-pointer bg-violet-100 hover:bg-violet-200 hover:text-white font-bold rounded-sm transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => navigateMonth("next")}
            className="p-2 cursor-pointer bg-violet-100 hover:bg-violet-200 hover:text-white font-bold rounded-sm transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
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
