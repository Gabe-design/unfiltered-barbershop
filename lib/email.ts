import { Resend } from "resend";
import { format } from "date-fns";
import { formatCurrency, formatDuration, formatTime } from "./utils";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Unfiltered Barbershop <bookings@unfilteredbarbershop.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@unfilteredbarbershop.com";

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  confirmationId: string;
  date: Date;
  startTime: string;
  barberName?: string;
  services: { name: string; price: number; duration: number }[];
  addOns: { name: string; price: number }[];
  totalPrice: number;
  totalDuration: number;
  isHouseCall?: boolean;
  houseCallAddress?: string;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  const dateStr = format(data.date, "EEEE, MMMM d, yyyy");
  const timeStr = formatTime(data.startTime);

  const itemsHtml = data.services
    .map((s) => `<tr><td style="padding:8px 0;">${s.name}</td><td style="text-align:right;padding:8px 0;">${formatCurrency(s.price)}</td></tr>`)
    .join("");

  const addOnsHtml = data.addOns
    .map((a) => `<tr><td style="padding:4px 0;color:#9CA3AF;">+ ${a.name}</td><td style="text-align:right;padding:4px 0;color:#9CA3AF;">${formatCurrency(a.price)}</td></tr>`)
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <div style="text-align:center;margin-bottom:40px;">
      <h1 style="font-size:28px;font-weight:900;color:#FFFFFF;letter-spacing:3px;margin:0;">UNFILTERED</h1>
      <p style="color:#3B82F6;letter-spacing:6px;font-size:11px;margin:4px 0 0;">BARBERSHOP</p>
    </div>

    <div style="background:linear-gradient(135deg,#1A1A2E,#16213E);border:1px solid #1E3A5F;border-radius:16px;padding:32px;margin-bottom:24px;">
      <h2 style="color:#FFFFFF;font-size:22px;margin:0 0 8px;">Booking Confirmed! ✓</h2>
      <p style="color:#9CA3AF;margin:0 0 24px;">Confirmation ID: <strong style="color:#3B82F6;">${data.confirmationId}</strong></p>

      <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.3);border-radius:12px;padding:20px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#9CA3AF;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:4px 0;">Date</td>
            <td style="color:#FFFFFF;font-weight:600;text-align:right;">${dateStr}</td>
          </tr>
          <tr>
            <td style="color:#9CA3AF;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:4px 0;">Time</td>
            <td style="color:#FFFFFF;font-weight:600;text-align:right;">${timeStr}</td>
          </tr>
          <tr>
            <td style="color:#9CA3AF;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:4px 0;">Barber</td>
            <td style="color:#FFFFFF;font-weight:600;text-align:right;">${data.barberName || "No Preference"}</td>
          </tr>
          <tr>
            <td style="color:#9CA3AF;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:4px 0;">Duration</td>
            <td style="color:#FFFFFF;font-weight:600;text-align:right;">${formatDuration(data.totalDuration)}</td>
          </tr>
          ${data.isHouseCall ? `<tr><td style="color:#9CA3AF;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:4px 0;">Location</td><td style="color:#FFFFFF;font-weight:600;text-align:right;">${data.houseCallAddress}</td></tr>` : ""}
        </table>
      </div>

      <table style="width:100%;border-collapse:collapse;border-top:1px solid #1F2937;padding-top:16px;">
        <tbody>
          ${itemsHtml}
          ${addOnsHtml}
          <tr style="border-top:1px solid #1F2937;">
            <td style="padding:12px 0;color:#FFFFFF;font-weight:700;font-size:16px;">Total</td>
            <td style="text-align:right;padding:12px 0;color:#3B82F6;font-weight:700;font-size:16px;">${formatCurrency(data.totalPrice)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="background:#111827;border-radius:12px;padding:24px;margin-bottom:24px;">
      <h3 style="color:#FFFFFF;margin:0 0 12px;font-size:14px;">Location</h3>
      <p style="color:#9CA3AF;margin:0;line-height:1.6;">
        1706 Erringer Rd Suite #4<br>
        Simi Valley, CA 93065
      </p>
    </div>

    <div style="text-align:center;">
      <p style="color:#6B7280;font-size:12px;margin:0;">Need to reschedule? Contact us at least 24 hours in advance.</p>
      <p style="color:#6B7280;font-size:12px;margin:8px 0 0;">© ${new Date().getFullYear()} Unfiltered Barbershop. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Booking Confirmed — ${dateStr} at ${timeStr} | Unfiltered Barbershop`,
    html,
  });
}

export async function sendAdminNotification(data: BookingEmailData) {
  const dateStr = format(data.date, "EEEE, MMMM d, yyyy");
  const timeStr = formatTime(data.startTime);

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:32px;">
    <h2 style="margin:0 0 24px;">🔔 New Booking — ${data.confirmationId}</h2>
    <p><strong>Customer:</strong> ${data.customerName}</p>
    <p><strong>Email:</strong> ${data.customerEmail}</p>
    <p><strong>Phone:</strong> ${data.customerPhone || "Not provided"}</p>
    <p><strong>Date:</strong> ${dateStr}</p>
    <p><strong>Time:</strong> ${timeStr}</p>
    <p><strong>Barber:</strong> ${data.barberName || "No preference"}</p>
    <p><strong>Services:</strong> ${data.services.map((s) => s.name).join(", ")}</p>
    ${data.addOns.length ? `<p><strong>Add-ons:</strong> ${data.addOns.map((a) => a.name).join(", ")}</p>` : ""}
    <p><strong>Total:</strong> ${formatCurrency(data.totalPrice)}</p>
    ${data.isHouseCall ? `<p><strong>House Call Address:</strong> ${data.houseCallAddress}</p>` : ""}
  </div>
</body>
</html>`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Booking: ${data.customerName} — ${dateStr} ${timeStr}`,
    html,
  });
}

export async function sendReviewRequest(data: {
  customerName: string;
  customerEmail: string;
  confirmationId: string;
  googleReviewUrl: string;
  reviewRequestId: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://unfilteredbarbershop.com";
  const trackingUrl = `${baseUrl}/api/review-request/${data.reviewRequestId}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:40px;">
      <h1 style="font-size:28px;font-weight:900;color:#FFFFFF;letter-spacing:3px;margin:0;">UNFILTERED</h1>
      <p style="color:#3B82F6;letter-spacing:6px;font-size:11px;margin:4px 0 0;">BARBERSHOP</p>
    </div>
    <div style="background:linear-gradient(135deg,#1A1A2E,#16213E);border:1px solid #1E3A5F;border-radius:16px;padding:32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;">⭐</div>
      <h2 style="color:#FFFFFF;font-size:22px;margin:0 0 12px;">How was your experience?</h2>
      <p style="color:#9CA3AF;margin:0 0 24px;line-height:1.6;">Hey ${data.customerName}, we hope you loved your visit. Your review means the world to us and helps other guys in Simi Valley find us.</p>
      <a href="${trackingUrl}" style="display:inline-block;background:#3B82F6;color:#FFFFFF;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:8px;letter-spacing:1px;">Leave a Google Review</a>
      <p style="color:#6B7280;font-size:11px;margin:20px 0 0;">Takes less than 60 seconds</p>
    </div>
    <p style="text-align:center;color:#6B7280;font-size:12px;margin-top:24px;">© ${new Date().getFullYear()} Unfiltered Barbershop · Simi Valley, CA</p>
  </div>
</body>
</html>`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: "How was your cut? Leave us a quick review ⭐",
    html,
  });
}

export async function sendRebookingReminder(data: {
  customerName: string;
  customerEmail: string;
  barberName?: string;
  bookingUrl: string;
  weeksAgo: number;
}) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:40px;">
      <h1 style="font-size:28px;font-weight:900;color:#FFFFFF;letter-spacing:3px;margin:0;">UNFILTERED</h1>
      <p style="color:#3B82F6;letter-spacing:6px;font-size:11px;margin:4px 0 0;">BARBERSHOP</p>
    </div>
    <div style="background:linear-gradient(135deg,#1A1A2E,#16213E);border:1px solid #1E3A5F;border-radius:16px;padding:32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;">✂️</div>
      <h2 style="color:#FFFFFF;font-size:22px;margin:0 0 12px;">Time for a fresh cut?</h2>
      <p style="color:#9CA3AF;margin:0 0 24px;line-height:1.6;">Hey ${data.customerName}, it's been about ${data.weeksAgo} week${data.weeksAgo !== 1 ? "s" : ""} since your last visit. ${data.barberName ? `${data.barberName} is ready to keep you looking sharp.` : "Your barber is ready to keep you looking sharp."}</p>
      <a href="${data.bookingUrl}" style="display:inline-block;background:#3B82F6;color:#FFFFFF;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:8px;letter-spacing:1px;">Book Now</a>
    </div>
    <p style="text-align:center;color:#6B7280;font-size:12px;margin-top:24px;">© ${new Date().getFullYear()} Unfiltered Barbershop · 1706 Erringer Rd Suite #4, Simi Valley, CA 93065</p>
  </div>
</body>
</html>`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: "Time for your next fresh cut ✂️",
    html,
  });
}

export async function sendAbandonedBookingFollowUp(data: {
  name: string;
  email: string;
  serviceSlug?: string;
  bookingUrl: string;
}) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:40px;">
      <h1 style="font-size:28px;font-weight:900;color:#FFFFFF;letter-spacing:3px;margin:0;">UNFILTERED</h1>
      <p style="color:#3B82F6;letter-spacing:6px;font-size:11px;margin:4px 0 0;">BARBERSHOP</p>
    </div>
    <div style="background:linear-gradient(135deg,#1A1A2E,#16213E);border:1px solid #1E3A5F;border-radius:16px;padding:32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;">💈</div>
      <h2 style="color:#FFFFFF;font-size:22px;margin:0 0 12px;">Still want to lock in your spot?</h2>
      <p style="color:#9CA3AF;margin:0 0 24px;line-height:1.6;">Hey ${data.name}, you started booking with us but didn't finish. Slots fill up fast — lock yours in before it's gone.</p>
      <a href="${data.bookingUrl}" style="display:inline-block;background:#3B82F6;color:#FFFFFF;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:8px;letter-spacing:1px;">Complete My Booking</a>
    </div>
    <p style="text-align:center;color:#6B7280;font-size:12px;margin-top:24px;">© ${new Date().getFullYear()} Unfiltered Barbershop · Simi Valley, CA</p>
  </div>
</body>
</html>`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: data.email,
    subject: "Still want to lock in your spot? 💈",
    html,
  });
}

export async function sendReferralInvite(data: {
  referrerName: string;
  refereeEmail: string;
  referralCode: string;
  bookingUrl: string;
  rewardDescription: string;
}) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:40px;">
      <h1 style="font-size:28px;font-weight:900;color:#FFFFFF;letter-spacing:3px;margin:0;">UNFILTERED</h1>
      <p style="color:#3B82F6;letter-spacing:6px;font-size:11px;margin:4px 0 0;">BARBERSHOP</p>
    </div>
    <div style="background:linear-gradient(135deg,#1A1A2E,#16213E);border:1px solid #1E3A5F;border-radius:16px;padding:32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;">🎁</div>
      <h2 style="color:#FFFFFF;font-size:22px;margin:0 0 12px;">${data.referrerName} invited you to Unfiltered</h2>
      <p style="color:#9CA3AF;margin:0 0 24px;line-height:1.6;">Your first visit comes with a special reward: <strong style="color:#FFFFFF;">${data.rewardDescription}</strong>.</p>
      <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.3);border-radius:8px;padding:16px;margin-bottom:24px;">
        <p style="color:#9CA3AF;font-size:12px;margin:0 0 4px;">Your referral code</p>
        <p style="color:#3B82F6;font-size:24px;font-weight:900;letter-spacing:4px;margin:0;">${data.referralCode}</p>
      </div>
      <a href="${data.bookingUrl}?ref=${data.referralCode}" style="display:inline-block;background:#3B82F6;color:#FFFFFF;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:8px;letter-spacing:1px;">Book Now</a>
    </div>
    <p style="text-align:center;color:#6B7280;font-size:12px;margin-top:24px;">© ${new Date().getFullYear()} Unfiltered Barbershop · Simi Valley, CA</p>
  </div>
</body>
</html>`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: data.refereeEmail,
    subject: `${data.referrerName} invited you to Unfiltered Barbershop 🎁`,
    html,
  });
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}) {
  const html = `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:32px;">
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
    ${data.service ? `<p><strong>Service Interest:</strong> ${data.service}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p style="background:#f9f9f9;padding:16px;border-radius:4px;">${data.message}</p>
  </div>
</body>
</html>`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `Contact Form: ${data.name} — ${data.service || "General Inquiry"}`,
    html,
  });
}
