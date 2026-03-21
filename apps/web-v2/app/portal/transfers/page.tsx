import type { Metadata } from "next";
import styles from "./transfers.module.css";

export const metadata: Metadata = { title: "Transfers" };

const STEPS = [
  { id: 1, label: "Amount & Currency" },
  { id: 2, label: "Recipient Details" },
  { id: 3, label: "Payment Method" },
  { id: 4, label: "Review & Confirm" },
] as const;

export default function TransfersPage() {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>New Transfer</h1>
        <p className={styles.pageSubtitle}>
          Send funds internationally with competitive rates
        </p>
      </header>

      {/* Step progress */}
      <nav aria-label="Transfer steps" className={styles.steps}>
        <ol className={styles.stepsList} role="list">
          {STEPS.map(({ id, label }, idx) => (
            <li key={id} className={styles.stepItem}>
              <div
                className={`${styles.stepCircle} ${idx === 0 ? styles.stepActive : styles.stepPending}`}
                aria-current={idx === 0 ? "step" : undefined}
              >
                {id}
              </div>
              <span className={styles.stepLabel}>{label}</span>
              {idx < STEPS.length - 1 && (
                <div className={styles.stepConnector} aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Step 1: Amount */}
      <div className={`glass-card ${styles.stepCard}`}>
        <h2 className={styles.stepTitle}>Amount &amp; Currency</h2>

        <div className={styles.amountRow}>
          <label htmlFor="transfer-amount" className={styles.fieldLabel}>
            You send
          </label>
          <div className={styles.amountInput}>
            <select className={styles.currencySelect} aria-label="Send currency">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="SGD">SGD</option>
              <option value="AED">AED</option>
            </select>
            <input
              id="transfer-amount"
              type="number"
              min="1"
              step="0.01"
              placeholder="0.00"
              className={styles.amountField}
            />
          </div>
        </div>

        <div className={styles.rateInfo}>
          <span className={styles.rateLabel}>Exchange rate</span>
          <span className={styles.rateValue}>—</span>
        </div>

        <div className={styles.amountRow}>
          <label htmlFor="receive-amount" className={styles.fieldLabel}>
            Recipient gets
          </label>
          <div className={styles.amountInput}>
            <select className={styles.currencySelect} aria-label="Receive currency">
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="CNY">CNY</option>
            </select>
            <input
              id="receive-amount"
              type="number"
              min="1"
              step="0.01"
              placeholder="0.00"
              readOnly
              className={styles.amountField}
            />
          </div>
        </div>

        <button type="button" className={styles.nextBtn}>
          Continue →
        </button>

        <p className={styles.disclaimer}>
          Rates are indicative. Final rate locked at confirmation.
          Transfers subject to KYC verification.
        </p>
      </div>
    </div>
  );
}
