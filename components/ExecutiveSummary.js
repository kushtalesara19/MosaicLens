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
      style={{
        padding: '40px',
        borderLeft: '1px solid var(--text-primary)',
        lineHeight: 1.8,
        backgroundColor: 'var(--bg-panel)',
      }}
    >
      <div 
        className="tracking-luxury"
        style={{ 
          fontSize: '10px', 
          color: 'var(--text-muted)', 
          fontWeight: 700, 
          marginBottom: '16px', 
          textTransform: 'uppercase' 
        }}
      >
        Executive Intelligence
      </div>
      <p style={{ fontSize: '18px', fontWeight: 300, color: 'var(--text-primary)', margin: 0, maxWidth: '800px' }}>
        Mosaic Lens has synthesized <span className="number-value" style={{ fontWeight: 500 }}>{totalReviews.toLocaleString('en-IN')}</span> customer interactions. 
        The primary revenue friction is <span style={{ color: 'var(--accent-luxury)', fontWeight: 500 }}>{topIssue.name.toLowerCase()}</span>, 
        prevalent within <strong>{topPlatform}</strong> and <strong>{topProduct}</strong>. 
        <span className="number-value" style={{ fontWeight: 500 }}>{formatINR(metrics.urgentChurnLTV)}</span> remains exposed 
        amongst repeat clientele within the critical 30-day reacquisition window. 
        Brand silence persists for <span className="number-value" style={{ fontWeight: 500 }}>{metrics.responseGapPct}%</span> of high-equity complaints.
      </p>
    </div>
  );
}
