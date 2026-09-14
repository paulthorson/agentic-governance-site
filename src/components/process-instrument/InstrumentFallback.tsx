'use client';

/**
 * Designed non-WebGL stage — keeps the right instrument plane present
 * when canvas/WebGL cannot paint. Matches void + sage craft; no KPIs.
 */
export function InstrumentFallback({
  className,
  reason = 'unavailable',
}: {
  className?: string;
  reason?: 'loading' | 'unavailable';
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
      }}
    >
      <svg
        viewBox="0 0 640 640"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{display: 'block', opacity: reason === 'loading' ? 0.35 : 0.55}}
      >
        <ellipse
          cx="320"
          cy="310"
          rx="168"
          ry="150"
          fill="none"
          stroke="rgba(138,154,142,0.45)"
          strokeWidth="1.5"
        />
        <ellipse
          cx="320"
          cy="310"
          rx="168"
          ry="150"
          fill="none"
          stroke="rgba(242,241,236,0.28)"
          strokeWidth="0.75"
          strokeDasharray="4 10"
        />
        {[
          [220, 220],
          [340, 185],
          [445, 265],
          [420, 390],
          [300, 445],
          [205, 355],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r="5"
              fill="none"
              stroke="rgba(216,221,214,0.7)"
              strokeWidth="1.25"
            />
            <circle cx={x} cy={y} r="1.5" fill="rgba(138,154,142,0.85)" />
          </g>
        ))}
      </svg>
    </div>
  );
}
