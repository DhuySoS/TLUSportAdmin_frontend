import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import Field from "@/components/common/Field";
import FormSection from "@/components/common/FormSection";
import PageHeader from "@/components/common/PageHeader";
import SubmitButton from "@/components/common/SubmitButton";
import { formatCurrency } from "@/lib/formatCurrency";
import couponServices from "@/services/couponServices";
import ConfirmModal from "@/components/common/ConfirmModal";

const EMPTY_FORM = {
  code: "",
  discountType: "PERCENT",
  discountValue: "",
  minOrderValue: "",
  usageLimit: "",
  startDate: "2026-01-01T00:00",
  endDate: "2026-12-31T23:59",
  isActive: true,
};

const CouponsPage = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [coupons, setCoupons] = useState([]);
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

  const loadCoupons = async () => {
    try {
      const res = await couponServices.getCoupons();
      setCoupons(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleEdit = (coupon) => {
    setEditId(coupon.id);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minOrderValue: coupon.minOrderValue ? String(coupon.minOrderValue) : "",
      usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : "",
      startDate: coupon.startDate
        ? coupon.startDate.slice(0, 16)
        : EMPTY_FORM.startDate,
      endDate: coupon.endDate
        ? coupon.endDate.slice(0, 16)
        : EMPTY_FORM.endDate,
      isActive: coupon.isActive ?? true,
    });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const handleDelete = (id) => {
    triggerConfirm(
      "Bạn có chắc chắn muốn xóa mã giảm giá này?",
      async () => {
        try {
          const res = await couponServices.deleteCoupon(id);
          toast.success(res.message || "Xóa mã giảm giá thành công");
          if (editId === id) handleCancelEdit();
          loadCoupons();
        } catch (error) {
          toast.error(error.response?.data?.message || "Không thể xóa mã giảm giá");
        }
      },
      "danger",
      "Xóa mã giảm giá"
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dValue = Number(form.discountValue);
    if (isNaN(dValue) || dValue <= 0) {
      toast.error("Giá trị giảm giá phải lớn hơn 0");
      return;
    }

    if (form.discountType === "PERCENT" && dValue > 100) {
      toast.error("Mã giảm giá theo phần trăm không được vượt quá 100%");
      return;
    }

    if (!form.startDate || !form.endDate) {
      toast.error("Vui lòng nhập đầy đủ ngày bắt đầu và ngày kết thúc");
      return;
    }

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    if (start >= end) {
      toast.error("Ngày bắt đầu phải xảy ra trước ngày kết thúc");
      return;
    }

    setIsLoading(true);

    const payload = {
      code: form.code,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : 0,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      startDate: form.startDate,
      endDate: form.endDate,
      isActive: form.isActive,
    };

    try {
      if (editId) {
        const res = await couponServices.updateCoupon(editId, payload);
        toast.success(res.message || "Cập nhật mã giảm giá thành công");
        setEditId(null);
      } else {
        const res = await couponServices.createCoupon(payload);
        toast.success(res.message || "Tạo mã giảm giá thành công");
      }
      setForm(EMPTY_FORM);
      loadCoupons();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (editId
            ? "Không thể cập nhật mã giảm giá"
            : "Không thể tạo mã giảm giá"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        badge="Mã giảm giá"
        title="Quản lý mã giảm giá"
        description="Tạo mã giảm theo phần trăm hoặc số tiền cố định để áp dụng vào thanh toán."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        {/* ===== Form ===== */}
        <FormSection
          title={editId ? "Cập nhật mã giảm giá" : "Tạo mã giảm giá"}
        >
          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <Field label="Mã giảm giá">
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                className="admin-input uppercase"
                placeholder="SALE10"
                required
              />
            </Field>
            <Field label="Loại giảm">
              <select
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
                className="admin-input"
              >
                <option value="PERCENT">PERCENT</option>
                <option value="FIXED">FIXED</option>
              </select>
            </Field>
            <Field label="Giá trị giảm">
              <input
                name="discountValue"
                value={form.discountValue}
                onChange={handleChange}
                type="number"
                min="1"
                max={form.discountType === "PERCENT" ? "100" : undefined}
                className="admin-input"
                placeholder={form.discountType === "PERCENT" ? "10" : "50000"}
                required
              />
            </Field>
            <Field label="Đơn tối thiểu">
              <input
                name="minOrderValue"
                value={form.minOrderValue}
                onChange={handleChange}
                type="number"
                className="admin-input"
                placeholder="500000"
              />
            </Field>
            <Field label="Giới hạn lượt dùng">
              <input
                name="usageLimit"
                value={form.usageLimit}
                onChange={handleChange}
                type="number"
                className="admin-input"
                placeholder="100"
              />
            </Field>
            <Field label="Ngày bắt đầu">
              <input
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                type="datetime-local"
                max={form.endDate || undefined}
                className="admin-input"
                required
              />
            </Field>
            <Field label="Ngày kết thúc">
              <input
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                type="datetime-local"
                min={form.startDate || undefined}
                className="admin-input"
                required
              />
            </Field>
            <label className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-4 text-sm font-bold cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="size-4 accent-blue-600"
              />
              Kích hoạt mã giảm giá
            </label>
            <div className="flex items-center gap-3 md:col-span-2">
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
                {editId ? "Lưu thay đổi" : "Tạo mã giảm giá"}
              </SubmitButton>
            </div>
          </form>
        </FormSection>

        {/* ===== Danh sách ===== */}
        <FormSection title="Mã giảm giá hiện có">
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {coupons.length === 0 && (
              <p className="rounded-2xl bg-neutral-50 p-4 text-sm font-medium text-neutral-500">
                Chưa có mã giảm giá nào.
              </p>
            )}
            {coupons.map((coupon) => (
              <div
                key={coupon.id || coupon.code}
                className="rounded-2xl border border-neutral-200 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-black">{coupon.code}</p>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {coupon.discountType}
                      </span>
                      {!coupon.isActive && (
                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-500">
                          Tắt
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-bold text-neutral-500">
                      Giảm:{" "}
                      {coupon.discountType === "FIXED"
                        ? formatCurrency(coupon.discountValue)
                        : `${coupon.discountValue}%`}
                    </p>
                    {coupon.minOrderValue > 0 && (
                      <p className="text-xs text-neutral-400">
                        Đơn tối thiểu: {formatCurrency(coupon.minOrderValue)}
                      </p>
                    )}
                    <p className="text-xs text-neutral-400">
                      Đã dùng: {coupon.usedCount || 0} lượt
                    </p>
                    {coupon.usageLimit ? (
                      <p className="text-xs font-semibold text-neutral-400">
                        Còn lại: {coupon.usageLimit - (coupon.usedCount || 0)} /{" "}
                        {coupon.usageLimit} lượt
                      </p>
                    ) : (
                      <p className="text-xs text-neutral-400">
                        Giới hạn: Vô hạn
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(coupon)}
                      className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(coupon.id)}
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

export default CouponsPage;
