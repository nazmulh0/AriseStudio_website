import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import nodemailer from 'nodemailer';
import * as crypto from 'node:crypto';
import { createClient } from '@libsql/client';

const root = fileURLToPath(new URL('..', import.meta.url));
const external = { 'node:timers/promises': { setTimeout: async () => {} }, 'node:crypto': crypto, path, 'fs/promises': fsPromises, nodemailer, '@libsql/client': { createClient } };
const NOW = Date.UTC(2030, 0, 6);
let clockNow = NOW;
class Clock extends Date {
  constructor(...args) { super(...(args.length ? args : [clockNow])); }
  static now() { return clockNow; }
}
// Load the real TypeScript modules with isolated env, clock and provider boundaries.
function app(stubs = {}, env = {}) {
  const modules = new Map();
  function load(name) {
    if (Object.hasOwn(stubs, name)) return stubs[name];
    const file = path.resolve(root, name.startsWith('@/') ? `src/${name.slice(2)}.ts` : name);
    if (modules.has(file)) return modules.get(file);
    const exports = {};
    modules.set(file, exports);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
    vm.runInNewContext(code, {
      exports, require: dependency => dependency.startsWith('@/') ? load(dependency) : dependency.startsWith('.') ? load(path.resolve(path.dirname(file), `${dependency}.ts`)) : Object.hasOwn(stubs, dependency) ? stubs[dependency] : external[dependency],
      process: { env, cwd: () => '/isolated-test' }, Date: Clock, URL, URLSearchParams, TextDecoder, AbortSignal,
      console: { log() {}, warn() {}, error() {} }, fetch: stubs.fetch,
    }, { filename: file });
    return exports;
  }
  return load;
}
const next = { after: () => {}, connection: async () => {}, NextResponse: { json: (body, options) => ({ body, status: options?.status || 200 }) } };
const missingFiles = { readFile: async () => { throw Object.assign(new Error('missing'), { code: 'ENOENT' }); } };
const base = { name: 'Alice', email: 'alice@example.test', phone: '+8801700000000', date: 'Monday, January 7, 2030', timeSlot: '10:00am', timezone: 'Asia/Dhaka' };
const lead = { name: 'Alice', email: 'alice@example.test', message: 'Please discuss this workflow.' };
const req = (body, ip = '127.0.0.1') => new Request('http://local.test/api', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip }, body: JSON.stringify(body) });
function setup(t, extra = {}, env = {}) {
  const client = createClient({ url: 'file::memory:' });
  t.after(() => { client.close(); clockNow = NOW; });
  let events = 0;
  const load = app({
    'next/server': next, 'fs/promises': missingFiles,
    '@libsql/client': { createClient: () => client },
    '@/lib/googleCalendar': { googleCalendarConnectionId: () => 'test-connection', readGoogleCalendarChanges: async () => null, createGoogleCalendarEvent: async () => { events++; return { success: true, meetUrl: 'https://meet.google.com/mock' }; } },
    ...extra,
  }, { TURSO_DATABASE_URL: 'file::memory:', ...env });
  return { client, load, events: () => events };
}

test('same slot is reserved once under concurrent requests; original customer is retained', async t => {
  const { load, client, events } = setup(t);
  const route = load('src/app/api/schedule/route.ts');
  const responses = await Promise.all([route.POST(req(base, '1')), route.POST(req({ ...base, name: 'Bob', email: 'bob@example.test' }, '2'))]);
  assert.deepEqual(responses.map(r => r.status).sort(), [200, 409]);
  assert.equal(events(), 1);
  const rows = await client.execute('SELECT name FROM bookings');
  assert.equal(rows.rows.length, 1);
  const successful = responses.findIndex(r => r.status === 200);
  assert.equal(rows.rows[0].name, successful === 0 ? 'Alice' : 'Bob');
});

test('already persisted booking rejects retries without creating another calendar event', async t => {
  const { load, client, events } = setup(t);
  const route = load('src/app/api/schedule/route.ts');
  assert.equal((await route.POST(req(base))).status, 200);
  assert.equal((await route.POST(req({ ...base, name: 'Changed' }))).status, 409);
  assert.equal((await client.execute('SELECT name FROM bookings')).rows[0].name, 'Alice');
  assert.equal(events(), 1);
});

test('legacy file reservations remain blocked and appear in availability', async t => {
  const { load, events } = setup(t, { 'fs/promises': { readFile: async () => JSON.stringify(base) + '\n' } });
  const route = load('src/app/api/schedule/route.ts');
  assert.equal((await route.POST(req(base))).status, 409);
  assert.equal(events(), 0);
  const available = await route.GET();
  assert.equal(available.status, 200);
  assert.ok(available.body.bookedSlots.includes(`${base.date}_${base.timeSlot}`));
});

for (const [label, changes] of Object.entries({
  invalidDate: { date: 'not-a-date' }, invalidTime: { timeSlot: '99:99pm' },
  closedFriday: { date: 'Friday, January 11, 2030' }, past: { date: 'Saturday, January 5, 2030' },
  outsideHours: { timeSlot: '6:00pm' }, wrongWeekday: { date: 'Tuesday, January 7, 2030' },
  invalidTimezone: { timezone: 'invented/timezone' }, numericPhone: { phone: 42 },
})) test(`booking rejects ${label} before storage and provider calls`, async t => {
  const { load, events, client } = setup(t);
  assert.equal((await load('src/app/api/schedule/route.ts').POST(req({ ...base, ...changes }))).status, 400);
  assert.equal(events(), 0);
  assert.equal((await client.execute('SELECT * FROM bookings')).rows.length, 0);
});

test('storage failure returns 503 and creates no external event', async t => {
  let events = 0;
  const { load } = setup(t, {
    '@/lib/turso': { reserveBooking: async () => { throw Error('disk full'); }, getDatabase: async () => { throw Error('offline'); } },
    '@/lib/googleCalendar': { googleCalendarConnectionId: () => 'test-connection', readGoogleCalendarChanges: async () => null, createGoogleCalendarEvent: async () => { events++; return {}; } },
  });
  const route = load('src/app/api/schedule/route.ts');
  assert.equal((await route.POST(req(base))).status, 503);
  assert.equal((await route.GET()).status, 503);
  assert.equal(events, 0);
  assert.equal((await load('src/app/api/contact/route.ts').POST(req(lead))).status, 503);
});

test('production without persistent storage fails instead of using temporary files', async () => {
  const load = app({}, { NODE_ENV: 'production' });
  await assert.rejects(load('src/lib/turso.ts').getDatabase(), /TURSO_DATABASE_URL/);
});

test('contact is saved before optional SMTP; provider failure does not discard the saved lead', async t => {
  const { load, client } = setup(t, { nodemailer: { createTransport: () => ({ sendMail: async () => { throw Error('SMTP offline'); } }) } }, { SMTP_HOST: 'mock', SMTP_USER: 'mock', SMTP_PASS: 'mock' });
  const response = await load('src/app/api/contact/route.ts').POST(req(lead));
  assert.equal(response.status, 200);
  assert.equal(response.body.emailSent, false);
  assert.equal(JSON.parse((await client.execute('SELECT submission FROM contact_leads')).rows[0].submission).message, lead.message);
});

for (const [label, changes] of Object.entries({ numericPhone: { phone: 42 }, objectCompany: { company: {} }, objectService: { service: {} }, oversizedMessage: { message: 'x'.repeat(5001) }, emptyName: { name: ' ' } })) {
  test(`contact rejects ${label}`, async t => {
    const { load } = setup(t);
    assert.equal((await load('src/app/api/contact/route.ts').POST(req({ ...lead, ...changes }))).status, 400);
  });
}

test('malformed JSON and oversized bodies return 400/413', async t => {
  const { load } = setup(t);
  const route = load('src/app/api/contact/route.ts');
  assert.equal((await route.POST(new Request('http://local.test', { method: 'POST', body: '{' }))).status, 400);
  assert.equal((await route.POST(req({ ...lead, message: 'x'.repeat(40000) }))).status, 413);
});

test('contact IP and email throttles reject excess requests', async t => {
  const { load } = setup(t);
  const route = load('src/app/api/contact/route.ts');
  assert.equal((await route.POST(req(lead, 'one'))).status, 200);
  assert.equal((await route.POST(req(lead, 'two'))).status, 200);
  assert.equal((await route.POST(req(lead, 'three'))).status, 429);
  for (let i = 0; i < 5; i++) assert.equal((await route.POST(req({ ...lead, email: `person${i}@example.test` }, 'shared'))).status, 200);
  assert.equal((await route.POST(req({ ...lead, email: 'last@example.test' }, 'shared'))).status, 429);
});

test('timezone display preserves the host slot instant; DST and previous-day labels are correct', () => {
  const booking = app()('src/lib/booking.ts');
  const start = booking.bookingStartIso(base.date, base.timeSlot);
  assert.equal(start, '2030-01-07T04:00:00.000Z');
  assert.match(booking.formatBookingDate(start, 'America/Los_Angeles'), /January 6, 2030/);
  assert.match(booking.formatBookingTime(start, 'America/New_York'), /11:00 PM EST/);
  assert.match(booking.formatBookingTime('2030-07-08T04:00:00Z', 'America/New_York'), /12:00 AM EDT/);
  const url = new URL(booking.googleCalendarUrl(start, 'Title', 'Details', ''));
  assert.equal(url.searchParams.get('dates'), '20300107T040000Z/20300107T043000Z');
  assert.equal(booking.hostToday(new Date('2030-01-06T20:00:00Z')).getDate(), 7);
});

test('Calendar API uses the canonical instant', async () => {
  const requests = [];
  const google = app({ fetch: async (url, options) => {
    if (url.includes('oauth2')) return { ok: true, json: async () => ({ access_token: 'mock' }) };
    requests.push(JSON.parse(options.body));
    return { ok: true, json: async () => ({ id: 'mock', hangoutLink: 'https://meet.google.com/mock' }) };
  } }, { GOOGLE_CLIENT_ID: 'mock', GOOGLE_CLIENT_SECRET: 'mock', GOOGLE_REFRESH_TOKEN: 'mock' })('src/lib/googleCalendar.ts');
  await google.createGoogleCalendarEvent({ title: 'Call', description: '', attendeeName: base.name, attendeeEmail: base.email, startIso: '2030-01-07T04:00:00.000Z' });
  assert.equal(requests[0].start.dateTime, '2030-01-07T04:00:00.000Z');
  assert.equal(requests[0].end.dateTime, '2030-01-07T04:30:00.000Z');
  assert.equal(requests[0].start.timeZone, 'UTC');
});

test('different display timezones cannot reserve the same host slot twice', async t => {
  const { load, events } = setup(t);
  const route = load('src/app/api/schedule/route.ts');
  const first = await route.POST(req({ ...base, timezone: 'America/New_York' }));
  assert.equal(first.status, 200);
  assert.equal(first.body.booking.startIso, '2030-01-07T04:00:00.000Z');
  assert.equal(first.body.emailSent, false);
  assert.equal((await route.POST(req({ ...base, timezone: 'Europe/London' }))).status, 409);
  assert.equal(events(), 1);
});

test('confirmation email and browser calendar link describe the same UTC slot', async t => {
  const sent = [];
  const { load } = setup(t, { nodemailer: { createTransport: () => ({ sendMail: async message => sent.push(message) }) } }, { SMTP_HOST: 'mock', SMTP_USER: 'mock@example.test', SMTP_PASS: 'mock' });
  const response = await load('src/app/api/schedule/route.ts').POST(req({ ...base, timezone: 'America/Los_Angeles' }));
  assert.equal(response.status, 200);
  assert.equal(response.body.emailSent, true);
  assert.equal(sent.length, 2);
  assert.match(sent[1].html, /Sunday, January 6, 2030/);
  assert.match(sent[1].html, /8:00 PM – 8:30 PM PST/);
  const link = sent[1].html.match(/href="(https:\/\/calendar\.google\.com[^\"]+)"/)[1];
  assert.equal(new URL(link.replace(/&amp;/g, '&')).searchParams.get('dates'), '20300107T040000Z/20300107T043000Z');
});

test('existing booking data survives additive schema initialization', async t => {
  const { load, client } = setup(t);
  await client.execute('CREATE TABLE bookings (id INTEGER PRIMARY KEY, date TEXT, timeSlot TEXT, name TEXT, email TEXT, company TEXT, timezone TEXT, service TEXT, notes TEXT, UNIQUE(date, timeSlot))');
  await client.execute({ sql: 'INSERT INTO bookings (date, timeSlot, name, email) VALUES (?, ?, ?, ?)', args: [base.date, base.timeSlot, 'Original', base.email] });
  await load('src/lib/turso.ts').getDatabase();
  assert.equal((await client.execute('SELECT name FROM bookings')).rows[0].name, 'Original');
  assert.ok((await client.execute('PRAGMA table_info(bookings)')).rows.some(row => row.name === 'phone'));
});

function calendarSetup(t, extra = {}, env = {}) {
  let feed = [], failure = false;
  const created = [], reads = [];
  const context = setup(t, {
    '@/lib/googleCalendar': {
      googleCalendarConnectionId: () => 'test-connection',
      createGoogleCalendarEvent: async params => {
        created.push(params);
        return { success: true, eventId: params.eventId, meetUrl: 'https://meet.google.com/mock' };
      },
      readGoogleCalendarChanges: async tokens => {
        reads.push({ ...tokens });
        if (failure) throw Error('Calendar unavailable');
        return { connectionId: 'test-connection', events: feed, syncToken: `token-${reads.length}` };
      },
    },
    ...extra,
  }, env);
  return { ...context, created, reads, setFeed: value => { feed = value; }, fail: () => { failure = true; }, tick: () => { clockNow += 16000; } };
}
const legacyEvent = (overrides = {}) => ({
  id: 'legacy-event', status: 'confirmed', summary: `30-Min Discovery Session | AriseStudio with ${base.name}`,
  organizer: { self: true }, start: { dateTime: '2030-01-07T04:00:00Z' }, end: { dateTime: '2030-01-07T04:30:00Z' },
  attendees: [{ email: base.email }], ...overrides,
});

test('host cancellation archives the original booking and allows a new reservation', async t => {
  const ctx = calendarSetup(t), route = ctx.load('src/app/api/schedule/route.ts');
  assert.equal((await route.POST(req(base))).status, 200);
  const eventId = ctx.created[0].eventId;
  assert.match(eventId, /^[a-f0-9]{32}$/);
  assert.equal((await ctx.client.execute('SELECT eventId FROM booking_calendar_events')).rows[0].eventId, eventId);
  ctx.setFeed([{ id: eventId, status: 'cancelled' }]); ctx.tick();
  const availability = await route.GET();
  assert.equal(availability.status, 200);
  assert.equal(availability.body.bookedSlots.length, 0);
  const archived = (await ctx.client.execute('SELECT * FROM booking_calendar_events')).rows[0];
  assert.ok(archived.cancelledAt);
  const snapshot = JSON.parse(archived.snapshot);
  assert.equal(snapshot.name, base.name); assert.equal(snapshot.email, base.email); assert.ok(snapshot.createdAt);
  assert.equal((await route.POST(req({ ...base, name: 'Bob', email: 'bob@example.test' }))).status, 200);
  assert.equal((await ctx.client.execute('SELECT name FROM bookings')).rows[0].name, 'Bob');
  // Repeated old cancellation must not cancel the replacement booking.
  ctx.tick(); await route.GET();
  assert.equal((await ctx.client.execute('SELECT name FROM bookings')).rows[0].name, 'Bob');
});

test('incremental sync tokens are persisted and reused', async t => {
  const ctx = calendarSetup(t), route = ctx.load('src/app/api/schedule/route.ts');
  await route.POST(req(base)); ctx.tick();
  ctx.setFeed([{ id: ctx.created[0].eventId, status: 'confirmed' }]); await route.GET();
  assert.deepEqual(ctx.reads[0], {});
  ctx.tick(); await route.GET();
  assert.equal(ctx.reads[1]['test-connection'], 'token-1');
});

for (const [label, event] of Object.entries({
  absent: null, attendeeDecline: { status: 'confirmed', attendees: [{ email: base.email, responseStatus: 'declined' }] },
  attendeeCalendarCopy: { status: 'cancelled', organizer: { self: false } },
  recurringException: { status: 'cancelled', recurringEventId: 'parent-event' },
})) test(`${label} does not release a known booking`, async t => {
  const ctx = calendarSetup(t), route = ctx.load('src/app/api/schedule/route.ts');
  await route.POST(req(base)); ctx.tick();
  ctx.setFeed(event ? [{ id: ctx.created[0].eventId, ...event }] : []);
  const availability = await route.GET();
  assert.equal(availability.body.bookedSlots.length, 1);
  assert.equal((await ctx.client.execute('SELECT * FROM bookings')).rows.length, 1);
});

test('Google errors keep the slot locked and leave the sync token unchanged', async t => {
  const ctx = calendarSetup(t), route = ctx.load('src/app/api/schedule/route.ts');
  await route.POST(req(base)); ctx.tick(); ctx.fail();
  assert.equal((await route.GET()).body.bookedSlots.length, 1);
  assert.equal((await ctx.client.execute('SELECT * FROM calendar_sync_state')).rows.length, 0);
});

test('a different OAuth connection cannot cancel the original booking by event ID alone', async t => {
  let eventId;
  const ctx = calendarSetup(t, { '@/lib/googleCalendar': {
    googleCalendarConnectionId: () => 'original-connection',
    createGoogleCalendarEvent: async params => { eventId = params.eventId; return { success: true, eventId, meetUrl: null }; },
    readGoogleCalendarChanges: async () => ({ connectionId: 'different-connection', events: [{ id: eventId, status: 'cancelled' }], syncToken: 'new-token' }),
  } });
  const route = ctx.load('src/app/api/schedule/route.ts');
  await route.POST(req(base)); ctx.tick();
  assert.equal((await route.GET()).body.bookedSlots.length, 1);
});

test('legacy database reservations link only to an exact organizer event and then cancel', async t => {
  const ctx = calendarSetup(t), storage = ctx.load('src/lib/turso.ts');
  await storage.reserveBooking({ ...base, company: '', service: '', notes: '' });
  ctx.setFeed([legacyEvent({ status: 'cancelled' })]);
  const route = ctx.load('src/app/api/schedule/route.ts');
  assert.equal((await route.GET()).body.bookedSlots.length, 0);
  const archived = (await ctx.client.execute('SELECT * FROM booking_calendar_events')).rows[0];
  assert.equal(archived.eventId, 'legacy-event'); assert.ok(archived.cancelledAt);
});

test('cancelled legacy files remain intact without permanently relocking a released slot', async t => {
  const content = JSON.stringify(base) + '\n'; let writes = 0;
  const ctx = calendarSetup(t, { 'fs/promises': { readFile: async () => content, writeFile: async () => { writes++; } } });
  ctx.setFeed([legacyEvent({ status: 'cancelled' })]);
  const route = ctx.load('src/app/api/schedule/route.ts');
  assert.equal((await route.GET()).body.bookedSlots.length, 0);
  assert.equal((await route.POST(req({ ...base, email: 'new@example.test' }))).status, 200);
  assert.equal((await route.GET()).body.bookedSlots.length, 1);
  assert.equal(writes, 0);
});

for (const [label, feed] of Object.entries({
  ambiguous: [legacyEvent(), legacyEvent({ id: 'duplicate', status: 'cancelled' })],
  wrongAttendee: [legacyEvent({ status: 'cancelled', attendees: [{ email: 'someone@example.test' }] })],
  wrongStart: [legacyEvent({ status: 'cancelled', start: { dateTime: '2030-01-07T05:00:00Z' } })],
  tombstoneWithoutIdentity: [{ id: 'unknown-event', status: 'cancelled' }],
})) test(`${label} leaves legacy bookings locked`, async t => {
  const ctx = calendarSetup(t), storage = ctx.load('src/lib/turso.ts');
  await storage.reserveBooking({ ...base, company: '', service: '', notes: '' });
  ctx.setFeed(feed);
  assert.equal((await ctx.load('src/app/api/schedule/route.ts').GET()).body.bookedSlots.length, 1);
});

test('archive failure rolls back cancellation and preserves the booking', async t => {
  const ctx = calendarSetup(t), route = ctx.load('src/app/api/schedule/route.ts');
  await route.POST(req(base));
  await ctx.client.execute("CREATE TRIGGER reject_archive BEFORE UPDATE ON booking_calendar_events BEGIN SELECT RAISE(ABORT, 'disk failure'); END");
  ctx.setFeed([{ id: ctx.created[0].eventId, status: 'cancelled' }]); ctx.tick();
  assert.equal((await route.GET()).body.bookedSlots.length, 1);
  assert.equal((await ctx.client.execute('SELECT cancelledAt FROM booking_calendar_events')).rows[0].cancelledAt, null);
  assert.equal((await ctx.client.execute('SELECT * FROM calendar_sync_state')).rows.length, 0);
});

const googleEnv = { GOOGLE_CLIENT_ID: 'mock-client', GOOGLE_CLIENT_SECRET: 'mock-secret', GOOGLE_REFRESH_TOKEN: 'mock-refresh' };
function googleReader(handler) {
  return app({ fetch: async (url, options) => url.includes('oauth2') ? { ok: true, json: async () => ({ access_token: 'mock' }) } : handler(new URL(url), options) }, googleEnv)('src/lib/googleCalendar.ts');
}
const okPage = body => ({ ok: true, status: 200, json: async () => ({ accessRole: 'owner', ...body }) });

test('Calendar change reader collects every page before returning a sync token', async () => {
  const urls = [];
  const reader = googleReader(async url => {
    urls.push(url);
    return url.searchParams.has('pageToken') ? okPage({ items: [{ id: 'deleted', status: 'cancelled' }], nextSyncToken: 'finished' }) : okPage({ items: [], nextPageToken: 'page-2' });
  });
  const result = await reader.readGoogleCalendarChanges({});
  assert.equal(result.events[0].id, 'deleted'); assert.equal(result.syncToken, 'finished');
  assert.equal(urls[0].searchParams.get('showDeleted'), 'true');
  assert.equal(urls[1].searchParams.get('pageToken'), 'page-2');
});

test('expired Google sync token triggers a complete baseline without treating absence as cancellation', async () => {
  const seen = [];
  const reader = googleReader(async url => {
    seen.push(url);
    return url.searchParams.has('syncToken') ? { ok: false, status: 410 } : okPage({ items: [], nextSyncToken: 'reset' });
  });
  const result = await reader.readGoogleCalendarChanges({ [reader.googleCalendarConnectionId()]: 'expired' });
  assert.equal(result.events.length, 0); assert.equal(result.syncToken, 'reset');
  assert.equal(seen[0].searchParams.get('syncToken'), 'expired');
  assert.equal(seen[1].searchParams.has('syncToken'), false);
});

test('partial pages, permission errors and non-organizer calendars never return cancellation evidence', async () => {
  for (const status of [401, 403, 404, 429, 500]) {
    const reader = googleReader(async () => ({ ok: false, status }));
    await assert.rejects(reader.readGoogleCalendarChanges({}), /unavailable/);
  }
  const reader = googleReader(async url => url.searchParams.has('pageToken') ? { ok: false, status: 503 } : okPage({ items: [{ id: 'deleted', status: 'cancelled' }], nextPageToken: 'two' }));
  await assert.rejects(reader.readGoogleCalendarChanges({}), /unavailable/);
  const other = googleReader(async () => okPage({ accessRole: 'reader', items: [], nextSyncToken: 'token' }));
  await assert.rejects(other.readGoogleCalendarChanges({}), /organizer/);
});

test('event identity persistence failure rolls back the reservation before Google is called', async t => {
  const ctx = calendarSetup(t);
  await ctx.load('src/lib/turso.ts').getDatabase();
  await ctx.client.execute("CREATE TRIGGER reject_link BEFORE INSERT ON booking_calendar_events BEGIN SELECT RAISE(ABORT, 'disk failure'); END");
  const response = await ctx.load('src/app/api/schedule/route.ts').POST(req(base));
  assert.equal(response.status, 503);
  assert.equal((await ctx.client.execute('SELECT * FROM bookings')).rows.length, 0);
  assert.equal(ctx.created.length, 0);
});

test('host env controls the profile and initials with safe defaults', () => {
  const defaultHost = app()('src/lib/bookingHost.ts').getBookingHost();
  assert.equal(defaultHost.name, 'Farhan Kabir Sifat'); assert.equal(defaultHost.initials, 'FS');
  const host = app({}, { BOOKING_HOST_NAME: ' "  Ayesha   Rahman  " ', BOOKING_HOST_TITLE: 'Founder & Lead' })('src/lib/bookingHost.ts').getBookingHost();
  assert.equal(host.name, 'Ayesha Rahman'); assert.equal(host.title, 'Founder & Lead'); assert.equal(host.initials, 'AR');
  assert.equal(app({}, { BOOKING_HOST_NAME: 'নাজমুল' })('src/lib/bookingHost.ts').getBookingHost().initials, 'ন');
});

test('host env reaches the provider description and escaped confirmation email', async t => {
  const sent = [], created = [];
  const { load } = setup(t, {
    nodemailer: { createTransport: () => ({ sendMail: async mail => { sent.push(mail); } }) },
    '@/lib/googleCalendar': { googleCalendarConnectionId: () => 'test-connection', readGoogleCalendarChanges: async () => null, createGoogleCalendarEvent: async params => { created.push(params); return { success: true, meetUrl: 'https://meet.google.com/mock' }; } },
  }, { BOOKING_HOST_NAME: 'Ayesha & Rahman', BOOKING_HOST_TITLE: 'Founder <Lead>', SMTP_HOST: 'mock', SMTP_USER: 'sender@example.test', SMTP_PASS: 'mock' });
  await load('src/app/api/schedule/route.ts').POST(req(base));
  assert.match(created[0].description, /Host: Ayesha & Rahman \(Founder <Lead>\)/);
  assert.match(sent[1].html, /Ayesha &amp; Rahman/); assert.match(sent[1].html, /Founder &lt;Lead&gt;/);
  assert.doesNotMatch(sent[1].html, /Farhan Kabir Sifat|Principal Systems Architect/);
});

const mailEnv = { SMTP_HOST: 'mock', SMTP_USER: 'sender@example.test', SMTP_PASS: 'mock', SITE_URL: 'https://studio.example.test' };
async function cancelledContext(t, sendMail, env = mailEnv) {
  const ctx = calendarSetup(t, { nodemailer: { createTransport: () => ({ sendMail }) } }, env);
  const route = ctx.load('src/app/api/schedule/route.ts'); await route.POST(req(base));
  ctx.setFeed([{ id: ctx.created[0].eventId, status: 'cancelled' }]); ctx.tick(); await route.GET();
  return { ...ctx, route, flush: ctx.load('src/lib/cancellationEmail.ts').sendPendingCancellationEmails };
}

test('cancellation email shows the chosen host, local time and rebooking without a Join link', () => {
  const render = app({}, { BOOKING_HOST_NAME: 'Ayesha & Rahman', BOOKING_HOST_TITLE: 'Founder <Lead>', SITE_URL: 'https://studio.example.test' })('src/lib/cancellationEmail.ts').renderCancellationEmail;
  const mail = render({ ...base, name: '<script>Alice</script>', timezone: 'America/Los_Angeles' });
  assert.match(mail.html, /Ayesha &amp; Rahman/); assert.match(mail.html, /Founder &lt;Lead&gt;/);
  assert.match(mail.html, /&lt;script&gt;Alice&lt;\/script&gt;/); assert.doesNotMatch(mail.html, /<script>/);
  assert.match(mail.html, /Sunday, January 6, 2030/); assert.match(mail.text, /8:00 PM – 8:30 PM PST/);
  assert.match(mail.html, /https:\/\/studio.example.test\/schedule/); assert.doesNotMatch(mail.html, /Join with Google Meet|meet.google.com/);
  assert.match(render({ ...base, timezone: 'old timezone label' }).text, /Asia\/Dhaka/);
});

test('a cancellation queues transactionally and repeated or concurrent sends deliver once', async t => {
  const sent = []; const ctx = await cancelledContext(t, async mail => { sent.push(mail); }); sent.length = 0;
  assert.equal((await ctx.client.execute('SELECT * FROM bookings')).rows.length, 0);
  assert.equal((await ctx.client.execute('SELECT * FROM booking_cancellation_emails')).rows.length, 1);
  await Promise.all([ctx.flush(), ctx.flush()]);
  assert.equal(sent.length, 1); assert.equal(sent[0].to, base.email); assert.match(sent[0].subject, /^Cancelled:/);
  assert.ok(sent[0].text); assert.match(sent[0].messageId, /^<cancellation\..+@studio.example.test>$/);
  assert.ok((await ctx.client.execute('SELECT sentAt FROM booking_cancellation_emails')).rows[0].sentAt);
  ctx.tick(); await ctx.route.GET(); await ctx.flush(); assert.equal(sent.length, 1);
});

test('failed cancellation email retries later without restoring the slot', async t => {
  let fail = false, attempts = 0; const ctx = await cancelledContext(t, async () => { if (fail) { attempts++; throw Error('SMTP offline'); } });
  fail = true; await ctx.flush();
  assert.equal(attempts, 1); assert.equal((await ctx.client.execute('SELECT sentAt FROM booking_cancellation_emails')).rows[0].sentAt, null);
  assert.equal((await ctx.client.execute('SELECT * FROM bookings')).rows.length, 0);
  await ctx.flush(); assert.equal(attempts, 1);
  clockNow += 61000; fail = false; await ctx.flush();
  assert.ok((await ctx.client.execute('SELECT sentAt FROM booking_cancellation_emails')).rows[0].sentAt);
});

test('cancellation without SMTP remains queued for later configuration', async t => {
  let attempts = 0; const ctx = await cancelledContext(t, async () => { attempts++; }, {});
  await ctx.flush(); assert.equal(attempts, 0);
  assert.equal((await ctx.client.execute('SELECT sentAt FROM booking_cancellation_emails')).rows[0].sentAt, null);
});

test('different Calendar connections cannot send the original cancellation notification', async t => {
  const ctx = await cancelledContext(t, async () => {}); let attempts = 0;
  const load = app({ '@libsql/client': { createClient: () => ctx.client }, '@/lib/googleCalendar': { googleCalendarConnectionId: () => 'other-connection' }, nodemailer: { createTransport: () => ({ sendMail: async () => { attempts++; } }) } }, { ...mailEnv, TURSO_DATABASE_URL: 'file::memory:' });
  await load('src/lib/cancellationEmail.ts').sendPendingCancellationEmails(); assert.equal(attempts, 0);
});

test('queue insertion failure rolls back cancellation and preserves reservation', async t => {
  const ctx = calendarSetup(t), route = ctx.load('src/app/api/schedule/route.ts'); await route.POST(req(base));
  await ctx.client.execute("CREATE TRIGGER reject_cancel_mail BEFORE INSERT ON booking_cancellation_emails BEGIN SELECT RAISE(ABORT, 'disk failure'); END");
  ctx.setFeed([{ id: ctx.created[0].eventId, status: 'cancelled' }]); ctx.tick(); await route.GET();
  assert.equal((await ctx.client.execute('SELECT * FROM bookings')).rows.length, 1);
  assert.equal((await ctx.client.execute('SELECT cancelledAt FROM booking_calendar_events')).rows[0].cancelledAt, null);
  assert.equal((await ctx.client.execute('SELECT * FROM booking_cancellation_emails')).rows.length, 0);
});

test('availability schedules cancellation mail after the response, even if a Calendar read fails', async t => {
  const tasks = []; const ctx = calendarSetup(t, { 'next/server': { ...next, after: task => tasks.push(task) } }, mailEnv);
  const route = ctx.load('src/app/api/schedule/route.ts'); await route.POST(req(base));
  ctx.tick(); ctx.fail(); assert.equal((await route.GET()).status, 200);
  assert.ok(tasks.length >= 2); assert.ok(tasks.every(task => typeof task === 'function'));
});

const meeting = { title: 'Discovery', description: '', attendeeName: base.name, attendeeEmail: base.email, startIso: '2030-01-07T04:00:00.000Z', eventId: 'test-event' };
const providerEvent = extra => ({ id: meeting.eventId, status: 'confirmed', organizer: { self: true }, start: { dateTime: meeting.startIso }, attendees: [{ email: base.email }], htmlLink: 'https://calendar.google.com/test-event', ...extra });
function creation(handler, env = googleEnv) {
  return app({ fetch: async (url, options) => url.includes('oauth2') ? { ok: true, status: 200, json: async () => ({ access_token: 'mock' }) } : handler(new URL(url), options) }, env)('src/lib/googleCalendar.ts');
}
const providerResponse = (body, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => body });

test('delayed Meet generation is read on the same event without guest notifications', async () => {
  let posts = 0, reads = 0;
  const google = creation(async (url, options) => {
    assert.ok(options.signal);
    if (options.method === 'POST') { posts++; assert.equal(url.searchParams.get('sendUpdates'), 'none'); return providerResponse(providerEvent({ conferenceData: { createRequest: { status: { statusCode: 'pending' } } } })); }
    reads++; assert.ok(url.pathname.endsWith('/test-event'));
    return providerResponse(providerEvent({ hangoutLink: 'https://meet.google.com/ready' }));
  });
  const result = await google.createGoogleCalendarEvent(meeting);
  assert.equal(result.status, 'ready'); assert.equal(result.meetUrl, 'https://meet.google.com/ready'); assert.equal(posts, 1); assert.equal(reads, 1);
});

test('pending conference retains event metadata and has a bounded poll count', async () => {
  let calls = 0; const google = creation(async () => { calls++; return providerResponse(providerEvent({ conferenceData: { createRequest: { status: { statusCode: 'pending' } } } })); });
  const result = await google.createGoogleCalendarEvent(meeting);
  assert.equal(result.success, false); assert.equal(result.status, 'pending'); assert.equal(result.eventId, meeting.eventId);
  assert.equal(result.calendarEventUrl, 'https://calendar.google.com/test-event'); assert.equal(result.retryable, true); assert.equal(calls, 3);
});

test('conference failure is a failure, and recovery patches the existing event', async () => {
  let patches = 0, posts = 0;
  const google = creation(async (_url, options) => {
    if (options.method === 'POST') posts++;
    if (options.method === 'PATCH') { patches++; assert.equal(_url.searchParams.get('sendUpdates'), 'none'); assert.equal(JSON.parse(options.body).attendees, undefined); return providerResponse(providerEvent({ hangoutLink: 'https://meet.google.com/recovered' })); }
    return providerResponse(providerEvent({ conferenceData: { createRequest: { status: { statusCode: 'failure' } } } }));
  });
  assert.equal((await google.createGoogleCalendarEvent(meeting)).status, 'failed');
  const recovered = await google.createGoogleCalendarEvent({ ...meeting, attempt: 1 });
  assert.equal(recovered.status, 'ready'); assert.equal(patches, 1); assert.equal(posts, 1);
});

test('uncertain insert recovery reads the same event without inserting a second meeting', async () => {
  let posts = 0;
  const google = creation(async (_url, options) => {
    if (options.method === 'POST') { posts++; throw Error('response lost after insert'); }
    return providerResponse(providerEvent({ hangoutLink: 'https://meet.google.com/existing' }));
  });
  assert.equal((await google.createGoogleCalendarEvent(meeting)).retryable, true);
  const recovered = await google.createGoogleCalendarEvent({ ...meeting, attempt: 1 });
  assert.equal(recovered.status, 'ready'); assert.equal(posts, 1);
});

test('insert conflict reads the existing event instead of returning a false failure', async () => {
  const google = creation(async (_url, options) => options.method === 'POST' ? providerResponse({}, 409) : providerResponse(providerEvent({ hangoutLink: 'https://meet.google.com/existing' })));
  assert.equal((await google.createGoogleCalendarEvent(meeting)).status, 'ready');
});

test('deleted or mismatched events are never recreated during recovery', async () => {
  let posts = 0;
  const gone = creation(async (_url, options) => { if (options.method === 'POST') posts++; return providerResponse({}, 410); });
  assert.equal((await gone.createGoogleCalendarEvent({ ...meeting, attempt: 1 })).status, 'cancelled'); assert.equal(posts, 0);
  const wrong = creation(async () => providerResponse(providerEvent({ attendees: [{ email: 'different@example.test' }] })));
  const result = await wrong.createGoogleCalendarEvent({ ...meeting, attempt: 1 }); assert.equal(result.status, 'failed'); assert.equal(result.retryable, false);
});

for (const [status, retryable] of [[400, false], [429, true], [503, true]]) test(`Calendar HTTP ${status} is classified for safe recovery`, async () => {
  const google = creation(async () => providerResponse({ error: { message: 'provider error' } }, status));
  const result = await google.createGoogleCalendarEvent(meeting); assert.equal(result.status, 'failed'); assert.equal(result.retryable, retryable);
});

test('missing canonical secret fails before OAuth instead of guessing from other env keys', async () => {
  let requests = 0; const google = creation(async () => { requests++; throw Error('unexpected fetch'); }, { GOOGLE_CLIENT_ID: 'id', GOOGLE_REFRESH_TOKEN: 'refresh', OTHER_GOOGLE_CLIENT_SECRET: 'wrong' });
  const result = await google.createGoogleCalendarEvent(meeting); assert.equal(result.status, 'failed'); assert.equal(result.retryable, false); assert.equal(requests, 0);
});

const recoveryRequest = (token, method = 'GET') => new Request('http://local.test/api/schedule/booking', { method, headers: token ? { authorization: `Bearer ${token}` } : {} });
function postWithToken(token, changes = {}, ip = '127.0.0.1') {
  const r = req({ ...base, ...changes }, ip); return new Request(r, { headers: { ...Object.fromEntries(r.headers), authorization: `Bearer ${token}` } });
}

test('saved booking recovers a delayed link and survives a new app instance', async t => {
  let ready = false; const attempts = [];
  const google = { googleCalendarConnectionId: () => 'test-connection', readGoogleCalendarChanges: async () => null, createGoogleCalendarEvent: async params => { attempts.push(params); return ready ? { success: true, status: 'ready', meetUrl: 'https://meet.google.com/recovered', calendarEventUrl: 'https://calendar.google.com/same' } : { success: false, status: 'pending', retryable: true, meetUrl: null, calendarEventUrl: 'https://calendar.google.com/same' }; } };
  const { load, client } = setup(t, { '@/lib/googleCalendar': google });
  const first = await load('src/app/api/schedule/route.ts').POST(req(base));
  assert.equal(first.body.booking.gcalStatus, 'pending'); assert.equal(first.body.booking.calendarEventUrl, 'https://calendar.google.com/same');
  const token = first.body.recoveryToken;
  assert.match(token, /^[a-f0-9]{64}$/); assert.notEqual((await client.execute('SELECT recoveryHash FROM booking_delivery')).rows[0].recoveryHash, token);
  ready = true; clockNow += 61000;
  await Promise.all([load('src/lib/bookingDelivery.ts').processPendingBookingDeliveries(), load('src/lib/bookingDelivery.ts').processPendingBookingDeliveries()]);
  assert.equal(attempts.length, 2); assert.equal(attempts[0].eventId, attempts[1].eventId); assert.equal(attempts[1].attempt, 1);
  const fresh = app({ 'next/server': next, '@libsql/client': { createClient: () => client }, '@/lib/googleCalendar': google }, { TURSO_DATABASE_URL: 'file::memory:' });
  const receipt = await fresh('src/app/api/schedule/booking/route.ts').GET(recoveryRequest(token));
  assert.equal(receipt.body.booking.googleMeetUrl, 'https://meet.google.com/recovered'); assert.equal((await client.execute('SELECT * FROM bookings')).rows.length, 1);
});

test('recovery needs the private token and never accepts another payload on it', async t => {
  const { load } = setup(t); const route = load('src/app/api/schedule/route.ts'); const token = 'a'.repeat(64);
  assert.equal((await route.POST(postWithToken(token))).status, 200);
  assert.equal((await route.POST(postWithToken(token, { name: 'Different' }))).status, 409);
  const recovery = load('src/app/api/schedule/booking/route.ts');
  assert.equal((await recovery.GET(recoveryRequest())).status, 401);
  assert.equal((await recovery.GET(recoveryRequest('b'.repeat(64)))).status, 404);
  assert.equal((await recovery.GET(recoveryRequest('invalid'))).status, 400);
  const valid = await recovery.GET(recoveryRequest(token)); assert.equal(valid.body.booking.name, base.name); assert.equal(valid.body.booking.recoveryHash, undefined);
});

test('concurrent retries of the same token reserve once and create one provider event', async t => {
  const { load, client, events } = setup(t); const route = load('src/app/api/schedule/route.ts'); const token = 'c'.repeat(64);
  const results = await Promise.all([route.POST(postWithToken(token, {}, 'one')), route.POST(postWithToken(token, {}, 'two'))]);
  assert.deepEqual(results.map(r => r.status), [200, 200]); assert.equal((await client.execute('SELECT * FROM bookings')).rows.length, 1); assert.equal(events(), 1);
});

test('notes cannot become a Meet URL and failed provider attempts remain safely reserved', async t => {
  const { load, client } = setup(t, { '@/lib/googleCalendar': { googleCalendarConnectionId: () => 'test-connection', readGoogleCalendarChanges: async () => null, createGoogleCalendarEvent: async () => ({ success: false, status: 'failed', retryable: true, meetUrl: null }) } });
  const r = await load('src/app/api/schedule/route.ts').POST(req({ ...base, notes: 'My site https://example.test' }));
  assert.equal(r.body.booking.googleMeetUrl, ''); assert.equal(r.body.booking.gcalStatus, 'failed'); assert.equal((await client.execute('SELECT * FROM bookings')).rows.length, 1);
});

for (const failedRecipient of ['host@example.test', base.email]) test(`failure for ${failedRecipient} does not block the other email or resend its success`, async t => {
  let fail = true; const sent = [];
  const { load, client, events } = setup(t, { nodemailer: { createTransport: () => ({ sendMail: async mail => { sent.push(mail.to); if (fail && mail.to === failedRecipient) throw Error('recipient rejected'); } }) } }, { ...mailEnv, CONTACT_NOTIFICATION_EMAIL: 'host@example.test' });
  const r = await load('src/app/api/schedule/route.ts').POST(req(base));
  assert.ok(sent.includes(base.email)); assert.ok(sent.includes('host@example.test')); assert.equal(r.body.emailSent, failedRecipient !== base.email);
  fail = false; clockNow += 61000; await load('src/lib/bookingDelivery.ts').processPendingBookingDeliveries();
  assert.equal(sent.filter(to => to === failedRecipient).length, 2); assert.equal(sent.filter(to => to !== failedRecipient).length, 1); assert.equal(events(), 1);
  const delivery = (await client.execute('SELECT * FROM booking_delivery')).rows[0]; assert.ok(delivery.clientEmailSentAt); assert.ok(delivery.hostEmailSentAt);
});

test('manual recovery schedules the existing event and cancelled sessions reject retries', async t => {
  const tasks = []; const ctx = calendarSetup(t, { 'next/server': { ...next, after: task => tasks.push(task) } });
  const first = await ctx.load('src/app/api/schedule/route.ts').POST(req(base));
  const recovery = ctx.load('src/app/api/schedule/booking/route.ts');
  assert.equal((await recovery.POST(recoveryRequest(first.body.recoveryToken, 'POST'))).status, 200); assert.ok(tasks.length);
  ctx.setFeed([{ id: ctx.created[0].eventId, status: 'cancelled' }]); ctx.tick(); await ctx.load('src/app/api/schedule/route.ts').GET();
  assert.equal((await recovery.POST(recoveryRequest(first.body.recoveryToken, 'POST'))).status, 409);
  assert.equal((await recovery.GET(recoveryRequest(first.body.recoveryToken))).body.booking.gcalStatus, 'cancelled');
});

test('rate limits share atomic counters between independent app instances and expire', async t => {
  const { load, client } = setup(t);
  const other = app({ '@libsql/client': { createClient: () => client } }, { TURSO_DATABASE_URL: 'file::memory:' });
  const a = load('src/lib/submissions.ts'), b = other('src/lib/submissions.ts');
  const results = await Promise.all(Array.from({ length: 6 }, (_, i) => (i % 2 ? a : b).limitSubmission(req(lead, 'same-ip'), 'shared-limit').then(() => 200, error => error.status)));
  assert.equal(results.filter(status => status === 200).length, 5); assert.equal(results.filter(status => status === 429).length, 1);
  assert.doesNotMatch(String((await client.execute('SELECT key FROM submission_limits')).rows[0].key), /same-ip/);
  clockNow += 600001; await b.limitSubmission(req(lead, 'same-ip'), 'shared-limit');
});

test('saved contact notification retries independently without duplicating a lead', async t => {
  let fail = true, sends = 0;
  const { load, client } = setup(t, { nodemailer: { createTransport: () => ({ sendMail: async () => { sends++; if (fail) throw Error('offline'); } }) } }, mailEnv);
  const result = await load('src/app/api/contact/route.ts').POST(req(lead));
  assert.equal(result.body.emailSent, false); assert.match(result.body.emailNotice, /request is saved/);
  assert.equal((await client.execute('SELECT sentAt FROM contact_notification_delivery')).rows[0].sentAt, null);
  fail = false; clockNow += 61000; await load('src/lib/contactNotification.ts').sendPendingContactNotifications(); await load('src/lib/contactNotification.ts').sendPendingContactNotifications();
  assert.equal(sends, 2); assert.equal((await client.execute('SELECT * FROM contact_leads')).rows.length, 1); assert.ok((await client.execute('SELECT sentAt FROM contact_notification_delivery')).rows[0].sentAt);
});

test('all submission mail uses bounded SMTP connection, greeting and idle timeouts', () => {
  let options; const load = app({ nodemailer: { createTransport: value => { options = value; return {}; } } }, mailEnv);
  load('src/lib/mail.ts').mailTransport(); assert.equal(options.connectionTimeout, 5000); assert.equal(options.greetingTimeout, 5000); assert.equal(options.socketTimeout, 8000);
});

test('ready bookings keep failed email retryable after the provider attempt budget is used', async t => {
  const { load, client, events } = setup(t, { nodemailer: { createTransport: () => ({ sendMail: async () => { throw Error('SMTP offline'); } }) } }, mailEnv);
  await load('src/app/api/schedule/route.ts').POST(req(base));
  await client.execute('UPDATE booking_delivery SET attempts = 5, nextAttemptAt = 0');
  await load('src/lib/bookingDelivery.ts').processPendingBookingDeliveries();
  const row = (await client.execute('SELECT * FROM booking_delivery')).rows[0]; assert.equal(row.state, 'ready'); assert.ok(Number(row.nextAttemptAt) > clockNow); assert.equal(events(), 1);
});

test('quota-related 403 is recoverable while permission-related 403 is not', async () => {
  const quota = creation(async () => providerResponse({ error: { errors: [{ reason: 'userRateLimitExceeded' }] } }, 403));
  const permission = creation(async () => providerResponse({ error: { errors: [{ reason: 'forbidden' }] } }, 403));
  assert.equal((await quota.createGoogleCalendarEvent(meeting)).retryable, true);
  assert.equal((await permission.createGoogleCalendarEvent(meeting)).retryable, false);
});


test('cancelled events with a stale Meet link are never reported ready', async () => {
  let calls = 0;
  const google = creation(async () => providerResponse(providerEvent(++calls === 1 ? {} : { status: 'cancelled', hangoutLink: 'https://meet.google.com/old' })));
  const result = await google.createGoogleCalendarEvent(meeting);
  assert.equal(result.status, 'cancelled'); assert.equal(result.meetUrl, null);
});

test('malformed SMTP configuration preserves the saved contact and pending notification', async t => {
  const { load, client } = setup(t, {}, { ...mailEnv, SMTP_PORT: 'invalid' });
  const response = await load('src/app/api/contact/route.ts').POST(req(lead));
  assert.equal(response.status, 200); assert.equal(response.body.emailSent, false);
  assert.equal((await client.execute('SELECT * FROM contact_leads')).rows.length, 1);
  assert.equal((await client.execute('SELECT sentAt FROM contact_notification_delivery')).rows[0].sentAt, null);
});

test('recovery authorization requires a Bearer token instead of a raw header value', () => {
  const load = app({}, {});
  assert.throws(() => load('src/lib/bookingDelivery.ts').requestBookingToken(new Request('http://local.test', { headers: { authorization: 'a'.repeat(64) } })), /Invalid booking recovery token/);
});


test('new organizer-only events recover by private booking identity without Google guest mail', async () => {
  let event, inserts = 0;
  const google = creation(async (url, options) => {
    if (options.method === 'POST') {
      inserts++; const body = JSON.parse(options.body);
      assert.equal(url.searchParams.get('sendUpdates'), 'none');
      assert.equal(body.attendees, undefined);
      assert.equal(body.reminders.overrides.some(item => item.method === 'email'), false);
      assert.match(body.extendedProperties.private.ariseStudioBooking, /^[a-f0-9]{64}$/);
      assert.doesNotMatch(body.extendedProperties.private.ariseStudioBooking, /alice/);
      assert.equal(body.conferenceData.createRequest.conferenceSolutionKey.type, 'hangoutsMeet');
      event = { ...body, status: 'confirmed', organizer: { self: true }, htmlLink: 'https://calendar.google.com/same' };
    }
    return providerResponse(event);
  });
  assert.equal((await google.createGoogleCalendarEvent(meeting)).status, 'pending');
  event.hangoutLink = 'https://meet.google.com/same';
  assert.equal((await google.createGoogleCalendarEvent({ ...meeting, attempt: 1 })).status, 'ready');
  assert.equal(inserts, 1);
  event.extendedProperties.private.ariseStudioBooking = 'wrong';
  assert.equal((await google.createGoogleCalendarEvent({ ...meeting, attempt: 1 })).status, 'failed');
  assert.equal(inserts, 1);
});

test('organizer-only booking and deletion send one custom message per customer action', async t => {
  let saved, cancelled = false; const sent = [];
  const google = creation(async (url, options) => {
    if (options.method === 'POST') {
      const body = JSON.parse(options.body); assert.equal(body.attendees, undefined); assert.equal(url.searchParams.get('sendUpdates'), 'none');
      saved = { ...body, status: 'confirmed', organizer: { self: true }, hangoutLink: 'https://meet.google.com/custom-only' };
      return providerResponse(saved);
    }
    return providerResponse({ accessRole: 'owner', items: cancelled ? [{ id: saved.id, status: 'cancelled' }] : [saved], nextSyncToken: cancelled ? 'cancelled-token' : 'active-token' });
  });
  const ctx = setup(t, { '@/lib/googleCalendar': google, nodemailer: { createTransport: () => ({ sendMail: async mail => sent.push(mail) }) } }, mailEnv);
  const route = ctx.load('src/app/api/schedule/route.ts');
  const receipt = await route.POST(req(base));
  assert.equal(receipt.body.booking.googleMeetUrl, 'https://meet.google.com/custom-only');
  assert.equal(sent.filter(mail => mail.to === base.email).length, 1);
  cancelled = true; clockNow += 16000;
  const availability = await route.GET();
  await ctx.load('src/lib/cancellationEmail.ts').sendPendingCancellationEmails();
  await ctx.load('src/lib/cancellationEmail.ts').sendPendingCancellationEmails();
  assert.equal(availability.body.bookedSlots.length, 0);
  const customer = sent.filter(mail => mail.to === base.email);
  assert.equal(customer.length, 2); assert.match(customer[0].subject, /^Confirmed:/); assert.match(customer[1].subject, /^Cancelled:/);
  assert.match(customer[0].html, /Your session is confirmed/); assert.match(customer[1].html, /Your session is cancelled/);
  assert.doesNotMatch(customer[1].html, /Join with Google Meet|meet.google.com/);
});

test('matching premium templates escape user data and use the configured brand origin', () => {
  const load = app({}, { SITE_URL: 'https://studio.example.test', BOOKING_HOST_NAME: 'Ayesha & Rahman', BOOKING_HOST_TITLE: 'Founder <Lead>' });
  const confirmation = load('src/lib/bookingEmail.ts').confirmationEmail({ ...base, name: 'Alice <img src=x onerror=alert(1)>', notes: '<script>unsafe</script> & details', startIso: meeting.startIso, googleMeetUrl: 'https://meet.google.com/abc-defg-hij' });
  const cancellation = load('src/lib/cancellationEmail.ts').renderCancellationEmail(base);
  for (const mail of [confirmation, cancellation]) {
    assert.match(mail.html, /https:\/\/studio.example.test\/brand\/arisestudio-logo.png/);
    assert.doesNotMatch(mail.html, /raw.githubusercontent.com|<script>|onerror=alert\(1\)>/);
    assert.match(mail.html, /max-width:600px/); assert.match(mail.html, /max-width:480px/);
    assert.match(mail.html, /role="presentation"/); assert.match(mail.html, /Founder &lt;Lead&gt;/);
    assert.ok(mail.text);
  }
  assert.match(confirmation.html, /&lt;script&gt;unsafe&lt;\/script&gt; &amp; details/);
  assert.match(confirmation.html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(confirmation.html, /href="https:\/\/meet.google.com\/abc-defg-hij"/);
  assert.match(cancellation.html, /href="https:\/\/studio.example.test\/schedule"/);
  assert.throws(() => load('src/lib/bookingEmail.ts').confirmationEmail({ ...base, notes: '', startIso: meeting.startIso, googleMeetUrl: 'javascript:alert(1)' }), /Invalid Google Meet URL/);
});

test('Calendar events include an empty host cancellation section without sending instructions as customer notes', async t => {
  const sent = [];
  const ctx = calendarSetup(t, { nodemailer: { createTransport: () => ({ sendMail: async mail => sent.push(mail) }) } }, mailEnv);
  const route = ctx.load('src/app/api/schedule/route.ts');
  assert.equal((await route.POST(req(base))).status, 200);
  const event = ctx.created[0];
  assert.match(event.description, /Host: [^\n]+\n\nTo cancel with a note, edit the section below, save the event, then delete it\.\nCancellation note:\n$/);
  assert.doesNotMatch(sent.find(mail => mail.to === base.email).html, /To cancel with a note|Cancellation note:/);
  sent.length = 0;
  ctx.setFeed([{ id: event.eventId, status: 'cancelled', description: event.description }]);
  ctx.tick(); await route.GET();
  await ctx.load('src/lib/cancellationEmail.ts').sendPendingCancellationEmails();
  assert.equal((await ctx.client.execute('SELECT * FROM bookings')).rows.length, 0);
  assert.equal(sent.length, 1);
  assert.doesNotMatch(sent[0].html, /A note from your host|To cancel with a note/);
  assert.doesNotMatch(sent[0].text, /Cancellation note:|To cancel with a note/);
});

test('saved Calendar description cancellation note survives archive and SMTP retries', async t => {
  let fail = false; const messages = [];
  const ctx = calendarSetup(t, { nodemailer: { createTransport: () => ({ sendMail: async mail => { if (fail) throw Error('offline'); messages.push(mail); } }) } }, mailEnv);
  const route = ctx.load('src/app/api/schedule/route.ts');
  await route.POST(req({ ...base, notes: 'Original booking notes stay intact.' }));
  messages.length = 0;
  ctx.setFeed([{ id: ctx.created[0].eventId, status: 'cancelled', description: ctx.created[0].description.replace(/Cancellation note:\n$/, 'Cancellation note:\nAn urgent commitment has come up.\nPlease choose a new time.') }]);
  ctx.tick(); await route.GET();
  const archived = JSON.parse((await ctx.client.execute('SELECT snapshot FROM booking_calendar_events')).rows[0].snapshot);
  assert.equal(archived.notes, 'Original booking notes stay intact.');
  assert.equal(archived.cancellationNote, 'An urgent commitment has come up.\nPlease choose a new time.');
  assert.equal((await ctx.client.execute('SELECT * FROM bookings')).rows.length, 0);
  const flush = ctx.load('src/lib/cancellationEmail.ts').sendPendingCancellationEmails;
  fail = true; await flush(); assert.equal(messages.length, 0);
  fail = false; clockNow += 61000; await flush(); await flush();
  assert.equal(messages.length, 1);
  assert.match(messages[0].text, /Cancellation note:\nAn urgent commitment has come up.\nPlease choose a new time./);
  assert.match(messages[0].html, /A note from your host/); assert.match(messages[0].html, /An urgent commitment has come up./);
});

test('Calendar rich-text note is decoded and safely escaped in custom cancellation email', async t => {
  const messages = []; const ctx = calendarSetup(t, { nodemailer: { createTransport: () => ({ sendMail: async mail => messages.push(mail) }) } }, mailEnv);
  const route = ctx.load('src/app/api/schedule/route.ts'); await route.POST(req(base)); messages.length = 0;
  ctx.setFeed([{ id: ctx.created[0].eventId, status: 'cancelled', description: '<div>Host: Farhan</div><div><b>Cancellation note:</b></div><div>Travel &amp; schedule conflict.</div><div>&lt;script&gt;unsafe&lt;/script&gt; &#x2014; &#2527; &#99999999;</div>' }]);
  ctx.tick(); await route.GET(); await ctx.load('src/lib/cancellationEmail.ts').sendPendingCancellationEmails();
  assert.equal(messages.length, 1);
  assert.match(messages[0].text, /Travel & schedule conflict.\n<script>unsafe<\/script> —/);
  assert.match(messages[0].html, /Travel &amp; schedule conflict./);
  assert.match(messages[0].html, /&lt;script&gt;unsafe&lt;\/script&gt;/); assert.doesNotMatch(messages[0].html, /<script>/);
});

for (const scenario of ['customer booking notes', 'attendee reply', 'empty section', 'ID-only tombstone']) test(`cancellation note never comes from ${scenario}`, async t => {
  const ctx = calendarSetup(t); const route = ctx.load('src/app/api/schedule/route.ts');
  await route.POST(req({ ...base, notes: 'Customer preferences\nCancellation note: This is a booking note.' }));
  const event = { id: ctx.created[0].eventId, status: 'cancelled' };
  if (scenario === 'customer booking notes') event.description = ctx.created[0].description;
  if (scenario === 'attendee reply') event.attendees = [{ email: base.email, comment: 'A response, not a cancellation note.' }];
  if (scenario === 'empty section') event.description = `${ctx.created[0].description}\n\nCancellation note:  \n`;
  ctx.setFeed([event]); ctx.tick(); await route.GET();
  const archived = JSON.parse((await ctx.client.execute('SELECT snapshot FROM booking_calendar_events')).rows[0].snapshot);
  assert.equal(archived.cancellationNote, undefined); assert.match(archived.notes, /Customer preferences/);
  const email = ctx.load('src/lib/cancellationEmail.ts').renderCancellationEmail(archived);
  assert.doesNotMatch(email.html, /A note from your host|This is a booking note/);
  assert.doesNotMatch(email.text, /Cancellation note:/);
  assert.equal((await ctx.client.execute('SELECT * FROM bookings')).rows.length, 0);
});


test('shared booking time range shows the timezone only once', () => {
  const booking = app()('src/lib/booking.ts');
  assert.equal(booking.formatBookingRange('2026-10-26T05:00:00Z', 'Asia/Dhaka'), '11:00 AM – 11:30 AM GMT+6');
  assert.equal(booking.formatBookingRange('2030-01-07T04:00:00Z', 'America/Los_Angeles'), '8:00 PM – 8:30 PM PST');
});

test('time range preserves both timezone labels when a DST transition changes the offset', () => {
  const booking = app()('src/lib/booking.ts');
  assert.equal(booking.formatBookingRange('2030-11-03T05:45:00Z', 'America/New_York'), '1:45 AM EDT – 1:15 AM EST');
  assert.equal(booking.formatBookingRange('2030-03-10T06:45:00Z', 'America/New_York'), '1:45 AM EST – 3:15 AM EDT');
});


test('email action layout preserves both booking links and only the rebooking action after cancellation', () => {
  const load = app({}, { SITE_URL: 'https://studio.example.test' });
  const render = load('src/lib/appointmentEmail.ts').renderAppointmentEmail;
  const details = { name: base.name, date: base.date, time: '11:00 AM – 11:30 AM GMT+6', timezone: base.timezone, meetUrl: 'https://meet.google.com/abc-defg-hij', calendarUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&dates=sample' };
  const booking = render({ ...details, cancelled: false });
  assert.match(booking, /href="https:\/\/calendar.google.com\/calendar\/render\?action=TEMPLATE&amp;dates=sample"/);
  assert.match(booking, /Join meeting/); assert.match(booking, /Add to Calendar/);
  const cancelled = render({ ...details, cancelled: true });
  assert.match(cancelled, /href="https:\/\/studio.example.test\/schedule"/); assert.match(cancelled, /Choose a new time/);
  assert.doesNotMatch(cancelled, /href="https:\/\/(meet|calendar).google.com/);
  const pending = render({ ...details, cancelled: false, meetUrl: undefined });
  assert.match(pending, /Add to Calendar/); assert.doesNotMatch(pending, /Join meeting/);
});


test('compact emails omit repeated details and canned paragraphs while retaining session actions and notes', () => {
  const load = app({}, { SITE_URL: 'https://studio.example.test' });
  const confirmation = load('src/lib/bookingEmail.ts').confirmationEmail({ ...base, notes: 'Discuss the existing workflow.', startIso: meeting.startIso, googleMeetUrl: 'https://meet.google.com/abc-defg-hij' });
  const cancellation = load('src/lib/cancellationEmail.ts').renderCancellationEmail({ ...base, cancellationNote: 'An urgent commitment came up.' });
  for (const mail of [confirmation, cancellation]) {
    assert.doesNotMatch(mail.html, /BOOKING DETAILS|Your time is reserved|We would be happy|Simply reply|Need a hand|Need to change|Meeting link|Built around|DISCOVERY SESSION/);
    assert.match(mail.html, /Monday, January 7, 2030/); assert.match(mail.html, /Farhan Kabir Sifat/);
  }
  assert.match(confirmation.html, /Discuss the existing workflow/);
  assert.match(cancellation.html, /An urgent commitment came up/);
  assert.equal((confirmation.html.match(/href="https:\/\/meet.google.com/g) || []).length, 1);
});


test('both emails retain a personal greeting, brief polite message and matching text signoff', () => {
  const load = app({}, { SITE_URL: 'https://studio.example.test' });
  const confirmed = load('src/lib/bookingEmail.ts').confirmationEmail({ ...base, notes: '', startIso: meeting.startIso, googleMeetUrl: 'https://meet.google.com/abc-defg-hij' });
  const cancelled = load('src/lib/cancellationEmail.ts').renderCancellationEmail(base);
  for (const mail of [confirmed, cancelled]) {
    assert.match(mail.html, /Hello Alice,/); assert.match(mail.text, /Hello Alice,/);
    assert.match(mail.html, /Kind regards,/); assert.match(mail.text, /Kind regards,/);
    assert.doesNotMatch(mail.html, /BOOKING DETAILS|Built around|Simply reply/);
  }
  assert.match(confirmed.html, /Thank you for booking with AriseStudio/);
  assert.match(cancelled.html, /We’re sorry for the change of plans/);
});

for (const scenario of [
  { stored: 'light', systemDark: true, expected: false },
  { stored: 'dark', systemDark: false, expected: true },
  { stored: null, systemDark: true, expected: true },
  { stored: 'invalid', systemDark: false, expected: false },
  { blocked: true, systemDark: true, expected: true },
]) test(`first-paint theme respects preference ${JSON.stringify(scenario)}`, () => {
  const { themeScript, THEME_KEY } = app()('src/lib/theme.ts');
  const classes = new Set(['font-manrope']);
  vm.runInNewContext(themeScript, {
    localStorage: { getItem: key => { assert.equal(key, THEME_KEY); if (scenario.blocked) throw Error('storage blocked'); return scenario.stored; } },
    matchMedia: () => ({ matches: scenario.systemDark }),
    document: { documentElement: { classList: { toggle: (name, enabled) => enabled ? classes.add(name) : classes.delete(name) } } },
  });
  assert.equal(classes.has('dark'), scenario.expected); assert.ok(classes.has('font-manrope'));
});

test('light and dark theme text and primary action pairs retain readable contrast', () => {
  const css = fs.readFileSync(path.join(root, 'src/app/globals.css'), 'utf8');
  const luminance = hex => {
    const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return rgb.reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
  };
  const ratio = (a, b) => { const [low, high] = [luminance(a), luminance(b)].sort((a, b) => a - b); return (high + .05) / (low + .05); };
  for (const selector of [':root', '.dark']) {
    const block = css.slice(css.indexOf(`${selector} {`)).split('}')[0];
    const values = Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[a-f0-9]{6})/g)].map(match => [match[1], match[2]]));
    for (const surface of ['canvas', 'surface', 'surface-muted', 'surface-raised']) for (const text of ['ink', 'muted', 'subtle', 'accent']) {
      assert.ok(ratio(values[text], values[surface]) >= 4.5, `${selector} ${text} on ${surface}: ${ratio(values[text], values[surface])}`);
    }
    for (const fill of ['accent', 'accent-strong']) assert.ok(ratio(values['on-accent'], values[fill]) >= 4.5, `${selector} primary ${fill}`);
  }
});

test('page metadata shares the configured origin without credentials and keeps canonical paths distinct', () => {
  const site = app({}, { SITE_URL: '"https://studio.example.test/some/path"' })('src/lib/site.ts');
  assert.equal(site.siteOrigin(), 'https://studio.example.test');
  assert.equal(site.pageMetadata('Contact', 'Talk with us', '/contact').alternates.canonical, '/contact');
  assert.equal(site.pageMetadata('Services', 'What we build', '/services').openGraph.url, '/services');
  assert.throws(() => app({}, { SITE_URL: 'https://user:pass@example.test' })('src/lib/site.ts').siteOrigin(), /without credentials/);
});
