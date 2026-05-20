import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSetMonthlyExpenses } from "@/hooks/useQueries";
import type { MonthlyExpenses } from "@/types";
import { Receipt } from "lucide-react";
import { useEffect, useState } from "react";

interface ExpensesCardProps {
  expenses: MonthlyExpenses | null | undefined;
  year: number;
  month: number;
  isLoading?: boolean;
}

interface ExpenseField {
  id: keyof ExpenseFormState;
  label: string;
  ocid: string;
}

interface ExpenseFormState {
  rent: string;
  electricity: string;
  staffSalary: string;
  other: string;
}

const EXPENSE_FIELDS: ExpenseField[] = [
  { id: "rent", label: "Rent (₹)", ocid: "expenses.rent_input" },
  {
    id: "electricity",
    label: "Electricity Bill (₹)",
    ocid: "expenses.electricity_input",
  },
  {
    id: "staffSalary",
    label: "Staff Salary (₹)",
    ocid: "expenses.staff_input",
  },
  { id: "other", label: "Other Expenses (₹)", ocid: "expenses.other_input" },
];

function toFormState(
  exp: MonthlyExpenses | null | undefined,
): ExpenseFormState {
  return {
    rent: exp ? String(exp.rent) : "",
    electricity: exp ? String(exp.electricity) : "",
    staffSalary: exp ? String(exp.staffSalary) : "",
    other: exp ? String(exp.other) : "",
  };
}

export function ExpensesCard({
  expenses,
  year,
  month,
  isLoading,
}: ExpensesCardProps) {
  const [form, setForm] = useState<ExpenseFormState>(toFormState(expenses));
  const setExpenses = useSetMonthlyExpenses();

  useEffect(() => {
    setForm(toFormState(expenses));
  }, [expenses]);

  const handleChange = (field: keyof ExpenseFormState, value: string) => {
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
        other: BigInt(form.other || "0"),
      },
    });
  };

  const total =
    Number(form.rent || 0) +
    Number(form.electricity || 0) +
    Number(form.staffSalary || 0) +
    Number(form.other || 0);

  return (
    <div
      className="kpi-card space-y-4 border-orange-500/20"
      data-ocid="expenses.card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-orange-400" />
          <h3 className="font-display text-sm font-semibold text-foreground">
            Monthly Expenses
          </h3>
        </div>
        {!isLoading && (
          <span className="font-mono text-xs text-muted-foreground">
            Total:{" "}
            <span className="text-orange-400 font-semibold">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {["e1", "e2", "e3", "e4"].map((id) => (
            <div key={id} className="h-9 animate-pulse rounded bg-muted" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {EXPENSE_FIELDS.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <Label
                  htmlFor={`expense-${field.id}`}
                  className="text-xs text-muted-foreground"
                >
                  {field.label}
                </Label>
                <Input
                  id={`expense-${field.id}`}
                  type="number"
                  min="0"
                  value={form[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder="0"
                  className="h-9 font-mono text-sm"
                  data-ocid={field.ocid}
                />
              </div>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleSave}
            disabled={setExpenses.isPending}
            className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-950/30 hover:text-orange-300"
            data-ocid="expenses.save_button"
          >
            {setExpenses.isPending ? "Saving…" : "Save Expenses"}
          </Button>
        </>
      )}
    </div>
  );
}
