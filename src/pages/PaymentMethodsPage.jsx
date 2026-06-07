import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import Field from "@/components/common/Field";
import FormSection from "@/components/common/FormSection";
import PageHeader from "@/components/common/PageHeader";
import SubmitButton from "@/components/common/SubmitButton";
import paymentServices from "@/services/paymentServices";
import ConfirmModal from "@/components/common/ConfirmModal";

const EMPTY_FORM = { name: "", code: "", isActive: true };

const PaymentMethodsPage = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [methods, setMethods] = useState([]);
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

  const loadMethods = async () => {
    try {
      const res = await paymentServices.getActivePaymentMethods();
      setMethods(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { loadMethods(); }, []);

  const handleEdit = (method) => {
    setEditId(method.id);
    setForm({ name: method.name, code: method.code, isActive: method.isActive ?? true });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const handleDelete = (id) => {
    triggerConfirm(
      "Bạn có chắc chắn muốn xóa phương thức thanh toán này?",
      async () => {
        try {
          const res = await paymentServices.deletePaymentMethod(id);
          toast.success(res.message || "Xóa thành công");
          if (editId === id) handleCancelEdit();
          loadMethods();
        } catch (error) {
          toast.error(error.response?.data?.message || "Không thể xóa phương thức thanh toán");
        }
      },
      "danger",
      "Xóa phương thức thanh toán"
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (editId) {
        const res = await paymentServices.updatePaymentMethod(editId, form);
        toast.success(res.message || "Cập nhật thành công");
        setEditId(null);
      } else {
        const res = await paymentServices.createPaymentMethod(form);
        toast.success(res.message || "Tạo phương thức thanh toán thành công");
      }
      setForm(EMPTY_FORM);
      loadMethods();
    } catch (error) {
      toast.error(error.response?.data?.message || (editId ? "Không thể cập nhật" : "Không thể tạo thanh toán"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader badge="Thanh toán" title="Quản lý thanh toán" />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1fr]">
        {/* ===== Form ===== */}
        <FormSection title={editId ? "Cập nhật phương thức thanh toán" : "Tạo phương thức thanh toán"}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Tên phương thức">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="admin-input"
                placeholder="Thanh toán khi nhận hàng"
                required
              />
            </Field>
            <Field label="Code">
              <input
                type="text"
                value={form.code}
                placeholder="COD"
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="admin-input"
                required
              />
            </Field>
            <label className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-4 text-sm font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="size-4 accent-blue-600"
              />
              Kích hoạt
            </label>
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
                {editId ? "Lưu thay đổi" : "Tạo thanh toán"}
              </SubmitButton>
            </div>
          </form>
        </FormSection>

        {/* ===== Danh sách ===== */}
        <FormSection title="Phương thức thanh toán">
          <div className="grid gap-3 md:grid-cols-2">
            {methods.length === 0 && (
              <p className="rounded-2xl bg-neutral-50 p-4 text-sm font-medium text-neutral-500 md:col-span-2">
                Chưa có phương thức nào.
              </p>
            )}
            {methods.map((method) => (
              <div key={method.id} className="rounded-2xl border border-neutral-200 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-black">#{method.id} {method.name}</p>
                    <p className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      {method.code}
                    </p>
                    {!method.isActive && (
                      <span className="ml-2 inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-500">
                        Tắt
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(method)}
                      className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(method.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
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

export default PaymentMethodsPage;
