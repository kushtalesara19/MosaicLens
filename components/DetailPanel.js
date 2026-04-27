import { formatINR } from '../lib/computeMetrics';

export default function DetailPanel({ issue, coOccurrences, onClose }) {
  if (!issue) return null;

  const coOccur = coOccurrences?.find(c => c.issueA === issue.id || c.issueB === issue.id);
  let coOccurMsg = null;
  if (coOccur) {
    const otherLabel = coOccur.issueA === issue.id ? coOccur.labelB : coOccur.labelA;
    const pct = Math.round((coOccur.count / issue.complaint_count) * 100);
    if (pct > 30) {
      coOccurMsg = `${pct}% of ${issue.name} complaints also have ${otherLabel}`;
    }
  }

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          zIndex: 100,
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '800px',
          backgroundColor: 'var(--bg-dark)',
          borderLeft: '1px solid var(--border)',
          zIndex: 101,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ padding: '60px 40px 40px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="tracking-luxury" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Deep Synthesis
            </div>
            <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 200, color: 'var(--text-primary)' }}>{issue.name}</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '32px',
              fontWeight: 200,
              padding: '0',
            }}
          >
            ×
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '60px 40px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '40px', marginBottom: '80px' }}>
            <div>
              <div className="tracking-luxury" style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Volume</div>
              <div className="number-value" style={{ fontSize: '32px', fontWeight: 200 }}>{issue.complaint_count}</div>
            </div>
            <div>
              <div className="tracking-luxury" style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Risk</div>
              <div className="number-value" style={{ fontSize: '32px', fontWeight: 200, color: 'var(--accent-luxury)' }}>{formatINR(issue.total_ltv_at_risk)}</div>
            </div>
            <div>
              <div className="tracking-luxury" style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Loyalty</div>
              <div className="number-value" style={{ fontSize: '32px', fontWeight: 200 }}>{issue.pct_repeat_customers}%</div>
            </div>
          </div>

          {coOccurMsg && (
            <div style={{ padding: '32px', backgroundColor: 'var(--bg-panel)', borderLeft: '1px solid var(--accent-luxury)', marginBottom: '80px' }}>
              <div className="tracking-luxury" style={{ fontSize: '9px', color: 'var(--accent-luxury)', textTransform: 'uppercase', marginBottom: '12px' }}>Structural Link</div>
              <div style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 300 }}>{coOccurMsg}</div>
            </div>
          )}

          <div style={{ marginBottom: '80px' }}>
            <div className="tracking-luxury" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '32px' }}>Accountability Distribution</div>
            <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ textAlign: 'left', padding: '16px 0', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '9px' }}>Platform</th>
                  <th style={{ textAlign: 'left', padding: '16px 0', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '9px' }}>Risk</th>
                  <th style={{ textAlign: 'left', padding: '16px 0', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '9px' }}>Equity</th>
                </tr>
              </thead>
              <tbody>
                {issue.platform_stats.map((p) => (
                  <tr key={p.platform} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '24px 0', color: 'var(--text-primary)', fontWeight: 300 }}>{p.platform}</td>
                    <td style={{ padding: '24px 0', color: 'var(--accent-luxury)' }} className="number-value">{formatINR(p.ltv_risk)}</td>
                    <td style={{ padding: '24px 0' }}>
                      <span className="tracking-luxury" style={{ fontSize: '9px', color: p.ownership === 'Mosaic owns this' ? 'var(--text-primary)' : 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {p.ownership}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <div className="tracking-luxury" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '32px' }}>Individual Narratives</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
              {issue.reviews.map((r) => (
                <div key={r.review_id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '40px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
                    <div className="tracking-luxury" style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {r.product} · via {r.platform}
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[...Array(5)].map((_, i) => (
                        <div key={i} style={{ width: '4px', height: '4px', background: i < r.rating ? 'var(--text-primary)' : 'var(--border)' }} />
                      ))}
                    </div>
                  </div>
                  
                  <p style={{ margin: '0 0 32px 0', color: 'var(--text-primary)', fontSize: '18px', fontWeight: 200, lineHeight: 1.6 }}>
                    &quot;{r.review_text}&quot;
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    <div style={{ color: 'var(--text-primary)' }}>
                      Equity: <span className="number-value">{formatINR(r.customer_ltv)}</span>
                    </div>
                    {r.is_repeat_customer === 1 && <div style={{ color: 'var(--text-primary)' }}>Loyal Client</div>}
                    {r.days_since_purchase <= 30 && <div style={{ color: 'var(--accent-luxury)' }}>Recent Friction</div>}
                    {r.response_from_brand === 0 && r.rating <= 2 && <div style={{ color: 'var(--accent-luxury)', border: '1px solid var(--accent-luxury)', padding: '0 8px' }}>Unresolved</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
