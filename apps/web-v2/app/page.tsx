import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Global Gateway — Your International Business Platform",
  description:
    "Streamline global operations with integrated logistics, commercial real estate, and legal compliance — all in one platform.",
};

// ─── Structured mock data (replace with DB/API calls at cutover) ──────────────

const STATS = [
  { value: "180+", label: "Countries Served" },
  { value: "$2.4B", label: "Transactions Processed" },
  { value: "15,000+", label: "Properties Listed" },
  { value: "50+", label: "Legal Jurisdictions" },
] as const;

const CAPABILITIES = [
  {
    id: "logistics",
    icon: "🚢",
    title: "Global Logistics",
    summary:
      "End-to-end freight forwarding, real-time tracking, and customs clearance across 180+ countries.",
    features: [
      "Multi-modal freight (air, sea, road)",
      "Real-time shipment tracking",
      "Automated customs documentation",
    ],
    href: "/logistics",
    cta: "Explore Logistics",
  },
  {
    id: "real-estate",
    icon: "🏢",
    title: "Commercial Real Estate",
    summary:
      "Premium offices, warehouses, and retail spaces worldwide with flexible leasing terms.",
    features: [
      "15,000+ verified properties",
      "Virtual tours & 3D walkthroughs",
      "Flexible lease structures",
    ],
    href: "/real-estate",
    cta: "Browse Properties",
  },
  {
    id: "legal",
    icon: "⚖️",
    title: "Legal & Compliance",
    summary:
      "Expert legal support for international contracts, regulatory compliance, and risk management.",
    features: [
      "Contract drafting & review",
      "GDPR & digital compliance",
      "Risk assessment & insurance",
    ],
    href: "/legal-services",
    cta: "Get Legal Support",
  },
] as const;

const REGIONS = [
  { name: "Americas", cities: "New York · Miami · São Paulo · Toronto", flag: "🌎" },
  { name: "Europe", cities: "London · Frankfurt · Amsterdam · Paris", flag: "🌍" },
  { name: "Asia-Pacific", cities: "Singapore · Hong Kong · Tokyo · Sydney", flag: "🌏" },
  { name: "Middle East & Africa", cities: "Dubai · Riyadh · Nairobi · Johannesburg", flag: "🌍" },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroEyebrow}>
            <span className={styles.eyebrowBadge}>V2 Platform · Now in Preview</span>
          </div>
          <h1 id="hero-heading" className={styles.heroHeading}>
            Your Global Business
            <span className={`gradient-text ${styles.heroAccent}`}> Gateway</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Integrated logistics, commercial real estate, and legal compliance
            services — designed for enterprises operating across borders.
          </p>
          <div className={styles.heroCta}>
            <Link href="/portal" className={styles.ctaPrimary}>
              Open Client Portal
            </Link>
            <Link href="/about" className={styles.ctaGhost}>
              Learn More
            </Link>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className={styles.orb1} aria-hidden="true" />
        <div className={styles.orb2} aria-hidden="true" />
      </section>

      {/* ── Stats bar ── */}
      <section className={styles.statsBar} aria-label="Platform statistics">
        <div className="container">
          <ul className={styles.statsList} role="list">
            {STATS.map(({ value, label }) => (
              <li key={label} className={styles.statItem}>
                <span className={styles.statValue}>{value}</span>
                <span className={styles.statLabel}>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section className={styles.section} aria-labelledby="capabilities-heading">
        <div className="container">
          <header className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Core Services</p>
            <h2 id="capabilities-heading" className={styles.sectionTitle}>
              Three capabilities, one integrated platform
            </h2>
            <p className={styles.sectionSubtitle}>
              Whether you&apos;re moving freight, securing space, or navigating
              legal complexity — we provide the infrastructure to scale globally.
            </p>
          </header>

          <ul className={styles.capabilitiesGrid} role="list">
            {CAPABILITIES.map((cap) => (
              <li key={cap.id} className={`glass-card ${styles.capCard}`}>
                <div className={styles.capIcon} aria-hidden="true">
                  {cap.icon}
                </div>
                <h3 className={styles.capTitle}>{cap.title}</h3>
                <p className={styles.capSummary}>{cap.summary}</p>
                <ul className={styles.capFeatures} role="list">
                  {cap.features.map((f) => (
                    <li key={f} className={styles.capFeatureItem}>
                      <span className={styles.capFeatureDot} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={cap.href} className={styles.capCta}>
                  {cap.cta} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Regions ── */}
      <section className={styles.regionSection} aria-labelledby="regions-heading">
        <div className="container">
          <header className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Global Presence</p>
            <h2 id="regions-heading" className={styles.sectionTitle}>
              Local expertise, global reach
            </h2>
            <p className={styles.sectionSubtitle}>
              Offices and partner networks spanning four continents, providing
              on-the-ground support in every major financial hub.
            </p>
          </header>

          <ul className={styles.regionsGrid} role="list">
            {REGIONS.map(({ name, cities, flag }) => (
              <li key={name} className={`glass-card ${styles.regionCard}`}>
                <span className={styles.regionFlag} aria-hidden="true">{flag}</span>
                <h3 className={styles.regionName}>{name}</h3>
                <p className={styles.regionCities}>{cities}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection} aria-labelledby="cta-heading">
        <div className="container">
          <div className={styles.ctaCard}>
            <h2 id="cta-heading" className={styles.ctaTitle}>
              Ready to scale your global operations?
            </h2>
            <p className={styles.ctaBody}>
              Join thousands of enterprises already using Global Gateway to
              streamline international logistics, real estate, and compliance.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/portal" className={styles.ctaPrimary}>
                Start Free Trial
              </Link>
              <Link href="/contact" className={styles.ctaGhost}>
                Schedule a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
