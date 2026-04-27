'use client';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { fetchAllReviews } from '../lib/fetchReviews';
import { computeMetrics, formatINR } from '../lib/computeMetrics';
import { downloadCSV } from '../lib/exportUtils';
import KPICard from '../components/KPICard';
import ExecutiveSummary from '../components/ExecutiveSummary';
import ProgressBar from '../components/ProgressBar';
import IssueTable from '../components/IssueTable';
import DetailPanel from '../components/DetailPanel';
import { ProductChart, PlatformChart, CityRiskChart, TrendLineChart } from '../components/Charts';
import ResponseGap from '../components/ResponseGap';
 
const TOTAL_REVIEWS = 5000;
 
export default function Dashboard() {
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchedCount, setFetchedCount] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    platform: 'All',
    product: 'All',
  });
 
  useEffect(() => {
    fetchAllReviews(
      (batch, count) => {
        setFetchedCount(count);
        setAllReviews(batch);
      },
      (final) => {
        setAllReviews(final);
        setIsDone(true);
        setLoading(false);
      }
    );
  }, []);

  // Unique Filter Options
  const platforms = useMemo(() => ['All', ...new Set(allReviews.map(r => r.platform))].filter(Boolean), [allReviews]);
  const products = useMemo(() => ['All', ...new Set(allReviews.map(r => r.product))].filter(Boolean), [allReviews]);

  // Derived Metrics based on Filters
  const metrics = useMemo(() => {
    let filtered = allReviews;
    if (filters.platform !== 'All') {
      filtered = filtered.filter(r => r.platform === filters.platform);
    }
    if (filters.product !== 'All') {
      filtered = filtered.filter(r => r.product === filters.product);
    }
    return computeMetrics(filtered);
  }, [allReviews, filters]);

  const handleExport = () => {
    if (!metrics || !metrics.issueStats) return;
    const exportData = metrics.issueStats.map(stat => ({
      Issue: stat.name,
      Complaints: stat.complaint_count,
      Avg_LTV: Math.round(stat.avg_ltv),
      Total_LTV_Risk: stat.total_ltv_at_risk,
      Repeat_Rate: `${stat.pct_repeat_customers}%`,
      Rating: stat.avg_rating,
      Response_Rate: `${stat.brand_response_pct}%`
    }));
    downloadCSV(exportData, `mosaic_lens_report_${new Date().toISOString().split('T')[0]}.csv`);
  };
 
  return (
    <div style={{ minHeight: '100vh', paddingTop: isDone ? '0' : '44px' }}>
      <ProgressBar fetched={fetchedCount} total={TOTAL_REVIEWS} done={isDone} />

      {/* Header */}
      <header
        style={{
          padding: '16px 32px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: isDone ? 0 : '44px',
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={40}
            height={40}
            style={{ objectFit: 'contain' }}
            priority
          />
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Mosaic Lens
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              CX INTELLIGENCE DASHBOARD
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
           {/* Export Button */}
           {isDone && (
            <button
              onClick={handleExport}
              style={{
                background: 'var(--text-primary)',
                color: 'var(--bg-panel)',
                border: 'none',
                padding: '8px 16px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.05em',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              DOWNLOAD REPORT (.CSV)
            </button>
          )}

          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right' }}>
            <div style={{ fontWeight: 600 }}>{fetchedCount.toLocaleString('en-IN')} units processed</div>
            <div style={{ color: isDone ? '#10b981' : 'var(--accent-cyan)' }}>
              {isDone ? '✓ ANALYSIS COMPLETE' : '• LIVE STREAMING'}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Global Filter Bar */}
        <div 
          className="card" 
          style={{ 
            padding: '16px 24px', 
            marginBottom: '24px', 
            display: 'flex', 
            gap: '32px', 
            alignItems: 'center',
            background: 'var(--bg-panel)'
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Intelligence Filters
          </div>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Platform:</label>
            <select 
              value={filters.platform}
              onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                padding: '4px 8px',
                fontSize: '12px',
                outline: 'none'
              }}
            >
              {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Product:</label>
            <select 
              value={filters.product}
              onChange={(e) => setFilters(prev => ({ ...prev, product: e.target.value }))}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                padding: '4px 8px',
                fontSize: '12px',
                outline: 'none',
                maxWidth: '200px'
              }}
            >
              {products.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {(filters.platform !== 'All' || filters.product !== 'All') && (
            <button 
              onClick={() => setFilters({ platform: 'All', product: 'All' })}
              style={{ fontSize: '11px', color: 'var(--accent-blue)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* KPI Strip */}
        <div
          className="kpi-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <KPICard
            label="Filtered Segment"
            value={(metrics?.issueStats?.reduce((acc, s) => acc + s.complaint_count, 0) || 0).toLocaleString('en-IN')}
            sub="Total relevant reviews"
          />
          <KPICard
            label="Total LTV at Risk"
            value={metrics ? formatINR(metrics.totalLTVAtRisk) : '—'}
            sub="Repeat customers, rating ≤ 2"
            accent
            loading={loading}
          />
          <KPICard
            label="Urgent — Last 30 Days"
            value={metrics ? formatINR(metrics.urgentChurnLTV) : '—'}
            sub="Friction in reorder window"
            danger
            loading={loading}
          />
          <KPICard
            label="Response Gap"
            value={metrics ? `${metrics.responseGapPct}%` : '—'}
            sub="Silence on high-value friction"
            loading={loading}
          />
        </div>

        {/* Executive Summary */}
        <div style={{ marginBottom: '24px' }}>
          <ExecutiveSummary metrics={metrics} totalReviews={allReviews.length} />
        </div>

        {/* Issue Priority Table */}
        <div style={{ marginBottom: '24px' }}>
          {metrics && metrics.issueStats ? (
            <IssueTable
              issueStats={metrics.issueStats}
              onRowClick={(issue) => setSelectedIssue(issue)}
            />
          ) : (
            <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading intelligence matrix...
            </div>
          )}
        </div>

        {/* Charts Section */}
        {metrics && (
          <>
            <div
              className="charts-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <ProductChart productBreakdown={metrics.productBreakdown} />
              <PlatformChart platformBreakdown={metrics.platformBreakdown} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <TrendLineChart monthlyIssueTrend={metrics.monthlyIssueTrend} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
                Geographic Risk Hotspots
              </div>
              <CityRiskChart cityBreakdown={metrics.cityBreakdown} />
            </div>
          </>
        )}

        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Mosaic Lens · CX Intelligence Dashboard
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
            {new Date().getFullYear()} · Final Submission
          </div>
        </div>
      </main>

      {/* Detail Panel */}
      <DetailPanel
        issue={selectedIssue}
        coOccurrences={metrics?.topCoOccurrences}
        onClose={() => setSelectedIssue(null)}
      />

      <style>{`
        @media (max-width: 900px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .charts-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .kpi-grid { grid-template-columns: 1fr !important; }
          main { padding: 20px !important; }
        }
      `}</style>
    </div>
  );
}
