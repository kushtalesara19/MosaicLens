'use client';
 
import { useState, useEffect, useCallback } from 'react';
import { fetchAllReviews } from '../lib/fetchReviews';
import { computeMetrics, formatINR } from '../lib/computeMetrics';
import KPICard from '../components/KPICard';
import ExecutiveSummary from '../components/ExecutiveSummary';
import ProgressBar from '../components/ProgressBar';
import IssueTable from '../components/IssueTable';
import DetailPanel from '../components/DetailPanel';
import { ProductChart, PlatformChart } from '../components/Charts';
import ResponseGap from '../components/ResponseGap';
 
const TOTAL_REVIEWS = 5000;
 
export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [fetchedCount, setFetchedCount] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
 
  // Recompute metrics whenever reviews update
  const handleBatchComplete = useCallback((allReviews, count) => {
    setReviews(allReviews);
    setFetchedCount(count);
    const m = computeMetrics(allReviews);
    setMetrics(m);
  }, []);
 
  const handleComplete = useCallback((allReviews) => {
    setIsDone(true);
    const m = computeMetrics(allReviews);
    setMetrics(m);
  }, []);
 
  useEffect(() => {
    fetchAllReviews(handleBatchComplete, handleComplete);
  }, [handleBatchComplete, handleComplete]);
 
  const loading = fetchedCount === 0;
 
  return (
    <div style={{ minHeight: '100vh', paddingTop: isDone ? '0' : '44px' }}>
      {/* Progress Bar */}
      <ProgressBar fetched={fetchedCount} total={TOTAL_REVIEWS} done={isDone} />
 
      {/* Header */}
      <header
        style={{
          padding: '24px 32px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(7,13,26,0.8)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: isDone ? 0 : '44px',
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Logo mark */}
          <div
            style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 800,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            ML
          </div>
          <div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Mosaic Lens
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              CX INTELLIGENCE
            </div>
          </div>
        </div>
 
        <div
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            textAlign: 'right',
            letterSpacing: '0.05em',
          }}
        >
          <div>Revenue-weighted complaint analysis</div>
          <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
            {isDone ? (
              <span style={{ color: '#10b981' }}>
                ✓ {fetchedCount.toLocaleString('en-IN')} reviews analysed
              </span>
            ) : (
              <span style={{ color: 'var(--accent-cyan)' }}>
                Live — {fetchedCount.toLocaleString('en-IN')} / {TOTAL_REVIEWS.toLocaleString('en-IN')} reviews
              </span>
            )}
          </div>
        </div>
      </header>
 
      {/* Main content */}
      <main style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
 
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
            label="Reviews Analysed"
            value={fetchedCount.toLocaleString('en-IN')}
            sub={isDone ? 'Full dataset loaded' : 'Loading more...'}
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
            sub="Still in reorder window"
            danger
            loading={loading}
          />
          <KPICard
            label="Response Gap"
            value={metrics ? `${metrics.responseGapPct}%` : '—'}
            sub="High-value complaints ignored"
            loading={loading}
          />
        </div>
 
        {/* Executive Summary */}
        <div style={{ marginBottom: '24px' }}>
          <ExecutiveSummary metrics={metrics} totalReviews={fetchedCount} />
        </div>
 
        {/* Issue Priority Table */}
        <div style={{ marginBottom: '24px' }}>
          {metrics && metrics.issueStats ? (
            <IssueTable
              issueStats={metrics.issueStats}
              onRowClick={(issue) => setSelectedIssue(issue)}
            />
          ) : (
            <div
              className="card"
              style={{
                padding: '48px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '14px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  border: '2px solid var(--accent-blue)',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  margin: '0 auto 16px',
                  animation: 'spin 1s linear infinite',
                }}
              />
              Building issue priority table...
            </div>
          )}
        </div>
 
        {/* Product + Platform charts */}
        {metrics && (
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
        )}
 
        {/* Co-occurrence insight */}
        {metrics && metrics.topCoOccurrences && metrics.topCoOccurrences.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '4px',
                }}
              >
                Issue Co-occurrence — Systemic Patterns
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  marginBottom: '16px',
                }}
              >
                Issues that appear together in the same review reveal process failures, not isolated incidents
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {metrics.topCoOccurrences.map((pair) => (
                  <div
                    key={`${pair.issueA}|${pair.issueB}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      background: 'rgba(59,130,246,0.04)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Space Mono, monospace',
                        fontSize: '20px',
                        fontWeight: 700,
                        color: 'var(--accent-blue)',
                        minWidth: '40px',
                      }}
                    >
                      {pair.count}
                    </span>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      reviews mention both{' '}
                      <strong style={{ color: 'var(--text-primary)' }}>{pair.labelA}</strong> and{' '}
                      <strong style={{ color: 'var(--text-primary)' }}>{pair.labelB}</strong> —
                      likely one systemic failure with two symptoms
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
 
        {/* Response Gap */}
        {metrics && (
          <div style={{ marginBottom: '32px' }}>
            <ResponseGap metrics={metrics} />
          </div>
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
            Data: mosaicfellowship.in/api · {new Date().getFullYear()}
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
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .charts-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .kpi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
