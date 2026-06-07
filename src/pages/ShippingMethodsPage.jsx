import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import Field from "@/components/common/Field";
import FormSection from "@/components/common/FormSection";
import PageHeader from "@/components/common/PageHeader";
import SubmitButton from "@/components/common/SubmitButton";
import { formatCurrency } from "@/lib/formatCurrency";
import shippingServices from "@/services/shippingServices";
import ConfirmModal from "@/components/common/ConfirmModal";

const EMPTY_FORM = { name: "", cost: "", estimatedDeliveryDays: "" };

const ShippingMethodsPage = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "Xác nhận",
    message: "",
    onConfirm: () => {},
    type: "primary",
  });

  const triggerConfirm = (message, onConfirm, type = "primary", title = "Xác nhận hành động") => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      type,
    });
  };

  const loadShippingMethods = async () => {
    try {
      const res = await shippingServices.getShippingMethods();
      setShippingMethods(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { loadShippingMethods(); }, []);

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      cost: String(item.cost),
      estimatedDeliveryDays: item.estimatedDeliveryDays || "",
    });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const handleDelete = (id) => {
    triggerConfirm(
      "Bạn có chắc chắn muốn xóa phương thức này?",
      async () => {
        try {
          const res = await shippingServices.deleteShippingMethod(id);
          toast.success(res.message || "Xóa phương thức vận chuyển thành công");
          if (editId === id) handleCancelEdit();
          loadShippingMethods();
        } catch (error) {
          toast.error(error.response?.data?.message || "Không thể xóa phương thức");
        }
      },
      "danger",
      "Xóa phương thức vận chuyển"
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const payload = {
      name: form.name,
      cost: Number(form.cost),
      estimatedDeliveryDays: form.estimatedDeliveryDays,
    };

    try {
      if (editId) {
        const res = await shippingServices.updateShippingMethod(editId, payload);
        toast.success(res.message || "Cập nhật phương thức vận chuyển thành công");
        setEditId(null);
      } else {
        const res = await shippingServices.createShippingMethod(payload);
        toast.success(res.message || "Tạo phương thức vận chuyển thành công");
      }
      setForm(EMPTY_FORM);
      loadShippingMethods();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (editId ? "Không thể cập nhật vận chuyển" : "Không thể tạo vận chuyển")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader badge="Vận chuyển" title="Quản lý vận chuyển" />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1fr]">
        {/* ===== Form ===== */}
        <FormSection title={editId ? "Cập nhật phương thức vận chuyển" : "Tạo phương thức vận chuyển"}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Tên phương thức">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="admin-input"
                placeholder="Giao hàng tiêu chuẩn"
                required
              />
            </Field>
            <Field label="Chi phí">
              <input
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                type="number"
                className="admin-input"
                placeholder="30000"
                required
              />
            </Field>
            <Field label="Thời gian dự kiến">
              <input
                value={form.estimatedDeliveryDays}
                onChange={(e) => setForm({ ...form, estimatedDeliveryDays: e.target.value })}
                className="admin-input"
                placeholder="3-5 ngày"
              />
            </Field>
            <div className="flex items-center gap-3">
              {editId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-full bg-neutral-100 px-6 py-3 text-sm font-bold text-neutral-600 transition-colors hover:bg-neutral-200"
                >
                  Hủy
                </button>
              )}
              <SubmitButton isLoading={isLoading}>
                {editId ? "Lưu thay đổi" : "Tạo vận chuyển"}
              </SubmitButton>
            </div>
          </form>
        </FormSection>

        {/* ===== Danh sách ===== */}
        <FormSection title="Danh sách phương thức">
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {shippingMethods.length === 0 && (
              <p className="rounded-2xl bg-neutral-50 p-4 text-sm font-medium text-neutral-500">
                Chưa có phương thức nào.
              </p>
            )}
            {shippingMethods.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-neutral-200 p-4"
              >
                <div>
                  <p className="font-black">#{item.id} {item.name}</p>
                  {item.estimatedDeliveryDays && (
                    <p className="text-sm font-medium text-neutral-500">{item.estimatedDeliveryDays}</p>
                  )}
                  <p className="mt-1 font-black text-blue-700">{formatCurrency(item.cost)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </FormSection>
      </div>
      <ConfirmModal
        {...confirmModal}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default ShippingMethodsPage;
