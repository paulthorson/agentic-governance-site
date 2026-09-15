'use client';

import {Component, type ErrorInfo, type ReactNode} from 'react';
import {InstrumentFallback} from '@/components/process-instrument/InstrumentFallback';

type Props = {
  children: ReactNode;
  className?: string;
};

type State = {
  hasError: boolean;
  retryCount: number;
};

const MAX_AUTO_RETRIES = 6;

/**
 * Catch paint/hydrate throws so the tab stays up (#8).
 * Paul LOCK: 3D must persist — auto-remount the instrument; never leave a
 * flat sage-loop / heptagon / diagram as the public face.
 */
export class InstrumentErrorBoundary extends Component<Props, State> {
  state: State = {hasError: false, retryCount: 0};
  private retryTimer: ReturnType<typeof setTimeout> | null = null;

  static getDerivedStateFromError(): Partial<State> {
    return {hasError: true};
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[ProcessInstrument] boundary caught', error, info);
    }
    this.scheduleRemount();
  }

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  }

  private scheduleRemount = () => {
    if (this.retryTimer) clearTimeout(this.retryTimer);
    const attempt = this.state.retryCount;
    if (attempt >= MAX_AUTO_RETRIES) return;
    // Backoff: keep trying to restore true-3D face.
    const delay = Math.min(400 + attempt * 500, 2800);
    this.retryTimer = setTimeout(() => {
      this.setState((s) => ({
        hasError: false,
        retryCount: s.retryCount + 1,
      }));
    }, delay);
  };

  render() {
    if (this.state.hasError) {
      // Transient empty void only — never a diagram hero.
      return (
        <InstrumentFallback
          className={this.props.className}
          reason="unavailable"
        />
      );
    }
    // Key forces a fresh instrument mount after each auto-retry.
    return (
      <InstrumentMount key={`instrument-boundary-${this.state.retryCount}`}>
        {this.props.children}
      </InstrumentMount>
    );
  }
}

/** Height-preserving remount wrapper (no layout chrome). */
function InstrumentMount({children}: {children: ReactNode}) {
  return (
    <div style={{width: '100%', height: '100%', minHeight: 'var(--ag-instrument-min-h)'}}>
      {children}
    </div>
  );
}
