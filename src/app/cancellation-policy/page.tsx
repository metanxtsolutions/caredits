import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Cancellation Policy" };

export default function CancellationPolicyPage() {
  return (
    <LegalPage title="CANCELLATION POLICY" updated="7 July 2026">
      <p>
        We understand plans change. This policy explains how to cancel or reschedule a booking
        with {siteConfig.legalName}.
      </p>

      <h2>Rescheduling</h2>
      <p>
        Bookings can be rescheduled free of charge up to 24 hours before the scheduled shoot time,
        subject to time slot availability. Reschedule requests can be made from your dashboard or
        via WhatsApp.
      </p>

      <h2>Cancelling a Booking</h2>
      <ul>
        <li>Cancellations made 48+ hours before the shoot: full refund per our Refund Policy.</li>
        <li>Cancellations made 24-48 hours before the shoot: 50% refund of amount paid.</li>
        <li>Cancellations made within 24 hours: non-refundable, as crew has already been scheduled.</li>
      </ul>

      <h2>Cancellations By Us</h2>
      <p>
        On rare occasions we may need to cancel a shoot due to crew or equipment unavailability. In
        this case, we will offer a free reschedule at the earliest available slot or a full
        refund, at your choice.
      </p>

      <h2>No-Shows</h2>
      <p>
        If our crew arrives at the scheduled time and location and the vehicle or client is not
        available, the booking is treated as a same-day cancellation and is non-refundable.
      </p>

      <h2>How to Cancel</h2>
      <p>
        Cancel anytime from your booking dashboard, or contact us at {siteConfig.email} or{" "}
        {siteConfig.phone} with your Booking ID.
      </p>
    </LegalPage>
  );
}
