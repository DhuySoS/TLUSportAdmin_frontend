import React from "react";
import OrderCard from "./OrderCard";

const OrderList = ({
  orders,
  isLoading,
  expandedOrders,
  toggleExpandOrder,
  actionLoading,
  returnDetails,
  adminNotes,
  setAdminNotes,
  handleApproveReturn,
  handleRejectReturn,
  handleConfirm,
  handleShip,
  handleDeliver,
  handleCancel,
}) => {
  if (isLoading) {
    return (
      <div className="w-full text-center py-24 animate-pulse text-neutral-500 font-bold">
        Đang tải danh sách đơn hàng...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-16 text-center shadow-sm">
        <h3 className="text-xl font-black text-neutral-900">
          Không tìm thấy đơn hàng nào
        </h3>
        <p className="mt-2 text-sm font-medium text-neutral-500">
          Không có dữ liệu đơn hàng nào tương ứng với trạng thái bộ lọc đã chọn.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {orders.map((order) => (
        <OrderCard
          key={order.orderId}
          order={order}
          isExpanded={expandedOrders[order.orderId]}
          onToggleExpand={toggleExpandOrder}
          loading={actionLoading[order.orderId]}
          returnDetail={returnDetails[order.orderId]}
          adminNote={adminNotes[order.orderId]}
          onAdminNoteChange={(orderId, val) =>
            setAdminNotes((prev) => ({ ...prev, [orderId]: val }))
          }
          onApproveReturn={handleApproveReturn}
          onRejectReturn={handleRejectReturn}
          onConfirm={handleConfirm}
          onShip={handleShip}
          onDeliver={handleDeliver}
          onCancel={handleCancel}
        />
      ))}
    </div>
  );
};

export default OrderList;
