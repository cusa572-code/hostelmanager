import { Button } from "@/components/ui/button";
import { BedDouble, KeyRound, Shield, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface LoginPageProps {
  onLogin: () => void;
  isLoggingIn: boolean;
}

const features = [
  {
    icon: <TrendingUp className="h-4 w-4" />,
    label: "Monthly profit tracking",
  },
  {
    icon: <BedDouble className="h-4 w-4" />,
    label: "Seat occupancy analytics",
  },
  { icon: <Shield className="h-4 w-4" />, label: "Staff-only secure access" },
];

export function LoginPage({ onLogin, isLoggingIn }: LoginPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      {/* Subtle grid background */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03] [background-image:linear-gradient(hsl(var(--foreground)_/_0.5)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground)_/_0.5)_1px,transparent_1px)] [background-size:40px_40px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-sm"
      >
        {/* Glow accent */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/20 to-transparent opacity-60 blur-xl" />

        <div className="relative rounded-2xl border border-border bg-card p-8 shadow-lg">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg"
            >
              <BedDouble className="h-7 w-7 text-primary-foreground" />
            </motion.div>
            <div className="text-center">
              <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
                HostelAdmin
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Management Portal
              </p>
            </div>
          </div>

          {/* Features list */}
          <ul className="mb-8 space-y-2">
            {features.map((feat, i) => (
              <motion.li
                key={feat.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.35 }}
                className="flex items-center gap-3 rounded-md px-3 py-2 bg-muted/40"
              >
                <span className="text-primary">{feat.icon}</span>
                <span className="text-sm text-foreground">{feat.label}</span>
              </motion.li>
            ))}
          </ul>

          {/* Login button */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.35 }}
          >
            <Button
              className="w-full gap-2 font-semibold"
              size="lg"
              onClick={onLogin}
              disabled={isLoggingIn}
              data-ocid="login.submit_button"
            >
              <KeyRound className="h-4 w-4" />
              {isLoggingIn ? "Connecting…" : "Sign in with Internet Identity"}
            </Button>
          </motion.div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Staff and administrators only.
            <br />
            Secure identity powered by Internet Computer.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
