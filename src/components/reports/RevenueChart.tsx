'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function RevenueChart({ data }: { data?: any }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Ingen data tilgjengelig</div>;
  }

  // Format data for chart
  const chartData = data.map((item: any) => ({
    date: item.date || item.period,
    revenue: item.revenue || 0,
    paid: item.paid || 0
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="date" 
            className="text-xs"
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('no-NO', { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis 
            className="text-xs"
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              
              return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
                  <p className="text-sm font-medium mb-2">
                    {new Date(payload[0].payload.date).toLocaleDateString('no-NO')}
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm text-blue-600">
                      Inntekt: {payload[0].value.toLocaleString('no-NO', { style: 'currency', currency: 'NOK' })}
                    </p>
                    {payload[1] && (
                      <p className="text-sm text-green-600">
                        Betalt: {payload[1].value.toLocaleString('no-NO', { style: 'currency', currency: 'NOK' })}
                      </p>
                    )}
                  </div>
                </div>
              );
            }}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Inntekt"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="paid" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Betalt"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
