export default function ProgressBar({ fetched, total, done }) {
  if (done) return null;

  const percentage = total > 0 ? (fetched / total) * 100 : 0;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'var(--border)',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${percentage}%`,
          background: 'var(--text-primary)',
          transition: 'width 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
          boxShadow: '0 0 10px rgba(250,250,250,0.3)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '32px',
          fontSize: '9px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
        }}
        className="animate-luxury"
      >
        Synchronizing Data Stream — {Math.round(percentage)}%
      </div>
    </div>
  );
}
