'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatINR } from '../lib/computeMetrics';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="card" style={{ padding: '12px', background: 'rgba(13,21,38,0.95)', border: '1px solid var(--border)' }}>
        <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600 }}>{label}</p>
        <p style={{ margin: 0, fontSize: '14px', color: '#ef4444', fontFamily: 'Space Mono, monospace' }}>
          {formatINR(data.ltv)}
        </p>
        {data.ownership && (
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
            {data.ownership}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function ProductChart({ productBreakdown }) {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '24px', color: 'var(--text-secondary)' }}>
        Top 10 Products by LTV at Risk
      </div>
      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={productBreakdown} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="product" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              width={120}
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="ltv" radius={[0, 4, 4, 0]}>
              {productBreakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="var(--accent-blue)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function PlatformChart({ platformBreakdown }) {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '24px', color: 'var(--text-secondary)' }}>
        Platform Accountability (LTV at Risk)
      </div>
      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={platformBreakdown} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="platform" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            />
            <YAxis type="number" hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="ltv" radius={[4, 4, 0, 0]}>
              {platformBreakdown.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.ownership === 'Mosaic owns this' ? 'var(--accent-blue)' : '#f59e0b'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', background: 'var(--accent-blue)' }} /> Mosaic Owned
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', background: '#f59e0b' }} /> Partner Owned
        </div>
      </div>
    </div>
  );
}
