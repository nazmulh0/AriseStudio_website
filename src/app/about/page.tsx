import { pageMetadata } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";
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
    title: "Zero Blind Commits & Deterministic Architecture",
    desc: "Every pull request undergoes static analysis, automated unit/integration suites, and mandatory peer review from a Principal Architect. We don't deploy fragile hotfixes or untested glue code to production."
  },
  {
    icon: Target,
    title: "Measurable Economic ROI",
    desc: "We consider software an engineering asset, not an experiment. Every workflow we automate and every platform we build is evaluated by concrete business metrics: payroll hours saved, order throughput multiplied, and eliminated SaaS seat licenses."
  },
  {
    icon: Lock,
    title: "Data Sovereignty & Code IP Ownership",
    desc: "You own 100% of your source code, deployment scripts, schema definitions, and private keys from day one. Your sensitive commercial data stays securely on your own cloud VPC, never locked into proprietary vendor silos."
  },
  {
    icon: Server,
    title: "Contractual Incident SLAs",
    desc: "When high-volume campaigns or month-end billing cycles run, automated bots are not enough. Our dedicated on-call systems engineers are bound by contract to respond within 15 minutes of any priority escalation."
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

      {/* Header */}
      <div className="page-intro">
        <span className="page-eyebrow">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          Engineering Heritage & Culture
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink mt-4 tracking-tight">
          We Build the Software <br className="hidden sm:inline" />
          <span className="gradient-text-teal-emerald">Your Business Actually Owns.</span>
        </h1>
        <p className="mt-4 text-lg text-muted max-w-3xl mx-auto leading-relaxed">
          AriseStudio was founded with a straightforward thesis: growing enterprises shouldn&apos;t be held hostage between manual spreadsheet chaos and extortionate per-user SaaS license fees. We design, deploy, and safeguard bespoke operational engines.
        </p>
      </div>

      {/* Story & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="rounded-3xl bg-canvas border border-line p-8 sm:p-14 lg:p-16 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase text-accent font-semibold tracking-wider">
                Who We Are & Why We Exist
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-ink">
                Pragmatic Software Engineering for Complex Realities
              </h2>
              <p className="text-muted leading-relaxed text-base">
                We observed that while multibillion-dollar conglomerates have in-house software arms, mid-market enterprises frequently struggle with fragmented SaaS tools that don&apos;t talk to one another, leaving operators to re-enter data by hand.
              </p>
              <p className="text-muted leading-relaxed text-base">
                AriseStudio bridges that gap. We assemble senior engineering pods that step into your operational bottlenecks, architect resilient automated pipelines, build custom ERPs tailored to your exact hierarchy, and protect uptime 24/7/365.
              </p>
              <div className="pt-2 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent/10 border border-accent/30 text-accent">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-ink font-bold text-sm">Founded in Dhaka, Operating Globally</h4>
                  <p className="text-xs text-muted">Partnering with fast-scaling enterprises across North America, Europe, the Middle East, and South Asia.</p>
                </div>
              </div>
            </div>

            {/* Metrics Grid with Brand Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-surface-muted/80 border border-line hover:border-accent/40 transition-colors">
                <p className="text-4xl font-bold text-accent">100%</p>
                <p className="text-sm font-semibold text-ink mt-2">Code & IP Ownership</p>
                <p className="text-xs text-muted mt-1">Full source code rights, schema migrations, and database sovereignty.</p>
              </div>

              <div className="p-6 rounded-2xl bg-surface-muted/80 border border-line hover:border-accent/40 transition-colors">
                <p className="text-4xl font-bold text-info">24/7</p>
                <p className="text-sm font-semibold text-ink mt-2">Engineers On Call</p>
                <p className="text-xs text-muted mt-1">Active telemetries, rapid triage, and synthetic edge probes.</p>
              </div>

              <div className="p-6 rounded-2xl bg-surface-muted/80 border border-line hover:border-accent/40 transition-colors">
                <p className="text-4xl font-bold text-info">0 min</p>
                <p className="text-sm font-semibold text-ink mt-2">Unplanned Downtime</p>
                <p className="text-xs text-muted mt-1">Zero-downtime rolling deploys and automatic failover drills.</p>
              </div>

              <div className="p-6 rounded-2xl bg-surface-muted/80 border border-line hover:border-accent/40 transition-colors">
                <p className="text-4xl font-bold text-accent">&lt; 15 min</p>
                <p className="text-sm font-semibold text-ink mt-2">Priority SLA Response</p>
                <p className="text-xs text-muted mt-1">Contractual SLA guarantee for mission-critical production alerts.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Engineering Principles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-accent bg-accent/10 border border-accent/30">
            Our Architectural Tenets
          </span>
          <h2 className="text-3xl font-bold text-ink mt-3">The Principles We Code By</h2>
          <p className="text-muted mt-2 text-sm">
            Standards crafted to provide predictability, auditability, and long-term security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {principles.map((pr, idx) => {
            const Icon = pr.icon;
            return (
              <div key={idx} className="p-8 rounded-2xl bg-canvas border border-line hover:border-accent/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">{pr.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{pr.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Engineering Pod Structure */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="rounded-3xl bg-surface-muted/50 border border-line p-8 sm:p-12">
          <div className="max-w-2xl mb-10">
            <span className="text-xs uppercase text-accent font-semibold tracking-wider">
              Studio Structure
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-ink mt-2">
              Cross-Functional Engineering Pods
            </h3>
            <p className="text-muted text-sm mt-2">
              You collaborate directly with dedicated systems engineers and technical leads—never account managers or outsourced junior subcontractors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamPods.map((pod, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-canvas border border-line space-y-4">
                <div className="text-xs text-accent font-semibold uppercase tracking-wider">
                  Pod 0{idx + 1}
                </div>
                <h4 className="text-lg font-bold text-ink">{pod.pod}</h4>
                <p className="text-xs text-muted leading-relaxed">{pod.focus}</p>
                <div className="pt-2 flex flex-wrap gap-1.5 border-t border-line">
                  {pod.stack.map((st) => (
                    <span key={st} className="text-xs px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl bg-gradient-to-r from-accent/40 via-canvas to-accent/30 border border-accent/30 p-10 sm:p-14 shadow-sm">
          <h2 className="text-3xl font-bold text-ink">Let&apos;s Review Your Technical Roadmap</h2>
          <p className="text-muted mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Book an introductory technical architecture audit with our lead systems engineer. We assess your workflow bottlenecks and provide a concrete action plan within 48 hours.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-on-accent bg-accent hover:bg-accent-strong transition-colors text-sm shadow-sm "
            >
              Book an Architecture Session
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
