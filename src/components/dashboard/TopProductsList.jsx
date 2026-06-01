import React from "react";
import { Trophy } from "lucide-react";

const TopProductsList = ({ products = [] }) => {
  const formatVND = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-neutral-900">
            Sản phẩm bán chạy
          </h3>
        </div>
        <p className="text-xs font-semibold text-neutral-400">
          Top các sản phẩm đem lại sản lượng bán cao nhất
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {products.length === 0 ? (
          <div className="text-sm font-bold text-neutral-400 py-8 text-center">
            Chưa có dữ liệu sản phẩm bán chạy
          </div>
        ) : (
          products.map((product, index) => {
            const rank = index + 1;
            const rankColors = {
              1: "bg-amber-100 text-amber-700",
              2: "bg-slate-100 text-slate-700",
              3: "bg-orange-100 text-orange-700",
            };

            return (
              <div
                key={product.productId || index}
                className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-8 items-center justify-center rounded-xl text-sm font-black ${
                      rankColors[rank] || "bg-neutral-50 text-neutral-500"
                    }`}
                  >
                    {rank === 1 ? <Trophy className="size-4" /> : rank}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-neutral-800 line-clamp-1">
                      {product.productName}
                    </h4>
                    <p className="text-xs font-semibold text-neutral-400">
                      Doanh thu: {formatVND(product.totalRevenue)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    Đã bán: {product.totalSold}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TopProductsList;
