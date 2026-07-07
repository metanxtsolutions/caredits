import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="PRIVACY POLICY" updated="7 July 2026">
      <p>
        {siteConfig.legalName} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates{" "}
        {siteConfig.url} and provides automotive photography and video production services. This
        Privacy Policy explains what information we collect, how we use it, and the choices you
        have.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li>Contact details: name, phone number, email address, city and state.</li>
        <li>Booking details: service selected, vehicle brand/model, shoot location and preferred date/time.</li>
        <li>Payment information processed by our third-party payment partners (Razorpay/Stripe). We do not store full card numbers on our servers.</li>
        <li>Usage data such as pages visited and device/browser information, collected via cookies and analytics tools.</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To process and manage your booking, including scheduling and photographer/videographer assignment.</li>
        <li>To send booking confirmations, reminders and delivery notifications via email, SMS and WhatsApp.</li>
        <li>To respond to enquiries submitted through our contact form.</li>
        <li>To improve our website and services, and for internal analytics.</li>
        <li>To comply with legal and tax obligations, including GST invoicing.</li>
      </ul>

      <h2>Sharing of Information</h2>
      <p>
        We do not sell your personal information. We may share information with photographers or
        videographers assigned to your booking, and with payment processors, SMS/WhatsApp
        notification providers, and analytics providers strictly to deliver our services. These
        third parties are contractually obligated to protect your information.
      </p>

      <h2>Data Retention</h2>
      <p>
        We retain booking and payment records for as long as required for service delivery, tax
        and accounting purposes, and legal compliance under Indian law.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal information by
        contacting us at {siteConfig.email}. We will respond within a reasonable timeframe.
      </p>

      <h2>Cookies</h2>
      <p>
        We use cookies to keep you signed in, remember preferences, and understand site usage. You
        can control cookies through your browser settings.
      </p>

      <h2>Contact Us</h2>
      <p>
        For any privacy-related questions, contact us at {siteConfig.email} or {siteConfig.phone}.
      </p>
    </LegalPage>
  );
}
