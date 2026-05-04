import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
  LineChart, Line, CartesianGrid, Legend, LabelList
} from 'recharts';
import { formatINR } from '../lib/computeMetrics';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card" style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.98)', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ margin: '4px 0', fontSize: '14px', color: entry.color || '#ef4444', fontFamily: 'Space Mono, monospace' }}>
            {entry.name}: {entry.name.includes('LTV') ? formatINR(entry.value) : entry.value}
          </p>
        ))}
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
          <BarChart data={productBreakdown} layout="vertical" margin={{ top: 0, right: 80, left: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="product" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              width={120}
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'rgba(0,0,0,0.03)' }}
              isAnimationActive={false}
              offset={10}
              position={{ x: 130 }}
            />
            <Bar dataKey="ltv" name="LTV at Risk" radius={[0, 4, 4, 0]}>
              {productBreakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="var(--accent-blue)" />
              ))}
              <LabelList 
                dataKey="ltv" 
                position="right" 
                formatter={(val) => formatINR(val)} 
                style={{ fill: 'var(--text-primary)', fontSize: '11px', fontWeight: 600 }} 
              />
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
          <BarChart data={platformBreakdown} margin={{ top: 30, right: 0, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="platform" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            />
            <YAxis type="number" hide />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'rgba(0,0,0,0.03)' }}
              isAnimationActive={false}
              offset={10}
            />
            <Bar dataKey="ltv" name="LTV at Risk" radius={[4, 4, 0, 0]}>
              {platformBreakdown.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill="var(--accent-blue)" 
                />
              ))}
              <LabelList 
                dataKey="ltv" 
                position="top" 
                formatter={(val) => formatINR(val)} 
                style={{ fill: 'var(--text-primary)', fontSize: '11px', fontWeight: 600 }} 
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
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
          <BarChart data={cityBreakdown} margin={{ top: 30, right: 0, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="city" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            />
            <YAxis type="number" hide />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'rgba(0,0,0,0.03)' }}
              isAnimationActive={false}
              offset={10}
            />
            <Bar dataKey="ltvAtRisk" name="LTV at Risk" radius={[4, 4, 0, 0]}>
              {cityBreakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="var(--accent-cyan)" />
              ))}
              <LabelList 
                dataKey="ltvAtRisk" 
                position="top" 
                formatter={(val) => formatINR(val)} 
                style={{ fill: 'var(--text-primary)', fontSize: '11px', fontWeight: 600 }} 
              />
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
          <LineChart data={monthlyIssueTrend} margin={{ top: 25, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            />
            <YAxis yAxisId="left" orientation="left" stroke="var(--accent-blue)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="var(--accent-cyan)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip 
              content={<CustomTooltip />}
              isAnimationActive={false}
            />
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
