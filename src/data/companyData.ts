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

export interface ProjectExample {
  id: string;
  industry: string;
  challenge: string;
  approach: string;
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
      "Full source code ownership with zero monthly per-seat licensing fees",
      "35% increase in cross-department operational velocity",
      "One central view across all your branches, warehouses and retail outlets"
    ],
    techStack: ["React", "NestJS", "TypeScript", "PostgreSQL", "TimescaleDB", "GraphQL", "Tailwind CSS"]
  },
  {
    id: "business-automation",
    title: "Business Process Automation & Workflows",
    shortDesc: "Spend less time copying information, checking documents and chasing approvals.",
    fullDesc: "We map out where your team loses time—spreadsheets, email approval chains, and copying data between portals—and build background automations that handle it reliably.",
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
    fullDesc: "Keep your servers, databases, and customer-facing apps running without disruption. Our systems engineers handle deployments, security patches, backups, and 24/7 monitoring.",
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
      "Predictable monthly cost with dedicated on-call systems engineers"
    ],
    techStack: ["AWS", "Google Cloud", "Kubernetes", "Terraform", "Prometheus", "Grafana", "Cloudflare"]
  }
];

export const projectExamples: ProjectExample[] = [
  {
    id: "retail",
    industry: "Retail & Multi-Channel E-Commerce",
    challenge: "Orders, stock and delivery updates live in separate systems, leaving teams to reconcile them by hand.",
    approach: "Connect storefronts, inventory and courier workflows through one reliable order pipeline."
  },
  {
    id: "logistics",
    industry: "Supply Chain & Logistics",
    challenge: "Freight documents are copied between email, spreadsheets and legacy portals.",
    approach: "Use document extraction and a tailored ERP workflow to keep consignments and approvals in sync."
  },
  {
    id: "finance",
    industry: "Financial Services",
    challenge: "Peak transaction periods expose fragile infrastructure and slow incident response.",
    approach: "Add resilient deployment, monitoring and a clear incident response path for critical services."
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
