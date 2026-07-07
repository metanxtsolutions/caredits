"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DEMO_OTP } from "@/lib/otp";
import { cn } from "@/lib/utils";

export function LoginForm({ googleConfigured }: { googleConfigured: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const googleError = searchParams.get("google");

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequestOtp() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.formErrors?.[0] || "Something went wrong");
      setIsNewUser(data.isNewUser);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, name: isNewUser ? name : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Incorrect code");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div>
      {googleError === "unconfigured" && (
        <p className="mb-5 bg-grey-light p-4 text-sm text-grey">
          Google login isn&apos;t connected yet. Use your phone number below instead.
        </p>
      )}
      {googleError === "error" && (
        <p className="mb-5 bg-grey-light p-4 text-sm text-accent">
          Google sign-in didn&apos;t work. Please try again or use your phone number below.
        </p>
      )}

      {step === "phone" && (
        <div className="space-y-5">
          <label className="block">
            <span className="font-label mb-2 block text-xs font-semibold uppercase tracked-tight text-ink">
              Phone Number
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 90000 00000"
              className="input"
            />
          </label>
          {error && <p className="text-sm text-accent">{error}</p>}
          <Button
            variant="primary"
            arrow
            className="w-full"
            disabled={phone.length < 10 || loading}
            onClick={handleRequestOtp}
          >
            {loading ? "Sending..." : "Send OTP"}
          </Button>

          <div className="flex items-center gap-3 text-xs text-grey">
            <div className="h-px flex-1 bg-border" />
            OR
            <div className="h-px flex-1 bg-border" />
          </div>

          <a
            href={googleConfigured ? "/api/auth/google" : undefined}
            aria-disabled={!googleConfigured}
            title={googleConfigured ? undefined : "Coming soon"}
            className={cn(
              "flex w-full items-center justify-center gap-2 border-2 border-border py-3.5 text-sm font-semibold text-ink transition-colors",
              googleConfigured ? "hover:border-ink" : "cursor-not-allowed opacity-40",
            )}
            onClick={(e) => {
              if (!googleConfigured) e.preventDefault();
            }}
          >
            Continue with Google
          </a>
        </div>
      )}

      {step === "otp" && (
        <div className="space-y-5">
          <div className="bg-grey-light p-4">
            <p className="flex items-center gap-2 text-xs text-grey">
              <ShieldCheck className="size-4 shrink-0 text-accent" />
              Sandbox mode. No real SMS is sent. Demo OTP:{" "}
              <span className="font-bold text-ink">{DEMO_OTP}</span>
            </p>
          </div>

          {isNewUser && (
            <label className="block">
              <span className="font-label mb-2 block text-xs font-semibold uppercase tracked-tight text-ink">
                Full Name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="input"
              />
            </label>
          )}

          <label className="block">
            <span className="font-label mb-2 block text-xs font-semibold uppercase tracked-tight text-ink">
              Enter 6-digit code
            </span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              placeholder="123456"
              className="input"
            />
          </label>

          {error && <p className="text-sm text-accent">{error}</p>}

          <Button
            variant="primary"
            arrow
            className="w-full"
            disabled={code.length !== 6 || (isNewUser && name.length < 2) || loading}
            onClick={handleVerify}
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </Button>

          <button
            onClick={() => setStep("phone")}
            className="w-full text-center text-sm text-grey hover:text-ink"
          >
            Use a different number
          </button>
        </div>
      )}

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
      `}</style>
    </div>
  );
}
