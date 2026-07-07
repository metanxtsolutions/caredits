import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <LegalPage title="TERMS & CONDITIONS" updated="7 July 2026">
      <p>
        These Terms &amp; Conditions govern your use of {siteConfig.url} and any booking made with{" "}
        {siteConfig.legalName}. By booking a shoot or using our website, you agree to these terms.
      </p>

      <h2>Services</h2>
      <p>
        We provide automotive photography and cinematic video production services, including but
        not limited to car and bike delivery shoots, dealership content, drone cinematography, and
        vehicle launch coverage, as described on our Services and Pricing pages.
      </p>

      <h2>Bookings</h2>
      <ul>
        <li>Bookings are confirmed only once the required advance or full payment has been received.</li>
        <li>Availability of time slots is subject to change and confirmed at the time of booking.</li>
        <li>Accurate vehicle, location and contact details must be provided at booking to avoid delays.</li>
      </ul>

      <h2>Pricing</h2>
      <p>
        Package prices are listed on our Pricing page starting from ₹{siteConfig.startingPrice}.
        Prices exclude applicable taxes and travel fees for outstation shoots unless stated
        otherwise. Add-ons are charged as selected at booking.
      </p>

      <h2>Client Responsibilities</h2>
      <ul>
        <li>Ensure the vehicle and shoot location are accessible at the scheduled time.</li>
        <li>Obtain any permissions required for shoots at private or restricted locations.</li>
        <li>Be present or nominate a representative during the shoot where required.</li>
      </ul>

      <h2>Intellectual Property</h2>
      <p>
        Unless otherwise agreed in writing, {siteConfig.legalName} retains copyright over raw and
        edited content produced during a shoot. Clients receive a license to use delivered content
        for personal or business marketing purposes. We may use delivered content for our own
        portfolio and marketing unless the client opts out in writing at the time of booking.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        While we take every precaution to deliver shoots as scheduled, {siteConfig.legalName} is
        not liable for delays or cancellations caused by circumstances beyond our reasonable
        control, including weather, vehicle unavailability, or force majeure events. Our liability
        for any claim is limited to the amount paid for the specific booking in question.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of our services after changes
        are posted constitutes acceptance of the updated terms.
      </p>

      <h2>Governing Law</h2>
      <p>
        These Terms are governed by the laws of India, with courts in Kolkata, West Bengal having
        exclusive jurisdiction.
      </p>

      <h2>Contact Us</h2>
      <p>
        Questions about these Terms can be sent to {siteConfig.email}.
      </p>
    </LegalPage>
  );
}
