"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import HeroAmbientCanvas from "@/components/HeroAmbientCanvas";
import TiltCard from "@/components/TiltCard";
import MagneticElement from "@/components/MagneticElement";
import {
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MessageSquare,
  AlertCircle,
  Loader2,
  RefreshCw,
  Calendar
} from "lucide-react";

function getInitialService(serviceParam: string, roleParam: string): string {
  if (roleParam) return "careers-application";
  if (serviceParam) {
    if (serviceParam.includes("ecommerce") || serviceParam.includes("retail")) return "e-commerce-automation";
    if (serviceParam.includes("erp") || serviceParam.includes("crm") || serviceParam.includes("manufacturing")) return "custom-erp-crm";
    if (serviceParam.includes("automation") || serviceParam.includes("logistics") || serviceParam.includes("finance")) return "process-automation";
    if (serviceParam.includes("it") || serviceParam.includes("cloud")) return "managed-it-support";
    if (serviceParam.includes("arisesell")) return "arisesell-deployment";
  }
  return "e-commerce-automation";
}

function getInitialMessage(roleParam: string, messageParam: string): string {
  if (roleParam) {
    return `Hello AriseStudio Team,\n\nI would like to apply for the position: ${roleParam}.\n\n`;
  }
  return messageParam.slice(0, 5000);
}

function ContactForm() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service") || searchParams.get("industry") || "";
  const roleParam = searchParams.get("apply") || "";

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [notificationPending, setNotificationPending] = useState(false);
  const [formData, setFormData] = useState(() => {
    const service = getInitialService(serviceParam, roleParam);
    const career = service === "careers-application";
    return {
      name: "",
      email: "",
      phone: "",
      company: "",
      service,
      budget: career ? "1 - 3 Years" : "$3,000 - $8,000",
      message: getInitialMessage(roleParam, searchParams.get("message") || ""),
    };
  });

  const isCareer = formData.service === "careers-application";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit consultation request. Please try again.");
      }

      setNotificationPending(!data.emailSent);
      setStatus("success");
    } catch (err: unknown) {
      console.error("[Submission Error]:", err);
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Network error. Please try again or email us directly."
      );
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setNotificationPending(false);
    setErrorMessage("");
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      service: getInitialService(serviceParam, roleParam),
      budget: roleParam ? "1 - 3 Years" : "$3,000 - $8,000",
      message: getInitialMessage(roleParam, searchParams.get("message") || "")
    });
  };

  return (
    <div className="p-6 sm:p-10 rounded-3xl enterprise-card relative">
      {status === "success" ? (
        <div role="status" className="py-12 text-center space-y-5">
          <div className="w-20 h-20 rounded-full bg-accent/10 border-2 border-accent text-accent mx-auto flex items-center justify-center shadow-sm ">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-semibold text-ink">
            {isCareer ? "Application Received!" : "Consultation Request Received!"}
          </h3>
          <p className="text-muted max-w-md mx-auto text-sm leading-relaxed">
            {notificationPending ? (
              <>Thank you, <strong>{formData.name}</strong>. Your {isCareer ? "application" : "request"} is saved, but we could not notify our team yet. For urgent help, email <a href="mailto:contact@arisestudio.com" className="underline">contact@arisestudio.com</a>.</>
            ) : isCareer ? (
              <>Thank you, <strong className="text-ink">{formData.name}</strong>. Your application has been logged into our talent review queue. Our engineering leadership will review your profile and reach out via <strong className="text-ink">{formData.email}</strong>.</>
            ) : (
              <>Thank you, <strong className="text-ink">{formData.name}</strong>. Your consultation inquiry regarding <strong className="text-accent">{formData.service}</strong> has been logged into our engineering dispatch queue. An architect will reach out via <strong className="text-ink">{formData.email}</strong> within 24 hours.</>
            )}
          </p>
          <div className="pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent/10 hover:bg-accent border border-accent/40 text-sm font-semibold text-ink transition-colors "
            >
              <RefreshCw className="w-4 h-4" />
              {isCareer ? "Submit Another Application" : "Submit Another Inquiry"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form space-y-6">
          {status === "error" && (
            <div role="alert" className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Submission Failed</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold text-muted mb-2">
                Your Full Name *
              </label>
              <input id="contact-name"
                type="text"
                required
                disabled={status === "loading"}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Farhan Rahman"
                className="w-full px-4 py-3 rounded-xl bg-canvas border border-line text-ink placeholder:text-subtle focus:border-accent text-base sm:text-sm disabled:opacity-60 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-xs font-semibold text-muted mb-2">
                {isCareer ? "Email Address *" : "Corporate Email *"}
              </label>
              <input id="contact-email"
                type="email"
                required
                disabled={status === "loading"}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={isCareer ? "you@example.com" : "farhan@company.com"}
                className="w-full px-4 py-3 rounded-xl bg-canvas border border-line text-ink placeholder:text-subtle focus:border-accent text-base sm:text-sm disabled:opacity-60 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contact-phone" className="block text-xs font-semibold text-muted mb-2">
                Phone / WhatsApp
              </label>
              <input id="contact-phone"
                type="tel"
                disabled={status === "loading"}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+880 17... / +1 ..."
                className="w-full px-4 py-3 rounded-xl bg-canvas border border-line text-ink placeholder:text-subtle focus:border-accent text-base sm:text-sm disabled:opacity-60 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="contact-company" className="block text-xs font-semibold text-muted mb-2">
                {isCareer ? "Portfolio / GitHub / LinkedIn" : "Company Name"}
              </label>
              <input id="contact-company"
                type="text"
                disabled={status === "loading"}
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder={isCareer ? "https://github.com/... or linkedin.com/..." : "Your Organization"}
                className="w-full px-4 py-3 rounded-xl bg-canvas border border-line text-ink placeholder:text-subtle focus:border-accent text-base sm:text-sm disabled:opacity-60 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contact-service" className="block text-xs font-semibold text-muted mb-2">
                Primary Service Needed
              </label>
              <select id="contact-service"
                disabled={status === "loading"}
                value={formData.service}
                onChange={(e) => {
                  const newService = e.target.value;
                  const isNowCareer = newService === "careers-application";
                  const wasCareer = formData.service === "careers-application";
                  let newBudget = formData.budget;
                  if (isNowCareer && !wasCareer) newBudget = "1 - 3 Years";
                  if (!isNowCareer && wasCareer) newBudget = "$3,000 - $8,000";
                  setFormData({ ...formData, service: newService, budget: newBudget });
                }}
                className="w-full px-4 py-3 rounded-xl bg-canvas border border-line text-ink focus:border-accent text-base sm:text-sm disabled:opacity-60"
              >
                <option value="e-commerce-automation">E-Commerce Automation System</option>
                <option value="arisesell-deployment">AriseSell Platform Deployment</option>
                <option value="custom-erp-crm">Custom ERP / CRM Engineering</option>
                <option value="process-automation">Business Process RPA & AI</option>
                <option value="managed-it-support">24/7 Managed IT & Cloud Support</option>
                <option value="careers-application">Careers Application</option>
                <option value="other">Full Custom Solution</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-budget" className="block text-xs font-semibold text-muted mb-2">
                {isCareer ? "Years of Experience" : "Estimated Budget Bracket"}
              </label>
              <select id="contact-budget"
                disabled={status === "loading"}
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-canvas border border-line text-ink focus:border-accent text-base sm:text-sm disabled:opacity-60"
              >
                {isCareer ? (
                  <>
                    <option value="Student / Entry-Level">Student / Entry-Level</option>
                    <option value="1 - 3 Years">1 – 3 Years Experience</option>
                    <option value="3 - 5 Years">3 – 5 Years Experience</option>
                    <option value="5+ Years Senior">5+ Years Senior / Lead</option>
                  </>
                ) : (
                  <>
                    <option value="$1,000 - $3,000">$1,000 – $3,000 (Starter Module)</option>
                    <option value="$3,000 - $8,000">$3,000 – $8,000 (Growth Automation)</option>
                    <option value="$8,000 - $25,000">$8,000 – $25,000 (Full Enterprise ERP)</option>
                    <option value="$25,000+">$25,000+ (High-Scale Architecture)</option>
                    <option value="monthly-retainer">Monthly IT Support Retainer</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-xs font-semibold text-muted mb-2">
              {isCareer
                ? "Cover Note, Background & Core Skills *"
                : "Tell us about your project or current operational bottlenecks *"}
            </label>
              <textarea id="contact-message"
              required
              disabled={status === "loading"}
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={
                isCareer
                  ? "Share your core stack, relevant projects or open-source work, and what excites you about joining AriseStudio..."
                  : "Describe your current systems, what you wish to automate, and your target completion timeline..."
              }
              className="w-full px-4 py-3 rounded-xl bg-canvas border border-line text-ink placeholder:text-subtle focus:border-accent text-base sm:text-sm disabled:opacity-60 transition-colors"
            />
          </div>

          <p className="text-xs leading-relaxed text-muted">We use your details to respond to this request. <Link href="/privacy" className="font-semibold text-accent underline underline-offset-4">Privacy notice</Link></p>
          <MagneticElement strength={0.15} className="w-full">
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-4 rounded-full font-semibold text-on-accent bg-accent hover:bg-accent-strong transition-colors shadow-sm flex items-center justify-center gap-2 text-sm disabled:opacity-75 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(44,199,138,0.25)]"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isCareer ? "Submitting Application..." : "Sending Consultation Request..."}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{isCareer ? "Submit Application" : "Submit Consultation Request"}</span>
                </>
              )}
            </button>
          </MagneticElement>
        </form>
      )}
    </div>
  );
}

export default function ContactPage() {
  return (
    <div data-compact-footer className="pt-32 pb-24 relative bg-canvas overflow-hidden">
      <HeroAmbientCanvas />
      <div className="hero-ambient-glow" aria-hidden="true" />

      <div className="page-intro relative z-1">
        <span className="page-eyebrow">
          Contact the studio
        </span>
        <h1 className="motion-stagger-2 text-4xl sm:text-5xl font-semibold text-ink mt-4 tracking-tight leading-[1.15]">
          Let&apos;s build <br className="hidden sm:inline" />
          <span>a better workflow.</span>
        </h1>
        <p className="mt-4 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
          Tell us about your current workflow and where your team loses time. A systems engineer will review your note and respond within 24 hours with practical recommendations.
        </p>

        {/* Live Call Scheduler CTA */}
        <div className="mt-7 max-w-2xl p-4 rounded-2xl bg-surface border border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Prefer a 30-minute call?</p>
              <p className="text-xs text-muted">Pick an open slot on our Google Meet scheduler.</p>
            </div>
          </div>
          <MagneticElement strength={0.2}>
            <Link
              href="/schedule"
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-on-accent bg-accent hover:bg-accent-strong transition-colors shrink-0 shadow-sm"
            >
              Schedule a Call
            </Link>
          </MagneticElement>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Contact & Guarantees */}
          <div className="order-2 lg:order-1 lg:col-span-5 space-y-8">
            <TiltCard maxTilt={3} spotlightBorder={true} className="rounded-3xl">
              <div className="p-8 rounded-3xl enterprise-card space-y-6">
                <h3 className="text-xl font-semibold text-ink flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-accent" />
                  How to reach our engineers
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Whether you need ongoing 24/7 IT support, custom ERP development, or automation across your stores and warehouses, we are ready to help.
                </p>

                <div className="space-y-4 pt-2 text-sm">
                  <div className="flex items-start gap-3 text-muted">
                    <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-ink block">Headquarters:</strong>
                      Dhaka, Bangladesh (Partnering with clients across US, UK, EU, Middle East & APAC)
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-muted">
                    <Mail className="w-5 h-5 text-accent shrink-0" />
                    <div>
                      <strong className="text-ink block">Direct Email:</strong>
                      <a href="mailto:contact@arisestudio.com" className="text-accent hover:underline">
                        contact@arisestudio.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* SLA & Security Trust Badges */}
            <TiltCard maxTilt={3} spotlightBorder={true} className="rounded-2xl">
              <div className="p-6 rounded-2xl bg-surface border border-line space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted">
                  <Clock className="w-4 h-4 text-accent shrink-0" />
                  <span><strong>Response target:</strong> Under 24 hours on business days</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted">
                  <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                  <span><strong>Confidentiality:</strong> NDA available before sharing sensitive details</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span><strong>Technical discovery:</strong> Practical guidance with zero sales pressure</span>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Right Column: Suspense wrapped form */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <Suspense fallback={
              <div className="p-12 rounded-3xl enterprise-card text-center text-muted">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-accent mb-2" />
                <span>Loading consultation desk...</span>
              </div>
            }>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
