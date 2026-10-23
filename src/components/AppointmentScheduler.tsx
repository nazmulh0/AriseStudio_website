"use client";

import { useState, useEffect, useCallback, useMemo, useSyncExternalStore, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Clock,
  Video,
  CheckCircle2,
  Calendar as CalendarIcon,
  ArrowRight,
  Globe,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Lock,
} from "lucide-react";

import type { BookingHost } from "@/lib/bookingHost";

import { bookingSlots, bookingStartIso, bookingTimezones, HOST_TIMEZONE, hostToday, formatBookingDate, formatBookingTime, formatBookingRange, googleCalendarUrl } from "@/lib/booking";

interface DaySchedule {
  dayName: string;
  dayShort: string;
  dateNumber: number;
  fullDate: string;
  slots: string[];
}

const emptySubscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

const defaultSlotsByWeekday: Record<number, string[]> = Object.fromEntries(
  Array.from({ length: 7 }, (_, day) => [day, day === 5 ? [] : bookingSlots]),
);

const dayShortNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const dayFullNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function generateRollingSchedule(
  daysCount: number = 7,
  refDate: Date = new Date(),
): DaySchedule[] {
  const days: DaySchedule[] = [];
  for (let i = 0; i < daysCount; i++) {
    const d = new Date(refDate);
    d.setDate(refDate.getDate() + i);
    const dayOfWeek = d.getDay();
    const dayName = dayFullNames[dayOfWeek];
    const dayShort = dayShortNames[dayOfWeek];
    const dateNumber = d.getDate();
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    const fullDate = `${dayName}, ${month} ${dateNumber}, ${year}`;
    days.push({
      dayName,
      dayShort,
      dateNumber,
      fullDate,
      slots: defaultSlotsByWeekday[dayOfWeek] || [],
    });
  }
  return days;
}

export default function AppointmentScheduler({ host }: { host: BookingHost }) {
  const isClient = useIsClient();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const refresh = () => setNow(new Date());
    const initial = setTimeout(refresh, 0);
    const timer = setInterval(refresh, 30000);
    return () => { clearTimeout(initial); clearInterval(timer); };
  }, []);
  const currentDate = useMemo(() => now ? hostToday(now) : null, [now]);
  const [scheduleRefDate, setScheduleRefDate] = useState<Date | null>(null);
  const [viewMonthState, setViewMonthState] = useState<number | null>(null);
  const [viewYearState, setViewYearState] = useState<number | null>(null);

  const activeRefDate = useMemo(
    () => scheduleRefDate || currentDate,
    [scheduleRefDate, currentDate],
  );
  const viewMonth =
    viewMonthState ?? (activeRefDate ? activeRefDate.getMonth() : 9);
  const viewYear =
    viewYearState ?? (activeRefDate ? activeRefDate.getFullYear() : 2026);

  const scheduleDays = useMemo(
    () => (activeRefDate ? generateRollingSchedule(7, activeRefDate) : []),
    [activeRefDate],
  );

  const isPrevMonthDisabled = useMemo(() => {
    if (!currentDate) return true;
    const currentY = currentDate.getFullYear();
    const currentM = currentDate.getMonth();
    return (
      viewYear < currentY || (viewYear === currentY && viewMonth <= currentM)
    );
  }, [currentDate, viewYear, viewMonth]);

  const isPrevWeekDisabled = useMemo(() => {
    if (!currentDate) return true;
    const base = scheduleRefDate || currentDate;
    const todayMidnight = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    ).getTime();
    const baseMidnight = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate(),
    ).getTime();
    return baseMidnight <= todayMidnight;
  }, [currentDate, scheduleRefDate]);

  const handlePrevMonth = () => {
    if (isPrevMonthDisabled) return;
    if (viewMonth === 0) {
      setViewMonthState(11);
      setViewYearState(viewYear - 1);
    } else {
      setViewMonthState(viewMonth - 1);
      setViewYearState(viewYear);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonthState(0);
      setViewYearState(viewYear + 1);
    } else {
      setViewMonthState(viewMonth + 1);
      setViewYearState(viewYear);
    }
  };

  const handlePrevWeek = () => {
    if (isPrevWeekDisabled || !currentDate) return;
    const base = scheduleRefDate || currentDate;
    const newRef = new Date(base);
    newRef.setDate(base.getDate() - 7);
    const todayMidnight = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    if (newRef < todayMidnight) {
      newRef.setTime(todayMidnight.getTime());
    }
    setScheduleRefDate(newRef);
    setViewYearState(newRef.getFullYear());
    setViewMonthState(newRef.getMonth());
    setSelectedDayIndex(0);
    setSelectedSlot(null);
  };

  const handleNextWeek = () => {
    if (!currentDate) return;
    const base = scheduleRefDate || currentDate;
    const newRef = new Date(base);
    newRef.setDate(base.getDate() + 7);
    setScheduleRefDate(newRef);
    setViewYearState(newRef.getFullYear());
    setViewMonthState(newRef.getMonth());
    setSelectedDayIndex(0);
    setSelectedSlot(null);
  };

  const handleCalendarDayClick = (
    dayNum: number,
    monthIdx: number,
    yearNum: number,
  ) => {
    if (!currentDate) return;
    const targetDate = new Date(yearNum, monthIdx, dayNum);
    const todayMidnight = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    if (targetDate < todayMidnight) return;

    setScheduleRefDate(targetDate);
    setViewYearState(yearNum);
    setViewMonthState(monthIdx);
    setSelectedDayIndex(0);
    setSelectedSlot(null);
  };

  const dateRangeLabel = useMemo(() => {
    if (!scheduleDays || scheduleDays.length === 0) return "";
    const first = scheduleDays[0];
    const last = scheduleDays[scheduleDays.length - 1];
    const firstParts = first.fullDate.split(", ");
    const lastParts = last.fullDate.split(", ");
    return `${firstParts[1]} – ${lastParts[1]}`;
  }, [scheduleDays]);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState<string>(
    HOST_TIMEZONE,
  );
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const [availability, setAvailability] = useState<"loading" | "ready" | "error">("loading");
  const [availabilityAttempt, setAvailabilityAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let loading = false;
    async function loadBookedSlots() {
      if (loading) return;
      loading = true;
      try {
        const res = await fetch("/api/schedule", { cache: "no-store", signal: controller.signal });
        const data = await res.json();
        if (!res.ok || !data.success || !Array.isArray(data.bookedSlots)) throw new Error("Availability unavailable");
        if (!controller.signal.aborted) { setBookedSlots(data.bookedSlots); setAvailability("ready"); }
      } catch {
        if (!controller.signal.aborted) setAvailability("error");
      } finally { loading = false; }
    }
    const refresh = () => { if (document.visibilityState === "visible") void loadBookedSlots(); };
    loadBookedSlots();
    const timer = setInterval(refresh, 30000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      controller.abort(); clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [availabilityAttempt]);

  const isSlotBooked = (dayFullDate: string, slotTime: string) => {
    const key = `${dayFullDate.trim()}_${slotTime.trim()}`.toLowerCase();
    return bookedSlots.some((s) => s.trim().toLowerCase() === key);
  };

  // Form State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "confirmed" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<{
    date: string;
    timeSlot: string;
    timezone: string;
    meetUrl: string;
    startIso: string;
    emailSent: boolean;
    gcalStatus: string;
  } | null>(null);

  const [recoveryToken, setRecoveryToken] = useState<string | null>(null);
  const recoveryRef = useRef<string | null>(null);
  const [recoveryNotice, setRecoveryNotice] = useState("");
  const [retrying, setRetrying] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const applyReceipt = useCallback((data: { emailSent: boolean; booking: { date: string; timeSlot: string; timezone: string; googleMeetUrl: string; startIso: string; gcalStatus: string; name: string; email: string; phone: string; notes: string } }) => {
    setConfirmedBooking({ date: data.booking.date, timeSlot: data.booking.timeSlot, timezone: data.booking.timezone,
      meetUrl: data.booking.googleMeetUrl, startIso: data.booking.startIso, emailSent: data.emailSent, gcalStatus: data.booking.gcalStatus });
    setFormData({ name: data.booking.name, email: data.booking.email, phone: data.booking.phone, notes: data.booking.notes });
    setBookedSlots(previous => Array.from(new Set([...previous, `${data.booking.date}_${data.booking.timeSlot}`])));
    setIsBookingOpen(false); setStatus("confirmed"); setRecoveryNotice("");
  }, []);

  const recoveryInterval = confirmedBooking?.gcalStatus === "cancelled" ? 0 : confirmedBooking?.meetUrl && confirmedBooking.emailSent ? 30000 : 5000;
  useEffect(() => {
    if (status === "loading") return;
    let token = recoveryToken;
    try { token ||= sessionStorage.getItem("arisestudio.booking"); } catch { /* Storage may be disabled. */ }
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return;
    recoveryRef.current = token;
    const controller = new AbortController();
    let loading = false;
    const refresh = async () => {
      if (loading || document.visibilityState !== "visible") return;
      loading = true;
      try {
        const response = await fetch("/api/schedule/booking", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: controller.signal });
        if (response.status === 404) {
          try { sessionStorage.removeItem("arisestudio.booking"); } catch { /* Storage may be disabled. */ }
          recoveryRef.current = null; setRecoveryToken(null); return;
        }
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error("Could not refresh your saved booking. Please try again shortly.");
        if (!controller.signal.aborted) { applyReceipt(data); setRecoveryToken(token); }
      } catch (error) {
        if (!controller.signal.aborted) setRecoveryNotice(error instanceof Error ? error.message : "Could not refresh your saved booking.");
      } finally { loading = false; }
    };
    void refresh();
    const timer = recoveryInterval ? setInterval(() => { void refresh(); }, recoveryInterval) : undefined;
    const onFocus = () => { void refresh(); };
    window.addEventListener("focus", onFocus);
    return () => { controller.abort(); clearInterval(timer); window.removeEventListener("focus", onFocus); };
  }, [recoveryToken, status, applyReceipt, recoveryInterval]);

  const retryDelivery = async () => {
    if (!recoveryToken) return;
    setRetrying(true); setRecoveryNotice("");
    try {
      const response = await fetch("/api/schedule/booking", { method: "POST", headers: { Authorization: `Bearer ${recoveryToken}` } });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not retry your saved booking.");
      applyReceipt(data);
      setRecoveryNotice("Checking your saved booking again. This page will update automatically.");
    } catch (error) { setRecoveryNotice(error instanceof Error ? error.message : "Could not retry your saved booking."); }
    finally { setRetrying(false); }
  };

  const activeDay = scheduleDays[selectedDayIndex] || scheduleDays[0];

  const selectedStart = activeDay && selectedSlot ? bookingStartIso(activeDay.fullDate, selectedSlot) : null;
  const formattedSlotRange = selectedStart ? formatBookingRange(selectedStart, selectedTimezone) : "";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const modalOpen = isBookingOpen && status !== "confirmed";
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!modalOpen || !dialog) return;
    const trigger = document.activeElement;
    dialog.showModal();
    dialog.querySelector("input")?.focus();
    return () => {
      dialog.close();
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
    };
  }, [modalOpen]);

  const handleSlotSelect = (dayIdx: number, slot: string) => {
    const targetDay = scheduleDays[dayIdx];
    const start = targetDay && bookingStartIso(targetDay.fullDate, slot);
    if (!start || !now || Date.parse(start) <= now.getTime() || availability !== "ready" || isSlotBooked(targetDay.fullDate, slot)) return;
    setSelectedDayIndex(dayIdx);
    setSelectedSlot(slot);
    setIsBookingOpen(true);
    setErrorMessage("");
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !activeDay || isSlotBooked(activeDay.fullDate, selectedSlot)) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const token = recoveryRef.current || Array.from(crypto.getRandomValues(new Uint8Array(32)), value => value.toString(16).padStart(2, "0")).join("");
      recoveryRef.current = token;
      try { sessionStorage.setItem("arisestudio.booking", token); } catch { /* The current page still holds the recovery token. */ }
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: activeDay.fullDate,
          timeSlot: selectedSlot,
          timezone: selectedTimezone,
          notes: formData.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 409) {
          setBookedSlots(prev => [...prev, `${activeDay.fullDate}_${selectedSlot}`]);
          setIsBookingOpen(false);
          setAvailability("loading");
          setAvailabilityAttempt(attempt => attempt + 1);
        }
        throw new Error(data.error || "Failed to schedule appointment.");
      }

      applyReceipt(data);
      setRecoveryToken(token);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Network error. Please try again.",
      );
    }
  };

  const calendarUrl = confirmedBooking ? googleCalendarUrl(confirmedBooking.startIso,
    `30 minutes with ${host.name} | AriseStudio`,
    `Technical Discovery Call with AriseStudio.\nAttendee: ${formData.name} (${formData.phone})\nEmail: ${formData.email}\nHost: ${host.name} (${host.title})\nGoogle Meet: ${confirmedBooking.meetUrl}`,
    confirmedBooking.meetUrl) : "#";

  const monthHeader = `${monthNames[viewMonth]} ${viewYear}`;

  return (
    <div className="w-full max-w-7xl mx-auto rounded-3xl bg-[#09101d]/90 backdrop-blur-xl border border-white/[0.08] shadow-2xl p-5 sm:p-7 relative">
      {/* Sleek Integrated Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/[0.06]">
        {/* Host Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#004157] to-[#0a814f] border border-emerald-400/50 flex items-center justify-center text-xs font-mono font-bold text-emerald-300 shrink-0 shadow-sm">
            {host.initials}
          </div>
          <div className="leading-tight">
            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
              <span>{host.name}</span>
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-mono text-emerald-400 font-normal">{host.title}</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono mt-0.5">
              <Clock className="w-3 h-3 text-emerald-400/80" />
              <span>30 min</span>
              <span>•</span>
              <Video className="w-3 h-3 text-sky-400/80" />
              <span>Google Meet</span>
            </div>
          </div>
        </div>

        {/* Timezone Selector & Open/Extend Calendar Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-white/[0.08] text-xs font-mono text-slate-300">
            <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              aria-label="Display timezone"
              value={selectedTimezone}
              onChange={(e) => setSelectedTimezone(e.target.value)}
              className="bg-transparent border-none text-slate-200 focus:outline-none cursor-pointer pr-1 text-xs"
            >
              {bookingTimezones.map((tz) => (
                <option
                  key={tz.value}
                  value={tz.value}
                  className="bg-[#09101d] text-slate-200"
                >
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!isClient || !currentDate || scheduleDays.length === 0 ? (
        <div className="w-full py-16 sm:py-20 text-center flex items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
          <span className="text-sm font-mono">
            Loading available appointment dates...
          </span>
        </div>
      ) : status === "confirmed" && confirmedBooking ? (
        /* Confirmed Success View (No inner nested card) */
        <div className="py-6 sm:py-10 text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-6 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            {confirmedBooking.gcalStatus === "cancelled" ? "Session Cancelled" : "Slot Reserved"}
          </span>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
            {confirmedBooking.gcalStatus === "cancelled" ? "This session has been cancelled" : confirmedBooking.meetUrl ? "Your 30-Min Architecture Call is Scheduled!" : confirmedBooking.gcalStatus === "failed" ? "Your slot is saved. Meeting setup needs another attempt." : "Your slot is saved. We are preparing your meeting."}
          </h3>

          <p className="text-slate-300 text-sm max-w-lg mx-auto mt-2 leading-relaxed">
            Your session with {host.name}, {host.title}. {confirmedBooking.gcalStatus === "cancelled" ? <>Please choose a new time below.</> : confirmedBooking.emailSent ? <>Confirmation details have been emailed to <strong>{formData.email}</strong>.</> : <>Confirmation email is pending. We will retry it; you can also save these details.</>}
          </p>

          <div className="my-8 max-w-md mx-auto p-5 rounded-2xl bg-[#004157]/30 border border-white/[0.08] text-left space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-400">Date:</span>
              <span className="text-white font-bold">
                {formatBookingDate(confirmedBooking.startIso, confirmedBooking.timezone)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-400">Time:</span>
              <span className="text-emerald-400 font-bold">
                {formatBookingRange(confirmedBooking.startIso, confirmedBooking.timezone)}
              </span>
            </div>
            {confirmedBooking.meetUrl ? (
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-slate-400">Google Meet Link:</span>
                <a
                  href={confirmedBooking.meetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:text-sky-300 underline break-all flex items-center gap-1 font-semibold"
                >
                  {confirmedBooking.meetUrl}
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            ) : (
              <div className="flex flex-col gap-1 pt-1">
                <span className="text-slate-400">Video Conference:</span>
                <span className="text-slate-200">
                  {confirmedBooking.gcalStatus === "cancelled" ? "This appointment is cancelled. Please do not use its previous meeting link." : confirmedBooking.gcalStatus === "failed" ? "We could not finish meeting setup. Retry this saved booking below or contact us; you do not need to reserve another slot." : "Meeting setup is pending. We are checking the same booking and will update this page when the link is ready."}
                </span>
              </div>
            )}
          </div>

          {recoveryNotice && <p role="status" className="mb-4 text-sm text-amber-300">{recoveryNotice}</p>}
          {confirmedBooking.gcalStatus !== "cancelled" && (!confirmedBooking.meetUrl || !confirmedBooking.emailSent) && <button type="button" disabled={retrying || !recoveryToken} onClick={retryDelivery} className="mb-5 px-5 py-2 rounded-xl border border-emerald-500/50 text-emerald-300 text-sm disabled:opacity-50">{retrying ? "Checking…" : "Retry meeting / email delivery"}</button>}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {confirmedBooking.gcalStatus !== "cancelled" && <a
              href={calendarUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all text-xs shadow-lg shadow-emerald-500/20"
            >
              <CalendarIcon className="w-4 h-4" />
              Add to Google Calendar
            </a>}
            <button
              onClick={() => {
                try { sessionStorage.removeItem("arisestudio.booking"); } catch { /* Storage may be disabled. */ }
                recoveryRef.current = null; setRecoveryToken(null); setConfirmedBooking(null);
                setStatus("idle");
                setIsBookingOpen(false);
                setSelectedSlot(null);
              }}
              className="px-6 py-3 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors text-xs"
            >
              Schedule Another Call
            </button>
          </div>
        </div>
      ) : (
        /* Main Schedule Section - Single Card Interface */
        <div className="pt-2">
          <p className="text-xs text-slate-400 mb-3">Calendar columns follow Bangladesh dates. Slot times are shown in your selected timezone; dates are included when they differ.</p>
          {availability !== "ready" && <div role={availability === "error" ? "alert" : "status"} className="mb-4 text-sm text-amber-300">
            {availability === "loading" ? "Checking available slots…" : <>Availability is temporarily unavailable. <button type="button" className="underline" onClick={() => { setAvailability("loading"); setAvailabilityAttempt(n => n + 1); }}>Try again</button></>}
          </div>}
          {status === "error" && !isBookingOpen && <p role="alert" className="text-sm text-rose-300 mb-4">{errorMessage}</p>}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-white/[0.06]">
            <h3 className="text-base sm:text-lg font-bold text-white">
              Select an appointment time
            </h3>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                {dateRangeLabel}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrevWeek}
                  disabled={isPrevWeekDisabled}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-white/[0.08] text-slate-300 hover:text-white hover:border-emerald-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Previous 7 Days"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextWeek}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-white/[0.08] text-slate-300 hover:text-white hover:border-emerald-500/40 transition-all"
                  title="Next 7 Days"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-7 items-start">
            {/* Left Mini Calendar - Clean & Borderless (No inner card) */}
            <div className="w-full lg:w-[245px] shrink-0 space-y-4 pb-6 lg:pb-0 border-b lg:border-b-0 lg:border-r border-white/[0.06] lg:pr-6">
              <div className="flex items-center justify-between pb-2">
                <span className="text-sm font-bold text-white font-mono">
                  {monthHeader}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    disabled={isPrevMonthDisabled}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                    title="Previous month"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Next month"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Initials */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono text-slate-500 font-semibold">
                <span>S</span>
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
              </div>

              {/* Calendar Days Matrix */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono">
                {/* Preceding days from previous month */}
                {Array.from(
                  {
                    length: new Date(viewYear, viewMonth, 1).getDay(),
                  },
                  (_, i) => {
                    const prevMonthDays = new Date(
                      viewYear,
                      viewMonth,
                      0,
                    ).getDate();
                    const firstDay = new Date(
                      viewYear,
                      viewMonth,
                      1,
                    ).getDay();
                    const dayNum = prevMonthDays - firstDay + 1 + i;
                    return (
                      <span
                        key={`prev-${i}`}
                        className="w-7 h-7 mx-auto flex items-center justify-center text-slate-700"
                      >
                        {dayNum}
                      </span>
                    );
                  },
                )}

                {/* Current month days */}
                {Array.from(
                  {
                    length: new Date(
                      viewYear,
                      viewMonth + 1,
                      0,
                    ).getDate(),
                  },
                  (_, i) => {
                    const dayNum = i + 1;
                    const targetDate = new Date(viewYear, viewMonth, dayNum);
                    const todayMidnight = currentDate
                      ? new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth(),
                          currentDate.getDate(),
                        )
                      : null;
                    const isPast = todayMidnight ? targetDate < todayMidnight : false;

                    const schedIdx = scheduleDays.findIndex((sd) => {
                      const d = new Date(sd.fullDate);
                      return (
                        d.getDate() === dayNum &&
                        d.getMonth() === viewMonth &&
                        d.getFullYear() === viewYear
                      );
                    });
                    const isSchedDay = schedIdx !== -1;
                    const isSelected =
                      isSchedDay && selectedDayIndex === schedIdx;
                    const dayOfWeek = targetDate.getDay();
                    const isClosed = defaultSlotsByWeekday[dayOfWeek]?.length === 0;

                    if (isPast) {
                      return (
                        <span
                          key={dayNum}
                          className="w-7 h-7 mx-auto flex items-center justify-center text-slate-700 cursor-not-allowed"
                        >
                          {dayNum}
                        </span>
                      );
                    }

                    return (
                      <button
                        key={dayNum}
                        type="button"
                        disabled={isClosed}
                        onClick={() => {
                          if (isSchedDay) {
                            setSelectedDayIndex(schedIdx);
                          } else {
                            handleCalendarDayClick(dayNum, viewMonth, viewYear);
                          }
                        }}
                        className={`w-7 h-7 mx-auto flex items-center justify-center rounded-full font-bold transition-all ${
                          isSelected
                            ? "bg-emerald-500 text-slate-950 ring-2 ring-emerald-400 shadow-md scale-105"
                            : isSchedDay
                              ? "bg-slate-800/80 text-emerald-300 hover:bg-emerald-500/20 cursor-pointer"
                              : isClosed
                                ? "text-slate-600 cursor-not-allowed"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                        }`}
                        title={
                          isClosed
                            ? "Studio closed (Maintenance)"
                            : `Select ${monthNames[viewMonth]} ${dayNum}`
                        }
                      >
                        {dayNum}
                      </button>
                    );
                  },
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>Highlighted dates have open slots</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <span>Fridays reserved for maintenance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                  <span>Locked slots are already booked</span>
                </div>
              </div>
            </div>

            {/* Right Days & Pill Slot Columns */}
            <div className="flex-1 w-full min-w-0 overflow-x-auto lg:overflow-x-visible pb-2">
              <div className="min-w-[560px] lg:min-w-0">
                {/* Day Headers Row */}
                <div className="grid grid-cols-7 gap-2 sm:gap-2.5 pb-4 text-center">
                  {scheduleDays.map((day, idx) => {
                    const isSelected = selectedDayIndex === idx;
                    return (
                      <div
                        key={day.dateNumber}
                        className="flex flex-col items-center"
                      >
                        <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">
                          {day.dayShort}
                        </span>
                        <button
                          onClick={() => setSelectedDayIndex(idx)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                            isSelected
                              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105"
                              : "bg-slate-800/80 text-slate-200 hover:bg-slate-700"
                          }`}
                        >
                          {day.dateNumber}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Slots Columns */}
                <div className="grid grid-cols-7 gap-2 sm:gap-2.5 pt-2 items-start">
                  {scheduleDays.map((day, dIdx) => (
                    <div key={day.dateNumber} className="space-y-2">
                      {day.slots.length > 0 ? (
                        day.slots.map((slot) => {
                          const isBooked = isSlotBooked(day.fullDate, slot);
                          const start = bookingStartIso(day.fullDate, slot)!;
                          const isPast = !now || Date.parse(start) <= now.getTime();
                          const disabled = isBooked || isPast || availability !== "ready";
                          const displayTime = formatBookingTime(start, selectedTimezone, false);
                          const displayDate = formatBookingDate(start, selectedTimezone);
                          const differentDate = displayDate !== day.fullDate;
                          const isPicked =
                            selectedDayIndex === dIdx && selectedSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={disabled}
                              onClick={() => !disabled && handleSlotSelect(dIdx, slot)}
                              className={`w-full py-2 px-1 text-center rounded-xl sm:rounded-full text-xs font-mono font-medium transition-all duration-150 border flex items-center justify-center gap-1.5 whitespace-nowrap ${
                                disabled
                                  ? "bg-slate-950/50 text-slate-500 border-slate-800/60 select-none cursor-not-allowed disabled:cursor-not-allowed hover:border-slate-800/60 hover:bg-slate-950/50"
                                  : isPicked
                                    ? "bg-emerald-400 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/30 cursor-pointer"
                                    : "bg-slate-900/90 text-slate-200 border-slate-800 hover:border-emerald-500/50 hover:bg-[#004157]/40 hover:text-white cursor-pointer"
                              }`}
                              title={isBooked ? `${displayDate} ${displayTime} (Booked)`
                                : isPast ? "This appointment time has passed"
                                : availability !== "ready" ? "Availability is not confirmed yet"
                                : `Select ${displayDate} ${displayTime}`}
                              aria-label={`${displayDate}, ${displayTime}${isBooked ? ", booked" : isPast ? ", passed" : ""}`}
                            >
                              {isBooked && (
                                <Lock className="w-3 h-3 text-slate-500/80 shrink-0" />
                              )}
                              <span>{displayTime}{differentDate && <span className="block text-[10px]">{new Date(start).toLocaleDateString("en-US", { timeZone: selectedTimezone, month: "short", day: "numeric" })}</span>}</span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="py-6 text-center text-slate-600 font-mono text-sm">
                          —
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Slide-In Modal / Panel rendered via Portal to escape backdrop-filter */}
      {isBookingOpen && status !== "confirmed" && isClient && typeof document !== "undefined" && createPortal(
        <dialog
          ref={dialogRef}
          aria-labelledby="booking-dialog-title"
          onCancel={(event) => { event.preventDefault(); if (status !== "loading") setIsBookingOpen(false); }}
          onClick={(event) => { if (event.target === event.currentTarget && status !== "loading") setIsBookingOpen(false); }}
          className="m-auto w-[calc(100%-2rem)] max-w-md max-h-[90vh] overflow-y-auto p-0 bg-transparent text-slate-100 backdrop:bg-black/80 backdrop:backdrop-blur-md"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-[#09101d] border border-white/[0.12] p-5 sm:p-6 shadow-2xl relative text-left animate-in zoom-in-95 duration-150"
          >
            {/* Header matching Google Calendar style */}
            <div className="flex items-start justify-between pb-3 border-b border-white/[0.08]">
              <div className="space-y-1">
                <h3 id="booking-dialog-title" className="text-lg font-bold text-white tracking-tight">
                  30 minutes with AriseStudio
                </h3>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-medium">
                  <CalendarIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    {selectedStart ? formatBookingDate(selectedStart, selectedTimezone) : ""} · {formattedSlotRange}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>
                      {selectedTimezone}
                    </span>
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-sans font-medium">
                    <Video className="w-3 h-3 shrink-0" />
                    <span>Google Meet</span>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBookingOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                title="Close"
                aria-label="Close booking dialog"
                disabled={status === "loading"}
              >
                ✕
              </button>
            </div>

            {status === "error" && (
              <div role="alert" className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="mt-4 space-y-3">
              <div>
                <label htmlFor="booking-name" className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Full Name <span className="text-emerald-400">*</span>
                </label>
                <input
                  id="booking-name"
                  disabled={status === "loading"}
                  maxLength={120}
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Mahir Zaman"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs sm:text-sm focus:border-emerald-400 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              <div>
                <label htmlFor="booking-email" className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Email Address <span className="text-emerald-400">*</span>
                </label>
                <input
                  id="booking-email"
                  disabled={status === "loading"}
                  maxLength={254}
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="mahir@company.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs sm:text-sm focus:border-emerald-400 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              <div>
                <label htmlFor="booking-phone" className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Phone Number <span className="text-emerald-400">*</span>
                </label>
                <input
                  id="booking-phone"
                  disabled={status === "loading"}
                  maxLength={64}
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+880 1700-000000"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs sm:text-sm focus:border-emerald-400 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              <div>
                <label htmlFor="booking-notes" className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Project Notes (Optional)
                </label>
                <input
                  id="booking-notes"
                  disabled={status === "loading"}
                  maxLength={5000}
                  type="text"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Questions or topics you would like to discuss..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs sm:text-sm focus:border-emerald-400 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Reserving Slot...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm 30-Min Call</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </dialog>,
        document.body
      )}
    </div>
  );
}
