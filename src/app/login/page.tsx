import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { LoginForm } from "@/components/auth/LoginForm";
import { getSession } from "@/lib/auth";
import { isGoogleConfigured } from "@/lib/google-auth";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your Car Edits account to manage bookings, view invoices, and more.",
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <section className="bg-white pt-24 pb-16 md:pt-28">
      <Container className="max-w-md">
        <h1 className="font-display text-4xl text-ink">LOG IN</h1>
        <p className="mt-2 text-grey">Manage your bookings, invoices, and account details.</p>
        <div className="mt-8">
          <Suspense fallback={null}>
            <LoginForm googleConfigured={isGoogleConfigured()} />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
