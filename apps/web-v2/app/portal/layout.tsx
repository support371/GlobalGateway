import type { Metadata } from "next";
import { PortalSidebar } from "@v2/components/portal/PortalSidebar";
import styles from "./portal.module.css";

export const metadata: Metadata = {
  title: {
    default: "Client Portal",
    template: "%s | Portal — Global Gateway",
  },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <PortalSidebar />
      <div className={styles.content}>
        <div className={styles.inner}>{children}</div>
      </div>
    </div>
  );
}
