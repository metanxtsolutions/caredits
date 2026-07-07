import { sendEmail } from "@/lib/notifications/email";
import { sendSms } from "@/lib/notifications/sms";
import { sendWhatsApp } from "@/lib/notifications/whatsapp";
import { formatDate, formatINR } from "@/lib/utils";

type BookingNotificationInput = {
  fullName: string;
  phone: string;
  email: string;
  bookingRef: string;
  serviceName: string;
  startTime: Date | null;
};

async function notifyAllChannels(to: { phone: string; email: string }, subject: string, message: string) {
  await Promise.all([
    sendEmail({ to: to.email, subject, html: `<p>${message}</p>` }),
    sendSms({ to: to.phone, body: message }),
    sendWhatsApp({ to: to.phone, body: message }),
  ]);
}

export async function notifyBookingConfirmed(booking: BookingNotificationInput) {
  const when = booking.startTime ? formatDate(booking.startTime) : "a date we'll confirm shortly";
  await notifyAllChannels(
    booking,
    `Booking Confirmed — ${booking.bookingRef}`,
    `Hi ${booking.fullName}, your ${booking.serviceName} is booked for ${when}. Reference: ${booking.bookingRef}.`,
  );
}

export async function notifyPaymentReceived(booking: BookingNotificationInput & { amount: number }) {
  await notifyAllChannels(
    booking,
    `Payment Received — ${booking.bookingRef}`,
    `Hi ${booking.fullName}, we've received your payment of ${formatINR(booking.amount)} for ${booking.serviceName}. Reference: ${booking.bookingRef}.`,
  );
}

export async function notifyBookingRescheduled(booking: BookingNotificationInput) {
  const when = booking.startTime ? formatDate(booking.startTime) : "a date we'll confirm shortly";
  await notifyAllChannels(
    booking,
    `Booking Rescheduled — ${booking.bookingRef}`,
    `Hi ${booking.fullName}, your ${booking.serviceName} has been rescheduled to ${when}. Reference: ${booking.bookingRef}.`,
  );
}

export async function notifyBookingCancelled(booking: BookingNotificationInput) {
  await notifyAllChannels(
    booking,
    `Booking Cancelled — ${booking.bookingRef}`,
    `Hi ${booking.fullName}, your ${booking.serviceName} booking (${booking.bookingRef}) has been cancelled.`,
  );
}
