import { useState } from "react";

export interface MonthSelectorReturn {
  year: number;
  month: number; // 1-12
  monthLabel: string;
  yearLabel: string;
  prevMonth: () => void;
  nextMonth: () => void;
  prevYear: () => void;
  nextYear: () => void;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
}

const MONTH_NAMES = [
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

export function useMonthSelector(
  initialYear?: number,
  initialMonth?: number,
): MonthSelectorReturn {
  const now = new Date();
  const [year, setYear] = useState(initialYear ?? now.getFullYear());
  const [month, setMonth] = useState(initialMonth ?? now.getMonth() + 1);

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const prevYear = () => setYear((y) => y - 1);
  const nextYear = () => setYear((y) => y + 1);

  return {
    year,
    month,
    monthLabel: MONTH_NAMES[month - 1],
    yearLabel: String(year),
    prevMonth,
    nextMonth,
    prevYear,
    nextYear,
    setYear,
    setMonth,
  };
}
