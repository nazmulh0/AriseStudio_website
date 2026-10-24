import { pageMetadata } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  ShieldAlert, 
  Zap,
  Sparkles,
  Quote
} from "lucide-react";

export const metadata: Metadata = pageMetadata("Case Studies & Client Success | AriseStudio", "Real-world engineering case studies showcasing automation, custom ERP overhauls, and IT infrastructure results by AriseStudio.", "/case-studies");

const fullStudies = [
  {
    title: "Multi-Channel Order & Inventory Synchronizer",
    client: "Apex OmniCommerce",
    industry: "Retail & Multi-Channel E-Commerce",
    overview: "Managing 14 physical retail branches alongside Shopify and Daraz web stores was causing inventory overselling, stockout chaos, and an average fulfillment lag of 48 hours per customer order.",
    solution: "AriseStudio engineered an event-driven inventory hub built on Next.js, Redis, and Webhooks. Every POS sales register or online transaction immediately acquires an atomic distributed lock across all channels within 120 milliseconds.",
    quote: "Our shipping error rate dropped to virtually zero within three weeks of rollout. The automated courier booking alone saved our warehouse team four hours every morning.",
    quoteAuthor: "Tanvir Rahman, COO",
    results: [
      "450% surge in daily online order handling capacity with zero added headcount",
      "99.4% elimination of customer refund cancellations caused by stock mismatches",
      "Automated courier consignment booking saving 18 staff hours daily"
    ],
    tech: ["Next.js", "Node.js", "Redis Mutex", "Shopify Webhooks", "PostgreSQL", "Docker"]
  },
  {
    title: "Paperless Customs & Automated Freight Tracking ERP",
    client: "Nordic Logistics & Freight Ltd.",
    industry: "Freight Forwarding & Customs",
    overview: "Customs paper manifests and freight bills of lading were manually re-typed by clerks into three different legacy portals, resulting in costly data-entry typos and customs clearance bottlenecks.",
    solution: "Implemented an automated OCR and LLM-assisted document parsing pipeline connected directly into their custom cloud ERP. Consignment documents uploaded via mobile or email are automatically verified against customs tariffs.",
    quote: "We were paying thousands every month for an off-the-shelf software our staff hated. AriseStudio built an ERP mapped to our exact freight process. We own the codebase outright.",
    quoteAuthor: "Zubair Al-Mansoor, Managing Director",
    results: [
      "92% reduction in manifest processing turnaround time",
      "Zero compliance fines across 12 consecutive months of audit",
      "Instant client consignment tracking portal with live GPS milestones"
    ],
    tech: ["Python", "FastAPI", "OCR Pipeline", "Docker", "React ERP", "PostgreSQL"]
  },
  {
    title: "High-Availability Cloud Infrastructure & 24/7 IT Desk",
    client: "FinTrust Capital Group",
    industry: "Financial & Loan Services",
    overview: "Unplanned server crashes during monthly repayment collection cycles caused reputational damage and threatened transaction log consistency across branch tellers.",
    solution: "Architected a multi-zone AWS Kubernetes cluster with automated horizontal pod autoscaling, automated database replication failover, and established an around-the-clock L3 engineering response team.",
    quote: "Their 24/7 telemetry team mitigated a targeted edge DDoS attack during our peak loan disbursement window before our users even noticed a dip in speed.",
    quoteAuthor: "Farhana Yasmin, VP of Engineering",
    results: [
      "100% server availability across 18 peak settlement windows",
      "Average incident mitigation speed under 8 minutes",
      "38% decrease in unnecessary cloud hosting expenses via rightsizing"
    ],
    tech: ["AWS EKS", "Terraform", "Prometheus", "PostgreSQL Replication", "Cloudflare"]
  }
];

export default function CaseStudiesPage() {
  return (
    <div className="pt-32 pb-24 relative bg-canvas overflow-hidden">

      {/* Header */}
      <div className="page-intro">
        <span className="page-eyebrow">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          Proven Field Deployments
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink mt-4 tracking-tight">
          Client Case Studies & <br className="hidden sm:inline" />
          <span className="gradient-text-teal-emerald">Measurable Commercial Outcomes</span>
        </h1>
        <p className="mt-4 text-lg text-muted max-w-3xl mx-auto leading-relaxed">
          Explore how AriseStudio has eliminated operational bottlenecks, replaced fragile spreadsheets with custom platforms, and protected system uptime for fast-growing enterprises.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {fullStudies.map((study, idx) => (
          <article
            key={idx}
            className="rounded-3xl bg-canvas border border-line p-8 sm:p-12 shadow-sm hover:border-accent/30 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-line">
              <div>
                <span className="text-xs uppercase text-accent font-semibold">
                  {study.industry}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-ink mt-1">
                  {study.title}
                </h2>
                <p className="text-sm text-muted mt-1">Client: <span className="text-ink font-semibold">{study.client}</span></p>
              </div>
              <div className="flex flex-wrap gap-2">
                {study.tech.map((t) => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-md bg-accent/10 text-accent border border-accent/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-8">
              {/* Problem */}
              <div className="p-6 rounded-2xl bg-surface-muted/80 border border-danger/20">
                <h3 className="text-xs font-bold uppercase tracking-wider text-danger mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> The Bottleneck
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {study.overview}
                </p>
              </div>

              {/* Solution */}
              <div className="p-6 rounded-2xl bg-accent/10 border border-accent/30">
                <h3 className="text-xs font-bold uppercase tracking-wider text-accent mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Architectural Solution
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {study.solution}
                </p>
              </div>

              {/* Verified Results */}
              <div className="p-6 rounded-2xl bg-accent/10 border border-accent/40">
                <h3 className="text-xs font-bold uppercase tracking-wider text-accent mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent" /> Commercial Returns
                </h3>
                <div className="space-y-2.5">
                  {study.results.map((res, rIdx) => (
                    <div key={rIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>{res}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Client Quote Callout */}
            <div className="mt-6 p-5 rounded-2xl bg-accent/10 border border-accent/20 flex items-start gap-4">
              <Quote className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-ink italic">&ldquo;{study.quote}&rdquo;</p>
                <p className="text-xs text-accent mt-2 font-semibold">— {study.quoteAuthor}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-line flex items-center justify-between">
              <span className="text-xs text-muted">Facing a similar operational hurdle?</span>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent"
              >
                Schedule an architecture audit <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
