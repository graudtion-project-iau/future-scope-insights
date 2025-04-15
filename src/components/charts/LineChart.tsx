
import React from 'react';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface LineChartProps {
  data: Array<Record<string, any>>;
  lines: Array<{
    dataKey: string;
    color: string;
    name: string;
  }>;
  xAxisDataKey: string;
  height?: number;
  rtl?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  lines, 
  xAxisDataKey, 
  height = 300,
  rtl = true
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
        direction={rtl ? 'rtl' : 'ltr'}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey={xAxisDataKey} 
          axisLine={{ stroke: '#E0E0E0' }}
          tick={{ fill: '#666', fontSize: 12 }}
        />
        <YAxis 
          axisLine={{ stroke: '#E0E0E0' }}
          tick={{ fill: '#666', fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
            borderRadius: '8px', 
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
          }} 
        />
        <Legend wrapperStyle={{ paddingTop: '10px' }} />
        {lines.map((line, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
            activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
