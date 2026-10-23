import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowDown,
  Check,
  ShoppingCart,
  Database,
  Workflow,
  Headphones,
  Quote,
  Layers,
} from "lucide-react";
import {
  servicesData,
  testimonialsData,
  engagementModels,
} from "@/data/companyData";
import SavingsCalculator from "@/components/SavingsCalculator";

const icons = [ShoppingCart, Database, Workflow, Headphones];

export default function HomePage() {
  return (
    <div className="bg-canvas">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 lg:pb-24 lg:pt-40">
        <div className="grid items-center gap-12 lg:grid-cols-[1.12fr_1fr] lg:gap-16">
          <div>
            <p className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Dhaka studio. Global partnerships.
            </p>
            <h1 className="text-[2.6rem] font-semibold leading-[1.12] tracking-[-.055em] text-ink sm:text-6xl lg:text-[4.1rem]">
              Less manual work.
              <br />
              <span className="text-accent">More room to grow.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Automation and custom software built around the way your business
              works. Connect your commerce, simplify operations and give your
              team time for what matters.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/schedule"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-accent px-6 text-sm font-semibold text-on-accent hover:bg-accent-strong"
              >
                Book a discovery call{" "}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/services"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-line bg-surface px-6 text-sm font-semibold text-ink hover:bg-surface-muted"
              >
                Explore our services
              </Link>
            </div>
            <p className="mt-4 text-xs text-subtle">
              30 minutes · Google Meet · A conversation about your goals
            </p>
          </div>
          <figure
            className="relative rounded-[28px] border border-line bg-surface p-6 shadow-sm sm:p-8"
            aria-label="Illustrative operations workflow: orders connect to automation, inventory and customer updates"
          >
            <div className="mb-8 flex items-center justify-between border-b border-line pb-5">
              <span className="text-sm font-semibold text-ink">
                Your business, connected
              </span>
              <span className="rounded-full bg-surface-muted px-3 py-1 text-[11px] font-semibold text-muted">
                Workflow preview
              </span>
            </div>
            <div className="mx-auto flex max-w-xs flex-col items-center">
              <div className="flex w-full items-center gap-4 rounded-2xl border border-line bg-canvas p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold">An order comes in</p>
                  <p className="mt-1 text-xs text-muted">
                    Online store, marketplace or POS
                  </p>
                </div>
              </div>
              <div className="flex h-10 items-center text-accent">
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="w-full rounded-2xl border border-accent/30 bg-accent/10 p-5">
                <div className="flex items-center gap-3">
                  <Workflow
                    className="h-5 w-5 text-accent"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold text-ink">
                    Your automation layer
                  </p>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  The right information reaches the right system, without the
                  repetitive work.
                </p>
              </div>
              <div className="flex h-10 items-center text-accent">
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="grid w-full grid-cols-2 gap-3">
                {["Stock updated", "Team notified"].map((label) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-4 text-xs font-medium"
                  >
                    <Check
                      className="h-4 w-4 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    {label}
                  </div>
                ))}
              </div>
            </div>
            <figcaption className="mt-7 text-center text-xs text-subtle">
              A simple example. Built around your actual workflow.
            </figcaption>
          </figure>
        </div>
        <div className="mt-14 grid grid-cols-3 gap-4 border-y border-line py-7 sm:mt-20">
          {[
            { value: "40+", label: "Production deployments" },
            { value: "14+", label: "Retail stores connected" },
            { value: "Your code", label: "Your ownership" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-xl font-semibold tracking-tight text-ink sm:text-3xl">
                {item.value}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-muted sm:text-xs">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:pb-24">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.15em] text-accent">
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
        <div className="grid gap-4 md:grid-cols-2">
          {servicesData.map((service, index) => {
            const Icon = icons[index];
            return (
              <Link
                key={service.id}
                href={`/services#${service.id}`}
                className="group rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-accent/50 sm:p-8"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-subtle group-hover:text-accent"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-ink">
                  {service.title}
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
                  {service.shortDesc}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="products" className="border-y border-line bg-surface-muted">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.15em] text-accent">
              Built at AriseStudio
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Meet AriseSell.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              Bring orders, inventory, couriers and customer conversations into
              one connected commerce platform.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              {[
                "Connected online and in-store operations",
                "Inventory and courier automation",
                "One place for your team to work",
              ].map((text) => (
                <li key={text} className="flex items-center gap-3">
                  <Check
                    className="h-4 w-4 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  {text}
                </li>
              ))}
            </ul>
            <Link
              href="/contact?service=arisesell"
              className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-xl bg-accent px-6 text-sm font-semibold text-on-accent hover:bg-accent-strong"
            >
              Discuss AriseSell{" "}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="rounded-3xl border border-line bg-surface p-8 sm:p-12">
            <Image
              src="/brand/arisesell-icon.svg"
              alt="AriseSell"
              width={80}
              height={80}
              className="mb-6 h-20 w-20"
            />
            <p className="text-2xl font-semibold tracking-tight text-ink">
              From order to fulfilment.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              A platform designed to reduce the daily handoffs between your
              sales, operations and delivery teams.
            </p>
            <div className="mt-8 flex items-center justify-between gap-2 border-t border-line pt-5 text-xs text-muted">
              <span>Sales</span>
              <span aria-hidden="true">→</span>
              <span>Inventory</span>
              <span aria-hidden="true">→</span>
              <span>Delivery</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.15em] text-accent">
              Client perspectives
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Good work. Lasting partnerships.
            </h2>
          </div>
          <Link
            href="/case-studies"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent"
          >
            Read the case studies{" "}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {testimonialsData.map((testimonial) => (
            <figure
              key={testimonial.id}
              className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 sm:p-7"
            >
              <div>
                <Quote
                  className="mb-5 h-5 w-5 text-accent"
                  aria-hidden="true"
                />
                <blockquote className="text-sm leading-[1.8] text-muted">
                  “{testimonial.quote}”
                </blockquote>
              </div>
              <figcaption className="mt-6 border-t border-line pt-5">
                <p className="text-sm font-semibold text-ink">
                  {testimonial.author}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {testimonial.role} · {testimonial.company}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:pb-24">
        <p className="text-xs font-semibold uppercase tracking-[.15em] text-accent">
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
              <span className="text-xs font-semibold text-accent">
                0{index + 1}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-ink">
                {model.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {model.subtitle}
              </p>
              <p className="mt-3 text-xs text-subtle">{model.timeline}</p>
              <Link
                href={`/contact?service=${index === 0 ? "business-automation" : index === 1 ? "custom-erp-crm" : "managed-it-support"}`}
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent"
              >
                Discuss your project{" "}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
        <details className="mt-12 rounded-2xl border border-line bg-surface">
          <summary className="flex min-h-16 items-center justify-between gap-4 px-6 py-5 text-sm font-semibold text-ink">
            <span className="flex items-center gap-3">
              <Layers className="h-4 w-4 text-accent" aria-hidden="true" />
              Estimate the time your team could recover
            </span>
            <span aria-hidden="true">+</span>
          </summary>
          <div className="border-t border-line">
            <SavingsCalculator />
          </div>
        </details>
      </section>
    </div>
  );
}
