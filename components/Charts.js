import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
  LineChart, Line, CartesianGrid, Legend 
} from 'recharts';
import { formatINR } from '../lib/computeMetrics';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ padding: '16px', background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
        <p style={{ margin: '0 0 8px', fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ margin: '4px 0', fontSize: '16px', color: 'var(--text-primary)', fontWeight: 300 }}>
            {entry.name}: <span className="number-value" style={{ fontWeight: 500 }}>{entry.name.includes('LTV') ? formatINR(entry.value) : entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ProductChart({ productBreakdown }) {
  return (
    <div style={{ padding: '40px 0' }}>
      <div 
        className="tracking-luxury"
        style={{ fontSize: '10px', fontWeight: 600, marginBottom: '32px', color: 'var(--text-muted)', textTransform: 'uppercase' }}
      >
        Revenue Exposure by Product
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
              width={140}
              tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 300 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="ltv" name="LTV at Risk" radius={[0, 0, 0, 0]}>
              {productBreakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="var(--text-primary)" />
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
    <div style={{ padding: '40px 0' }}>
      <div 
        className="tracking-luxury"
        style={{ fontSize: '10px', fontWeight: 600, marginBottom: '32px', color: 'var(--text-muted)', textTransform: 'uppercase' }}
      >
        Platform Ownership Variance
      </div>
      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={platformBreakdown} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="platform" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 300 }}
            />
            <YAxis type="number" hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="ltv" name="LTV at Risk" radius={[0, 0, 0, 0]}>
              {platformBreakdown.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.ownership === 'Mosaic owns this' ? 'var(--text-primary)' : 'var(--accent-luxury)'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '24px', marginTop: '24px', fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '4px', height: '4px', background: 'var(--text-primary)' }} /> Mosaic Capital
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '4px', height: '4px', background: 'var(--accent-luxury)' }} /> Partner Equity
        </div>
      </div>
    </div>
  );
}

export function CityRiskChart({ cityBreakdown }) {
  return (
    <div style={{ padding: '40px 0' }}>
      <div 
        className="tracking-luxury"
        style={{ fontSize: '10px', fontWeight: 600, marginBottom: '32px', color: 'var(--text-muted)', textTransform: 'uppercase' }}
      >
        Geographic Risk Hotspots
      </div>
      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={cityBreakdown} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="city" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 300 }}
            />
            <YAxis type="number" hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="ltvAtRisk" name="LTV at Risk" radius={[0, 0, 0, 0]}>
              {cityBreakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="var(--text-primary)" />
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
    <div style={{ padding: '40px 0' }}>
      <div 
        className="tracking-luxury"
        style={{ fontSize: '10px', fontWeight: 600, marginBottom: '32px', color: 'var(--text-muted)', textTransform: 'uppercase' }}
      >
        Historical Friction Velocity
      </div>
      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyIssueTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke="var(--border)" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 300 }}
            />
            <YAxis yAxisId="left" orientation="left" stroke="var(--text-muted)" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="var(--accent-luxury)" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="issueCount" 
              name="Complaints" 
              stroke="var(--text-primary)" 
              strokeWidth={1}
              dot={false}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="avgLtv" 
              name="Avg LTV" 
              stroke="var(--accent-luxury)" 
              strokeWidth={1}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
