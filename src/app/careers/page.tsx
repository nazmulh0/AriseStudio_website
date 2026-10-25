import { pageMetadata } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";
import HeroAmbientCanvas from "@/components/HeroAmbientCanvas";
import TiltCard from "@/components/TiltCard";
import MagneticElement from "@/components/MagneticElement";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Sparkles,
  Coffee
} from "lucide-react";

export const metadata: Metadata = pageMetadata("Careers & Culture | AriseStudio", "Join the AriseStudio engineering team. Build enterprise automation systems, custom ERPs, and cloud architectures.", "/careers");

const openRoles = [
  {
    title: "Senior Full-Stack Automation Engineer (Node.js / Next.js)",
    department: "Engineering",
    location: "Dhaka (Hybrid) / Remote",
    type: "Full-time",
    desc: "Architect scalable automation pipelines, webhook receivers, and custom CRM/ERP modules for global clients.",
    requirements: [
      "4+ years with TypeScript, Next.js, and Node.js backend architectures",
      "Demonstrated experience with Redis, PostgreSQL, and message queues (Kafka / RabbitMQ)",
      "Strong API integration background (Shopify, Stripe, ERP systems)"
    ]
  },
  {
    title: "DevOps & 24/7 Site Reliability Engineer (SRE)",
    department: "Cloud Operations & Support",
    location: "Dhaka / Remote",
    type: "Full-time",
    desc: "Maintain multi-region Kubernetes clusters, automated zero-downtime rollouts, and lead our 24/7 enterprise IT response team.",
    requirements: [
      "Strong background in AWS / Google Cloud, Terraform, and Docker/Kubernetes",
      "Hands-on telemetry mastery: Prometheus, Grafana, ELK stack",
      "Experience setting up high-availability database failover mechanisms"
    ]
  },
  {
    title: "Python RPA & Process Automation Specialist",
    department: "Automation Lab",
    location: "Dhaka / Remote",
    type: "Full-time",
    desc: "Build robotic process automations, automated web scrapers, and AI document OCR processing engines.",
    requirements: [
      "3+ years Python mastery (FastAPI, Celery, Temporal.io, Playwright)",
      "Experience fine-tuning or integrating LLM vision/extraction APIs",
      "Solid knowledge of asynchronous architectures and enterprise security"
    ]
  }
];

export default function CareersPage() {
  return (
    <div className="pt-32 pb-24 relative bg-canvas overflow-hidden">
      <HeroAmbientCanvas />
      <div className="hero-ambient-glow" aria-hidden="true" />

      {/* Header */}
      <div className="page-intro relative z-1">
        <span className="page-eyebrow">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          Careers at AriseStudio
        </span>
        <h1 className="text-4xl sm:text-5xl font-semibold text-ink mt-4 tracking-tight">
          <span className="text-mask-reveal">
            <span className="text-mask-inner">Do your best work.</span>
          </span>{" "}
          <br className="hidden sm:inline" />
          <span className="text-mask-reveal">
            <span className="text-mask-inner [animation-delay:120ms]">Build useful systems.</span>
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted max-w-3xl mx-auto leading-relaxed">
          At AriseStudio, we build production software that real businesses rely on every single day—from high-volume commerce queues to custom ERPs and automated logistics pipelines.
        </p>
      </div>

      {/* Culture Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <TiltCard maxTilt={3} spotlightBorder={true} className="rounded-2xl">
            <div className="p-8 rounded-2xl enterprise-card h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-ink flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-accent" />
                  Challenging technical problems
                </h3>
                <p className="text-sm text-muted mt-3 leading-relaxed">
                  Work directly with event-driven pipelines, distributed databases, high-concurrency commerce queues, and automated workflow engines.
                </p>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={3} spotlightBorder={true} className="rounded-2xl">
            <div className="p-8 rounded-2xl enterprise-card h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-ink flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-accent" />
                  Developer-first environment
                </h3>
                <p className="text-sm text-muted mt-3 leading-relaxed">
                  Zero bureaucracy, modern tooling (GitHub, automated CI/CD, Linear), continuous learning stipends, and flexible hybrid options.
                </p>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={3} spotlightBorder={true} className="rounded-2xl">
            <div className="p-8 rounded-2xl enterprise-card h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-ink flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Transparent growth and bonuses
                </h3>
                <p className="text-sm text-muted mt-3 leading-relaxed">
                  Competitive compensation, bi-annual performance evaluations, and project success bonuses tied to measurable client outcomes.
                </p>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>

      {/* Open Positions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-1">
        <h2 className="text-2xl sm:text-3xl font-semibold text-ink mb-8">Open Engineering Positions</h2>

        <div className="space-y-6">
          {openRoles.map((role, idx) => (
            <TiltCard key={idx} maxTilt={2} spotlightBorder={true} className="rounded-3xl">
              <div className="p-8 rounded-3xl enterprise-card shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-line">
                  <div>
                    <h3 className="text-xl font-semibold text-ink">{role.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted mt-2">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-accent" /> {role.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-accent" /> {role.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-accent" /> {role.type}
                      </span>
                    </div>
                  </div>

                  <MagneticElement strength={0.2}>
                    <Link
                      href={`/contact?apply=${encodeURIComponent(role.title)}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-on-accent bg-accent hover:bg-accent-strong transition-colors shrink-0 shadow-sm"
                    >
                      Apply for Role <ArrowRight className="w-4 h-4" />
                    </Link>
                  </MagneticElement>
                </div>

                <p className="text-sm text-muted mt-4 leading-relaxed">
                  {role.desc}
                </p>

                <div className="mt-4 space-y-1.5">
                  <p className="text-xs font-semibold text-muted">Requirements:</p>
                  {role.requirements.map((req, rIdx) => (
                    <div key={rIdx} className="flex items-start gap-2 text-xs text-muted">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  );
}
