import { j as jsxRuntimeExports, B as Button } from "./index-BHGx-AOT.js";
import { E as ExpensesCard } from "./ExpensesCard-BdqTKhp0.js";
import { e as useMonthlyExpenses, L as Layout, C as ChevronRight } from "./Layout-eWnk62al.js";
import { u as useMonthSelector } from "./useMonthSelector-CLlxXPrd.js";
import { C as ChevronLeft } from "./chevron-left-D3t0WHEH.js";
import "./input-BlYRW_mJ.js";
import "./label-CG4MNOlI.js";
function ExpensesPage() {
  const { year, month, monthLabel, yearLabel, prevMonth, nextMonth } = useMonthSelector();
  const { data: expenses, isLoading } = useMonthlyExpenses(year, month);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { title: "Expenses", subtitle: "Monthly Breakdown", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-2xl", "data-ocid": "expenses.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3",
        "data-ocid": "expenses.month_selector",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              onClick: prevMonth,
              className: "h-8 w-8 shrink-0",
              "data-ocid": "expenses.prev_month_button",
              "aria-label": "Previous month",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-[140px] text-center font-display text-base font-semibold text-foreground", children: [
            monthLabel,
            " ",
            yearLabel
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              onClick: nextMonth,
              className: "h-8 w-8 shrink-0",
              "data-ocid": "expenses.next_month_button",
              "aria-label": "Next month",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExpensesCard,
      {
        expenses,
        year,
        month,
        isLoading
      }
    )
  ] }) });
}
export {
  ExpensesPage as default
};
