export default function KPICard({ label, value, sub, loading, children }) {
  return (
    <div
      style={{
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        border: 'none'
      }}
    >
      <div 
        className="tracking-luxury"
        style={{ 
          fontSize: '10px', 
          color: 'var(--text-muted)', 
          fontWeight: 600, 
          textTransform: 'uppercase' 
        }}
      >
        {label}
      </div>
      <div
        className="number-value"
        style={{
          fontSize: '64px',
          fontWeight: 200,
          color: 'var(--text-primary)',
          opacity: loading ? 0.3 : 1,
          transition: 'opacity 0.5s ease',
          lineHeight: '1.1',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>{sub}</div>
      {children}
    </div>
  );
}
