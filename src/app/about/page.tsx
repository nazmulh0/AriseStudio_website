import { pageMetadata } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";
import HeroAmbientCanvas from "@/components/HeroAmbientCanvas";
import TiltCard from "@/components/TiltCard";
import MagneticElement from "@/components/MagneticElement";
import KineticCounter from "@/components/KineticCounter";
import {
  Target,
  ArrowRight,
  Code2,
  Terminal,
  Sparkles,
  Lock,
  Server
} from "lucide-react";

export const metadata: Metadata = pageMetadata("About Us | AriseStudio", "Learn about AriseStudio - our engineering culture, architectural standards, leadership philosophy, and commitment to building resilient automation systems.", "/about");

const principles = [
  {
    icon: Code2,
    title: "Deterministic architecture, zero untested code",
    desc: "Every pull request undergoes automated regression tests, static type checking, and peer review before reaching production. We don't ship untested glue code or fragile hotfixes."
  },
  {
    icon: Target,
    title: "Measurable business value",
    desc: "We treat software as an operational asset, not an experiment. Every workflow we build is measured by tangible metrics: hours recovered each week, fewer manual errors, and eliminated SaaS subscription fees."
  },
  {
    icon: Lock,
    title: "Full source code and data ownership",
    desc: "You own 100% of your source code, database schemas, and configuration from day one. Your sensitive commercial data stays securely in your cloud account, never trapped in proprietary vendor silos."
  },
  {
    icon: Server,
    title: "Direct engineering support with contractual SLAs",
    desc: "During high-volume flash sales or month-end billing, automated bots aren't enough. Our on-call systems engineers are bound by contract to respond within 15 minutes to any production escalation."
  }
];

const teamPods = [
  {
    pod: "Core Systems & ERP Pod",
    focus: "Enterprise Resource Planning, Custom CRM, High-Throughput Relational Databases",
    stack: ["TypeScript", "NestJS", "PostgreSQL", "TimescaleDB", "GraphQL"]
  },
  {
    pod: "Commerce & Automation Pod",
    focus: "Multi-Channel Inventory Engines, Courier APIs, Automated Invoicing, RPA",
    stack: ["Next.js", "Python", "Temporal.io", "Shopify API", "Redis Mutex"]
  },
  {
    pod: "Cloud Reliability & SRE Desk",
    focus: "24/7 Monitoring, Multi-Region Failover, DDoS Mitigation, Kubernetes",
    stack: ["AWS", "Kubernetes", "Terraform", "Prometheus", "Cloudflare"]
  }
];

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 relative bg-canvas overflow-hidden">
      <HeroAmbientCanvas />
      <div className="hero-ambient-glow" aria-hidden="true" />
      {/* Header */}
      <div className="page-intro relative z-1">
        <span className="page-eyebrow">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          About the studio
        </span>
        <h1 className="motion-stagger-2 text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink mt-4 tracking-tight leading-[1.15]">
          Software you own. <br className="hidden sm:inline" />
          <span>A team you can rely on.</span>
        </h1>
        <p className="mt-4 text-lg text-muted max-w-3xl mx-auto leading-relaxed">
          AriseStudio was founded on a simple premise: growing businesses shouldn&apos;t be stuck between messy spreadsheets and expensive per-seat SaaS tools. We design, build and support custom software and automated workflows tailored to the way your business actually runs.
        </p>
      </div>

      {/* Story & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-1">
        <div className="rounded-3xl bg-surface border border-line p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs text-accent font-semibold">
                Our background
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-ink">
                Engineering for businesses that have outgrown off-the-shelf tools
              </h2>
              <p className="text-muted leading-relaxed text-base">
                Large corporations have in-house software departments. Growing businesses usually don&apos;t—so they end up juggling disconnected subscription tools, forcing their team to manually copy orders, invoices and tracking numbers between systems.
              </p>
              <p className="text-muted leading-relaxed text-base">
                AriseStudio bridges that gap. We step in as your dedicated technical partners: automating repetitive handoffs, building custom ERP and inventory software where SaaS falls short, and maintaining 24/7 uptime.
              </p>
              <div className="pt-2 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent/10 border border-accent/30 text-accent">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-ink font-semibold text-sm">Founded in Dhaka, operating globally</h4>
                  <p className="text-xs text-muted">Partnering with fast-scaling retail, logistics, and technology businesses across North America, Europe, the Middle East, and South Asia.</p>
                </div>
              </div>
            </div>

            {/* Metrics Grid with Brand Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-surface-muted/80 border border-line hover:border-accent/40 transition-colors">
                <p className="studio-stat text-4xl font-semibold">
                  <KineticCounter end={100} suffix="%" />
                </p>
                <p className="text-sm font-semibold text-ink mt-2">Code & IP Ownership</p>
                <p className="text-xs text-muted mt-1">Full source code rights, schema migrations, and database sovereignty.</p>
              </div>

              <div className="p-6 rounded-2xl bg-surface-muted/80 border border-line hover:border-accent/40 transition-colors">
                <p className="studio-stat text-4xl font-semibold">24/7</p>
                <p className="text-sm font-semibold text-ink mt-2">Engineers On Call</p>
                <p className="text-xs text-muted mt-1">Active telemetries, rapid triage, and synthetic edge probes.</p>
              </div>

              <div className="p-6 rounded-2xl bg-surface-muted/80 border border-line hover:border-accent/40 transition-colors">
                <p className="studio-stat text-4xl font-semibold">0 min</p>
                <p className="text-sm font-semibold text-ink mt-2">Unplanned Downtime</p>
                <p className="text-xs text-muted mt-1">Zero-downtime rolling deploys and automatic failover drills.</p>
              </div>

              <div className="p-6 rounded-2xl bg-surface-muted/80 border border-line hover:border-accent/40 transition-colors">
                <p className="studio-stat text-4xl font-semibold">
                  &lt; <KineticCounter end={15} suffix=" min" />
                </p>
                <p className="text-sm font-semibold text-ink mt-2">Priority SLA Response</p>
                <p className="text-xs text-muted mt-1">Contractual SLA guarantee for mission-critical production alerts.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Engineering Principles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-1">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="studio-label">
            How we build
          </span>
          <h2 className="text-3xl font-semibold text-ink mt-3">Principles we stick to</h2>
          <p className="text-muted mt-2 text-sm">
            Standards designed to provide predictability, auditability, and long-term security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {principles.map((pr, idx) => {
            const Icon = pr.icon;
            return (
              <TiltCard key={idx} maxTilt={3} spotlightBorder={true} className="rounded-2xl">
                <div className="p-8 rounded-2xl bg-canvas border border-line motion-card h-full flex flex-col justify-between">
                  <div>
                    <div className="studio-icon mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-ink mb-2">{pr.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{pr.desc}</p>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>

      {/* Engineering Pod Structure */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-1">
        <div className="rounded-3xl bg-surface border border-line p-6 sm:p-10">
          <div className="max-w-2xl mb-10">
            <span className="text-xs text-accent font-semibold">
              How we work together
            </span>
            <h3 className="text-2xl sm:text-3xl font-semibold text-ink mt-2">
              Dedicated engineering pods, no middlemen
            </h3>
            <p className="text-muted text-sm mt-2">
              You collaborate directly with dedicated systems engineers and technical leads—never account managers or outsourced junior subcontractors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {teamPods.map((pod, idx) => (
              <TiltCard key={idx} maxTilt={3} spotlightBorder={true} className="rounded-2xl">
                <div className="p-6 rounded-2xl bg-canvas border border-line space-y-4 motion-card h-full flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-ink">{pod.pod}</h4>
                    <p className="text-xs text-muted leading-relaxed mt-2">{pod.focus}</p>
                  </div>
                  <div className="pt-2 flex flex-wrap gap-1.5 border-t border-line">
                    {pod.stack.map((st) => (
                      <span key={st} className="studio-tag text-xs px-2 py-0.5 rounded font-mono">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-1">
        <div className="studio-cta p-10 sm:p-14 shadow-sm">
          <h2 className="text-3xl font-semibold text-ink">Let&apos;s Review Your Technical Roadmap</h2>
          <p className="text-muted mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Book an introductory technical architecture audit with our lead systems engineer. We assess your workflow bottlenecks and provide a concrete action plan within 48 hours.
          </p>
          <div className="mt-8">
            <MagneticElement strength={0.25}>
              <Link
                href="/contact"
                className="motion-btn group inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-on-accent bg-accent hover:bg-accent-strong transition-colors text-sm shadow-sm"
              >
                Book an Architecture Session
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </MagneticElement>
          </div>
        </div>
      </div>
    </div>
  );
}
