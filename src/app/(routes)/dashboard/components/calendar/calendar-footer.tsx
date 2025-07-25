import { CardFooter } from "@/components/ui/card";
import React from "react";

export default function CalendarFooter() {
  return (
    <CardFooter>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 inline-block rounded-sm bg-gradient-to-br from-green-100 to-green-200 border border-green-300"></span>
          <span className="text-sm font-semibold">Low Volatility</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 inline-block rounded-sm bg-gradient-to-br from-yellow-100 to-yellow-200 border border-yellow-300"></span>
          <span className="text-sm font-semibold">Medium Volatility</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 inline-block rounded-sm bg-gradient-to-br from-red-100 to-red-200 border border-red-300"></span>
          <span className="text-sm font-semibold">High Volatility</span>
        </div>
      </div>
    </CardFooter>
  );
}
