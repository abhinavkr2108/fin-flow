interface CalendarCellProps {
  currentDate: Date;
}

export default function CalendarCell({ currentDate }: CalendarCellProps) {
  const today = new Date();
  const isToday = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return date.toDateString() === today.toDateString();
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfWeek = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  return (
    <div className="grid grid-cols-7 gap-1">
      {/* Empty cells before the first day of the month */}
      {Array(firstDayOfWeek)
        .fill(0)
        .map((_, idx) => (
          <div key={idx} className="p-4 text-center text-sm text-slate-300">
            &nbsp;
          </div>
        ))}

      {/* Days of the month */}
      {Array.from({ length: daysInMonth }, (_, idx) => idx + 1).map(
        (day, idx) => (
          <div
            key={idx}
            className={`text-center text-sm font-medium text-slate-800 h-20 p-2 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
              isToday(day) ? "border-violet-600 border-2" : ""
            } `}
          >
            {day}
          </div>
        )
      )}
    </div>
  );
}
