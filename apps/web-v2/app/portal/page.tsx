import type { Metadata } from "next";
import styles from "./overview.module.css";
import { ErrorBoundary } from "@v2/components/ui/ErrorBoundary";

export const metadata: Metadata = { title: "Overview" };

// ─── Mock data — replace with Prisma queries wrapped in server actions ────────

const METRICS = [
  { label: "Active Shipments", value: "—", delta: null, status: "neutral" },
  { label: "Open Leases", value: "—", delta: null, status: "neutral" },
  { label: "Legal Cases", value: "—", delta: null, status: "neutral" },
  { label: "Pending Payments", value: "—", delta: null, status: "neutral" },
] as const;

const RAIL_STATUS = [
  { rail: "Air Freight", status: "operational", latency: "Normal" },
  { rail: "Ocean Freight", status: "degraded", latency: "Delays: Asia–EU" },
  { rail: "Road (EU)", status: "operational", latency: "Normal" },
  { rail: "Express Courier", status: "operational", latency: "Normal" },
] as const;

type StatusType = "operational" | "degraded" | "down";

const STATUS_COLORS: Record<StatusType, string> = {
  operational: "var(--color-green-500)",
  degraded:    "var(--color-amber-500)",
  down:        "var(--color-red-500)",
};

export default function PortalOverviewPage() {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Overview</h1>
        <p className={styles.pageSubtitle}>
          Your global operations at a glance
        </p>
      </header>

      {/* Metrics row */}
      <ErrorBoundary section="metrics">
        <section aria-label="Key metrics">
          <ul className={styles.metricsGrid} role="list">
            {METRICS.map(({ label, value }) => (
              <li key={label} className={`glass-card ${styles.metricCard}`}>
                <span className={styles.metricLabel}>{label}</span>
                <span className={styles.metricValue}>{value}</span>
              </li>
            ))}
          </ul>
        </section>
      </ErrorBoundary>

      {/* Transport rail status */}
      <ErrorBoundary section="rail-status">
        <section className={styles.section} aria-labelledby="rail-heading">
          <h2 id="rail-heading" className={styles.sectionTitle}>
            Transport Rail Status
          </h2>
          <ul className={styles.railGrid} role="list">
            {RAIL_STATUS.map(({ rail, status, latency }) => (
              <li key={rail} className={`glass-card ${styles.railCard}`}>
                <div className={styles.railHeader}>
                  <span
                    className={styles.railDot}
                    style={{ background: STATUS_COLORS[status as StatusType] }}
                    aria-label={status}
                  />
                  <span className={styles.railName}>{rail}</span>
                </div>
                <span className={styles.railLatency}>{latency}</span>
              </li>
            ))}
          </ul>
        </section>
      </ErrorBoundary>

      {/* Recent transactions placeholder */}
      <ErrorBoundary section="transactions">
        <section className={styles.section} aria-labelledby="txn-heading">
          <h2 id="txn-heading" className={styles.sectionTitle}>
            Recent Transactions
          </h2>
          <div className={`glass-card ${styles.emptyState}`}>
            <p>No transactions yet.</p>
            <a href="/portal/transfers" className={styles.emptyLink}>
              Initiate a transfer →
            </a>
          </div>
        </section>
      </ErrorBoundary>
    </div>
  );
}
