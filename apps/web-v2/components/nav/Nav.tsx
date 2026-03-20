import Link from "next/link";
import styles from "./Nav.module.css";

const NAV_LINKS = [
  { href: "/logistics", label: "Logistics" },
  { href: "/real-estate", label: "Real Estate" },
  { href: "/legal-services", label: "Legal & Compliance" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Nav() {
  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        {/* Brand */}
        <Link href="/" className={styles.brand} aria-label="Global Gateway — Home">
          <span className={styles.brandIcon} aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" stroke="url(#gg-grad)" strokeWidth="2" />
              <path
                d="M16 4C16 4 8 10 8 16s8 12 8 12 8-6 8-12-8-12-8-12z"
                stroke="url(#gg-grad)"
                strokeWidth="1.5"
                fill="none"
              />
              <line x1="4" y1="16" x2="28" y2="16" stroke="url(#gg-grad)" strokeWidth="1.5" />
              <defs>
                <linearGradient id="gg-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#60a5fa" />
                  <stop offset="1" stopColor="#d4a843" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className={styles.brandName}>
            Global<span className={styles.brandAccent}>Gateway</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav} aria-label="Primary navigation">
          <ul className={styles.navList} role="list">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={styles.navLink}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <Link href="/portal" className={styles.btnPortal}>
            Client Portal
          </Link>
          <Link href="/api/auth/login" className={styles.btnPrimary}>
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
