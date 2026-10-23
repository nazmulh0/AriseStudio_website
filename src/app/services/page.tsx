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
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-accent/25 via-accent/15 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-accent/10 blur-[130px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-accent bg-accent/10 border border-accent/30">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          Our services
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink mt-4 tracking-tight">
          Practical automation. <br className="hidden sm:inline" />
          <span className="gradient-text-teal-emerald">Software that fits your business.</span>
        </h1>
        <p className="mt-4 text-lg text-muted max-w-3xl mx-auto leading-relaxed">
          We replace fragmented spreadsheets, manual data transcription, and brittle off-the-shelf software with resilient systems engineered around your exact business model.
        </p>
      </div>

      {/* Service Blocks */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {servicesData.map((service, index) => {
          let IconComp = ShoppingCart;
          if (service.id === "erp-crm") IconComp = Database;
          if (service.id === "business-automation") IconComp = Layers;
          if (service.id === "it-support") IconComp = Headphones;

          const isEven = index % 2 === 0;

          return (
            <section
              key={service.id}
              id={service.id}
              className={`scroll-mt-32 rounded-3xl bg-surface border border-line p-8 sm:p-12 lg:p-14 flex flex-col ${
                isEven ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-10 items-start hover:border-accent/30 transition-colors shadow-sm`}
            >
              {/* Left Column: Descriptions & Details */}
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-semibold border border-accent/30">
                  <IconComp className="w-4 h-4 text-accent" />
                  <span>Service 0{index + 1}</span>
                </div>

                <h2 className="text-3xl font-bold text-ink tracking-tight">
                  {service.title}
                </h2>

                <p className="text-base text-muted leading-relaxed">
                  {service.fullDesc}
                </p>

                <details className="rounded-xl border border-line bg-surface p-4">
                  <summary className="text-sm font-semibold text-accent">Capabilities & technologies</summary>
                  <div className="mt-4 space-y-3">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-muted">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                  </div>
                  <div className="pt-4 flex flex-wrap gap-2">
                  <span className="text-xs text-muted py-1 pr-2">Technologies:</span>
                  {service.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2.5 py-1 rounded-md bg-accent/10 text-accent border border-accent/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                </details>

                <div className="pt-4">
                  <Link
                    href={`/contact?service=${service.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-on-accent bg-accent hover:bg-accent-strong transition-colors text-sm shadow-sm "
                  >
                    Discuss this service
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Key Benefits Card / Visual Metric */}
              <div className="w-full lg:w-96 shrink-0">
                <div className="rounded-2xl bg-accent/10 border border-line p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-xl pointer-events-none" />
                  
                  <h3 className="text-lg font-bold text-ink flex items-center gap-2">
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

                  <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 text-xs text-accent">
                    <p className="font-semibold text-ink">Delivery approach</p>
                    <p className="text-muted mt-1">{service.id === "erp-crm" ? "Typical custom-system engagement: 6–12 weeks. The delivery plan is agreed after discovery." : service.id === "it-support" ? "Ongoing support. Coverage, response and availability targets are defined in your service agreement." : "Typical automation sprint: 2–4 weeks. Scope and rollout are agreed after discovery."}</p>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <details className="rounded-2xl border border-line bg-surface">
          <summary className="min-h-14 px-6 py-5 text-sm font-semibold text-ink">Explore a sample architecture</summary>
          <ArchitectureSimulator />
        </details>
      </section>
      {/* What You Receive / Standard Deliverables */}
      <section className="mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase text-accent font-semibold tracking-wider">
            Standard Operating Procedure
          </span>
          <h2 className="text-3xl font-bold text-ink mt-2">What You Receive in Every Handover</h2>
          <p className="text-muted text-sm mt-2">
            Clear handover, documented systems and a team that helps you take ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deliverables.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-canvas border border-line hover:border-accent/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-ink mb-2">{item.title}</h3>
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
