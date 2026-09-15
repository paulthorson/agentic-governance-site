'use client';

/**
 * Transient hold while the 3D instrument remounts.
 * NEVER a flat SVG / heptagon / bead kit — Paul LOCK: 3D is the only face.
 */
export function InstrumentFallback({
  className,
  reason = 'unavailable',
}: {
  className?: string;
  reason?: 'loading' | 'unavailable';
  /** @deprecated Retries are automatic — kept for call-site compat. */
  onRetry?: () => void;
}) {
  return (
    <div
      className={className}
      aria-hidden
      data-instrument-fallback={reason}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 'var(--ag-instrument-min-h)',
        position: 'relative',
        overflow: 'hidden',
        background: 'transparent',
      }}
    />
  );
}
