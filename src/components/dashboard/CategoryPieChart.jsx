import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#64748b"];

const CategoryPieChart = ({ data = [] }) => {
  const formatVND = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-black text-neutral-900">Doanh thu theo danh mục</h3>
        <p className="text-xs font-semibold text-neutral-400">Tỷ lệ đóng góp doanh thu của các danh mục</p>
      </div>

      <div className="relative my-4 flex h-[280px] w-full items-center justify-center">
        {data.length === 0 ? (
          <div className="text-sm font-bold text-neutral-400">Không có dữ liệu danh mục</div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="revenue"
                  nameKey="categoryName"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "1rem",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value) => [formatVND(value), "Doanh thu"]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  tick={{ fontSize: 12, fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xs font-semibold text-neutral-400 uppercase">Tổng cộng</span>
              <span className="text-lg font-black text-neutral-800">
                {totalRevenue >= 1e6
                  ? (totalRevenue / 1e6).toFixed(1) + " Trđ"
                  : formatVND(totalRevenue)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPieChart;
