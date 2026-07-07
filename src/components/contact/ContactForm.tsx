"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactInput) {
    setServerError(null);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      setServerError("Something went wrong. Please try WhatsApp or email instead.");
      return;
    }

    setSubmitted(true);
    reset();
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 bg-grey-light p-12 text-center">
        <CheckCircle2 className="size-12 text-accent" />
        <h3 className="font-display text-3xl text-ink">MESSAGE SENT</h3>
        <p className="max-w-sm text-grey">
          Thanks for reaching out. Our team will get back to you within 24 hours.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full Name" error={errors.name?.message}>
          <input {...register("name")} className="input" placeholder="Your name" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input {...register("email")} type="email" className="input" placeholder="you@email.com" />
        </Field>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Phone (optional)" error={errors.phone?.message}>
          <input {...register("phone")} className="input" placeholder="+91 90000 00000" />
        </Field>
        <Field label="Subject (optional)" error={errors.subject?.message}>
          <input {...register("subject")} className="input" placeholder="Booking enquiry" />
        </Field>
      </div>
      <Field label="Message" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={5}
          className="input resize-none"
          placeholder="Tell us about your shoot: vehicle, location, and preferred dates."
        />
      </Field>

      {serverError && <p className="text-sm text-accent">{serverError}</p>}

      <Button type="submit" variant="primary" arrow disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid var(--color-border);
          background: white;
          padding: 0.85rem 1rem;
          font-size: 0.9rem;
          outline: none;
        }
        .input:focus {
          border-color: var(--color-ink);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-label mb-2 block text-xs font-semibold uppercase tracked-tight text-ink">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-accent">{error}</span>}
    </label>
  );
}
