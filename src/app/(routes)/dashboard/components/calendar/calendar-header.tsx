import { CardHeader } from "@/components/ui/card";
import React from "react";
import { Calendar, Clock, LineChart } from "lucide-react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CalendarHeader() {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Market Analysis View</h3>
        <TabSwitchViews />
      </div>
    </CardHeader>
  );
}

function TabSwitchViews() {
  return (
    <Tabs defaultValue="tab-1">
      <ScrollArea>
        <TabsList className="bg-background mb-3 h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse">
          <TabsTrigger
            value="tab-1"
            className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
          >
            <Calendar
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Monthly
          </TabsTrigger>
          <TabsTrigger
            value="tab-2"
            className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
          >
            <LineChart
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Weekly
          </TabsTrigger>
          <TabsTrigger
            value="tab-3"
            className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
          >
            <Clock
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Daily
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Tabs>
  );
}
