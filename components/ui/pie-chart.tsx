"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

// Define the colors for each segment of the doughnut chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DoughnutChartComponent: React.FC = () => {
  return (
    <div className="w-full h-full p-4 bg-white shadow rounded-2xl">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={40} // Makes it a doughnut by having a non-zero inner radius
            outerRadius={75}
            fill="#8884d8"
            paddingAngle={5}
          >
            {data.map((entry, index) => (
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
