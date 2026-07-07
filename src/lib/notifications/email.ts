/**
 * Email sending via SMTP (nodemailer). Inert in sandbox mode until SMTP_HOST/SMTP_USER/
 * SMTP_PASSWORD are set in .env — see src/lib/payments/razorpay.ts for the same pattern.
 */
import nodemailer from "nodemailer";

export function isEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });
  }
  return transporter;
}

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!isEmailConfigured()) {
    console.log(`[sandbox] would email ${to}: "${subject}"`);
    return;
  }
  await getTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
}
