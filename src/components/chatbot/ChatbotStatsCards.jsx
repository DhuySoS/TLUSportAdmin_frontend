import React from "react";
import { MessageSquare, Users, MessageCircle, Smile, User } from "lucide-react";

const ChatbotStatsCards = ({ stats, loading }) => {
  const displayVal = (val, mockVal) => {
    if (loading) return "...";
    return val !== undefined && val !== null ? val.toLocaleString() : mockVal;
  };

  const cards = [
    {
      title: "Tổng số cuộc trò chuyện",
      value: displayVal(stats?.totalSessions, "1,248"),
      icon: MessageSquare,
      iconColor: "text-blue-600 bg-blue-50 border border-blue-100",
    },
    {
      title: "Số người dùng đã chat",
      value: displayVal(stats?.authenticatedSessions, "856"),
      icon: Users,
      iconColor: "text-green-600 bg-green-50 border border-green-100",
    },
    {
      title: "Khách vãng lai dùng chat",
      value: displayVal(stats?.guestSessions, "392"),
      icon: User,
      iconColor: "text-amber-600 bg-amber-50 border border-amber-100",
    },
    {
      title: "Tin nhắn đã gửi",
      value: displayVal(stats?.totalMessages, "3,672"),
      icon: MessageCircle,
      iconColor: "text-indigo-600 bg-indigo-50 border border-indigo-100",
    },
  ];

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="group rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`flex size-12 items-center justify-center rounded-2xl ${card.iconColor}`}
              >
                <Icon className="size-6" />
              </div>
            </div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              {card.title}
            </p>
            <h3 className="text-3xl font-black text-neutral-900 mt-2 leading-none">
              {card.value}
            </h3>
          </div>
        );
      })}
    </div>
  );
};

export default ChatbotStatsCards;
