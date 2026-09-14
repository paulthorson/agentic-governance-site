'use client';

import {Component, type ErrorInfo, type ReactNode} from 'react';
import {InstrumentFallback} from '@/components/process-instrument/InstrumentFallback';

type Props = {
  children: ReactNode;
  className?: string;
};

type State = {
  hasError: boolean;
};

/**
 * Catch paint/hydrate throws from the 3D instrument so the public `/`
 * shell stays up — never take down the tab for a WebGL failure.
 * Soft-fail is designed empty + retry (not a flat diagram hero).
 */
export class InstrumentErrorBoundary extends Component<Props, State> {
  state: State = {hasError: false};

  static getDerivedStateFromError(): State {
    return {hasError: true};
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[ProcessInstrument] boundary caught', error, info);
    }
  }

  private retry = () => {
    this.setState({hasError: false});
  };

  render() {
    if (this.state.hasError) {
      return (
        <InstrumentFallback
          className={this.props.className}
          reason="unavailable"
          onRetry={this.retry}
        />
      );
    }
    return this.props.children;
  }
}
