import { Card, CardHeader } from "@/components/ui/card";
import React from "react";
import CalendarHeader from "./calendar-header";
import CalendarBody from "./calendar-body";

export default function CalendarView() {
  return (
    <Card className="max-w-7xl mx-auto mt-10 shadow-md">
      <CalendarHeader />
      <CalendarBody />
    </Card>
  );
}
