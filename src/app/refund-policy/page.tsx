import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <LegalPage title="REFUND POLICY" updated="7 July 2026">
      <p>
        This Refund Policy explains when and how refunds are issued for bookings made with{" "}
        {siteConfig.legalName}.
      </p>

      <h2>Advance Payments</h2>
      <p>
        Bookings confirmed with a 50% advance payment are refundable in full if cancelled at least
        48 hours before the scheduled shoot time. Cancellations made within 48 hours of the shoot
        are non-refundable, as crew and equipment have already been allocated.
      </p>

      <h2>Full Payments</h2>
      <p>
        Bookings paid in full are refundable in full if cancelled at least 48 hours before the
        scheduled shoot. Cancellations within 48 hours are eligible for a 50% refund of the amount
        paid, with the remainder retained to cover crew allocation costs.
      </p>

      <h2>Service Issues</h2>
      <p>
        If a shoot does not take place due to a fault on our part (crew no-show, equipment
        failure, or missed scheduling), you are entitled to a full refund or a free rescheduled
        shoot, at your choice.
      </p>

      <h2>Weather &amp; Force Majeure</h2>
      <p>
        If a shoot cannot proceed due to weather or circumstances beyond either party&apos;s
        control, we will offer a free reschedule. A refund will be issued only if rescheduling is
        not possible within 30 days.
      </p>

      <h2>Refund Timeline</h2>
      <p>
        Approved refunds are processed to the original payment method within 5-7 business days,
        subject to your bank or payment provider&apos;s processing time.
      </p>

      <h2>How to Request a Refund</h2>
      <p>
        Refund requests can be made from your booking dashboard or by contacting us at{" "}
        {siteConfig.email} or {siteConfig.phone} with your Booking ID.
      </p>
    </LegalPage>
  );
}
