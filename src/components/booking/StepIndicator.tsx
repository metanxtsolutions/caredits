import { ChevronLeft } from "lucide-react";
import { STEP_LABELS, TOTAL_STEPS } from "@/store/booking-store";
import { cn } from "@/lib/utils";

export function StepIndicator({ step, onBack }: { step: number; onBack: () => void }) {
  const label = STEP_LABELS[step - 1];

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Go back"
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-ink transition-opacity",
            step === 1 ? "pointer-events-none opacity-0" : "opacity-100 hover:border-ink",
          )}
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p aria-live="polite" className="font-label truncate text-xs font-semibold uppercase tracked-tight text-grey">
            Step {step} of {TOTAL_STEPS} · {label}
          </p>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-grey-light">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
