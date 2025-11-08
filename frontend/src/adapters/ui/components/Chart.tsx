import React from 'react';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts';

interface ChartProps {
  data: any[];
  xKey: string;
  yKeys: { key: string; label: string; color: string }[];
  height?: number;
  title?: string;
}

export const Chart: React.FC<ChartProps> = ({
  data,
  xKey,
  yKeys,
  height = 300,
  title,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {yKeys.map((yKey, index) => (
            index === 0 ? (
              <Bar
                key={yKey.key}
                dataKey={yKey.key}
                fill={yKey.color}
                name={yKey.label}
              />
            ) : (
              <Line
                key={yKey.key}
                type="monotone"
                dataKey={yKey.key}
                stroke={yKey.color}
                name={yKey.label}
                strokeWidth={2}
              />
            )
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};