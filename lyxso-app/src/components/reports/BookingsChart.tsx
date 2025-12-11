'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function BookingsChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Ingen data tilgjengelig</div>;
  }

  const chartData = data.map(item => ({
    date: item.date,
    count: item.count || 0
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="date" 
            className="text-xs"
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('no-NO', { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis className="text-xs" />
          <Tooltip 
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              
              return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
                  <p className="text-sm font-medium mb-2">
                    {new Date(payload[0].payload.date).toLocaleDateString('no-NO')}
                  </p>
                  <p className="text-sm text-blue-600">
                    Bookinger: {payload[0].value}
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
