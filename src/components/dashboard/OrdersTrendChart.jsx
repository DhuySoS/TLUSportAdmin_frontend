import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const OrdersTrendChart = ({ data = [] }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}`;
  };

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-black text-neutral-900">Số lượng đơn hàng mới</h3>
        <p className="text-xs font-semibold text-neutral-400">Biến động số lượng đơn hàng theo ngày</p>
      </div>

      <div className="h-[250px] w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm font-bold text-neutral-400">
            Không có dữ liệu đơn hàng
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
              <XAxis
                dataKey="reportDate"
                tickFormatter={formatDate}
                tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "1rem",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{ fontWeight: "bold", color: "#111827" }}
                labelFormatter={(value) => `Ngày ${formatDate(value)}`}
                formatter={(value) => [value, "Đơn hàng"]}
              />
              <Line
                type="monotone"
                dataKey="totalOrders"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 3, stroke: "#3b82f6", strokeWidth: 1, fill: "#fff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default OrdersTrendChart;
