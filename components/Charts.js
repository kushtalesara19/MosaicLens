import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
  LineChart, Line, CartesianGrid, Legend 
} from 'recharts';
import { formatINR } from '../lib/computeMetrics';

const CustomTooltip = ({ active, payload, label, prefix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card" style={{ padding: '12px', background: 'rgba(13,21,38,0.95)', border: '1px solid var(--border)' }}>
        <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600 }}>{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ margin: '4px 0', fontSize: '14px', color: entry.color || '#ef4444', fontFamily: 'Space Mono, monospace' }}>
            {entry.name}: {entry.name.includes('LTV') ? formatINR(entry.value) : entry.value}
          </p>
        ))}
        {payload[0].payload.ownership && (
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
            {payload[0].payload.ownership}
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
          <BarChart data={productBreakdown} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
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
            <Bar dataKey="ltv" name="LTV at Risk" radius={[0, 4, 4, 0]}>
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
            <Bar dataKey="ltv" name="LTV at Risk" radius={[4, 4, 0, 0]}>
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

export function CityRiskChart({ cityBreakdown }) {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '24px', color: 'var(--text-secondary)' }}>
        City Hotspots (LTV at Risk)
      </div>
      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={cityBreakdown} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="city" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            />
            <YAxis type="number" hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="ltvAtRisk" name="LTV at Risk" radius={[4, 4, 0, 0]}>
              {cityBreakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="var(--accent-cyan)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TrendLineChart({ monthlyIssueTrend }) {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '24px', color: 'var(--text-secondary)' }}>
        Issue Trend Over Time
      </div>
      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyIssueTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            />
            <YAxis yAxisId="left" orientation="left" stroke="var(--accent-blue)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="var(--accent-cyan)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="issueCount" 
              name="Complaint Count" 
              stroke="var(--accent-blue)" 
              strokeWidth={2}
              dot={{ r: 4, fill: 'var(--accent-blue)' }}
              activeDot={{ r: 6 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="avgLtv" 
              name="Avg Customer LTV" 
              stroke="var(--accent-cyan)" 
              strokeWidth={2}
              dot={{ r: 4, fill: 'var(--accent-cyan)' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
