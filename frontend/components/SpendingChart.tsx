// components/SpendingChart.tsx
"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Transaction } from "@/types";

interface SpendingChartProps {
  transactions: Transaction[];
}

const COLORS = [
  "#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b",
  "#ef4444", "#ec4899", "#84cc16", "#0ea5e9", "#f97316",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p className="text-gray-600">Total: <span className="font-bold">${data.value.toFixed(2)}</span></p>
        <p className="text-gray-500 text-sm">{data.count} purchase{data.count > 1 ? "s" : ""}</p>
      </div>
    );
  }
  return null;
};

export default function SpendingChart({ transactions }: SpendingChartProps) {
  
  const merchantTotals: Record<string, { total: number; count: number }> = {};
  
  for (const t of transactions) {
    if (t.transaction_type === "debit") { 
      if (!merchantTotals[t.merchant]) {
        merchantTotals[t.merchant] = { total: 0, count: 0 };
      }
      merchantTotals[t.merchant].total += t.amount;
      merchantTotals[t.merchant].count += 1;
    }
  }
  
  const chartData = Object.entries(merchantTotals)
    .map(([name, { total, count }]) => ({
      name,
      value: Math.round(total * 100) / 100,
      count,
    }))
    .sort((a, b) => b.value - a.value);
  
  const TOP_N = 9; 
  
  let displayData = chartData;
  if (chartData.length > TOP_N) {
    const topMerchants = chartData.slice(0, TOP_N);
    const others = chartData.slice(TOP_N);
    const othersTotal = others.reduce((sum, d) => sum + d.value, 0);
    const othersCount = others.reduce((sum, d) => sum + d.count, 0);
    
    displayData = [
      ...topMerchants,
      { name: "Other", value: Math.round(othersTotal * 100) / 100, count: othersCount }
    ];
  }
  
  if (displayData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No spending data to display
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Spending by Merchant
      </h2>
      
      {/* ResponsiveContainer makes the chart fill its parent's width */}
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={displayData}
            dataKey="value"       
            nameKey="name"        
            cx="50%"             
            cy="50%"             
            outerRadius={150}
            innerRadius={60}     
            paddingAngle={2}     
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
            labelLine={true}
          >
            {displayData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}