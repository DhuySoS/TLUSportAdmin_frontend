import React, { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import orderServices from "@/services/orderServices";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Clock,
  ShoppingBag
} from "lucide-react";
import OrderTabs from "@/components/orders/OrderTabs";
import OrderList from "@/components/orders/OrderList";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [actionLoading, setActionLoading] = useState({});
  const [expandedOrders, setExpandedOrders] = useState({});
  const [returnDetails, setReturnDetails] = useState({});
  const [adminNotes, setAdminNotes] = useState({});

  const tabs = [
    { id: "ALL", label: "Tất cả", icon: ShoppingBag },
    { id: "PENDING", label: "Chờ xác nhận", icon: Clock },
    { id: "PROCESSING", label: "Đang chuẩn bị", icon: Package },
    { id: "SHIPPED", label: "Đang giao", icon: Truck },
    { id: "DELIVERED", label: "Đã giao", icon: CheckCircle },
    { id: "RETURN_REQUESTED", label: "Yêu cầu hoàn trả", icon: Clock },
    { id: "RETURNED", label: "Đã hoàn trả", icon: CheckCircle },
    { id: "RETURN_REJECTED", label: "Từ chối hoàn trả", icon: XCircle },
    { id: "CANCELLED", label: "Đã hủy", icon: XCircle },
  ];

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await orderServices.getAllOrders(1, 50);
      if (res && res.data) {
        setOrders(res.data.items || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách đơn hàng:", error);
      toast.error("Không thể tải danh sách đơn hàng");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpandOrder = async (order) => {
    const orderId = order.orderId;
    const isNowExpanded = !expandedOrders[orderId];

    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: isNowExpanded,
    }));

    if (
      isNowExpanded &&
      ["RETURN_REQUESTED", "RETURNED", "RETURN_REJECTED"].includes(
        order.orderStatus,
      )
    ) {
      if (!returnDetails[orderId]) {
        try {
          const res = await orderServices.getReturnByOrderId(orderId);
          if (res && res.data) {
            setReturnDetails((prev) => ({ ...prev, [orderId]: res.data }));
          }
        } catch (error) {
          console.error("Lỗi khi tải chi tiết yêu cầu hoàn trả:", error);
        }
      }
    }
  };

  const handleApproveReturn = async (orderId, returnId) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn CHẤP NHẬN yêu cầu hoàn trả này và hoàn tiền cho khách hàng?",
      )
    ) {
      setActionLoading((prev) => ({ ...prev, [orderId]: true }));
      try {
        const adminNote = adminNotes[orderId] || "";
        const res = await orderServices.approveReturn(returnId, { adminNote });
        toast.success(res.message || "Duyệt hoàn trả thành công!", {
          position: "top-right",
        });
        setAdminNotes((prev) => {
          const copy = { ...prev };
          delete copy[orderId];
          return copy;
        });
        setReturnDetails((prev) => {
          const copy = { ...prev };
          delete copy[orderId];
          return copy;
        });
        fetchOrders();
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Lỗi khi duyệt hoàn trả!",
          { position: "top-right" },
        );
      } finally {
        setActionLoading((prev) => ({ ...prev, [orderId]: false }));
      }
    }
  };

  const handleRejectReturn = async (orderId, returnId) => {
    if (window.confirm("Bạn có chắc chắn muốn TỪ CHỐI yêu cầu hoàn trả này?")) {
      setActionLoading((prev) => ({ ...prev, [orderId]: true }));
      try {
        const adminNote = adminNotes[orderId] || "";
        const res = await orderServices.rejectReturn(returnId, { adminNote });
        toast.success(res.message || "Từ chối hoàn trả thành công!", {
          position: "top-right",
        });
        setAdminNotes((prev) => {
          const copy = { ...prev };
          delete copy[orderId];
          return copy;
        });
        setReturnDetails((prev) => {
          const copy = { ...prev };
          delete copy[orderId];
          return copy;
        });
        fetchOrders();
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Lỗi khi từ chối hoàn trả!",
          { position: "top-right" },
        );
      } finally {
        setActionLoading((prev) => ({ ...prev, [orderId]: false }));
      }
    }
  };

  const executeAction = async (orderId, actionName, serviceCall) => {
    setActionLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await serviceCall(orderId);
      toast.success(res.message || `${actionName} thành công!`, {
        position: "top-right",
      });
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || `Lỗi khi thực hiện: ${actionName}`,
        { position: "top-right" },
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleConfirm = (order) => {
    const method = order.paymentMethodCode || "CASH";
    if (method !== "CASH" && order.paymentStatus !== "PAID") {
      toast.warning(
        "Đơn hàng thanh toán trực tuyến chưa hoàn tất thanh toán!",
        { position: "top-right" },
      );
      return;
    }

    executeAction(
      order.orderId,
      "Duyệt & Chuẩn bị đơn hàng",
      orderServices.confirmOrder,
    );
  };

  const handleShip = (orderId) => {
    executeAction(
      orderId,
      "Bàn giao đơn hàng cho vận chuyển",
      orderServices.shipOrder,
    );
  };

  const handleDeliver = (order) => {
    executeAction(
      order.orderId,
      "Hoàn thành giao đơn hàng",
      orderServices.deliverOrder,
    );
  };

  const handleCancel = (order) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${order.orderId}?`)
    ) {
      executeAction(order.orderId, "Hủy đơn hàng", orderServices.cancelOrder);
    }
  };

  const filteredOrders =
    activeTab === "ALL"
      ? orders
      : orders.filter((o) => o.orderStatus === activeTab);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Đơn hàng"
        title="Quản lý đơn hàng"
        description="Theo dõi luồng vận hành, duyệt, giao hàng và hủy đơn hàng trên hệ thống."
      />

      <OrderTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        orders={orders}
      />

      <OrderList
        orders={filteredOrders}
        isLoading={isLoading}
        expandedOrders={expandedOrders}
        toggleExpandOrder={toggleExpandOrder}
        actionLoading={actionLoading}
        returnDetails={returnDetails}
        adminNotes={adminNotes}
        setAdminNotes={setAdminNotes}
        handleApproveReturn={handleApproveReturn}
        handleRejectReturn={handleRejectReturn}
        handleConfirm={handleConfirm}
        handleShip={handleShip}
        handleDeliver={handleDeliver}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default OrdersPage;
