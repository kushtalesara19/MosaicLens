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
    let color = 'var(--accent-luxury)'; // muted orange for < 2
    if (num >= 4) color = 'var(--text-primary)'; // white for high
    else if (num >= 2) color = 'var(--text-secondary)'; // zinc for medium

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '4px', height: '4px', backgroundColor: color }} />
        <span className="number-value" style={{ fontSize: '10px' }}>{rating}</span>
      </div>
    );
  };

  const renderBar = (pct) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="number-value" style={{ width: '28px', fontSize: '10px' }}>{pct}%</div>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}>
          <div style={{ height: '100%', width: `${pct}%`, backgroundColor: 'var(--text-primary)' }} />
        </div>
      </div>
    );
  };

  return (
    <div style={{ overflowX: 'auto', border: 'none' }}>
      <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {[
              { id: 'name', label: 'Issue' },
              { id: 'complaint_count', label: 'Volume' },
              { id: 'avg_ltv', label: 'Avg LTV' },
              { id: 'total_ltv_at_risk', label: 'Risk Exposure' },
              { id: 'pct_repeat_customers', label: 'Repeat Rate' },
              { id: 'avg_rating', label: 'Rating' },
              { id: 'validated_ltv', label: 'Validated Impact' },
              { id: 'brand_response_pct', label: 'Response' },
            ].map(col => (
              <th
                key={col.id}
                onClick={() => handleSort(col.id)}
                className="tracking-luxury"
                style={{
                  padding: '24px 16px',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                  textTransform: 'uppercase',
                  fontSize: '9px'
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
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderBottomColor = 'var(--text-muted)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderBottomColor = 'var(--border)';
              }}
            >
              <td style={{ padding: '32px 16px', fontWeight: 500 }}>{row.name}</td>
              <td style={{ padding: '32px 16px' }} className="number-value">{row.complaint_count}</td>
              <td style={{ padding: '32px 16px' }} className="number-value">{formatINR(row.avg_ltv)}</td>
              <td style={{ padding: '32px 16px', fontWeight: 600, color: 'var(--accent-luxury)' }} className="number-value">
                {formatINR(row.total_ltv_at_risk)}
              </td>
              <td style={{ padding: '32px 16px', minWidth: '150px' }}>{renderBar(row.pct_repeat_customers)}</td>
              <td style={{ padding: '32px 16px' }}>{renderRatingDots(row.avg_rating)}</td>
              <td style={{ padding: '32px 16px' }} className="number-value">
                {formatINR(row.validated_ltv)}
              </td>
              <td style={{ padding: '32px 16px' }}>{renderBar(row.brand_response_pct)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
