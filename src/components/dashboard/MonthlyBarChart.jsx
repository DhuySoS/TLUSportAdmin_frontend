import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const MonthlyBarChart = ({ data = [] }) => {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-black text-neutral-900">Thống kê đơn hàng theo tháng</h3>
        <p className="text-xs font-semibold text-neutral-400">Số lượng đơn hàng được bán ra hàng tháng</p>
      </div>

      <div className="h-[250px] w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm font-bold text-neutral-400">
            Không có dữ liệu đơn hàng
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
              <XAxis
                dataKey="month"
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
                formatter={(value) => [value, "Số đơn hàng"]}
              />
              <Bar
                dataKey="totalOrders"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={16}
                name="Số đơn"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MonthlyBarChart;
