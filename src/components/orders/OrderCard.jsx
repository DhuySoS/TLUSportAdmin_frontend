import React from "react";
import {
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  Receipt,
  Truck,
  ShoppingBag,
  CreditCard,
} from "lucide-react";

const OrderCard = ({
  order,
  isExpanded,
  onToggleExpand,
  loading,
  returnDetail,
  adminNote,
  onAdminNoteChange,
  onApproveReturn,
  onRejectReturn,
  onConfirm,
  onShip,
  onDeliver,
  onCancel,
}) => {
  const isPending = order.orderStatus === "PENDING";
  const isProcessing = order.orderStatus === "PROCESSING";
  const isShipped = order.orderStatus === "SHIPPED";
  const isTerminal =
    order.orderStatus === "DELIVERED" ||
    order.orderStatus === "CANCELLED" ||
    order.orderStatus === "RETURN_REQUESTED" ||
    order.orderStatus === "RETURNED" ||
    order.orderStatus === "RETURN_REJECTED";

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getOrderStatusBadge = (status) => {
    const map = {
      PENDING: {
        label: "Chờ xác nhận",
        cls: "text-neutral-950 border-neutral-950 bg-transparent",
      },
      PROCESSING: {
        label: "Đang chuẩn bị",
        cls: "text-neutral-950 border-neutral-950 bg-transparent",
      },
      SHIPPED: {
        label: "Đang giao hàng",
        cls: "text-neutral-950 border-neutral-950 bg-transparent",
      },
      DELIVERED: {
        label: "Đã giao",
        cls: "text-neutral-950 border-neutral-950 bg-transparent font-bold",
      },
      CANCELLED: {
        label: "Đã hủy",
        cls: "text-neutral-950 border-neutral-950 bg-transparent",
      },
      RETURN_REQUESTED: {
        label: "Yêu cầu hoàn trả",
        cls: "text-neutral-950 border-neutral-950 bg-transparent",
      },
      RETURNED: {
        label: "Đã trả hàng",
        cls: "text-neutral-950 border-neutral-950 bg-transparent font-bold",
      },
      RETURN_REJECTED: {
        label: "Từ chối trả hàng",
        cls: "text-neutral-950 border-neutral-950 bg-transparent",
      },
    };
    const item = map[status] || {
      label: status,
      cls: "text-neutral-950 border-neutral-950 bg-transparent",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${item.cls}`}
      >
        {item.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const map = {
      UNPAID: {
        label: "Chưa thanh toán",
        cls: "text-neutral-950 border-neutral-950 bg-transparent",
      },
      PAID: {
        label: "Đã thanh toán",
        cls: "text-neutral-950 border-neutral-950 bg-transparent font-bold",
      },
      FAILED: {
        label: "Thanh toán thất bại",
        cls: "text-neutral-950 border-neutral-950 bg-transparent",
      },
      REFUNDED: {
        label: "Đã hoàn tiền",
        cls: "text-neutral-950 border-neutral-950 bg-transparent",
      },
    };
    const item = map[status] || {
      label: status,
      cls: "text-neutral-950 border-neutral-950 bg-transparent",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${item.cls}`}
      >
        {item.label}
      </span>
    );
  };

  const getPaymentMethodLabel = (code) => {
    const map = {
      CASH: "Tiền mặt (COD)",
      VNPAY: "VNPAY",
      WALLET: "Ví số dư",
    };
    return map[code] || code;
  };

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header card đơn hàng */}
      <div className="flex flex-wrap justify-between items-center pb-4 border-b border-neutral-100 gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-neutral-955">
            Mã đơn hàng: #{order.orderId}
          </h3>
          <p className="text-xs text-neutral-400 font-medium">
            Thời gian đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getOrderStatusBadge(order.orderStatus)}
          {getPaymentStatusBadge(order.paymentStatus)}
        </div>
      </div>

      {/* Items & Thông tin thanh toán */}
      <div className="py-5 grid md:grid-cols-[1.4fr_1fr] gap-6 items-start">
        {/* Danh sách items */}
        <div className="space-y-4">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Mặt hàng ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
          </p>
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex gap-4 items-center p-3 rounded-2xl border border-neutral-200 bg-neutral-50/30"
            >
              <img
                src={
                  item.imageUrl || "https://placehold.co/60x60?text=No+Image"
                }
                alt={item.productName}
                className="w-16 h-16 object-cover border border-neutral-200 rounded-xl shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-neutral-955 truncate">
                  {item.productName}
                </h4>
                <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                  Mã SKU: {item.skuCode || "N/A"}
                </p>
                {item.attributeValues && item.attributeValues.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {item.attributeValues.map((attr, aIdx) => (
                      <span
                        key={aIdx}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-neutral-800 border border-neutral-200/80"
                      >
                        {attr.attributeName || attr.name}:{" "}
                        {attr.valueName || attr.value}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-neutral-500 mt-2 font-bold">
                  Giá bán: {formatCurrency(item.price)} x {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Thanh toán & Tổng thu */}
        <div className="bg-neutral-50/50 rounded-2xl p-5 space-y-3 border border-neutral-200 text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-200/50">
            <span className="text-neutral-500 font-bold flex items-center gap-1.5">
              <Receipt size={14} className="text-neutral-400" /> Tạm tính:
            </span>
            <span className="font-extrabold text-neutral-800">
              {formatCurrency(
                order.subtotal ||
                  order.totalAmount -
                    (order.shippingFee || 0) +
                    (order.discountAmount || 0),
              )}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-neutral-200/50">
            <span className="text-neutral-500 font-bold flex items-center gap-1.5">
              <Truck size={14} className="text-neutral-400" /> Phí vận chuyển:
            </span>
            <span className="font-extrabold text-neutral-800">
              {order.shippingFee > 0
                ? formatCurrency(order.shippingFee)
                : "Miễn phí"}
            </span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200/50">
              <span className="text-neutral-500 font-bold flex items-center gap-1.5">
                <ShoppingBag size={14} className="text-neutral-400" /> Giảm giá{" "}
                {order.couponCode ? `(${order.couponCode})` : ""}:
              </span>
              <span className="font-extrabold text-neutral-800">
                - {formatCurrency(order.discountAmount)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center pb-2 border-b border-neutral-200/50">
            <span className="text-neutral-500 font-bold flex items-center gap-1.5">
              <CreditCard size={14} className="text-neutral-400" /> Phương thức:
            </span>
            <span className="font-extrabold text-neutral-800">
              {order.paymentMethodName ||
                getPaymentMethodLabel(order.paymentMethodCode || "CASH")}
            </span>
          </div>
          {order.paymentTransactionId && (
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200/50 text-xs">
              <span className="text-neutral-400 font-bold">Mã GD VNPay:</span>
              <span
                className="font-mono text-neutral-600 truncate max-w-[140px] font-bold"
                title={order.paymentTransactionId}
              >
                {order.paymentTransactionId}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2">
            <span className="text-neutral-500 font-bold text-sm">
              Tổng thanh toán:
            </span>
            <span className="text-xl font-black text-neutral-955">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Collapsible Customer and Shipping details */}
      <div className="border-t border-neutral-100 pt-4 pb-1">
        <button
          type="button"
          onClick={() => onToggleExpand(order)}
          className="text-xs font-black text-neutral-950 hover:underline cursor-pointer flex items-center gap-1 outline-none"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={14} /> Thu gọn chi tiết khách hàng
            </>
          ) : (
            <>
              <ChevronDown size={14} /> Xem thông tin giao nhận & khách hàng
            </>
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-250/60 grid md:grid-cols-2 gap-6 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Customer info */}
            <div className="space-y-2">
              <h5 className="font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 mb-1 text-[10px]">
                <User size={12} /> Người đặt hàng
              </h5>
              <p className="text-neutral-800 font-bold">
                Họ và tên:{" "}
                <span className="text-neutral-955 font-black">
                  {order.buyerName || "N/A"}
                </span>
              </p>
              <p className="text-neutral-700 font-semibold">
                Số điện thoại: {order.buyerPhone || "Chưa cập nhật"}
              </p>
              <p className="text-neutral-700 font-semibold">
                Email: {order.buyerEmail || "Chưa cập nhật"}
              </p>
            </div>

            {/* Delivery info */}
            <div className="space-y-2">
              <h5 className="font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 mb-1 text-[10px]">
                <MapPin size={12} /> Thông tin giao hàng
              </h5>
              <p className="text-neutral-800 font-bold">
                Đơn vị vận chuyển:{" "}
                <span className="text-neutral-955 font-black">
                  {order.shippingMethodName || "N/A"}
                </span>
              </p>
              <p className="text-neutral-700 font-semibold">
                Địa chỉ: {order.shippingAddress || "Chưa cập nhật"}
              </p>
              <p className="text-neutral-700 font-semibold">
                Thành phố/Tỉnh: {order.shippingCity || "Chưa cập nhật"}
              </p>
            </div>

            {/* Return request info */}
            {returnDetail && (
              <div className="md:col-span-2 border-t border-neutral-200 pt-4 mt-2 space-y-3">
                <h5 className="font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 mb-1 text-[10px]">
                  <Receipt size={12} /> Chi tiết yêu cầu trả hàng / hoàn tiền
                </h5>
                <div className="grid md:grid-cols-2 gap-6 bg-white p-4 rounded-xl border border-neutral-200">
                  <div className="space-y-2">
                    <p className="text-neutral-700 font-bold">
                      Lý do trả hàng:{" "}
                      <span className="text-neutral-955 font-black">
                        {returnDetail.reason}
                      </span>
                    </p>
                    <p className="text-neutral-700 font-bold">
                      Số tiền hoàn trả:{" "}
                      <span className="text-red-500 font-black">
                        {formatCurrency(returnDetail.refundAmount)}
                      </span>
                    </p>
                    <p className="text-neutral-700 font-bold">
                      Trạng thái:{" "}
                      <span className="text-neutral-955 font-black uppercase">
                        {returnDetail.status}
                      </span>
                    </p>
                    <p className="text-neutral-500 font-medium">
                      Ngày yêu cầu:{" "}
                      {new Date(returnDetail.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {order.orderStatus === "RETURN_REQUESTED" ? (
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase">
                          Ghi chú của người duyệt (tùy chọn)
                        </label>
                        <input
                          type="text"
                          placeholder="Nhập lý do đồng ý/từ chối hoàn trả..."
                          value={adminNote || ""}
                          onChange={(e) =>
                            onAdminNoteChange(order.orderId, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-neutral-300 rounded-xl outline-none focus:border-neutral-900 text-xs"
                          disabled={loading}
                        />
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              onApproveReturn(order.orderId, returnDetail.id)
                            }
                            disabled={loading}
                            className="flex-1 py-2 rounded-xl bg-neutral-955 text-white font-bold text-xs bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Chấp nhận hoàn tiền
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onRejectReturn(order.orderId, returnDetail.id)
                            }
                            disabled={loading}
                            className="flex-1 py-2 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Từ chối hoàn hàng
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                        <p className="text-neutral-700 font-semibold">
                          Ghi chú phản hồi:{" "}
                          <span className="text-neutral-955 font-bold">
                            {returnDetail.adminNote || "Không có ghi chú"}
                          </span>
                        </p>
                        <p className="text-neutral-500 font-medium">
                          Người duyệt:{" "}
                          {returnDetail.processedByName || "Hệ thống"} (
                          {new Date(returnDetail.processedAt).toLocaleString(
                            "vi-VN",
                          )}
                          )
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions Footer */}
      {!isTerminal && (
        <div className="pt-4 border-t border-neutral-100 flex justify-end gap-3">
          {/* Hủy đơn hàng */}
          {(isPending || isProcessing) && (
            <button
              onClick={() => onCancel(order)}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-neutral-350 bg-white text-neutral-955 font-bold text-sm hover:bg-neutral-50 active:bg-neutral-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              Hủy đơn hàng
            </button>
          )}

          {/* Duyệt & Chuẩn bị đơn hàng (Pending -> Processing) */}
          {isPending && (
            <button
              onClick={() => onConfirm(order)}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-neutral-350 bg-white text-neutral-955 font-bold text-sm hover:bg-neutral-50 active:bg-neutral-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Duyệt & Đóng gói"}
            </button>
          )}

          {/* Giao vận chuyển (Processing -> Shipped) */}
          {isProcessing && (
            <button
              onClick={() => onShip(order.orderId)}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-neutral-350 bg-white text-neutral-955 font-bold text-sm hover:bg-neutral-50 active:bg-neutral-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Bàn giao vận chuyển"}
            </button>
          )}

          {/* Xác nhận đã giao (Shipped -> Delivered) */}
          {isShipped && (
            <button
              onClick={() => onDeliver(order)}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-neutral-350 bg-white text-neutral-955 font-bold text-sm hover:bg-neutral-50 active:bg-neutral-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Xác nhận đã giao"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
