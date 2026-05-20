import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type KPIVariant = "default" | "emerald" | "orange" | "red" | "blue";

interface KPICardProps {
  label: string;
  value: string;
  subtext?: string;
  icon?: ReactNode;
  variant?: KPIVariant;
  loading?: boolean;
  onClick?: () => void;
  "data-ocid"?: string;
}

const variantStyles: Record<KPIVariant, string> = {
  default: "border-border",
  emerald: "border-emerald-500/30 bg-emerald-950/20",
  orange: "border-orange-500/30 bg-orange-950/20",
  red: "border-red-500/30 bg-red-950/20",
  blue: "border-blue-500/30 bg-blue-950/20",
};

const valueStyles: Record<KPIVariant, string> = {
  default: "text-foreground",
  emerald: "text-emerald-400",
  orange: "text-orange-400",
  red: "text-red-400",
  blue: "text-blue-400",
};

const iconStyles: Record<KPIVariant, string> = {
  default: "text-muted-foreground",
  emerald: "text-emerald-500",
  orange: "text-orange-500",
  red: "text-red-500",
  blue: "text-blue-500",
};

export function KPICard({
  label,
  value,
  subtext,
  icon,
  variant = "default",
  loading = false,
  onClick,
  "data-ocid": dataOcid,
}: KPICardProps) {
  const isClickable = typeof onClick === "function";

  if (isClickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "kpi-card transition-smooth w-full text-left",
          "hover:border-primary/40 hover:bg-card/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background cursor-pointer",
          variantStyles[variant],
        )}
        data-ocid={dataOcid}
      >
        <KPICardContent
          label={label}
          value={value}
          subtext={subtext}
          icon={icon}
          variant={variant}
          loading={loading}
          iconStyles={iconStyles}
          valueStyles={valueStyles}
        />
      </button>
    );
  }

  return (
    <div
      className={cn("kpi-card transition-smooth", variantStyles[variant])}
      data-ocid={dataOcid}
    >
      <KPICardContent
        label={label}
        value={value}
        subtext={subtext}
        icon={icon}
        variant={variant}
        loading={loading}
        iconStyles={iconStyles}
        valueStyles={valueStyles}
      />
    </div>
  );
}

function KPICardContent({
  label,
  value,
  subtext,
  icon,
  variant,
  loading,
  iconStyles,
  valueStyles,
}: {
  label: string;
  value: string;
  subtext?: string;
  icon?: ReactNode;
  variant: KPIVariant;
  loading: boolean;
  iconStyles: Record<KPIVariant, string>;
  valueStyles: Record<KPIVariant, string>;
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="text-metric-label truncate">{label}</p>
        {icon && (
          <span className={cn("shrink-0", iconStyles[variant])}>{icon}</span>
        )}
      </div>
      {loading ? (
        <div className="mt-2 h-8 w-24 animate-pulse rounded bg-muted" />
      ) : (
        <p
          className={cn(
            "mt-2 font-display text-2xl font-bold leading-none",
            valueStyles[variant],
          )}
        >
          {value}
        </p>
      )}
      {subtext && (
        <p className="mt-1 text-xs text-muted-foreground truncate">{subtext}</p>
      )}
    </>
  );
}
