# AriseStudio — Official Corporate Website

A enterprise-grade web application for **AriseStudio**, built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**.

AriseStudio is a business automation and IT engineering startup providing:
- **E-Commerce Automation Systems** (multi-channel sync, inventory routing, automated fulfillment)
- **Custom ERP & CRM Engineering** (bespoke resource planning, role-based workflows, financial ledgers)
- **Business Process Automation & RPA** (document OCR, approval pipelines, data bots)
- **24/7 Managed IT Support & Infrastructure** (cloud operations, SRE, SLA guarantees)

---

## 🚀 Architectural & Design Highlights

Inspired by the polished, trustworthy presentation of leading technology powerhouses like **Brain Station 23**, **Enosis Solutions**, and **Therap BD**:
- **Enterprise Dark/Modern Palette:** Styled with obsidian glassmorphic cards, indigo/cyan accent gradients, and typography designed for corporate clients.
- **Interactive Live Architecture Flow:** Visualizes how customer orders flow into the automation engine, sync to ERPs, and are monitored 24/7.
- **Dedicated Route Hierarchy:**
  - `/` — Homepage with value propositions, dynamic architecture flows, and metrics.
  - `/services` — Detailed breakdown of E-Commerce, ERP, CRM, RPA, and 24/7 Support with engagement models.
  - `/solutions` — Vertical-specific solutions (Retail & Omnichannel, Supply Chain & Logistics, Finance & Invoicing, Manufacturing).
  - `/case-studies` — Real-world problem/solution/impact case studies.
  - `/about` — Mission, engineering philosophy, and enterprise standards.
  - `/careers` — Engineering culture, open roles (Full-stack, DevOps/SRE, Python Automation).
  - `/contact` — Interactive consultation request form with SLA badges and budget selectors.
- **Fast & SEO Optimized:** Static prerendering with webpack, structured metadata, and responsive mobile-first navigation.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Icons:** Lucide React & inline SVG assets
- **Build Engine:** webpack

---

## 💻 Getting Started

To run the project locally:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To build for production:

```bash
npm run build
npm start
```


## Submission storage and provider setup

Contact inquiries and reservations are saved before success is returned. Production requires
`TURSO_DATABASE_URL` and, for authenticated Turso databases, `TURSO_AUTH_TOKEN`.
A configured database outage returns HTTP 503; requests do not fall back to temporary storage.
For a self-hosted server, an explicit `file:/absolute/persistent/path/arisestudio.db` URL can be
used on a persistent volume. Never point this at ephemeral serverless storage.

Without a database URL, local development uses `data/arisestudio.db`. Keep this file private
and backed up. Database and WAL files are ignored by Git. Existing `data/bookings.jsonl`
and legacy `/tmp/bookings.jsonl` reservations are still checked and listed; they are not
rewritten or deleted. Existing `data/leads.jsonl` remains untouched. New inquiries are in
`contact_leads.submission` as JSON; reservations remain in `bookings`.

The application creates missing tables on first database use and retains the existing
booking schema and unique slot constraint. No live database is accessed by the test suite.

Optional email settings: `SMTP_HOST`, `SMTP_PORT` (default 587), `SMTP_USER`, `SMTP_PASS`,
and `CONTACT_NOTIFICATION_EMAIL` (default contact@arisestudio.com).
Google Meet generation uses `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and
`GOOGLE_REFRESH_TOKEN`. If email or Calendar fails after reservation, the slot stays reserved
and the booking screen reports the missing confirmation/link.

Studio slots are defined in `Asia/Dhaka`; changing the display timezone converts the same
instant using IANA timezone rules, including daylight saving and date changes. Calendar
links, email times and provider events all use that reservation's UTC start time.

Submission throttles use atomic shared Turso counters (5 requests per IP per 10 minutes,
2 per email per hour, separately for contact and booking). Expired counters are pruned
and IP/email counter identities are hashed; multiple Vercel processes share the same limits. Forwarded IP headers must be overwritten by the trusted hosting proxy.

## Verification

```bash
npm test
npx tsc --noEmit --incremental false
npm run lint
npm run build
```

Tests use Node's built-in test runner, the installed TypeScript compiler and isolated
in-memory SQLite. They cover concurrent reservation conflicts, legacy reservations,
timezone conversion, invalid/past slots, storage errors, bounded input, throttling and
provider payloads without sending mail or creating real meetings.

## Calendar cancellation sync

The scheduler refreshes availability every 30 seconds while visible, on focus, and on reload.
Availability reads and new booking attempts reconcile the connected host's primary Calendar.
This uses Google incremental sync (`showDeleted=true`, persisted sync tokens), with a full
baseline on an expired token. Reads within 15 seconds share the last sync attempt per process.
No webhook, cron service or additional Google permission is required.

Each new booking stores a generated Google event ID before creating the event. A confirmed
`cancelled` event releases the slot in one database transaction: the original booking is
archived in `booking_calendar_events.snapshot`, `cancelledAt` is set, and only that active
booking is removed from `bookings`. Repeated cancellation updates cannot remove a new booking
in the same slot. Cancellation does not edit or delete the original JSONL files.

The two additive tables `booking_calendar_events` and `calendar_sync_state` are created on
first database use. Existing booking columns and the unique slot constraint are retained.
Archived snapshots are private booking history and should be backed up with the database.

For older bookings without event IDs, a complete Calendar snapshot is used. Backfill requires
exactly one non-recurring host-organized event with the same discovery-session title,
customer email, start instant and 30-minute duration. Ambiguous matches and old deleted events
whose identifying details have disappeared remain locked for manual review. A matching
cancelled legacy booking is archived, so its unchanged JSONL file does not relock the slot.

Missing events, attendee declines, permission/network errors, incomplete pages and a changed
OAuth connection never count as cancellation. Sync state is scoped to a hash of the OAuth
connection (no refresh token is stored in the database). Replacing that connection requires
review of previously linked bookings. Restoring or rescheduling a cancelled Google event
does not restore or move the website reservation; book a new slot through the website.

Automatic synchronization runs when the website scheduler is used. For background processing
when nobody has the scheduler open, add a scheduled worker or Calendar push subscription.
Reference: https://developers.google.com/workspace/calendar/api/v3/reference/events/list

## Booking host and cancellation email

Set the host once in the root `.env` for local use, and in Vercel's Production
Environment Variables for deployment:

```dotenv
BOOKING_HOST_NAME="Farhan Kabir Sifat"
BOOKING_HOST_TITLE="Principal Architect"
SITE_URL="https://arise-studio-website.vercel.app"
```

The server passes only the public host profile to the scheduler. The header,
automatic initials, confirmation screen, Calendar descriptions/links and both
confirmation and cancellation emails use this profile. These variables do not
need a `NEXT_PUBLIC_` prefix. Restart the local server after edits; redeploy after
changing Vercel environment variables. Already-sent emails and existing Calendar
event descriptions are historical records and are not rewritten.

Cancellation emails use the existing SMTP configuration and a separate branded
HTML/plain-text template with the cancelled time and a link to book again.
`SITE_URL` controls that link and the logo origin; on Vercel it can be omitted to
use `VERCEL_PROJECT_PRODUCTION_URL`. Use an HTTPS public origin in production.
Google's own Calendar cancellation notices are separate and retain Google's design.

A new `booking_cancellation_emails` table holds delivery state. Only newly
reconciled cancellations are queued, in the same transaction as their archive and
slot release. Older archived cancellations are not replayed. Next.js `after()`
sends up to five pending emails after scheduler API responses. Missing SMTP keeps
mail pending; a failed delivery is eligible again after one minute. A two-minute
claim prevents concurrent senders from sending the same queued item. A successful
SMTP send is recorded and not normally repeated. SMTP has no exactly-once delivery:
a process crash after acceptance but before recording success can cause a duplicate.

Email failure does not relock a cancelled slot. Delivery/retries run when the
scheduler API is used, like the existing cancellation sync; no always-on worker
or cron is added. No mail is sent merely by rendering the schedule page on the server.

## Booking delivery and private recovery

New reservations atomically store a provider event ID and a hashed recovery token in
`booking_delivery`. The browser creates a 256-bit token before submitting, sends it
in the Authorization header, and stores it in sessionStorage. The raw token is never
stored in the database or included in a recovery URL. Treat the token as private: it
grants access to that booking's details. The normal public availability API returns
only occupied slots, not recovery details.

`GET /api/schedule/booking` reads the receipt with `Authorization: Bearer <token>`.
`POST` on that endpoint schedules a retry of the same reservation, subject to shared
throttling. A token cannot be reused for a different booking. Refreshing the same
browser tab restores the saved receipt; choosing “Schedule Another Call” clears the
browser's recovery token. Visitors who disable browser storage should save their
confirmation details. Already-existing historical bookings are not backfilled or
recreated automatically.

Google insert and conference-retry calls use `sendUpdates=none`. New events are
organizer-only: the customer is not added as a Calendar attendee, so booking and
organizer cancellation notices go through custom SMTP rather than Google guest
invitations. Meet creation stays enabled. Customers can save their own copy using
“Add to Google Calendar” in the confirmation; that copy does not automatically
sync later cancellations. Google Meet admission follows the organizer account’s
settings. A private hashed booking marker validates recovery of events without
attendees; older invited events retain the original attendee identity checks.
Existing invitations are not recalled or rewritten by this change; Google may
still notify their guests when edited or deleted directly in Calendar.

Confirmation and cancellation emails share one responsive, table-based layout,
with inline styles, host details from env, matching status treatment, and direct
Join / Rebook actions. Images use the configured site origin rather than an
upstream GitHub URL. Neither path adds a second ICS invitation email.

Pending conferences are read at most twice
within the initial bounded request. Later attempts look up the stored event ID before
inserting; an insert conflict also reads that same event. A failed conference is
restarted on its existing event. Deleted events and mismatched event identities are
never recreated. Only exact `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and
`GOOGLE_REFRESH_TOKEN` names are accepted.

Meet URL, Calendar URL, provider state, attempts, and independent customer/host email
acknowledgments are persisted. Email is sent only once a Meet link is ready. A failed
recipient does not block the other recipient or resend an already acknowledged mail.
A ready room is reused when retrying mail. SMTP acceptance is not proof of inbox
delivery. As with cancellation mail, a crash after SMTP acceptance but before saving
its acknowledgment can cause a duplicate; SMTP provides no exactly-once guarantee.

At most five automatic meeting-setup attempts use increasing retry delays. Pending
email deliveries continue retrying with a delay capped at 15 minutes. The owner of a
recovery token can explicitly retry after correcting a meeting-setup problem. Recovery is scheduled
with Next.js `after()` on scheduler requests; it does not run continuously without site
traffic. A scheduled worker is needed for a delivery-time guarantee when nobody uses
the site. Existing reservations remain protected during provider or mail failures.

Contact inquiries atomically enqueue a `contact_notification_delivery` record. A failed
team notification remains queued and the UI clearly says that the request was saved
but notification is pending. Contact submissions and scheduler traffic retry pending
notifications. No customer message or old invitation is sent by schema initialization.

All SMTP paths share bounded connection/greeting/socket timeouts. Meet creation also
has an explicit request deadline. The new additive tables are `booking_delivery`,
`submission_limits`, and `contact_notification_delivery`; existing booking history and
cancellation mappings are retained. No new dependency, cron, or external queue service
is required.


### Add a cancellation note from Google Calendar

New booking events include a blank `Cancellation note:` section after the Host
details, with an instruction immediately above it. In Google Calendar, open
**Edit event**, write the note in that section, **save**, then **delete** the event.
Leaving it blank sends the cancellation email without a note. The instruction is
not included in customer confirmation/cancellation emails.

For existing events without that section, append it after the Host details, then
**save** before deleting:

```text
Cancellation note:
An urgent commitment has come up. Please choose another available time.
```

The cancellation sync saves that section in the archived snapshot and the custom
SMTP email shows it as “A note from your host” in HTML and plain text. Line breaks
are preserved and HTML is escaped. Without a note, no empty note panel is shown.
The original customer's booking notes and attendee response comments are never
used as a cancellation reason. Do not put additional session details after the
cancellation note section; the rest of the description belongs to that note.

Google Calendar’s delete-dialog message is not available as a cancellation-note
field in the Events API; the latest inspected cancelled event did not return it.
That dialog message cannot be copied automatically by this integration. An event
response containing only its ID still cancels/releases its linked booking, but
cannot supply a note. Already-sent cancellation emails are not replayed.

New events have no invited customer guest, so Google's guest-cancellation message
popup is not shown. This description section is the Calendar-only way to supply a
note to the custom SMTP email; it does not restore or modify Google's Delete popup.
Existing Calendar events are not rewritten by deploying this change.
