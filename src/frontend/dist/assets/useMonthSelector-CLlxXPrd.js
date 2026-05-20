import { r as reactExports } from "./index-BHGx-AOT.js";
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
  "December"
];
function useMonthSelector(initialYear, initialMonth) {
  const now = /* @__PURE__ */ new Date();
  const [year, setYear] = reactExports.useState(now.getFullYear());
  const [month, setMonth] = reactExports.useState(now.getMonth() + 1);
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
    setMonth
  };
}
export {
  useMonthSelector as u
};
