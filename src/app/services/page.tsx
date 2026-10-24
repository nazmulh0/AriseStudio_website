import ArchitectureSimulator from "@/components/ArchitectureSimulator";
import TechStackIcons from "@/components/TechStackIcons";
import { pageMetadata } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";
import {
  ShoppingCart,
  Database,
  Layers,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Zap,
  Sparkles,
  GitBranch,
  FileCheck2,
  Lock,
  Headset
} from "lucide-react";
import { servicesData } from "@/data/companyData";

export const metadata: Metadata = pageMetadata("Services & Capabilities | AriseStudio", "Explore AriseStudio's core services: E-Commerce Automation, Custom ERP & CRM Development, Robotic Process Automation, and 24/7 Managed IT Support.", "/services");

const deliverables = [
  {
    icon: GitBranch,
    title: "Complete Source Code & Git Repository",
    desc: "100% intellectual property ownership with modular, documented TypeScript & Python code."
  },
  {
    icon: FileCheck2,
    title: "Database Schemas & Automated Migrations",
    desc: "Idempotent migration scripts and entity diagrams ensuring zero data loss during version upgrades."
  },
  {
    icon: Lock,
    title: "CI/CD & Infrastructure as Code (IaC)",
    desc: "Automated Docker, Kubernetes, or serverless build scripts with automated secret rotation."
  },
  {
    icon: Headset,
    title: "30-Day Post-Launch Hypercare",
    desc: "Direct engineer-to-client Slack / WhatsApp bridge for instant bug fixes and operational guidance."
  }
];

export default function ServicesPage() {
  return (
    <div className="pt-32 pb-24 relative bg-canvas overflow-hidden">
      <div className="hero-ambient-glow" aria-hidden="true" />
      {/* Header */}
      <div className="page-intro relative z-1">
        <span className="page-eyebrow">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          Our services
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink mt-4 tracking-tight">
          Practical automation. <br className="hidden sm:inline" />
          <span>Software that fits your business.</span>
        </h1>
        <p className="mt-4 text-lg text-muted max-w-3xl mx-auto leading-relaxed">
          We replace messy spreadsheets and manual data entry with software built around how your team actually works—from multi-warehouse inventory and courier dispatches to custom ERP ledgers.
        </p>
      </div>

      {/* Service Blocks */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {servicesData.map((service) => {
          let IconComp = ShoppingCart;
          if (service.id === "erp-crm") IconComp = Database;
          if (service.id === "business-automation") IconComp = Layers;
          if (service.id === "it-support") IconComp = Headphones;


          return (
            <section
              key={service.id}
              id={service.id}
              className="scroll-mt-32 rounded-3xl bg-surface border border-line p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row gap-10 items-start shadow-sm motion-card"
            >
              {/* Left Column: Descriptions & Details */}
              <div className="flex-1 space-y-6">
                <div className="studio-icon">
                  <IconComp className="w-4 h-4 text-accent" />
                </div>

                <h2 className="text-3xl font-semibold text-ink tracking-tight">
                  {service.title}
                </h2>

                <p className="text-base text-muted leading-relaxed">
                  {service.fullDesc}
                </p>

                {/* Core Capabilities & Technologies - Fully Open & Visible */}
                <div className="rounded-2xl border border-line bg-surface-muted/60 p-5 space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">Core Capabilities & Technologies</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-line flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-muted">Stack:</span>
                    {service.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="studio-tag text-xs px-2.5 py-1 rounded-md font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href={`/contact?service=${service.id}`}
                    className="motion-btn group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-on-accent bg-accent hover:bg-accent-strong transition-colors text-sm shadow-sm"
                  >
                    Discuss this service
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Key Benefits Card / Visual Metric */}
              <div className="w-full lg:w-96 shrink-0">
                <div className="studio-outcomes p-6 sm:p-8 space-y-6">

                  <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
                    <Zap className="w-5 h-5 text-accent" />
                    What this can improve
                  </h3>

                  <div className="space-y-4">
                    {service.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="border-t border-line pt-4">
                        <p className="text-sm font-semibold text-ink mt-1">{benefit}</p>
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-muted">
                    <p className="font-semibold text-ink">Delivery approach</p>
                    <p className="text-muted mt-1">{service.id === "erp-crm" ? "Typical custom-system engagement: 6–12 weeks. The delivery plan is agreed after discovery." : service.id === "it-support" ? "Ongoing support. Coverage, response and availability targets are defined in your service agreement." : "Typical automation sprint: 2–4 weeks. Scope and rollout are agreed after discovery."}</p>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Live Sample Architecture & Engineering Console - Fully Open & Visible */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <span>Deterministic System Blueprint</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
            Explore live production architecture topologies
          </h2>
          <p className="text-muted text-sm sm:text-base mt-2 leading-relaxed">
            Toggle between live pipeline scenarios to inspect throughput, failover design, node execution phases, and sample JSON event streams.
          </p>
        </div>
        <div className="rounded-3xl border border-line bg-surface shadow-panel overflow-hidden motion-card">
          <ArchitectureSimulator />
        </div>
      </section>
      {/* What You Receive / Standard Deliverables */}
      <section className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs text-accent font-semibold">
            Handover standards
          </span>
          <h2 className="text-3xl font-semibold text-ink mt-2">What you receive in every project handover</h2>
          <p className="text-muted text-sm mt-2">
            Clear handover, documented systems and a team that helps you take ownership.
          </p>
        </div>

        <div className="studio-list studio-list--four">
          {deliverables.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-canvas border border-line motion-card">
                <div className="studio-icon mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-ink mb-2">{item.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-7xl px-5"><h2 className="mb-6 text-center text-lg font-semibold text-ink">Tools we work with</h2><TechStackIcons /></section>
    </div>
  );
}
