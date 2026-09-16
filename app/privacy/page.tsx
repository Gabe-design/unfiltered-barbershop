import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
import { SHOP_ADDRESS } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Unfiltered Barbershop collects, uses, and protects the information you share when you book an appointment or contact us.",
};

const LAST_UPDATED = "September 15, 2026";

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy"
      titleAccent="Policy"
      intro="What we collect when you book or reach out, what we do with it, and the choices you have."
      lastUpdated={LAST_UPDATED}
    >
      <section>
        <h2>Who we are</h2>
        <p>
          Unfiltered Barbershop is a barbershop located at {SHOP_ADDRESS.street}, {SHOP_ADDRESS.city},{" "}
          {SHOP_ADDRESS.state} {SHOP_ADDRESS.zip}. This policy covers our website and online booking
          system. If you have any questions about it, email us at{" "}
          <a href={`mailto:${SHOP_ADDRESS.email}`}>{SHOP_ADDRESS.email}</a> or call{" "}
          <a href={`tel:${SHOP_ADDRESS.phoneHref}`}>{SHOP_ADDRESS.phone}</a>.
        </p>
      </section>

      <section>
        <h2>What we collect</h2>
        <ul>
          <li>
            <strong className="text-white/80">Booking details</strong> — your name, email address, phone
            number, the service, barber, date and time you choose, and any notes you add. For house
            calls, the address where we will meet you.
          </li>
          <li>
            <strong className="text-white/80">Messages</strong> — anything you send through the contact
            form, along with your name, email, and phone number if you include it.
          </li>
          <li>
            <strong className="text-white/80">Text message preference</strong> — whether you opted in
            to appointment reminders by SMS.
          </li>
          <li>
            <strong className="text-white/80">Booking activity</strong> — which step of the booking
            flow you reached, so we can improve it. If you start a booking and do not finish, we may
            keep the details you entered so we can follow up.
          </li>
          <li>
            <strong className="text-white/80">Technical data</strong> — standard information your
            browser sends, such as pages visited and device type. If we enable analytics tools (for
            example Google Analytics or the Meta Pixel), they collect usage data under their own
            privacy policies.
          </li>
          <li>
            <strong className="text-white/80">Staff accounts</strong> — our barbers and admins sign in
            with an email address and password to manage the schedule.
          </li>
        </ul>
      </section>

      <section>
        <h2>How we use it</h2>
        <ul>
          <li>To schedule, confirm, change, and cancel your appointments.</li>
          <li>To send confirmations and reminders by email and, if you opted in, by text message.</li>
          <li>To reply to your questions and requests.</li>
          <li>To ask for a review after your visit and to let you know when you are due for your next cut.</li>
          <li>To run promotions, referral rewards, and loyalty perks you take part in.</li>
          <li>To keep the site working, secure, and improving.</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </section>

      <section>
        <h2>Text messages</h2>
        <p>
          If you check the SMS reminder box when booking, you agree to receive appointment-related
          text messages from Unfiltered Barbershop at the number you provided. Message frequency
          depends on your bookings. Message and data rates may apply. Reply STOP at any time to opt
          out, or HELP for help. Consent to receive texts is not a condition of booking.
        </p>
      </section>

      <section>
        <h2>Who we share it with</h2>
        <p>
          We share information only with the service providers that run this site on our behalf, and
          only as needed to do their job: website hosting, our database provider, our email delivery
          service, our text messaging service, and analytics providers if enabled. We may also share
          information when the law requires it or to protect our rights, our clients, or our staff.
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          The site uses a session cookie to keep staff signed in to the admin area. Analytics tools,
          if enabled, may set their own cookies. You can block or delete cookies in your browser
          settings; the public site and booking flow work without them.
        </p>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <p>
          We keep booking and contact records for as long as we need them for our business records
          and to serve you as a returning client. You can ask us to delete your information at any
          time (see below), and we will do so unless we are required to keep it.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <ul>
          <li>
            Email <a href={`mailto:${SHOP_ADDRESS.email}`}>{SHOP_ADDRESS.email}</a> to see, correct, or
            delete the information we hold about you.
          </li>
          <li>Reply STOP to any text message to stop receiving texts.</li>
          <li>Reply to any email from us to opt out of review requests and rebooking reminders.</li>
        </ul>
      </section>

      <section>
        <h2>Security</h2>
        <p>
          We use reasonable safeguards to protect your information: staff access is password
          protected, connections to the site are encrypted, and passwords are stored hashed. No
          system is completely secure, so we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>Children</h2>
        <p>
          This site is not directed to children under 13, and we do not knowingly collect their
          information online. Parents and guardians can book appointments for minors under their own
          contact details.
        </p>
      </section>

      <section>
        <h2>Changes to this policy</h2>
        <p>
          If we change this policy, we will post the new version here and update the date at the top
          of the page.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Unfiltered Barbershop
          <br />
          {SHOP_ADDRESS.street}, {SHOP_ADDRESS.city}, {SHOP_ADDRESS.state} {SHOP_ADDRESS.zip}
          <br />
          <a href={`mailto:${SHOP_ADDRESS.email}`}>{SHOP_ADDRESS.email}</a> ·{" "}
          <a href={`tel:${SHOP_ADDRESS.phoneHref}`}>{SHOP_ADDRESS.phone}</a>
        </p>
      </section>
    </LegalPage>
  );
}
