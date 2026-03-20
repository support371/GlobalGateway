import type { Metadata } from "next";
import styles from "../overview.module.css";

export const metadata: Metadata = { title: "Team" };

export default function TeamPage() {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Team</h1>
        <p className={styles.pageSubtitle}>Manage team members and permissions</p>
      </header>
      <div className={`glass-card ${styles.emptyState}`}>
        <p>Team management coming in next sprint.</p>
      </div>
    </div>
  );
}
