
import React from 'react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface DataItem {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: Array<DataItem>;
  innerRadius?: number;
  outerRadius?: number;
}

// Define default colors to use when color is not provided
const defaultColors = ['#4CAF50', '#FFC107', '#F44336', '#2196F3', '#9C27B0', '#3F51B5', '#607D8B', '#795548', '#FF9800', '#00BCD4'];

const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  innerRadius = 60,
  outerRadius = 80,
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey="value"
          animationBegin={0}
          animationDuration={1500}
          animationEasing="ease-out"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || defaultColors[index % defaultColors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value}`, '']}
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
            borderRadius: '8px', 
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
          }}
        />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
