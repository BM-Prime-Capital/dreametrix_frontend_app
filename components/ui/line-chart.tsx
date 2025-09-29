"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PerformanceTrend {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

interface LineChartComponentProps {
  data: PerformanceTrend;
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({ data }) => {
  // Transform the data format to match recharts expectations
  const chartData = data.labels.map((label, index) => {
    const dataPoint: { [key: string]: string | number } = { name: label };
    data.datasets.forEach(dataset => {
      dataPoint[dataset.label] = dataset.data[index] || 0;
    });
    return dataPoint;
  });
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {data.datasets.map((dataset, index) => (
            <Line
              key={index}
              type="linear"
              dataKey={dataset.label}
              stroke={dataset.borderColor}
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
