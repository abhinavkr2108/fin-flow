// calendar-cell.tsx

import { ProcessedCryptoData } from "@/lib/types/market";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, TrendingDown, TrendingUp } from "lucide-react";

interface CalendarCellProps {
  currentDate: Date;
  processedData: Record<string, ProcessedCryptoData>;
}

export default function CalendarCell({
  currentDate,
  processedData,
}: CalendarCellProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const getCellColor = (day: number): string => {
    const dateKey = new Date(year, month, day).toISOString().split("T")[0];
    const data = processedData[dateKey];

    if (!data) return "bg-muted";

    if (data.volatility < 0.3)
      return "bg-gradient-to-br from-green-100 to-green-200 border-green-300 text-green-800";
    if (data.volatility < 0.6)
      return "bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300 text-yellow-800";
    if (data.volatility < 1.0)
      return "bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300 text-orange-800";
    return "bg-gradient-to-br from-red-100 to-red-200 border-red-300 text-red-800";
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {/* Headers */}
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
        <div
          key={i}
          className="text-center text-sm text-gray-500 font-semibold"
        >
          {d}
        </div>
      ))}

      {/* Leading empty cells */}
      {Array(firstDayOfWeek)
        .fill(null)
        .map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

      {/* Day Cells */}
      {Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const date = new Date(year, month, day);
        const dateKey = date.toISOString().split("T")[0];
        const data = processedData[dateKey];

        return (
          <div key={day} className="relative group">
            <div
              className={cn(
                "p-2 aspect-square rounded-lg text-center text-sm cursor-pointer border transition-all",
                getCellColor(day),
                date.toDateString() === today.toDateString() &&
                  "border-violet-600 border-2"
              )}
            >
              <div>{day}</div>
              {data && (
                <div className="text-xs mt-1">
                  {data.priceChangePercent > 0 ? (
                    <span className="text-green-700">▲</span>
                  ) : data.priceChangePercent < 0 ? (
                    <span className="text-red-700">▼</span>
                  ) : (
                    <span className="text-gray-500">•</span>
                  )}
                </div>
              )}
            </div>

            <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-64 bg-white rounded-lg shadow-lg border p-4 opacity-0 invisible group-hover:visible group-hover:opacity-100 z-10 transition-all duration-200">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">
                  {date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </h3>
                {data && (
                  <p
                    className={cn(
                      "text-sm font-medium rounded-2xl px-2 py-1 text-white",
                      data.priceChangePercent > 0
                        ? "bg-green-600"
                        : "bg-red-600"
                    )}
                  >
                    {data.priceChangePercent > 0 ? "+" : ""}
                    {data.priceChangePercent?.toFixed(2) || "0.00"}%
                  </p>
                )}
              </div>

              {data ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="text-sm font-medium">
                      ${(data?.close * 100).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Volatility:</span>
                    <span className="text-sm font-medium">
                      {(data.volatility * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Liquidity:</span>
                    <span className="text-sm font-medium">
                      {data.liquidityScore?.toFixed(2) || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Volume:</span>
                    <span className="text-sm font-medium">
                      $
                      {data.volume
                        ? `${(data.volume / 1000000).toFixed(1)}M`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Trend:</span>
                    <span className="text-sm font-medium">
                      {data.priceChange > 0 ? (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          Bullish
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          Bearish
                        </div>
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
