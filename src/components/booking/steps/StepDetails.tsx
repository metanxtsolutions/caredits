"use client";

import { useState } from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { useBookingStore } from "@/store/booking-store";
import { Button } from "@/components/ui/Button";
import { DEMO_OTP } from "@/lib/otp";

export function StepDetails() {
  const s = useBookingStore();
  const { set } = s;
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);

  function handleVerify() {
    if (otpInput === DEMO_OTP) {
      set("phoneVerified", true);
      setOtpError(null);
    } else {
      setOtpError("Incorrect code. Try the demo OTP shown above.");
    }
  }

  return (
    <div>
      <h2 className="font-display text-4xl text-ink">YOUR DETAILS</h2>
      <p className="mt-2 text-grey">Tell us who to expect and which vehicle we&apos;re shooting.</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full Name">
          <input
            value={s.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            placeholder="Your full name"
            className="input"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={s.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@email.com"
            className="input"
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Phone Number">
          <div className="flex gap-2">
            <input
              type="tel"
              value={s.phone}
              onChange={(e) => {
                set("phone", e.target.value);
                set("phoneVerified", false);
                setOtpSent(false);
              }}
              placeholder="+91 90000 00000"
              className="input flex-1"
              disabled={s.phoneVerified}
            />
            {!s.phoneVerified && (
              <Button
                variant="dark"
                onClick={() => setOtpSent(true)}
                disabled={s.phone.length < 10}
                className="shrink-0"
              >
                Send OTP
              </Button>
            )}
            {s.phoneVerified && (
              <span className="flex shrink-0 items-center gap-1.5 bg-grey-light px-4 text-sm font-semibold text-ink">
                <CheckCircle2 className="size-4 text-accent" /> Verified
              </span>
            )}
          </div>
        </Field>

        {otpSent && !s.phoneVerified && (
          <div className="mt-3 bg-grey-light p-4">
            <p className="flex items-center gap-2 text-xs text-grey">
              <ShieldCheck className="size-4 shrink-0 text-accent" />
              Sandbox mode. No real SMS is sent. Demo OTP:{" "}
              <span className="font-bold text-ink">{DEMO_OTP}</span>
            </p>
            <div className="mt-3 flex gap-2">
              <input
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="input max-w-[200px]"
              />
              <Button variant="primary" onClick={handleVerify}>
                Verify
              </Button>
            </div>
            {otpError && <p className="mt-2 text-xs text-accent">{otpError}</p>}
          </div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Vehicle Brand">
          <input
            value={s.vehicleBrand}
            onChange={(e) => set("vehicleBrand", e.target.value)}
            placeholder="e.g. Tata, Royal Enfield"
            className="input"
          />
        </Field>
        <Field label="Vehicle Model">
          <input
            value={s.vehicleModel}
            onChange={(e) => set("vehicleModel", e.target.value)}
            placeholder="e.g. Nexon, Classic 350"
            className="input"
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Special Instructions (optional)">
          <textarea
            value={s.notes}
            onChange={(e) => set("notes", e.target.value)}
            rows={3}
            placeholder="Anything else we should know before the shoot?"
            className="input resize-none"
          />
        </Field>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border: 1px solid var(--color-border);
          background: white;
          padding: 0.85rem 1rem;
          font-size: 0.9rem;
          outline: none;
        }
        :global(.input:focus) {
          border-color: var(--color-ink);
        }
        :global(.input:disabled) {
          background: var(--color-grey-light);
          color: var(--color-grey);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-label mb-2 block text-xs font-semibold uppercase tracked-tight text-ink">
        {label}
      </span>
      {children}
    </label>
  );
}
