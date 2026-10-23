export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  features: string[];
  benefits: string[];
  techStack: string[];
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  industry: string;
  impactMetric: string;
}

export interface EngagementModel {
  title: string;
  subtitle: string;
  bestFor: string;
  timeline: string;
  features: string[];
}

export const servicesData: ServiceItem[] = [
  {
    id: "ecommerce",
    title: "E-Commerce Automation Systems",
    shortDesc: "Keep orders, stock and deliveries in sync across your stores and sales channels.",
    fullDesc: "We build unified, event-driven commerce backbones that synchronize orders, multi-warehouse stock levels, parcel courier APIs (Pathao, Steadfast, DHL, FedEx), and accounting software without manual intervention.",
    iconName: "ShoppingCart",
    features: [
      "Real-time Inventory Synchronization across Shopify, WooCommerce, Amazon & Custom Web",
      "Automated Order Dispatch & Shipping Label Generation with Courier APIs",
      "Dynamic Pricing Bots & Stock Depletion Prevention Alarms",
      "Multi-Channel Abandoned Cart Recovery (WhatsApp, SMS, Email Triggers)",
      "Automated Return & Refund RMA Workflows with Barcode Verification"
    ],
    benefits: [
      "99.8% reduction in order processing manual errors",
      "Under 120ms stock synchronizer latency across all connected channels",
      "Effortless scaling to 50,000+ daily orders during flash sales"
    ],
    techStack: ["Next.js", "Node.js", "Shopify GraphQL", "Redis", "Kafka", "PostgreSQL", "Docker"]
  },
  {
    id: "erp-crm",
    title: "Custom ERP & CRM Engineering",
    shortDesc: "Bring your sales, customer records and daily operations into software built for your team.",
    fullDesc: "Your software should reflect the way your team works. We build modular ERP and CRM systems that connect departments, support your sales process and give you clear operational reporting.",
    iconName: "Database",
    features: [
      "End-to-End Sales Pipeline & Lead Scoring Automation",
      "Multi-Warehouse Inventory & Bin-Level Barcode Tracking",
      "Automated Double-Entry Accounting & Local Tax / VAT Compliance",
      "Granular Role-Based Access Control (RBAC) & Immutable Audit Logs",
      "Executive Real-Time Business Intelligence & Financial Dashboards"
    ],
    benefits: [
      "100% intellectual property ownership with zero recurring SaaS user taxes",
      "35% increase in cross-department operational velocity",
      "Unified single pane of glass across multi-branch and multi-country operations"
    ],
    techStack: ["React", "NestJS", "TypeScript", "PostgreSQL", "TimescaleDB", "GraphQL", "Tailwind CSS"]
  },
  {
    id: "business-automation",
    title: "End-to-End Business Automation & RPA",
    shortDesc: "Spend less time copying information, checking documents and chasing approvals.",
    fullDesc: "We audit your manual bottlenecks—spreadsheets, email approval chains, and repetitive copying across legacy portals—and engineer autonomous event-driven pipelines that run quietly 24/7.",
    iconName: "Layers",
    features: [
      "Durable Workflow Automation with Temporal & Event-Driven Triggers",
      "AI OCR Document Extraction for Invoices, Customs Documents & Receipts",
      "Automated Employee Onboarding, Payroll Runs & Commission Calculations",
      "Interactive Approval Chains directly in Slack, Microsoft Teams, or WhatsApp",
      "Scheduled Data Aggregation & Automated PDF Executive Report Delivery"
    ],
    benefits: [
      "Recovers 120+ lost team hours per department every month",
      "Eliminates duplicate payments and human transcription typos",
      "Real-time alerting for threshold breaches and cash-flow anomalies"
    ],
    techStack: ["Python", "Temporal.io", "FastAPI", "OpenAI / Claude API", "Playwright", "Celery", "Redis"]
  },
  {
    id: "it-support",
    title: "24/7 Managed IT Support & DevOps",
    shortDesc: "Keep your systems running with monitoring, cloud support, backups and incident response.",
    fullDesc: "Ensure mission-critical systems and corporate workstations never suffer downtime. Our dedicated engineering desk handles zero-downtime deployments, security patching, cloud provisioning, and active surveillance 24/7/365.",
    iconName: "Headphones",
    features: [
      "24/7/365 Proactive Server, Database & Microservice Uptime Telemetry",
      "CI/CD Pipeline Hardening & Zero-Downtime Rolling Deployments",
      "Automated Multi-Region Cloud Backups with One-Click Failover Drills",
      "Comprehensive Security Audits, DDoS Mitigation & SSL Management",
      "Dedicated Helpdesk with 15-Minute Guaranteed Critical Incident SLA"
    ],
    benefits: [
      "99.99% guaranteed infrastructure uptime backed by contractual SLA",
      "Zero panic during peak traffic spikes or DDoS attempts",
      "Predictable monthly engineering cost without maintaining bloated in-house IT overhead"
    ],
    techStack: ["AWS", "Google Cloud", "Kubernetes", "Terraform", "Prometheus", "Grafana", "Cloudflare"]
  }
];

export const testimonialsData: TestimonialItem[] = [
  {
    id: "test-1",
    quote: "Before AriseStudio, our warehouse team spent four hours every morning manually re-entering Shopify orders into our legacy billing software and courier portals. AriseStudio replaced the entire mess with an automated pipeline in three weeks. Our shipping error rate dropped to virtually zero.",
    author: "Tanvir Rahman",
    role: "Chief Operating Officer",
    company: "Apex OmniCommerce",
    industry: "Retail & Multi-Channel E-Commerce",
    impactMetric: "Saved 20+ staff hours daily"
  },
  {
    id: "test-2",
    quote: "We were paying over $1,800 every month for a bloated enterprise CRM that 80% of our team hated using. AriseStudio engineered a tailored ERP & CRM platform that reflects our exact sales cycles. We own the codebase outright, our data is on our private VPC, and team adoption was instant.",
    author: "Zubair Al-Mansoor",
    role: "Managing Director",
    company: "Nordic Logistics & Freight Ltd.",
    industry: "Supply Chain & Logistics",
    impactMetric: "Zero recurring SaaS seat licenses"
  },
  {
    id: "test-3",
    quote: "During our bi-weekly loan disbursement cycles, server bottlenecks previously risked customer data corruption. AriseStudio overhauled our cloud architecture on Kubernetes, automated our failovers, and their 24/7 monitoring team resolved an edge DDoS attempt before our users even noticed.",
    author: "Farhana Yasmin",
    role: "VP of Engineering",
    company: "FinTrust Capital Group",
    industry: "Financial Services",
    impactMetric: "100% uptime across 18 peak cycles"
  }
];

export const caseStudiesData = [
  {
    client: "Apex OmniCommerce",
    industry: "Retail & E-Commerce",
    metric: "450% Order Growth with Zero Additional Staff",
    description: "Built an omnichannel inventory synchronizer linking 14 physical outlets with online web stores and courier API integrations.",
    tags: ["E-Commerce Automation", "Next.js", "Warehouse Sync"]
  },
  {
    client: "Nordic Logistics Ltd.",
    industry: "Freight & Transport",
    metric: "92% Reduction in Invoice Processing Delay",
    description: "Automated OCR bill of lading parsing and integrated an automated customs clearance audit checklist pipeline.",
    tags: ["Custom ERP", "AI OCR", "Process Automation"]
  },
  {
    client: "FinTrust MicroCapital",
    industry: "Financial Services",
    metric: "100% Uptime Across Peak Payment Cycles",
    description: "Architected high-availability cloud cluster, automated failovers, and established 24/7 Level 3 proactive system monitoring.",
    tags: ["Managed IT Support", "DevOps", "AWS High-Availability"]
  }
];

export const engagementModels: EngagementModel[] = [
  {
    title: "Targeted Automation Sprint",
    subtitle: "High-impact automation for a single mission-critical bottleneck",
    bestFor: "E-commerce synchronization, courier API integration, OCR invoice extraction, or report pipelines.",
    timeline: "2 to 4 Weeks",
    features: [
      "In-depth workflow & API audit",
      "Full custom code & pipeline delivery",
      "Staging sandbox & live stress testing",
      "30-day post-launch hypercare & engineer handover"
    ]
  },
  {
    title: "Custom System Engineering",
    subtitle: "End-to-end custom ERP, CRM, or operational software platform",
    bestFor: "Growing enterprises replacing fragmented SaaS spreadsheets with an owned system.",
    timeline: "6 to 12 Weeks (Agile 2-Week Sprints)",
    features: [
      "Dedicated Technical Architect & Full-Stack Pod",
      "Bi-weekly clickable demos & sprint reviews",
      "Complete code & database IP ownership",
      "Comprehensive team documentation & operator training"
    ]
  },
  {
    title: "24/7 Managed IT & DevOps Retainer",
    subtitle: "Round-the-clock infrastructure protection, backup drills, and helpdesk",
    bestFor: "Businesses requiring guaranteed uptime, cloud security, and rapid technical escalation.",
    timeline: "Continuous Monthly Retainer",
    features: [
      "24/7/365 active monitoring & telemetry alerts",
      "15-minute response SLA for critical incidents",
      "Zero-downtime deployments & weekly backups",
      "Direct engineer-to-client private Slack/Teams channel"
    ]
  }
];

export const teamPhilosophy = {
  headline: "Pragmatic Engineering, Zero Fluff",
  subheadline: "We are an engineering studio founded in Dhaka, operating for ambitious organizations globally. We reject bloated software, endless meetings, and fragile quick fixes in favor of resilient systems built to last.",
  values: [
    {
      title: "Deterministic Architecture",
      desc: "Every automated pipeline must be resilient to network blips and third-party rate limits. We design idempotent transactions and robust retry queues so data never gets dropped."
    },
    {
      title: "Measurable Economic ROI",
      desc: "We don't build software just for novelty. Every project we accept has a clear metric: hours saved per month, eliminated SaaS seat expenses, or accelerated order fulfillment."
    },
    {
      title: "Code Sovereignty & Clean IP",
      desc: "You own 100% of your source code, deployment scripts, and database assets. We never hold your business hostage with proprietary lock-in."
    },
    {
      title: "Contractual Incident SLAs",
      desc: "When servers go down at 3 AM on a holiday, an automated ticket isn't enough. Our on-call engineers are contractually bound to respond and remediate."
    }
  ]
};
