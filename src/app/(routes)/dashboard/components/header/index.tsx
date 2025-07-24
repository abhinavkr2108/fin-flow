import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { DollarSign } from "lucide-react";
import React from "react";
import SelectOption from "./select-option";

export default function Header() {
  return (
    <div className="w-full h-32 md:h-20 z-50 shadow-lg">
      <div className="flex flex-col gap-1 p-5 md:p-0 md:flex-row justify-between items-center h-full max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <Button>
            <DollarSign className="h-4 w-4" />
          </Button>
          <div className="flex flex-col gap-0">
            <h1 className="text-xl font-bold">FinFlow</h1>
            <p className="hidden md:block text-sm text-gray-500">
              Interactive volatility and performance analysis
            </p>
          </div>
        </div>

        <SelectOption />
      </div>
    </div>
  );
}
