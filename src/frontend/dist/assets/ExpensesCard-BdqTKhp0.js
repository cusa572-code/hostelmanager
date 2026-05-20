import { r as reactExports, j as jsxRuntimeExports, B as Button } from "./index-BHGx-AOT.js";
import { I as Input } from "./input-BlYRW_mJ.js";
import { L as Label } from "./label-CG4MNOlI.js";
import { g as useSetMonthlyExpenses, R as Receipt } from "./Layout-eWnk62al.js";
const EXPENSE_FIELDS = [
  { id: "rent", label: "Rent (₹)", ocid: "expenses.rent_input" },
  {
    id: "electricity",
    label: "Electricity Bill (₹)",
    ocid: "expenses.electricity_input"
  },
  {
    id: "staffSalary",
    label: "Staff Salary (₹)",
    ocid: "expenses.staff_input"
  },
  { id: "other", label: "Other Expenses (₹)", ocid: "expenses.other_input" }
];
function toFormState(exp) {
  return {
    rent: exp ? String(exp.rent) : "",
    electricity: exp ? String(exp.electricity) : "",
    staffSalary: exp ? String(exp.staffSalary) : "",
    other: exp ? String(exp.other) : ""
  };
}
function ExpensesCard({
  expenses,
  year,
  month,
  isLoading
}) {
  const [form, setForm] = reactExports.useState(toFormState(expenses));
  const setExpenses = useSetMonthlyExpenses();
  reactExports.useEffect(() => {
    setForm(toFormState(expenses));
  }, [expenses]);
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleSave = () => {
    setExpenses.mutate({
      year,
      month,
      input: {
        rent: BigInt(form.rent || "0"),
        electricity: BigInt(form.electricity || "0"),
        staffSalary: BigInt(form.staffSalary || "0"),
        other: BigInt(form.other || "0")
      }
    });
  };
  const total = Number(form.rent || 0) + Number(form.electricity || 0) + Number(form.staffSalary || 0) + Number(form.other || 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "kpi-card space-y-4 border-orange-500/20",
      "data-ocid": "expenses.card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-4 w-4 text-orange-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-semibold text-foreground", children: "Monthly Expenses" })
          ] }),
          !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
            "Total:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-orange-400 font-semibold", children: [
              "₹",
              total.toLocaleString("en-IN")
            ] })
          ] })
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ["e1", "e2", "e3", "e4"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 animate-pulse rounded bg-muted" }, id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: EXPENSE_FIELDS.map((field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: `expense-${field.id}`,
                className: "text-xs text-muted-foreground",
                children: field.label
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: `expense-${field.id}`,
                type: "number",
                min: "0",
                value: form[field.id],
                onChange: (e) => handleChange(field.id, e.target.value),
                placeholder: "0",
                className: "h-9 font-mono text-sm",
                "data-ocid": field.ocid
              }
            )
          ] }, field.id)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: handleSave,
              disabled: setExpenses.isPending,
              className: "w-full border-orange-500/30 text-orange-400 hover:bg-orange-950/30 hover:text-orange-300",
              "data-ocid": "expenses.save_button",
              children: setExpenses.isPending ? "Saving…" : "Save Expenses"
            }
          )
        ] })
      ]
    }
  );
}
export {
  ExpensesCard as E
};
