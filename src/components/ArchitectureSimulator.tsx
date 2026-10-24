"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Database,
  ShieldCheck,
  CheckCircle2,
  Terminal
} from "lucide-react";

interface PipelineScenario {
  id: string;
  name: string;
  badge: string;
  summary: string;
  latency: string;
  throughput: string;
  resilience: string;
  nodes: {
    title: string;
    description: string;
    status: string;
  }[];
  samplePayload: string;
}

const scenarios: PipelineScenario[] = [
  {
    id: "ecommerce",
    name: "E-Commerce Multi-Channel Synchronizer",
    badge: "Active Production Engine",
    summary: "Real-time webhook ingestion from Shopify, Amazon & local POS with automatic parcel courier booking & inventory lock.",
    latency: "18 ms avg",
    throughput: "140 orders / sec",
    resilience: "Redis Cluster + Kafka Dead-Letter Queue",
    nodes: [
      {
        title: "01. Storefront Webhook Ingest",
        description: "Validates HMAC signatures from Shopify, WooCommerce & Daraz within 4ms.",
        status: "200 OK · 0 dropped"
      },
      {
        title: "02. Stock Allocator & Idempotency",
        description: "Locks inventory across 14 warehouse locations with Redis distributed mutex.",
        status: "Atomic Lock Active"
      },
      {
        title: "03. Courier API Dispatch",
        description: "Generates Pathao / Steadfast / DHL barcode tracking slip asynchronously.",
        status: "Auto-Consigned"
      },
      {
        title: "04. Ledger & Accounting Sync",
        description: "Pushes double-entry invoice into ERP database without human intervention.",
        status: "Reconciled"
      }
    ],
    samplePayload: JSON.stringify({
      event: "order.created",
      order_id: "AR-98421",
      channels: ["Shopify_D2C", "POS_Gulshan_Branch"],
      items_count: 3,
      inventory_lock: "MUTEX_SUCCESS",
      courier: { provider: "Steadfast_API", tracking: "ST-8840192", label_printed: true },
      processing_latency_ms: 18.4
    }, null, 2)
  },
  {
    id: "erp",
    name: "Custom ERP & Manufacturing Ledger",
    badge: "Core Enterprise Backbone",
    summary: "Event-driven supply chain tracking connecting raw material procurement, Bill of Materials (BOM), and sales audit trails.",
    latency: "32 ms avg",
    throughput: "1,200 transactions / min",
    resilience: "PostgreSQL Streaming Replication + WAL",
    nodes: [
      {
        title: "01. Purchase Order OCR Ingest",
        description: "Extracts vendor invoice line items, tax IDs & customs duty codes via OCR.",
        status: "99.4% Accuracy"
      },
      {
        title: "02. Multi-Level BOM Allocation",
        description: "Deducts sub-assemblies and triggers automated restocking alerts if under threshold.",
        status: "BOM Verified"
      },
      {
        title: "03. RBAC Approval Pipeline",
        description: "Sends interactive approval cards to department directors via Slack / Teams.",
        status: "Digitally Signed"
      },
      {
        title: "04. General Ledger Posting",
        description: "Writes immutable audit record to TimescaleDB with cryptographic checksum.",
        status: "Zero Discrepancy"
      }
    ],
    samplePayload: JSON.stringify({
      transaction: "BOM_EXECUTION",
      batch_id: "MFG-2026-B9",
      components_consumed: 14,
      variance_tolerance: "<0.02%",
      signoff: { role: "Plant_Director", method: "Slack_Interactive_Webhook", approved: true },
      ledger_entry: "CR_RAW_MATERIALS / DR_WIP_FINISHED"
    }, null, 2)
  },
  {
    id: "sentry",
    name: "24/7 Managed Infrastructure Sentry",
    badge: "Continuous Surveillance",
    summary: "High-availability telemetry cluster providing proactive incident detection, synthetic health probes, and automated disaster failover.",
    latency: "< 5s probe",
    throughput: "24/7 Uptime Sentry",
    resilience: "Multi-Zone Kubernetes + Automated Pod Healing",
    nodes: [
      {
        title: "01. Synthetic Ping & Edge Probes",
        description: "Polls API endpoints every 10 seconds from Frankfurt, Singapore, and Virginia.",
        status: "Global Latency Normal"
      },
      {
        title: "02. Anomaly & DDoS Filter",
        description: "Detects HTTP traffic surges and throttles suspicious bots at Cloudflare edge.",
        status: "Rate-Limit Enforced"
      },
      {
        title: "03. Auto-Healing & Pod Scaling",
        description: "Kubernetes horizontal pod autoscaler spins up extra pods during traffic spikes.",
        status: "HPA Ready"
      },
      {
        title: "04. On-Call Escalation Engine",
        description: "Pages designated Systems Engineer if error rate exceeds 0.05% threshold.",
        status: "0 Critical Pagers"
      }
    ],
    samplePayload: JSON.stringify({
      telemetry: "HEALTH_CHECK_OK",
      uptime_sla_mtd: "99.98%",
      cluster_nodes: { active: 6, healthy: 6, max_limit: 18 },
      database_replica_lag_ms: 1.2,
      backup_snapshot: { status: "COMPLETED", storage: "AWS_S3_ENCRYPTED", drill_verified: true },
      pager_duty_status: "STANDBY_NO_INCIDENTS"
    }, null, 2)
  }
];

export default function ArchitectureSimulator() {
  const [activeTab, setActiveTab] = useState<string>("ecommerce");
  const [viewMode, setViewMode] = useState<"flow" | "payload">("flow");

  const currentScenario = scenarios.find((s) => s.id === activeTab) || scenarios[0];

  return (
    <div className="studio-tool overflow-hidden relative">
      {/* Chrome Top Header Bar */}
      <div className="bg-surface-raised/90 px-6 py-4 border-b border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-danger/80" />
            <span className="w-3 h-3 rounded-full bg-warning/80" />
            <span className="w-3 h-3 rounded-full bg-accent" />
          </div>
          <span className="font-mono text-xs text-muted pl-2 border-l border-line">
            AriseStudio Sample Architecture Explorer
          </span>
        </div>

        {/* Live Status Pill */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            INTERACTIVE DEMO
          </span>

          <div className="inline-flex rounded-lg bg-surface-muted p-0.5 border border-line text-xs font-medium">
            <button
              aria-pressed={viewMode === "flow"}
              onClick={() => setViewMode("flow")}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === "flow"
                  ? "bg-accent text-on-accent font-semibold"
                  : "text-muted hover:text-ink"
              }`}
            >
              Pipeline Topology
            </button>
            <button
              aria-pressed={viewMode === "payload"}
              onClick={() => setViewMode("payload")}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === "payload"
                  ? "bg-accent text-on-accent font-semibold"
                  : "text-muted hover:text-ink"
              }`}
            >
              Sample JSON
            </button>
          </div>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="p-4 sm:p-6 bg-surface-muted/50 border-b border-line flex flex-wrap gap-2">
        {scenarios.map((sc) => (
          <button
            key={sc.id}
            aria-pressed={activeTab === sc.id}
            onClick={() => setActiveTab(sc.id)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === sc.id
                ? "bg-accent text-on-accent border border-accent/40 shadow-sm "
                : "bg-surface-muted/40 text-muted hover:text-ink hover:bg-surface-muted/80 border border-transparent"
            }`}
          >
            {sc.id === "ecommerce" && <ShoppingCart className="w-4 h-4" />}
            {sc.id === "erp" && <Database className="w-4 h-4" />}
            {sc.id === "sentry" && <ShieldCheck className="w-4 h-4" />}
            <span>{sc.name}</span>
          </button>
        ))}
      </div>

      {/* Scenario Overview Bar */}
      <div className="px-6 py-4 bg-surface-muted/20 border-b border-line grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-subtle block">THROUGHPUT:</span>
          <span className="text-ink font-semibold text-sm">{currentScenario.throughput}</span>
        </div>
        <div>
          <span className="text-subtle block">AVG LATENCY:</span>
          <span className="text-accent font-semibold text-sm">{currentScenario.latency}</span>
        </div>
        <div>
          <span className="text-subtle block">FAILOVER ARCHITECTURE:</span>
          <span className="text-info font-semibold text-xs">{currentScenario.resilience}</span>
        </div>
        <div>
          <span className="text-subtle block">STATUS:</span>
          <span className="text-accent font-semibold flex items-center gap-1.5 mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Deterministic Execution
          </span>
        </div>
      </div>

      {/* Main Interactive Display */}
      <div className="p-6 sm:p-8">
        <p className="text-sm text-muted max-w-3xl mb-6 leading-relaxed">
          {currentScenario.summary}
        </p>

        {viewMode === "flow" ? (
          <div className="studio-list studio-list--four">
            {currentScenario.nodes.map((node, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-surface-muted/80 border border-line hover:border-accent/40 transition-colors flex flex-col justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-accent mb-2">
                    Phase {i + 1}
                  </div>
                  <h4 className="text-sm font-semibold text-ink group-hover:text-accent transition-colors">
                    {node.title}
                  </h4>
                  <p className="text-xs text-muted mt-2 leading-relaxed">
                    {node.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-line text-xs text-accent flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {node.status}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-canvas border border-line p-5 font-mono text-xs text-muted overflow-x-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-line text-subtle text-xs">
              <span className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-accent" />
                Raw Event Payload Stream
              </span>
              <span>Content-Type: application/json</span>
            </div>
            <pre className="text-accent leading-relaxed">
              {currentScenario.samplePayload}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
