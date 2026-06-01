import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconColor = "text-blue-600",
  bgColor = "bg-blue-50",
}) => {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="text-neutral-500 text-sm font-semibold uppercase tracking-wider">
          {title}
        </div>
        <div
          className={`flex size-12 items-center justify-center rounded-2xl ${bgColor} ${iconColor}`}
        >
          <Icon className="size-6" />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-3xl font-black tracking-tight text-neutral-950">
          {value}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
