import React from "react";
import Header from "./components/header";
import CalendarView from "./components/calendar";

export default function DashboardPage() {
  return (
    <React.Fragment>
      <Header />
      <CalendarView />
    </React.Fragment>
  );
}
