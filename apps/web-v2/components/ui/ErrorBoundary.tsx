"use client";

import React from "react";
import styles from "./ErrorBoundary.module.css";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  section?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production, send to error tracking (e.g. Sentry)
    console.error(
      `[ErrorBoundary:${this.props.section ?? "unknown"}]`,
      error,
      info.componentStack
    );
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className={styles.wrapper} role="alert">
          <p className={styles.icon} aria-hidden="true">⚠️</p>
          <h2 className={styles.title}>Something went wrong</h2>
          <p className={styles.body}>
            {this.props.section
              ? `The "${this.props.section}" section failed to load.`
              : "This section failed to load."}
          </p>
          <button
            className={styles.retry}
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
