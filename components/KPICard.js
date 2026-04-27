export default function KPICard({ label, value, sub, accent, danger, loading, children }) {
  let borderColor = 'var(--border)';
  if (accent) borderColor = 'var(--accent-blue)';
  if (danger) borderColor = '#ef4444'; // red

  return (
    <div
      className="card"
      style={{
        padding: '24px',
        borderTop: `2px solid ${borderColor}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
        {label}
      </div>
      <div
        className="number-value"
        style={{
          fontSize: '28px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          opacity: loading ? 0.5 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sub}</div>
      {children}
    </div>
  );
}
