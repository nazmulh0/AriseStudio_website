import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  ShoppingCart,
  Database,
  Workflow,
  Headphones,
  Layers,
  Terminal,
  Activity,
} from "lucide-react";
import {
  servicesData,
  projectExamples,
  engagementModels,
} from "@/data/companyData";
import SavingsCalculator from "@/components/SavingsCalculator";
import HeroAmbientCanvas from "@/components/HeroAmbientCanvas";
import TiltCard from "@/components/TiltCard";
import MagneticElement from "@/components/MagneticElement";
import KineticCounter from "@/components/KineticCounter";

const icons = [ShoppingCart, Database, Workflow, Headphones];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-canvas">
      <div className="hero-ambient-glow" aria-hidden="true" />
      <section className="studio-hero relative z-1 mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 lg:pb-24 lg:pt-40">
        <HeroAmbientCanvas />
        <div className="relative z-1 grid items-center gap-12 lg:grid-cols-[1.12fr_1fr] lg:gap-16">
          <div>
            <div className="motion-stagger-1 mb-6 inline-flex items-center gap-2.5 rounded-full border border-accent/25 bg-accent/5 px-3.5 py-1.5 text-xs font-semibold text-accent shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75 duration-1000" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span>Dhaka studio · Global partnerships</span>
            </div>
            <h1 className="text-[2.6rem] font-semibold leading-[1.12] tracking-[-.055em] text-ink sm:text-6xl lg:text-[4.1rem]">
              <span className="text-mask-reveal">
                <span className="text-mask-inner">Less manual work.</span>
              </span>
              <br />
              <span className="text-mask-reveal">
                <span className="text-mask-inner [animation-delay:120ms]">More room to grow.</span>
              </span>
            </h1>
            <p className="motion-stagger-3 mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Automation and custom software built around the way your business
              works. Connect your commerce, simplify operations and give your
              team time for what matters.
            </p>
            <div className="motion-stagger-4 mt-8 flex flex-col gap-3 sm:flex-row">
              <MagneticElement>
                <Link
                  href="/schedule"
                  className="nav-call motion-btn group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-accent px-6 text-sm font-semibold text-on-accent hover:bg-accent-strong shadow-[0_0_20px_rgba(44,199,138,0.25)]"
                >
                  Book a discovery call{" "}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </MagneticElement>
              <MagneticElement strength={0.18}>
                <Link
                  href="/services"
                  className="motion-btn inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-surface px-6 text-sm font-semibold text-ink hover:bg-surface-muted"
                >
                  Explore our services
                </Link>
              </MagneticElement>
            </div>
            <p className="motion-stagger-4 mt-4 text-xs text-subtle">
              30 minutes · Google Meet · A conversation about your goals
            </p>
          </div>

          {/* Interactive Live Operations Engine Console with 3D Tilt */}
          <TiltCard maxTilt={5}>
            <figure
              className="workflow-panel motion-card motion-stagger-5 relative rounded-[26px] p-5 sm:p-7 shadow-panel border border-line"
              aria-label="Interactive operations workflow engine showcasing real-time order ingest, stock mutex and instant courier dispatch"
            >
            {/* Terminal Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-line mb-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-danger/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-warning/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                </div>
                <span className="font-mono text-xs font-semibold text-ink pl-2 border-l border-line flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-accent" />
                  AriseCore Live Pipeline
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/25 text-[11px] font-semibold text-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                12ms avg · Dhaka Hub
              </span>
            </div>

            {/* Pipeline Flow Stages */}
            <div className="space-y-2">
              {/* Stage 1: Ingest */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-line bg-canvas p-3.5 sm:p-4 transition-all duration-200 hover:border-accent/40 hover:-translate-y-0.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm font-semibold text-ink">01. Omnichannel Ingest</p>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-muted text-accent font-semibold border border-line">
                      HMAC Validated
                    </span>
                  </div>
                  <p className="text-xs text-muted truncate mt-0.5">
                    Shopify D2C · WooCommerce · POS Gulshan Branch
                  </p>
                </div>
              </div>

              {/* Connector Stream 1 */}
              <div className="flex flex-col items-center py-0.5">
                <div className="pipeline-track">
                  <div className="pipeline-stream" />
                </div>
              </div>

              {/* Stage 2: Central Automation Engine */}
              <div className="rounded-2xl border border-line bg-surface-muted/90 p-3.5 sm:p-4 transition-all duration-200 hover:border-accent/40 hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-accent" aria-hidden="true" />
                    <p className="text-xs sm:text-sm font-semibold text-ink">
                      02. Automation & Idempotency Layer
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent font-semibold">
                    Atomic Mutex
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-muted mt-1">
                  Locks inventory across 14 warehouse nodes with zero double-sell conflicts.
                </p>
              </div>

              {/* Connector Stream 2 */}
              <div className="flex flex-col items-center py-0.5">
                <div className="pipeline-track">
                  <div className="pipeline-stream" />
                </div>
              </div>

              {/* Stage 3: Immediate Multi-Channel Resolution */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex flex-col justify-between rounded-xl border border-line bg-canvas p-3 text-xs transition-all duration-200 hover:border-accent/40 hover:-translate-y-0.5">
                  <div className="flex items-center gap-1.5 text-accent font-semibold text-[11px] mb-1">
                    <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>Courier Consigned</span>
                  </div>
                  <p className="text-[11px] text-muted">Steadfast / Pathao slip barcode active</p>
                </div>
                <div className="flex flex-col justify-between rounded-xl border border-line bg-canvas p-3 text-xs transition-all duration-200 hover:border-accent/40 hover:-translate-y-0.5">
                  <div className="flex items-center gap-1.5 text-accent font-semibold text-[11px] mb-1">
                    <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>Ledger Synchronized</span>
                  </div>
                  <p className="text-[11px] text-muted">Double-entry ERP record booked</p>
                </div>
              </div>
            </div>

            {/* Live Telemetry Footer */}
            <div className="mt-5 pt-3.5 border-t border-line flex items-center justify-between text-xs text-muted">
              <span className="flex items-center gap-1.5 text-accent">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>Zero dropped webhooks</span>
              </span>
              <span className="font-mono text-[11px] text-subtle">
                <KineticCounter end={140} suffix=" ops / sec" duration={1200} />
              </span>
            </div>
          </figure>
          </TiltCard>
        </div>
        <div className="mt-14 grid grid-cols-3 gap-4 border-y border-line py-7 sm:mt-20">
          <div className="text-center">
            <p className="text-xl font-semibold tracking-tight text-ink tabular-nums sm:text-3xl">
              <KineticCounter end={40} suffix="+" duration={1600} />
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-muted sm:text-xs">
              Production deployments
            </p>
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold tracking-tight text-ink tabular-nums sm:text-3xl">
              <KineticCounter end={14} suffix="+" duration={1400} />
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-muted sm:text-xs">
              Retail stores connected
            </p>
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold tracking-tight text-ink sm:text-3xl">
              Your code
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-muted sm:text-xs">
              Your ownership
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:pb-24">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-accent">
              What we do
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Make your systems work together.
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent"
          >
            All services <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {servicesData.map((service, index) => {
            const Icon = icons[index];
            return (
              <TiltCard key={service.id} maxTilt={4} spotlightBorder={true} className="rounded-2xl">
                <Link
                  href={`/services#${service.id}`}
                  className="enterprise-card motion-card group flex flex-col justify-between rounded-2xl p-6 transition-all hover:border-accent/50 sm:p-8 h-full"
                >
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform duration-200 group-hover:scale-110">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <ArrowRight
                        className="h-4 w-4 text-subtle transition-transform duration-200 group-hover:translate-x-1.5 group-hover:text-accent"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight text-ink">
                      {service.title}
                    </h3>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
                      {service.shortDesc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-line/60 flex items-center text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span>Explore architecture & details →</span>
                  </div>
                </Link>
              </TiltCard>
            );
          })}
        </div>
      </section>

      {/* Proprietary Product Showcase - AriseSell */}
      <section id="products" className="border-y border-line bg-surface-muted/50 py-16 sm:py-24 relative overflow-hidden">
        <div className="hero-ambient-glow" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_1fr] relative z-1">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>Proprietary Commerce Infrastructure</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-ink">
              Meet AriseSell.
            </h2>
            <p className="mt-4 max-w-lg text-base sm:text-lg leading-relaxed text-muted">
              The unified commerce engine engineered to eliminate the daily friction between sales channels, warehousing, couriers, and customer support.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { title: "Automated Courier Dispatch", desc: "Instant automated parcel booking with Pathao, Steadfast, RedX & DHL." },
                { title: "Atomic Multi-Warehouse Mutex", desc: "Prevents stock overselling across physical outlets and online shops." },
                { title: "Automated SMS & WhatsApp", desc: "Real-time delivery milestone notifications sent directly to customers." },
                { title: "Continuous ERP Ledger Sync", desc: "Invoices and revenue reconcile automatically without human re-entry." }
              ].map((feature, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-line bg-surface/80 motion-card">
                  <div className="flex items-center gap-2 text-accent font-semibold text-xs mb-1">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>{feature.title}</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Link
                href="/contact?service=arisesell"
                className="motion-btn group inline-flex min-h-12 items-center gap-3 rounded-full bg-accent px-6 text-sm font-semibold text-on-accent hover:bg-accent-strong"
              >
                Discuss AriseSell for Your Brand
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <span className="text-xs text-subtle">
                Designed for high-growth brands in Bangladesh & GCC
              </span>
            </div>
          </div>

          {/* Right Column: Live AriseSell Dashboard Mockup with 3D Tilt */}
          <TiltCard maxTilt={5}>
            <div className="motion-card rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-panel relative">
              <div className="flex items-center justify-between pb-4 border-b border-line mb-6">
                <div className="flex items-center gap-3">
                  <Image
                    src="/brand/arisesell-icon.svg"
                    alt="AriseSell"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-xl"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-ink">AriseSell Commerce Hub</h4>
                    <p className="text-xs text-muted">Node: Dhaka Fulfilment Central</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Live Hub
                </span>
              </div>

              {/* Live Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3.5 rounded-xl bg-surface-muted/70 border border-line text-center">
                  <span className="text-[11px] text-muted block mb-0.5">Today&apos;s Orders</span>
                  <span className="text-xl font-semibold text-ink tabular-nums">
                    <KineticCounter end={1842} duration={1500} />
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-muted/70 border border-line text-center">
                  <span className="text-[11px] text-muted block mb-0.5">Courier API</span>
                  <span className="text-xl font-semibold text-accent tabular-nums">&lt; 14ms</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-muted/70 border border-line text-center">
                  <span className="text-[11px] text-muted block mb-0.5">Desync Rate</span>
                  <span className="text-xl font-semibold text-accent tabular-nums">0.00%</span>
                </div>
              </div>

              {/* Live Pipeline Flow Visualizer */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-muted">Connected Delivery & Payment Gateways</div>
                <div className="flex flex-wrap gap-2">
                  {["Pathao Courier", "Steadfast", "RedX", "DHL Express", "bKash Merchant", "Shopify API"].map((badge) => (
                    <span key={badge} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-surface-muted/90 text-xs font-medium text-ink">
                      <Check className="w-3.5 h-3.5 text-accent" />
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-line flex items-center justify-between text-xs text-muted">
                <span>Automatic Barcode Slip Generator</span>
                <span className="font-mono text-accent font-semibold">Active & Synced</span>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-accent">
              Example workflows
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Built for the way teams work.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">Illustrative scenarios showing the kinds of systems we can design with you.</p>
          </div>
          <Link
            href="/case-studies"
            className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent-strong"
          >
            Explore the examples{" "}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projectExamples.map((example) => (
            <TiltCard key={example.id} maxTilt={3} spotlightBorder={true} className="rounded-2xl">
              <article
                className="motion-card flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 sm:p-7 h-full"
              >
                <div>
                  <Layers
                    className="mb-5 h-5 w-5 text-accent"
                    aria-hidden="true"
                  />
                  <h3 className="text-sm font-semibold text-ink">{example.industry}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{example.challenge}</p>
                </div>
                <p className="mt-6 border-t border-line pt-5 text-sm leading-relaxed text-muted">{example.approach}</p>
              </article>
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:pb-24">
        <p className="text-sm font-semibold text-accent">
          Working together
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Start where you need us.
        </h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {engagementModels.map((model, index) => (
            <div
              key={model.title}
              className="flex flex-col border-t border-line pt-6"
            >
              <h3 className="mt-4 text-xl font-semibold text-ink">
                {model.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {model.subtitle}
              </p>
              <p className="mt-3 text-xs text-subtle">{model.timeline}</p>
              <Link
                href={`/contact?service=${index === 0 ? "business-automation" : index === 1 ? "custom-erp-crm" : "managed-it-support"}`}
                className="group mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent-strong"
              >
                Discuss your project{" "}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Automation ROI Benchmark - Open, Prominent & Fully Visible */}
      <section id="roi-calculator" className="border-t border-line bg-surface-muted/50 py-16 sm:py-24 relative overflow-hidden">
        <div className="hero-ambient-glow" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8 relative z-1">
          <div className="max-w-2xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span>Interactive ROI & Capacity Benchmark</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              Calculate the time and payroll your team can recover.
            </h2>
            <p className="mt-3 text-base text-muted leading-relaxed">
              Slide to match your team size, manual hours spent, and hourly rate. See the tangible operational capacity automated workflows unlock for your business.
            </p>
          </div>
          <div className="rounded-3xl border border-line bg-surface shadow-panel overflow-hidden motion-card">
            <SavingsCalculator />
          </div>
        </div>
      </section>
    </div>
  );
}
