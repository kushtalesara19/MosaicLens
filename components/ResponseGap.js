export default function ResponseGap({ metrics }) {
  if (!metrics) return null;

  return (
    <div style={{ padding: '0', border: 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px', flexWrap: 'wrap', gap: '40px' }}>
        <div>
          <div className="tracking-luxury" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>
            Brand Silence Analysis
          </div>
          <div style={{ fontSize: '18px', fontWeight: 300, color: 'var(--text-secondary)', maxWidth: '500px', lineHeight: 1.6 }}>
            <span style={{ fontSize: '48px', fontWeight: 200, color: 'var(--accent-luxury)', display: 'block', marginBottom: '8px' }} className="number-value">{metrics.responseGapPct}%</span> 
            of high-equity interactions received zero institutional response, representing a significant risk to brand continuity.
          </div>
        </div>

        <div style={{ padding: '40px', backgroundColor: 'var(--bg-panel)', borderLeft: '1px solid var(--accent-luxury)', maxWidth: '450px' }}>
          <div className="tracking-luxury" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent-luxury)', marginBottom: '16px', textTransform: 'uppercase' }}>
            Critical Intervention
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.8, fontWeight: 300 }}>
            <span className="number-value" style={{ fontWeight: 500 }}>{metrics.highValueIgnoredCount}</span> loyal clientele with high lifetime equity have unresolved friction points. Immediate resolution is mandated to prevent permanent churn.
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <th className="tracking-luxury" style={{ padding: '24px 16px', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>Platform</th>
              <th className="tracking-luxury" style={{ padding: '24px 16px', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>High-Equity Friction</th>
              <th className="tracking-luxury" style={{ padding: '24px 16px', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>Institutional Response</th>
              <th className="tracking-luxury" style={{ padding: '24px 16px', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>Friction Resolution %</th>
              <th className="tracking-luxury" style={{ padding: '24px 16px', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase' }}>Ownership</th>
            </tr>
          </thead>
          <tbody>
            {metrics.responseGapByPlatform?.map((row) => (
              <tr key={row.platform} style={{ borderBottom: '1px solid var(--border)', transition: 'color 0.3s ease' }}>
                <td style={{ padding: '32px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>{row.platform}</td>
                <td style={{ padding: '32px 16px' }} className="number-value">{row.complaints}</td>
                <td style={{ padding: '32px 16px' }} className="number-value">{row.responses}</td>
                <td style={{ padding: '32px 16px' }} className="number-value">
                  <span style={{ color: row.responseRate < 50 ? 'var(--accent-luxury)' : 'var(--text-primary)' }}>
                    {row.responseRate}%
                  </span>
                </td>
                <td style={{ padding: '32px 16px' }}>
                  <span className="tracking-luxury" style={{ 
                    fontSize: '9px',
                    color: row.ownership === 'Mosaic owns this' ? 'var(--text-primary)' : 'var(--text-muted)',
                    textTransform: 'uppercase'
                  }}>
                    {row.ownership}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
