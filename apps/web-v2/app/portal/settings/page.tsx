import type { Metadata } from "next";
import styles from "../overview.module.css";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Account Settings</h1>
        <p className={styles.pageSubtitle}>Profile, security, and preferences</p>
      </header>
      <div className={`glass-card ${styles.emptyState}`}>
        <p>Settings panel coming in next sprint.</p>
      </div>
    </div>
  );
}
