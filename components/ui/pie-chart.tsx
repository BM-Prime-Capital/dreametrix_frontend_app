"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface GradeDistribution {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
  }[];
  average_score: number;
}

interface DoughnutChartComponentProps {
  data: GradeDistribution;
}

const DoughnutChartComponent: React.FC<DoughnutChartComponentProps> = ({ data }) => {
  // Transform the data format to match recharts expectations
  const chartData = data.labels.map((label, index) => ({
    name: label,
    value: data.datasets[0]?.data[index] || 0,
  }));

  const COLORS = data.datasets[0]?.backgroundColor || ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={75}
            fill="#8884d8"
            paddingAngle={5}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoughnutChartComponent;
