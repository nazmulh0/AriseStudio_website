import Link from "next/link";
import { pageMetadata } from "@/lib/site";
export const metadata = pageMetadata(
  "Privacy | AriseStudio",
  "How AriseStudio uses information submitted through contact forms and discovery bookings.",
  "/privacy",
);
export default function PrivacyPage() {
  return (
    <div className="px-5 pb-24 pt-36">
      <article className="mx-auto max-w-3xl rounded-3xl border border-line bg-surface p-7 sm:p-12">
        <p className="text-sm font-semibold text-accent">Your information</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink">
          Privacy notice
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted">
          This notice covers information you send through AriseStudio’s contact
          and discovery-call forms.
        </p>
        <h2 className="mt-9 text-xl font-semibold">What we receive</h2>
        <p className="mt-3 leading-relaxed text-muted">
          Depending on the form, we receive your name, email, phone number,
          company, project details and appointment preferences. Please avoid
          including passwords, payment details or other sensitive information in
          notes.
        </p>
        <h2 className="mt-9 text-xl font-semibold">How it is used</h2>
        <p className="mt-3 leading-relaxed text-muted">
          We store inquiries and reservations to respond to you, arrange calls
          and follow up on delivery problems. Booking details are used to create
          the host’s Google Calendar event and Google Meet link. Confirmation
          and cancellation messages are sent through our email provider.
        </p>
        <h2 className="mt-9 text-xl font-semibold">
          Storage and service providers
        </h2>
        <p className="mt-3 leading-relaxed text-muted">
          The website uses Vercel hosting, Turso database storage, Google
          Calendar and Meet, and an SMTP email service. These services process
          the information needed for the requested inquiry or appointment.
          Request limits use hashed IP or email identifiers to help prevent
          abuse.
        </p>
        <h2 className="mt-9 text-xl font-semibold">Browser preferences</h2>
        <p className="mt-3 leading-relaxed text-muted">
          Your selected colour theme is stored in this browser. A private
          booking recovery token is kept in session storage so the same tab can
          recover its reservation. Treat that token as private.
        </p>
        <h2 className="mt-9 text-xl font-semibold">Questions or corrections</h2>
        <p className="mt-3 leading-relaxed text-muted">
          Email{" "}
          <a
            href="mailto:contact@arisestudio.com"
            className="text-accent underline underline-offset-4"
          >
            contact@arisestudio.com
          </a>{" "}
          to ask about your information or request a correction or deletion.
          Cancellation history may remain in our booking records.
        </p>
        <Link
          href="/contact"
          className="mt-9 inline-flex min-h-11 items-center text-sm font-semibold text-accent"
        >
          Contact AriseStudio →
        </Link>
      </article>
    </div>
  );
}
