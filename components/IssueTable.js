'use client';
import { useState } from 'react';
import { formatINR } from '../lib/computeMetrics';

export default function IssueTable({ issueStats, onRowClick }) {
  const [sortCol, setSortCol] = useState('total_ltv_at_risk');
  const [sortDesc, setSortDesc] = useState(true);

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDesc(!sortDesc);
    } else {
      setSortCol(col);
      setSortDesc(true);
    }
  };

  const sortedData = [...issueStats].sort((a, b) => {
    let valA = a[sortCol];
    let valB = b[sortCol];
    if (valA < valB) return sortDesc ? 1 : -1;
    if (valA > valB) return sortDesc ? -1 : 1;
    return 0;
  });

  const renderRatingDots = (rating) => {
    const num = parseFloat(rating);
    let color = '#ef4444'; // red for < 2
    if (num >= 4) color = '#10b981'; // green
    else if (num >= 2) color = '#f59e0b'; // amber

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
        <span className="number-value">{rating}</span>
      </div>
    );
  };

  const renderBar = (pct) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className="number-value" style={{ width: '32px' }}>{pct}%</div>
        <div style={{ flex: 1, height: '4px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <div style={{ height: '100%', width: `${pct}%`, backgroundColor: 'var(--accent-blue)' }} />
        </div>
      </div>
    );
  };

  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(15, 23, 42, 0.03)' }}>
            {[
              { id: 'name', label: 'Issue' },
              { id: 'complaint_count', label: 'Complaints' },
              { id: 'avg_ltv', label: 'Avg Customer LTV' },
              { id: 'total_ltv_at_risk', label: 'Total LTV at Risk' },
              { id: 'pct_repeat_customers', label: 'Repeat Customer %' },
              { id: 'avg_rating', label: 'Avg Rating' },
              { id: 'validated_ltv', label: 'Validated LTV' },
              { id: 'brand_response_pct', label: 'Brand Response %' },
            ].map(col => (
              <th
                key={col.id}
                onClick={() => handleSort(col.id)}
                style={{
                  padding: '16px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  userSelect: 'none'
                }}
              >
                {col.label} {sortCol === col.id ? (sortDesc ? '↓' : '↑') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick(row)}
              style={{
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{row.name}</td>
              <td style={{ padding: '16px' }} className="number-value">{row.complaint_count}</td>
              <td style={{ padding: '16px' }} className="number-value">{formatINR(row.avg_ltv)}</td>
              <td style={{ padding: '16px', fontWeight: 700, color: '#ef4444' }} className="number-value">
                {formatINR(row.total_ltv_at_risk)}
              </td>
              <td style={{ padding: '16px', minWidth: '150px' }}>{renderBar(row.pct_repeat_customers)}</td>
              <td style={{ padding: '16px' }}>{renderRatingDots(row.avg_rating)}</td>
              <td style={{ padding: '16px', color: 'var(--accent-cyan)' }} className="number-value">
                {formatINR(row.validated_ltv)}
              </td>
              <td style={{ padding: '16px' }}>{renderBar(row.brand_response_pct)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
