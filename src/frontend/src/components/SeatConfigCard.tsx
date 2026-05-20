import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSetMonthlyBooking, useSetSeatConfig } from "@/hooks/useQueries";
import type { SeatSummary } from "@/types";
import { Settings2 } from "lucide-react";
import { useEffect, useState } from "react";

interface SeatConfigCardProps {
  summary: SeatSummary | null | undefined;
  pricePerSeatA: bigint | undefined;
  pricePerSeatB: bigint | undefined;
  totalCapacity: bigint | undefined;
  year: number;
  month: number;
  isLoading?: boolean;
}

export function SeatConfigCard({
  summary,
  pricePerSeatA,
  pricePerSeatB,
  totalCapacity,
  year,
  month,
  isLoading,
}: SeatConfigCardProps) {
  const [capacity, setCapacity] = useState(
    totalCapacity !== undefined ? String(totalCapacity) : "",
  );
  const [priceA, setPriceA] = useState(
    pricePerSeatA !== undefined && pricePerSeatA > 0n
      ? String(pricePerSeatA)
      : "",
  );
  const [priceB, setPriceB] = useState(
    pricePerSeatB !== undefined && pricePerSeatB > 0n
      ? String(pricePerSeatB)
      : "",
  );
  const [bookedA, setBookedA] = useState(
    summary?.bookedSeatsA !== undefined ? String(summary.bookedSeatsA) : "",
  );
  const [bookedB, setBookedB] = useState(
    summary?.bookedSeatsB !== undefined ? String(summary.bookedSeatsB) : "",
  );

  const setSeatConfig = useSetSeatConfig();
  const setMonthlyBooking = useSetMonthlyBooking();

  useEffect(() => {
    if (totalCapacity !== undefined) setCapacity(String(totalCapacity));
  }, [totalCapacity]);

  useEffect(() => {
    if (pricePerSeatA !== undefined)
      setPriceA(pricePerSeatA > 0n ? String(pricePerSeatA) : "");
  }, [pricePerSeatA]);

  useEffect(() => {
    if (pricePerSeatB !== undefined)
      setPriceB(pricePerSeatB > 0n ? String(pricePerSeatB) : "");
  }, [pricePerSeatB]);

  useEffect(() => {
    if (summary?.bookedSeatsA !== undefined)
      setBookedA(String(summary.bookedSeatsA));
  }, [summary?.bookedSeatsA]);

  useEffect(() => {
    if (summary?.bookedSeatsB !== undefined)
      setBookedB(String(summary.bookedSeatsB));
  }, [summary?.bookedSeatsB]);

  const handleSaveConfig = () => {
    const cap = BigInt(Math.round(Number(capacity) || 0));
    const pA = BigInt(Math.round(Number(priceA) || 0));
    const pB = BigInt(Math.round(Number(priceB) || 0));
    setSeatConfig.mutate({
      totalCapacity: cap,
      pricePerSeatA: pA,
      pricePerSeatB: pB,
    });
  };

  const handleSaveBooking = () => {
    setMonthlyBooking.mutate({
      year,
      month,
      bookedSeatsA: BigInt(Math.round(Number(bookedA) || 0)),
      bookedSeatsB: BigInt(Math.round(Number(bookedB) || 0)),
    });
  };

  return (
    <div className="kpi-card space-y-4" data-ocid="seat-config.card">
      <div className="flex items-center gap-2">
        <Settings2 className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-display text-sm font-semibold text-foreground">
          Seat Configuration
        </h3>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {["f1", "f2", "f3", "f4"].map((id) => (
            <div key={id} className="h-10 animate-pulse rounded bg-muted" />
          ))}
        </div>
      ) : (
        <>
          {/* Capacity */}
          <div className="space-y-1.5">
            <Label
              htmlFor="seat-capacity"
              className="text-xs font-medium text-muted-foreground"
            >
              Total Seat Capacity (building-wide)
            </Label>
            <Input
              id="seat-capacity"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g. 50"
              className="h-10 font-mono text-sm cursor-text"
              data-ocid="seat-config.capacity_input"
            />
          </div>

          {/* Dual pricing */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="seat-price-a"
                className="text-xs font-medium text-muted-foreground"
              >
                Student Type A Fee (₹)
              </Label>
              <Input
                id="seat-price-a"
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                value={priceA}
                onChange={(e) => setPriceA(e.target.value)}
                placeholder="Enter amount"
                className="h-10 font-mono text-sm cursor-text"
                data-ocid="seat-config.price_a_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="seat-price-b"
                className="text-xs font-medium text-muted-foreground"
              >
                Student Type B Fee (₹)
              </Label>
              <Input
                id="seat-price-b"
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                value={priceB}
                onChange={(e) => setPriceB(e.target.value)}
                placeholder="Enter amount"
                className="h-10 font-mono text-sm cursor-text"
                data-ocid="seat-config.price_b_input"
              />
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={handleSaveConfig}
            disabled={setSeatConfig.isPending}
            className="w-full cursor-pointer"
            data-ocid="seat-config.save_button"
          >
            {setSeatConfig.isPending ? "Saving…" : "Save Capacity & Fees"}
          </Button>

          {/* Monthly bookings */}
          <div className="border-t border-border pt-3 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Monthly Bookings
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="booked-a"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Type A Seats Booked
                </Label>
                <Input
                  id="booked-a"
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  value={bookedA}
                  onChange={(e) => setBookedA(e.target.value)}
                  placeholder="e.g. 20"
                  className="h-10 font-mono text-sm cursor-text"
                  data-ocid="seat-config.booked_a_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="booked-b"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Type B Seats Booked
                </Label>
                <Input
                  id="booked-b"
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  value={bookedB}
                  onChange={(e) => setBookedB(e.target.value)}
                  placeholder="e.g. 18"
                  className="h-10 font-mono text-sm cursor-text"
                  data-ocid="seat-config.booked_b_input"
                />
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleSaveBooking}
              disabled={setMonthlyBooking.isPending}
              className="w-full cursor-pointer"
              data-ocid="seat-config.booked_save_button"
            >
              {setMonthlyBooking.isPending ? "Updating…" : "Update Bookings"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
