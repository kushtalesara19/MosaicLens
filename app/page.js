'use client';
import { useState, useEffect } from 'react';
import { fetchAllReviews } from '../lib/fetchReviews';
import { computeMetrics, formatINR } from '../lib/computeMetrics';
import KPICard from '../components/KPICard';
import ExecutiveSummary from '../components/ExecutiveSummary';
import ProgressBar from '../components/ProgressBar';
import IssueTable from '../components/IssueTable';
import DetailPanel from '../components/DetailPanel';
import { ProductChart, PlatformChart, CityRiskChart, TrendLineChart } from '../components/Charts';
import ResponseGap from '../components/ResponseGap';
 
const TOTAL_REVIEWS = 5000;
 
export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchedCount, setFetchedCount] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
 
  useEffect(() => {
    fetchAllReviews(
      (allReviews, count) => {
        setFetchedCount(count);
        if (allReviews.length > 0) {
          const m = computeMetrics(allReviews);
          setMetrics(m);
        }
      },
      () => {
        setIsDone(true);
        setLoading(false);
      }
    );
  }, []);
 
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <ProgressBar fetched={fetchedCount} total={TOTAL_REVIEWS} done={isDone} />

      <header
        style={{
          padding: '80px 60px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          background: 'var(--bg-dark)',
        }}
      >
        <div>
          <div
            className="tracking-luxury"
            style={{
              fontSize: '32px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              lineHeight: '1',
            }}
          >
            Mosaic Lens
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4em', marginTop: '16px' }}>
            Architectural Synthesis · Data Gallery
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            {isDone ? (
              <span style={{ color: 'var(--text-primary)' }}>
                Archive Ready · {fetchedCount.toLocaleString('en-IN')} units analysed
              </span>
            ) : (
              <span className="animate-luxury">
                Ingesting Stream · {fetchedCount.toLocaleString('en-IN')} / {TOTAL_REVIEWS.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </header>

      <main style={{ padding: '120px 60px', maxWidth: '1800px', margin: '0 auto' }}>
        
        {/* KPI Strip */}
        <div
          className="kpi-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '100px',
            marginBottom: '160px',
          }}
        >
          <KPICard
            label="Synthesis Volume"
            value={fetchedCount.toLocaleString('en-IN')}
            sub="Units processed"
            loading={loading}
          />
          <KPICard
            label="Capital Risk"
            value={metrics ? formatINR(metrics.totalLTVAtRisk) : '—'}
            sub="Repeat equity exposure"
            loading={loading}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', fontStyle: 'italic', lineHeight: '1.4' }}>
              Methodology: full LTV of repeat clientele with rating ≤ 2
            </div>
          </KPICard>
          <KPICard
            label="Urgency Index"
            value={metrics ? formatINR(metrics.urgentChurnLTV) : '—'}
            sub="30-day window"
            loading={loading}
          />
          <KPICard
            label="Brand Silence"
            value={metrics ? `${metrics.responseGapPct}%` : '—'}
            sub="Unresolved high-equity friction"
            loading={loading}
          />
        </div>

        {/* Executive Summary */}
        <div style={{ marginBottom: '160px' }}>
          <ExecutiveSummary metrics={metrics} totalReviews={fetchedCount} />
        </div>

        {/* Issue Priority Table */}
        <div style={{ marginBottom: '160px' }}>
          <div className="tracking-luxury" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '48px' }}>
            Friction Matrix
          </div>
          {metrics && metrics.issueStats ? (
            <IssueTable
              issueStats={metrics.issueStats}
              onRowClick={(issue) => setSelectedIssue(issue)}
            />
          ) : (
            <div
              style={{
                padding: '100px 0',
                textAlign: 'left',
                color: 'var(--text-muted)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.3em'
              }}
              className="animate-luxury"
            >
              Generating friction matrix...
            </div>
          )}
        </div>

        {/* Charts Section */}
        {metrics && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '80px' }}>
            <div
              className="charts-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '120px',
                marginBottom: '120px',
              }}
            >
              <ProductChart productBreakdown={metrics.productBreakdown} />
              <PlatformChart platformBreakdown={metrics.platformBreakdown} />
            </div>

            <div style={{ marginBottom: '120px', borderTop: '1px solid var(--border)' }}>
              <TrendLineChart monthlyIssueTrend={metrics.monthlyIssueTrend} />
            </div>

            <div style={{ marginBottom: '160px', borderTop: '1px solid var(--border)' }}>
              <CityRiskChart cityBreakdown={metrics.cityBreakdown} />
            </div>
          </div>
        )}

        {/* Co-occurrence insight */}
        {metrics && metrics.topCoOccurrences && metrics.topCoOccurrences.length > 0 && (
          <div style={{ marginBottom: '160px', borderTop: '1px solid var(--border)', paddingTop: '100px' }}>
            <div className="tracking-luxury" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '60px' }}>
              Structural Resonance
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '80px' }}>
              {metrics.topCoOccurrences.map((pair) => (
                <div
                  key={`${pair.issueA}|${pair.issueB}`}
                  style={{
                    padding: '40px',
                    borderLeft: '1px solid var(--border)',
                    transition: 'border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div
                    className="number-value"
                    style={{
                      fontSize: '48px',
                      fontWeight: 200,
                      color: 'var(--accent-luxury)',
                      marginBottom: '24px',
                      lineHeight: '1'
                    }}
                  >
                    {pair.count}
                  </div>
                  <div style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, fontWeight: 300 }}>
                    Concurrent mentions of <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{pair.labelA}</span> & <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{pair.labelB}</span> indicate a deeper structural process failure rather than isolated symptoms.
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Response Gap */}
        {metrics && (
          <div style={{ marginBottom: '160px', borderTop: '1px solid var(--border)', paddingTop: '100px' }}>
            <ResponseGap metrics={metrics} />
          </div>
        )}

        {/* Footer */}
        <footer
          style={{
            borderTop: '1px solid var(--border)',
            padding: '100px 0 60px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
            Mosaic Lens · Architectural Intelligence
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {new Date().getFullYear()} · Design Systems
          </div>
        </footer>
      </main>

      <DetailPanel
        issue={selectedIssue}
        coOccurrences={metrics?.topCoOccurrences}
        onClose={() => setSelectedIssue(null)}
      />

      <style>{`
        @media (max-width: 1200px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 60px !important; }
          .charts-grid { grid-template-columns: 1fr !important; gap: 80px !important; }
        }
        @media (max-width: 600px) {
          .kpi-grid { grid-template-columns: 1fr !important; }
          main { padding: 60px 24px !important; }
          header { padding: 60px 24px !important; }
        }
      `}</style>
    </div>
  );
}
