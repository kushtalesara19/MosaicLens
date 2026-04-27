import { formatINR } from '../lib/computeMetrics';

export default function DetailPanel({ issue, coOccurrences, onClose }) {
  if (!issue) return null;

  // Find co-occurrence for this issue
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
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
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
          maxWidth: '600px',
          backgroundColor: 'var(--bg-dark)',
          borderLeft: '1px solid var(--border)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
          zIndex: 101,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s ease-out',
        }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>{issue.name}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '24px',
              padding: '4px',
            }}
          >
            ×
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          
          {/* Mini Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Complaints</div>
              <div className="number-value" style={{ fontSize: '20px', fontWeight: 700 }}>{issue.complaint_count}</div>
            </div>
            <div className="card" style={{ padding: '16px', borderTop: '2px solid #ef4444' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total LTV at Risk</div>
              <div className="number-value" style={{ fontSize: '20px', fontWeight: 700, color: '#ef4444' }}>{formatINR(issue.total_ltv_at_risk)}</div>
            </div>
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Repeat Customer %</div>
              <div className="number-value" style={{ fontSize: '20px', fontWeight: 700 }}>{issue.pct_repeat_customers}%</div>
            </div>
          </div>

          {/* Co-occurrence */}
          {coOccurMsg && (
            <div style={{ padding: '16px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderLeft: '3px solid #f59e0b', marginBottom: '24px', fontSize: '13px', color: 'var(--text-primary)' }}>
              <strong>Systemic Link Detected:</strong> {coOccurMsg}
            </div>
          )}

          {/* Platform Accountability Table */}
          <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Platform Accountability</h3>
          <table style={{ width: '100%', fontSize: '12px', marginBottom: '32px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Platform</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Complaints</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>LTV at Risk</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Ownership</th>
              </tr>
            </thead>
            <tbody>
              {issue.platform_stats.map((p) => (
                <tr key={p.platform} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px', color: 'var(--text-primary)' }}>{p.platform}</td>
                  <td style={{ padding: '8px' }} className="number-value">{p.count}</td>
                  <td style={{ padding: '8px', color: '#ef4444' }} className="number-value">{formatINR(p.ltv_risk)}</td>
                  <td style={{ padding: '8px' }}>
                    <span style={{ 
                      padding: '2px 6px', 
                      backgroundColor: p.ownership === 'Mosaic owns this' ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)',
                      color: p.ownership === 'Mosaic owns this' ? 'var(--accent-blue)' : '#f59e0b',
                      fontSize: '10px'
                    }}>
                      {p.ownership}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Reviews List */}
          <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Critical Reviews (Sorted by LTV)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {issue.reviews.map((r) => (
              <div key={r.review_id} className="card" style={{ padding: '16px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.product}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>via {r.platform}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: i < r.rating ? (r.rating <= 2 ? '#ef4444' : '#f59e0b') : 'var(--border)' }}>★</span>
                    ))}
                  </div>
                </div>
                
                <p style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  &quot;{r.review_text}&quot;
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px' }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px 8px', color: 'var(--text-primary)' }}>
                    Customer LTV: <span className="number-value" style={{ color: '#10b981', fontWeight: 700 }}>{formatINR(r.customer_ltv)}</span>
                  </div>
                  {r.is_repeat_customer === 1 && (
                    <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '4px 8px' }}>
                      Repeat Customer
                    </div>
                  )}
                  {r.days_since_purchase <= 30 && (
                    <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '4px 8px' }}>
                      {r.days_since_purchase} days ago
                    </div>
                  )}
                  {r.response_from_brand === 0 && r.rating <= 2 && (
                    <div style={{ border: '1px solid #ef4444', color: '#ef4444', padding: '4px 8px' }}>
                      No Brand Response
                    </div>
                  )}
                </div>
              </div>
            ))}
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
