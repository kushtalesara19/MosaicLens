export default function ResponseGap({ metrics }) {
  if (!metrics) return null;

  return (
    <div className="card" style={{ padding: '24px', borderTop: '2px solid #ef4444' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>
            Response Gap Analysis
          </h2>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444' }} className="number-value">{metrics.responseGapPct}%</span> of your highest-value angry customers were ignored.
          </div>
        </div>

        <div style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', maxWidth: '400px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#ef4444', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Immediate Action
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong className="number-value" style={{ color: 'var(--text-primary)' }}>{metrics.highValueIgnoredCount}</strong> repeat customers with LTV &gt; ₹10,000 have unresolved complaints and no brand response. Responding today costs nothing.
          </div>
        </div>
      </div>

      <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>Platform</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>High-LTV Complaints</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>Responses Given</th>
            <th style={{ padding: '12px 16px', fontWeight: 600 }}>Response Rate</th>
          </tr>
        </thead>
        <tbody>
          {metrics.responseGapByPlatform?.map((row) => (
            <tr key={row.platform} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 600 }}>{row.platform}</td>
              <td style={{ padding: '12px 16px' }} className="number-value">{row.complaints}</td>
              <td style={{ padding: '12px 16px' }} className="number-value">{row.responses}</td>
              <td style={{ padding: '12px 16px' }} className="number-value">
                <span style={{ color: row.responseRate < 50 ? '#ef4444' : 'var(--text-primary)' }}>
                  {row.responseRate}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
