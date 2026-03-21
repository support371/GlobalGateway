import type { Metadata } from "next";
import styles from "../overview.module.css";

export const metadata: Metadata = { title: "Transaction History" };

export default function HistoryPage() {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Transaction History</h1>
        <p className={styles.pageSubtitle}>All payments, transfers, and fees</p>
      </header>
      <div className={`glass-card ${styles.emptyState}`}>
        <p>No transactions yet.</p>
        <a href="/portal/transfers" className={styles.emptyLink}>
          Make your first transfer →
        </a>
      </div>
    </div>
  );
}
