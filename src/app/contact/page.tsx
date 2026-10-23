"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Mail, 
  Phone, 
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
      service: "e-commerce-automation",
      budget: "$3,000 - $8,000",
      message: ""
    });
  };

  return (
    <div className="p-8 sm:p-12 rounded-3xl enterprise-card relative shadow-2xl">
      {status === "success" ? (
        <div className="py-12 text-center space-y-5 animate-in fade-in duration-300">
          <div className="w-20 h-20 rounded-full bg-[#004157]/40 border-2 border-[#10b981] text-[#10b981] mx-auto flex items-center justify-center shadow-lg shadow-[#10b981]/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            {isCareer ? "Application Received!" : "Consultation Request Received!"}
          </h3>
          <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed">
            {notificationPending ? (
              <>Thank you, <strong>{formData.name}</strong>. Your {isCareer ? "application" : "request"} is saved, but we could not notify our team yet. For urgent help, email <a href="mailto:contact@arisestudio.com" className="underline">contact@arisestudio.com</a>.</>
            ) : isCareer ? (
              <>Thank you, <strong className="text-white">{formData.name}</strong>. Your application has been logged into our talent review queue. Our engineering leadership will review your profile and reach out via <strong className="text-white">{formData.email}</strong>.</>
            ) : (
              <>Thank you, <strong className="text-white">{formData.name}</strong>. Your consultation inquiry regarding <strong className="text-[#a7f3d0]">{formData.service}</strong> has been logged into our engineering dispatch queue. An architect will reach out via <strong className="text-white">{formData.email}</strong> within 24 hours.</>
            )}
          </p>
          <div className="pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#004157]/60 hover:bg-[#004157] border border-[#10b981]/40 text-sm font-semibold text-white transition-all hover:scale-105"
            >
              <RefreshCw className="w-4 h-4" />
              {isCareer ? "Submit Another Application" : "Submit Another Inquiry"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {status === "error" && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-sm flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Submission Failed</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Your Full Name *
              </label>
              <input id="contact-name"
                type="text"
                required
                disabled={status === "loading"}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Farhan Rahman"
                className="w-full px-4 py-3 rounded-xl bg-[#09101d] border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#10b981] text-sm disabled:opacity-60 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                {isCareer ? "Email Address *" : "Corporate Email *"}
              </label>
              <input id="contact-email"
                type="email"
                required
                disabled={status === "loading"}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={isCareer ? "you@example.com" : "farhan@company.com"}
                className="w-full px-4 py-3 rounded-xl bg-[#09101d] border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#10b981] text-sm disabled:opacity-60 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contact-phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Phone / WhatsApp
              </label>
              <input id="contact-phone"
                type="tel"
                disabled={status === "loading"}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+880 17... / +1 ..."
                className="w-full px-4 py-3 rounded-xl bg-[#09101d] border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#10b981] text-sm disabled:opacity-60 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="contact-company" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                {isCareer ? "Portfolio / GitHub / LinkedIn" : "Company Name"}
              </label>
              <input id="contact-company"
                type="text"
                disabled={status === "loading"}
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder={isCareer ? "https://github.com/... or linkedin.com/..." : "Your Organization"}
                className="w-full px-4 py-3 rounded-xl bg-[#09101d] border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#10b981] text-sm disabled:opacity-60 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contact-service" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
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
                className="w-full px-4 py-3 rounded-xl bg-[#09101d] border border-slate-700/80 text-white focus:outline-none focus:border-[#10b981] text-sm disabled:opacity-60"
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
              <label htmlFor="contact-budget" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                {isCareer ? "Years of Experience" : "Estimated Budget Bracket"}
              </label>
              <select id="contact-budget"
                disabled={status === "loading"}
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#09101d] border border-slate-700/80 text-white focus:outline-none focus:border-[#10b981] text-sm disabled:opacity-60"
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
            <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
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
              className="w-full px-4 py-3 rounded-xl bg-[#09101d] border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#10b981] text-sm disabled:opacity-60 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-4 rounded-xl font-semibold text-slate-950 bg-[#10b981] hover:bg-[#34d399] transition-all shadow-lg shadow-[#10b981]/25 flex items-center justify-center gap-2 text-sm disabled:opacity-75 disabled:cursor-not-allowed hover:-translate-y-0.5"
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
        </form>
      )}
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 relative bg-[#09101d] overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-[#004157]/30 via-[#0a814f]/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-[#004157]/20 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-[#a7f3d0] bg-[#004157]/40 border border-[#10b981]/30">
          Get in Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
          Let&apos;s Engineer Your <br className="hidden sm:inline" />
          <span className="gradient-text-teal-emerald">System Together</span>
        </h1>
        <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
          Share your requirements with our solutions architects. We evaluate your workflow and respond within 24 hours with an actionable roadmap.
        </p>

        {/* Live Call Scheduler CTA */}
        <div className="mt-8 max-w-xl mx-auto p-4 rounded-2xl bg-[#004157]/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Prefer an instant 30-min live call?</p>
              <p className="text-xs text-slate-300">Pick an open slot on our Google Meet scheduler.</p>
            </div>
          </div>
          <Link
            href="/schedule"
            className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shrink-0 shadow-md shadow-emerald-500/20"
          >
            Schedule a Call
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Contact & Guarantees */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-3xl enterprise-card space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#10b981]" />
                AriseStudio Solutions Desk
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Whether you need immediate 24/7 IT support, a full ERP migration, or high-volume e-commerce automation, we are ready to assist.
              </p>

              <div className="space-y-4 pt-2 text-sm">
                <div className="flex items-start gap-3 text-slate-300">
                  <MapPin className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Headquarters:</strong>
                    Dhaka, Bangladesh (Serving clients globally across US, UK, EU & APAC)
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="w-5 h-5 text-[#10b981] shrink-0" />
                  <div>
                    <strong className="text-white block">Direct Email:</strong>
                    <a href="mailto:contact@arisestudio.com" className="text-[#38bdf8] hover:underline">
                      contact@arisestudio.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <Phone className="w-5 h-5 text-[#10b981] shrink-0" />
                  <div>
                    <strong className="text-white block">Direct Line:</strong>
                    <a href="tel:+8801700000000" className="text-slate-300 hover:text-white">
                      +880 (17) 0000-0000
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* SLA & Security Trust Badges */}
            <div className="p-6 rounded-2xl bg-[#09101d] border border-[#004157]/50 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Clock className="w-4 h-4 text-[#10b981] shrink-0" />
                <span><strong>Guaranteed Response:</strong> Under 24 hours on business days</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <ShieldCheck className="w-4 h-4 text-[#38bdf8] shrink-0" />
                <span><strong>Strict Confidentiality:</strong> NDA signed upon initial contact</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#a7f3d0] shrink-0" />
                <span><strong>Free Architecture Audit:</strong> No commitment or sales pressure</span>
              </div>
            </div>
          </div>

          {/* Right Column: Suspense wrapped form */}
          <div className="lg:col-span-7">
            <Suspense fallback={
              <div className="p-12 rounded-3xl enterprise-card text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#10b981] mb-2" />
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
