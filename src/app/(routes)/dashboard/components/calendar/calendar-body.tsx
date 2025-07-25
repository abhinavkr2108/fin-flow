"use client";

type CalendarView = "daily" | "weekly" | "monthly";
import { CardContent } from "@/components/ui/card";
import { useProcessedCryptoData } from "@/lib/ApiService";
import { useMemo, useState } from "react";
import CalendarCell from "./calendar-cell";
import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCryptoStore } from "@/store";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarBody() {
  const { selectedCrypto } = useCryptoStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("daily");

  const {
    data: cryptoData,
    isLoading,
    isError,
  } = useProcessedCryptoData(selectedCrypto, 90);

  if (isLoading) {
    return (
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {/* Skeleton Weekday Headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
            <Skeleton
              key={idx}
              className="text-center text-sm font-semibold h-8 bg-muted"
            >
              &nbsp;{/* Invisible placeholder for header width */}
            </Skeleton>
          ))}

          {/* Skeleton Date Cells: 6 Weeks x 7 Days = 42 Cells */}
          {Array.from({ length: 42 }, (_, idx) => (
            <div className="h-20" key={`skeleton-date-${idx}`}>
              <Skeleton className="w-full aspect-square p-2 rounded-lg bg-muted" />
              <div className="flex items-center gap-2">
                <LoaderCircle className="h-4 w-4 text-muted-foreground animate-spin" />
                <p>Loading....</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    );
  }
  if (isError) {
    return toast.error("Failed to load data");
  }

  const handleNavigation = (type: "prev" | "next") => {
    const newDate = new Date(currentDate);
    type === "prev"
      ? newDate.setMonth(newDate.getMonth() - 1)
      : newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  return (
    <CardContent>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <div className="flex gap-2">
          <Button
            className="h-8 w-8 cursor-pointer bg-violet-200 hover:bg-violet-300 text-muted-foreground"
            onClick={() => handleNavigation("prev")}
          >
            <ChevronLeft />
          </Button>
          <Button
            className="h-8 w-8 cursor-pointer bg-violet-200 hover:bg-violet-300 text-muted-foreground"
            onClick={() => handleNavigation("next")}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <CalendarCell
        currentDate={currentDate}
        processedData={cryptoData || {}}
      />
    </CardContent>
  );
}
