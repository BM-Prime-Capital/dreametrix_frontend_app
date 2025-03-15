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

const data = [
  { name: "Jan", value: 84 },
  { name: "Feb", value: 50 },
  { name: "Mar", value: 77 },
  { name: "Apr", value: 90 },
  { name: "May", value: 92 },
  { name: "Jun", value: 84 },
];

const LineChartComponent: React.FC = () => {
  return (
    <div className="w-full h-full p-4 bg-white shadow-md rounded-2xl">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="linear"
            dataKey="value"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
