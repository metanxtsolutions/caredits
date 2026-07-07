import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Book Your Shoot",
  description:
    "Book your car, bike or dealership shoot online in under two minutes. Select a service, pick a date and time, and pay securely.",
};

export default function BookPage() {
  return (
    <section className="bg-white pt-24 pb-16 md:pt-28">
      <Container className="max-w-4xl">
        <Suspense fallback={null}>
          <BookingWizard />
        </Suspense>
      </Container>
    </section>
  );
}
