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

  render() {
    if (this.state.hasError) {
      return (
        <InstrumentFallback
          className={this.props.className}
          reason="unavailable"
        />
      );
    }
    return this.props.children;
  }
}
