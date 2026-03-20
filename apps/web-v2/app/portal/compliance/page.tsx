import type { Metadata } from "next";
import styles from "../overview.module.css";

export const metadata: Metadata = { title: "Compliance & KYC" };

const KYC_DOCS = [
  { id: "government_id", label: "Government-issued ID", required: true },
  { id: "proof_of_address", label: "Proof of Address (< 3 months)", required: true },
  { id: "business_registration", label: "Business Registration Certificate", required: true },
] as const;

export default function CompliancePage() {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Compliance &amp; KYC</h1>
        <p className={styles.pageSubtitle}>
          Complete verification to unlock full platform access
        </p>
      </header>

      <div className={`glass-card ${styles.section}`} style={{ padding: "var(--space-8)" }}>
        <h2 className={styles.sectionTitle}>KYC Status: Not Started</h2>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginTop: "var(--space-2)" }}>
          Upload the following documents to begin verification. Documents are
          reviewed within 1–3 business days.
        </p>

        <ul style={{ listStyle: "none", padding: 0, marginTop: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {KYC_DOCS.map(({ id, label, required }) => (
            <li
              key={id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "var(--space-4)",
                background: "var(--bg-elevated)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
                {label}
                {required && (
                  <span style={{ color: "var(--color-red-500)", marginLeft: "var(--space-1)" }}>*</span>
                )}
              </span>
              <span style={{
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                color: "var(--text-disabled)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
                Not uploaded
              </span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          disabled
          style={{
            marginTop: "var(--space-6)",
            padding: "12px var(--space-8)",
            background: "var(--bg-muted)",
            color: "var(--text-disabled)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            cursor: "not-allowed",
          }}
        >
          Upload Documents (coming soon)
        </button>
      </div>
    </div>
  );
}
