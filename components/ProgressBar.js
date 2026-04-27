export default function ProgressBar({ fetched, total, done }) {
  const percentage = total > 0 ? (fetched / total) * 100 : 0;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '44px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        zIndex: 1000,
        transform: done ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-cyan))',
            transition: 'width 0.5s ease-out',
          }}
        />
      </div>
      <div
        style={{
          marginLeft: '24px',
          fontSize: '11px',
          fontFamily: 'Space Mono, monospace',
          color: 'var(--text-secondary)',
          minWidth: '240px',
        }}
      >
        {done ? (
          <span style={{ color: '#10b981' }}>✓ DATA SYNC COMPLETE — 5,000 REVIEWS</span>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                border: '2px solid var(--accent-cyan)',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <span>SYNCHRONIZING REVENUE STREAM ({Math.round(percentage)}%)</span>
          </div>
        )}
      </div>
    </div>
  );
}
