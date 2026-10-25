import { pageMetadata } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";
import HeroAmbientCanvas from "@/components/HeroAmbientCanvas";
import TiltCard from "@/components/TiltCard";
import MagneticElement from "@/components/MagneticElement";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Zap,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = pageMetadata("Project Examples | AriseStudio", "Illustrative examples of automation, ERP and infrastructure solutions AriseStudio can design around a business workflow.", "/case-studies");

const fullStudies = [
  {
    title: "Multi-Channel Order & Inventory Synchronizer",
    industry: "Retail & Multi-Channel E-Commerce",
    overview: "A retailer selling through physical stores and online channels needs one reliable view of orders, inventory and delivery status.",
    solution: "An event-driven inventory hub could connect POS, storefronts and courier APIs, with safeguards against duplicate or conflicting stock updates.",
    capabilities: [
      "Keep stock changes consistent across connected channels",
      "Route new orders into a shared fulfillment workflow",
      "Give the team a clear record of dispatch and delivery status"
    ],
    tech: ["Next.js", "Node.js", "Redis Mutex", "Shopify Webhooks", "PostgreSQL", "Docker"]
  },
  {
    title: "Paperless Customs & Automated Freight Tracking ERP",
    industry: "Freight Forwarding & Customs",
    overview: "A freight team handling paper manifests and bills of lading may spend too much time re-entering the same information into separate systems.",
    solution: "A tailored ERP could combine document extraction, human review and shipment tracking in one workflow.",
    capabilities: [
      "Reduce repeated entry of consignment details",
      "Keep source documents attached to each shipment",
      "Give customers a clearer view of shipment milestones"
    ],
    tech: ["Python", "FastAPI", "OCR Pipeline", "Docker", "React ERP", "PostgreSQL"]
  },
  {
    title: "High-Availability Cloud Infrastructure & 24/7 IT Desk",
    industry: "Financial & Loan Services",
    overview: "A financial services platform needs predictable availability and a dependable response when transaction traffic spikes.",
    solution: "A resilient deployment could pair monitored services, tested backups and a clear incident response process.",
    capabilities: [
      "Detect service problems before they spread",
      "Recover critical systems with tested backup and failover plans",
      "Review infrastructure usage and costs regularly"
    ],
    tech: ["AWS EKS", "Terraform", "Prometheus", "PostgreSQL Replication", "Cloudflare"]
  }
];

export default function CaseStudiesPage() {
  return (
    <div className="pt-32 pb-24 relative bg-canvas overflow-hidden">
      <HeroAmbientCanvas />
      <div className="hero-ambient-glow" aria-hidden="true" />
      {/* Header */}
      <div className="page-intro relative z-1">
        <span className="page-eyebrow">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          Illustrative project examples
        </span>
        <h1 className="motion-stagger-2 text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink mt-4 tracking-tight leading-[1.15]">
          Connected systems. <br className="hidden sm:inline" />
          <span>Built around real workflows.</span>
        </h1>
        <p className="mt-4 text-lg text-muted max-w-3xl mx-auto leading-relaxed">
          These are illustrative scenarios, not client case studies or measured outcomes. They show how we might approach common operational challenges; the final design depends on your business.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-1">
        {fullStudies.map((study, idx) => (
          <TiltCard key={idx} maxTilt={2} spotlightBorder={true} className="rounded-3xl">
            <article
              className="rounded-3xl bg-surface border border-line p-6 sm:p-10 shadow-sm motion-card"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-line">
                <div>
                  <span className="text-xs text-accent font-semibold">
                    {study.industry}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-ink mt-1">
                    {study.title}
                  </h2>
                  <p className="text-sm text-muted mt-1">Example architecture</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {study.tech.map((t) => (
                    <span key={t} className="studio-tag text-xs px-2.5 py-1 rounded-md font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="studio-list studio-list--three studio-list--inset mt-6">
                {/* Problem */}
                <div className="p-6">
                  <h3 className="text-xs font-semibold text-muted mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> The Bottleneck
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {study.overview}
                  </p>
                </div>

                {/* Solution */}
                <div className="p-6">
                  <h3 className="text-xs font-semibold text-accent mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Possible Approach
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {study.solution}
                  </p>
                </div>

                {/* Illustrative capabilities */}
                <div className="p-6">
                  <h3 className="text-xs font-semibold text-accent mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent" /> What This Could Enable
                  </h3>
                  <div className="space-y-2.5">
                    {study.capabilities.map((res, rIdx) => (
                      <div key={rIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span>{res}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-muted">Facing a similar operational hurdle?</span>
                <MagneticElement strength={0.2}>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-strong transition-colors"
                  >
                    Schedule an architecture audit{" "}
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </MagneticElement>
              </div>
            </article>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
