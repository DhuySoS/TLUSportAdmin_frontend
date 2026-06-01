import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const RevenueChart = ({ data = [], days = 30, onDaysChange }) => {
  // Format VND to compact string (e.g. 1.2M -> 1.2 Trđ)
  const formatVNDCompact = (value) => {
    if (value >= 1e6) {
      return (value / 1e6).toFixed(1) + " Trđ";
    }
    return value.toLocaleString("vi-VN") + " đ";
  };

  const formatVND = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}`;
  };

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-neutral-900">Thống kê doanh thu & đơn hàng</h3>
          <p className="text-xs font-semibold text-neutral-400">Xu hướng doanh thu và số lượng đơn hàng</p>
        </div>
        <select
          value={days}
          onChange={(e) => onDaysChange(Number(e.target.value))}
          className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-bold text-neutral-700 outline-none transition-colors focus:border-blue-500 focus:bg-white"
        >
          <option value={7}>7 ngày qua</option>
          <option value={30}>30 ngày qua</option>
          <option value={90}>90 ngày qua</option>
        </select>
      </div>

      <div className="h-[350px] w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm font-bold text-neutral-400">
            Không có dữ liệu trong khoảng thời gian này
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: -10, left: -10, bottom: 0 }}
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
                yAxisId="left"
                tickFormatter={formatVNDCompact}
                tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
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
                labelStyle={{ fontWeight: "bold", color: "#111827", marginBottom: "0.25rem" }}
                labelFormatter={(value) => `Ngày ${formatDate(value)}`}
                formatter={(value, name) => {
                  if (name === "Doanh thu") return [formatVND(value), name];
                  return [value, name];
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar
                yAxisId="right"
                dataKey="totalOrders"
                fill="#3b82f6"
                name="Đơn hàng"
                radius={[4, 4, 0, 0]}
                barSize={12}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="totalRevenue"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 3, stroke: "#10b981", strokeWidth: 1, fill: "#fff" }}
                activeDot={{ r: 6 }}
                name="Doanh thu"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
