import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/legal-page";
import { SHOP_ADDRESS } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply when you book an appointment with Unfiltered Barbershop online, including our cancellation and house call policies.",
};

const LAST_UPDATED = "September 15, 2026";

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of"
      titleAccent="Service"
      intro="The ground rules for booking with us online. Short, plain, and the same for everyone."
      lastUpdated={LAST_UPDATED}
    >
      <section>
        <h2>Agreement</h2>
        <p>
          By using this website or booking an appointment through it, you agree to these terms and to
          our <Link href="/privacy">Privacy Policy</Link>. If you do not agree, please book by phone
          instead at <a href={`tel:${SHOP_ADDRESS.phoneHref}`}>{SHOP_ADDRESS.phone}</a>.
        </p>
      </section>

      <section>
        <h2>Bookings</h2>
        <ul>
          <li>
            Booking online reserves your appointment and sends you a confirmation email with a
            confirmation ID. Keep it — you will need it if you contact us about the appointment.
          </li>
          <li>
            Please give us accurate contact details. We use them to confirm, remind, and reach you if
            anything changes.
          </li>
          <li>
            We may contact you to confirm details, and in rare cases (a barber out sick, an emergency)
            we may need to reschedule. We will let you know as early as we can.
          </li>
          <li>
            If you book with no barber preference, we will assign an available barber for your time.
          </li>
        </ul>
      </section>

      <section>
        <h2>Pricing and payment</h2>
        <ul>
          <li>
            Prices and durations are shown for each service and add-on when you book. The price shown
            when you book is the price for that appointment, unless you add services at the shop.
          </li>
          <li>
            Haircut services before 9 AM or after 7 PM carry a $20 early/late surcharge, as noted on
            those services.
          </li>
          <li>Payment is made at the shop after your service. We accept the payment methods listed on our <Link href="/faq">FAQ</Link>.</li>
          <li>Prices may change over time; changes never apply to appointments already booked.</li>
        </ul>
      </section>

      <section>
        <h2>Cancellations, rescheduling, and no-shows</h2>
        <ul>
          <li>
            Please cancel or reschedule at least 24 hours before your appointment so we can offer the
            time to another client.
          </li>
          <li>
            Late cancellations (inside 24 hours) and no-shows may be charged a fee of up to 50% of the
            service price.
          </li>
          <li>
            Running late? Call us. We will do our best to fit you in, but we may need to shorten the
            service or reschedule so the next client is not kept waiting.
          </li>
          <li>Repeated no-shows may result in loss of online booking privileges.</li>
          <li>Emergencies happen — reach out and we will work with you.</li>
        </ul>
      </section>

      <section>
        <h2>House calls</h2>
        <ul>
          <li>
            House calls are offered as a 3-hour session at the price listed when you book, within a
            40-mile radius of Simi Valley, CA. Locations farther out may incur additional mileage
            charges, which we will confirm with you before the appointment.
          </li>
          <li>
            Please provide an accurate address and a clean, well-lit space with a chair and access to
            power and water where practical.
          </li>
          <li>The cancellation policy above applies to house calls as well.</li>
        </ul>
      </section>

      <section>
        <h2>At the shop</h2>
        <p>
          We keep the shop welcoming for everyone. We may refuse or end service to anyone who is
          abusive, threatening, or under the influence, and to anyone whose behavior puts our staff or
          other clients at risk.
        </p>
      </section>

      <section>
        <h2>Photos and reviews</h2>
        <p>
          We love showing off our work, but we will only post a photo of you with your permission. If
          you leave a review through a link we send you, that review is governed by the platform you
          post it on (for example, Google).
        </p>
      </section>

      <section>
        <h2>Website content</h2>
        <p>
          The Unfiltered Barbershop name, logo, photos, and site content belong to us or our licensors.
          You may not copy or reuse them without our written permission. We try to keep the site
          accurate, but availability shown online can change, and we are not responsible for typos or
          errors on the site.
        </p>
      </section>

      <section>
        <h2>Limitation of liability</h2>
        <p>
          We provide our services with care and skill. To the fullest extent permitted by law, our
          liability for any claim relating to the website or a booking is limited to the amount you
          paid for the service in question, and we are not liable for indirect or consequential
          losses. Nothing in these terms limits rights you have under California law that cannot be
          limited.
        </p>
      </section>

      <section>
        <h2>Governing law</h2>
        <p>These terms are governed by the laws of the State of California.</p>
      </section>

      <section>
        <h2>Changes to these terms</h2>
        <p>
          We may update these terms from time to time. The version posted here, with the date at the
          top, is the one that applies.
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
