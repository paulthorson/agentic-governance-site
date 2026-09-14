'use client';

/**
 * Soft-fail / loading stage for the instrument plane.
 *
 * Designed empty only — never a flat SVG polygon/bead kit as the public face.
 * Optional retry keeps the shell up when WebGL cannot paint.
 */
export function InstrumentFallback({
  className,
  reason = 'unavailable',
  onRetry,
}: {
  className?: string;
  reason?: 'loading' | 'unavailable';
  onRetry?: () => void;
}) {
  return (
    <div
      className={className}
      aria-hidden={reason === 'loading' ? true : undefined}
      data-instrument-fallback={reason}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 'var(--ag-instrument-min-h)',
        position: 'relative',
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      {reason === 'unavailable' && onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          data-instrument-retry
          style={{
            position: 'absolute',
            right: 'var(--spacing-4)',
            bottom: 'var(--spacing-4)',
            appearance: 'none',
            border: '1px solid var(--ag-panel-border)',
            background: 'var(--ag-panel)',
            color: 'var(--ag-sage-lift)',
            fontFamily: 'var(--font-family-body)',
            fontSize: '0.8125rem',
            letterSpacing: '0.04em',
            paddingBlock: 'var(--spacing-2)',
            paddingInline: 'var(--spacing-3)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
          }}
        >
          Retry instrument
        </button>
      ) : null}
    </div>
  );
}
