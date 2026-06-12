import React from "react";

const OrderTabs = ({ tabs, activeTab, onTabChange, statusCounts }) => {
  return (
    <div className="flex flex-wrap border-b border-neutral-200 gap-1 bg-white p-2 rounded-2xl border">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const count = statusCounts?.[tab.id] || 0;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-sm rounded-xl transition-all outline-none cursor-pointer ${
              isActive
                ? "bg-neutral-900 text-white shadow-sm"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            <Icon size={16} />
            {tab.label}
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                isActive
                  ? "bg-neutral-800 text-white"
                  : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default OrderTabs;
