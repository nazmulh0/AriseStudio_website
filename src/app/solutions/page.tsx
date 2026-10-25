import { pageMetadata } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";
import HeroAmbientCanvas from "@/components/HeroAmbientCanvas";
import TiltCard from "@/components/TiltCard";
import MagneticElement from "@/components/MagneticElement";
import {
  ShoppingCart,
  Truck,
  Receipt,
  Factory,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Sparkles
} from "lucide-react";

export const metadata: Metadata = pageMetadata("Industry Solutions | AriseStudio", "Industry-tailored automation solutions for retail, omnichannel logistics, healthcare, manufacturing, and financial services.", "/solutions");

const solutions = [
  {
    id: "retail",
    icon: ShoppingCart,
    title: "Retail & Omnichannel Commerce",
    subtitle: "Synchronize stores, warehouses, and online marketplaces in real-time.",
    challenges: [
      "Inventory mismatches leading to overselling or delayed customer orders",
      "Manual data entry into courier software & tracking number copy-pasting",
      "Disconnected point-of-sale (POS) and online web shop ledgers"
    ],
    solutionsProvided: [
      "Real-time bidirectional inventory balancer (<150ms sync speed)",
      "Automated order dispatch with Pathao, Steadfast, and international freight APIs",
      "Consolidated multi-outlet sales analytics and automated restocking reorders"
    ],
    metrics: "40% reduction in fulfillment turnaround time"
  },
  {
    id: "logistics",
    icon: Truck,
    title: "Supply Chain & Logistics Management",
    subtitle: "Automate fleet tracking, freight consignment, and warehouse slotting.",
    challenges: [
      "Physical paper manifests and lost documentation in transit",
      "Lack of real-time consignment visibility for shippers & consignees",
      "Slow, manual route allocation causing fuel and driver wastage"
    ],
    solutionsProvided: [
      "Custom ERP module for warehouse bin management & barcode scanning",
      "Automated bill of lading OCR parser and digital consignment vault",
      "Driver mobile companion app with proof-of-delivery GPS sync"
    ],
    metrics: "90% paperless logistics processing achieved"
  },
  {
    id: "finance",
    icon: Receipt,
    title: "Finance, Billing & Automated Invoicing",
    subtitle: "Eliminate invoice discrepancies, track approvals, and automate tax compliance.",
    challenges: [
      "Late customer payments due to forgotten invoice follow-ups",
      "Tedious manual reconciliation between bank statements and sales ledgers",
      "Complex NBR / local tax computation errors and filing lag"
    ],
    solutionsProvided: [
      "Automated recurring subscription & milestone billing engine",
      "Automated bank ledger reconciliation bots with anomaly flags",
      "Multi-level approval workflow with immutable audit logging"
    ],
    metrics: "Eliminates duplicate payments and reduces DSO by 18 days"
  },
  {
    id: "manufacturing",
    icon: Factory,
    title: "Manufacturing & Assembly ERP",
    subtitle: "Complete control over raw material procurement, BOM, and production batches.",
    challenges: [
      "Inaccurate Bill of Materials (BOM) resulting in factory floor halts",
      "Difficulty tracking scrap and wastage rates per shift",
      "Unscheduled machine downtimes hurting contract delivery dates"
    ],
    solutionsProvided: [
      "Dynamic multi-level BOM calculator and automated procurement triggers",
      "Factory floor production tracking with operator touchscreens",
      "Preventative machine maintenance schedule automation"
    ],
    metrics: "25% boost in factory floor machine utilization"
  }
];

export default function SolutionsPage() {
  return (
    <div className="pt-32 pb-24 relative bg-canvas overflow-hidden">
      <HeroAmbientCanvas />
      <div className="hero-ambient-glow" aria-hidden="true" />

      {/* Header */}
      <div className="page-intro relative z-1">
        <span className="page-eyebrow">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          Industry solutions
        </span>
        <h1 className="text-4xl sm:text-5xl font-semibold text-ink mt-4 tracking-tight">
          <span className="text-mask-reveal">
            <span className="text-mask-inner">Built around</span>
          </span>{" "}
          <br className="hidden sm:inline" />
          <span className="text-mask-reveal">
            <span className="text-mask-inner [animation-delay:120ms]">your industry.</span>
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted max-w-3xl mx-auto leading-relaxed">
          Every industry has its own bottlenecks, paperwork, and daily friction. Here is how we design systems around the specific demands of retail, logistics, manufacturing, and billing.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-1">
        {solutions.map((item) => {
          const Icon = item.icon;
          return (
            <TiltCard key={item.id} maxTilt={2} spotlightBorder={true} className="rounded-3xl">
              <div
                id={item.id}
                className="scroll-mt-32 rounded-3xl enterprise-card p-6 sm:p-10"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-line">
                  <div className="flex items-center gap-4">
                    <div className="studio-icon shrink-0">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-semibold text-ink">{item.title}</h2>
                      <p className="text-muted text-sm mt-1">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="px-4 py-2 rounded-full bg-surface-muted text-ink text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <span>{item.metrics}</span>
                  </div>
                </div>

                <div className="studio-list studio-list--two studio-list--inset mt-6">
                  {/* Traditional Bottlenecks */}
                  <div className="p-6">
                    <h3 className="text-sm font-semibold text-muted mb-4 flex items-center gap-2">
                      <span>The challenge</span>
                    </h3>
                    <div className="space-y-3">
                      {item.challenges.map((ch, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm text-muted">
                          <span className="text-muted font-semibold">✕</span>
                          <span>{ch}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AriseStudio Engineered Solution */}
                  <div className="p-6">
                    <h3 className="text-sm font-semibold text-accent mb-4 flex items-center gap-2">
                      <span>What we build</span>
                    </h3>
                    <div className="space-y-3">
                      {item.solutionsProvided.map((sol, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm text-ink">
                          <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <span>{sol}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <MagneticElement strength={0.2}>
                    <Link
                      href={`/contact?industry=${item.id}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-strong"
                    >
                      Discuss your industry requirements with an architect <ArrowRight className="w-4 h-4" />
                    </Link>
                  </MagneticElement>
                </div>
              </div>
            </TiltCard>
          );
        })}
      </div>
    </div>
  );
}
