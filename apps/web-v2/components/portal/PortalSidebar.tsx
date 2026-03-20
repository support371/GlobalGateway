import Link from "next/link";
import styles from "./PortalSidebar.module.css";

const NAV_SECTIONS = [
  {
    label: "Operations",
    items: [
      { href: "/portal", icon: "◈", label: "Overview" },
      { href: "/portal/transfers", icon: "⇄", label: "Transfers" },
      { href: "/portal/history", icon: "≡", label: "History" },
    ],
  },
  {
    label: "Compliance",
    items: [
      { href: "/portal/compliance", icon: "✓", label: "Compliance & KYC" },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/portal/settings", icon: "⚙", label: "Settings" },
      { href: "/portal/team", icon: "◎", label: "Team" },
    ],
  },
] as const;

export function PortalSidebar() {
  return (
    <aside className={styles.sidebar} aria-label="Portal navigation">
      <nav className={styles.nav}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className={styles.section}>
            <p className={styles.sectionLabel}>{section.label}</p>
            <ul className={styles.list} role="list">
              {section.items.map(({ href, icon, label }) => (
                <li key={href}>
                  <Link href={href} className={styles.link}>
                    <span className={styles.icon} aria-hidden="true">{icon}</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className={styles.logoutBtn}>
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
