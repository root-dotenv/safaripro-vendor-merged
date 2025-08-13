"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

// Define the shape of the room status data
interface RoomStatusData {
  Available: number;
  Booked: number;
  Maintenance: number;
}

interface RoomStatusPieChartProps {
  data: RoomStatusData;
}

// Define colors for each segment of the pie chart
const PIE_CHART_COLORS = {
  Available: "#22C55E", // Tailwind green-500
  Booked: "#F97316", // Tailwind orange-500
  Maintenance: "#EAB308", // Tailwind yellow-500
};

const RoomStatusPieChart: React.FC<RoomStatusPieChartProps> = ({ data }) => {
  // Format the data for Recharts
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Tooltip
          contentStyle={{
            background: "white",
            borderRadius: "0.5rem",
            border: "1px solid #e2e8f0",
          }}
        />
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
            return (
              <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                className="text-xs font-bold"
              >
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                PIE_CHART_COLORS[entry.name as keyof typeof PIE_CHART_COLORS]
              }
            />
          ))}
        </Pie>
        <Legend
          iconType="circle"
          iconSize={10}
          wrapperStyle={{ fontSize: "14px", color: "#6B7280" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RoomStatusPieChart;
