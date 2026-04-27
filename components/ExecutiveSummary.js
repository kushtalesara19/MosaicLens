import { formatINR } from '../lib/computeMetrics';

export default function ExecutiveSummary({ metrics, totalReviews }) {
  if (!metrics || metrics.issueStats.length === 0) {
    return (
      <div className="card" style={{ padding: '24px', color: 'var(--text-muted)' }}>
        Generating executive summary...
      </div>
    );
  }

  const sortedIssues = [...metrics.issueStats].sort((a, b) => b.total_ltv_at_risk - a.total_ltv_at_risk);
  const topIssue = sortedIssues[0];
  const topPlatform = topIssue.platform_stats[0]?.platform || 'unknown platform';
  const topProduct = metrics.productBreakdown[0]?.product || 'unknown product';

  return (
    <div className="card" style={{ padding: '24px', borderLeft: '4px solid var(--accent-blue)', background: 'var(--bg-panel)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        
        {/* Risk Column */}
        <div>
          <div style={{ fontSize: '11px', color: 'var(--accent-blue)', fontWeight: 700, marginBottom: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Operational Risk Intelligence
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            Analysis of <strong className="number-value">{totalReviews.toLocaleString('en-IN')}</strong> customer touchpoints identifies 
            <strong style={{ color: '#ef4444' }}> {topIssue.name}</strong> as the primary driver of financial friction, 
            accounting for <strong className="number-value">{formatINR(topIssue.total_ltv_at_risk)}</strong> in potential churn. 
            The friction is most acute on <strong>{topPlatform}</strong>.
          </div>
        </div>

        {/* Action Column */}
        <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '32px' }}>
          <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 700, marginBottom: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Critical Recovery Window
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            There is a <strong className="number-value" style={{ color: '#ef4444' }}>{formatINR(metrics.urgentChurnLTV)}</strong> recovery opportunity in the next 30 days. 
            These are repeat customers who are currently within their reorder window but have unresolved high-friction experiences.
            Current response gap: <strong className="number-value" style={{ color: 'var(--text-primary)' }}>{metrics.responseGapPct}%</strong>.
          </div>
        </div>

      </div>
    </div>
  );
}
