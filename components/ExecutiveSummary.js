import { formatINR } from '../lib/computeMetrics';

export default function ExecutiveSummary({ metrics, totalReviews }) {
  if (!metrics || metrics.issueStats.length === 0) {
    return (
      <div className="card" style={{ padding: '24px', color: 'var(--text-muted)' }}>
        Generating executive summary...
      </div>
    );
  }

  // Determine top issue by LTV at risk
  const sortedIssues = [...metrics.issueStats].sort((a, b) => b.total_ltv_at_risk - a.total_ltv_at_risk);
  const topIssue = sortedIssues[0];

  // Top platform for that issue
  const topPlatform = topIssue.platform_stats[0]?.platform || 'unknown platform';

  // For product, we just use the overall top product for simplicity in this summary
  const topProduct = metrics.productBreakdown[0]?.product || 'unknown product';

  return (
    <div
      className="card"
      style={{
        padding: '24px',
        borderLeft: '3px solid var(--accent-cyan)',
        lineHeight: 1.6,
      }}
    >
      <div style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.05em' }}>
        EXECUTIVE SUMMARY
      </div>
      <p style={{ fontSize: '15px', color: 'var(--text-primary)', margin: 0 }}>
        Mosaic Lens has analysed <strong className="number-value">{totalReviews.toLocaleString('en-IN')}</strong> reviews. 
        The most financially damaging issue is <strong style={{ color: '#ef4444' }}>{topIssue.name.toLowerCase()}</strong>, 
        concentrated on <strong>{topPlatform}</strong> and <strong>{topProduct}</strong>. 
        <strong className="number-value" style={{ color: '#ef4444' }}> {formatINR(metrics.urgentChurnLTV)}</strong> is at risk 
        from repeat customers who complained in the last 30 days and are still in the reorder window. 
        <strong className="number-value"> {metrics.responseGapPct}%</strong> of high-value complaints received no brand response.
      </p>
    </div>
  );
}
