import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Palette } from "lucide-react";
import Field from "@/components/common/Field";
import FormSection from "@/components/common/FormSection";
import PageHeader from "@/components/common/PageHeader";
import SubmitButton from "@/components/common/SubmitButton";
import attributeServices from "@/services/attributeServices";
import ConfirmModal from "@/components/common/ConfirmModal";

/** Kiểm tra chuỗi có phải mã màu hex hợp lệ (#rrggbb / #rgb) */
const isHexColor = (str) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(str?.trim());

const AttributesPage = () => {
  const [attributeForm, setAttributeForm] = useState({ name: "", description: "" });
  const [valueForm, setValueForm] = useState({
    attributeId: "",
    value: "",
    description: "",     // mã màu hex, để trống nếu không phải màu
    useColor: false,     // checkbox – chỉ dùng trên UI, không gửi lên server
  });
  const [createdAttribute, setCreatedAttribute] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editAttributeId, setEditAttributeId] = useState(null);
  const [editValueId, setEditValueId] = useState(null);

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

  const loadAttributes = async () => {
    const res = await attributeServices.getAttributes();
    setAttributes(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    loadAttributes();
  }, []);

  // ===== Attribute handlers =====

  const handleEditAttribute = (attr) => {
    setEditAttributeId(attr.id);
    setAttributeForm({ name: attr.name, description: attr.description || "" });
  };

  const handleCancelEditAttribute = () => {
    setEditAttributeId(null);
    setAttributeForm({ name: "", description: "" });
  };

  const handleDeleteAttribute = (id) => {
    triggerConfirm(
      "Bạn có chắc chắn muốn xóa thuộc tính này?",
      async () => {
        try {
          const res = await attributeServices.deleteAttribute(id);
          toast.success(res.message || "Xóa thuộc tính thành công");
          loadAttributes();
          if (editAttributeId === id) handleCancelEditAttribute();
        } catch (error) {
          toast.error(error.response?.data?.message || "Không thể xóa thuộc tính");
        }
      },
      "danger",
      "Xóa thuộc tính"
    );
  };

  const handleAttributeSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const payload = { name: attributeForm.name, description: attributeForm.description, values: [] };
    try {
      if (editAttributeId) {
        const res = await attributeServices.updateAttribute(editAttributeId, payload);
        toast.success(res.message || "Cập nhật thuộc tính thành công");
        setEditAttributeId(null);
      } else {
        const res = await attributeServices.createAttribute(payload);
        setCreatedAttribute(res.data);
        toast.success(res.message || "Tạo thuộc tính thành công");
      }
      setAttributeForm({ name: "", description: "" });
      loadAttributes();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        (editAttributeId ? "Không thể cập nhật thuộc tính" : "Không thể tạo thuộc tính")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ===== Value handlers =====

  const handleEditValue = (attributeId, valueObj) => {
    const hasColor = isHexColor(valueObj.description);
    setEditValueId(valueObj.id);
    setValueForm({
      attributeId,
      value: valueObj.value,
      description: valueObj.description || "",
      useColor: hasColor,
    });
  };

  const handleCancelEditValue = () => {
    setEditValueId(null);
    setValueForm({ attributeId: "", value: "", description: "", useColor: false });
  };

  const handleDeleteValue = (id) => {
    triggerConfirm(
      "Bạn có chắc chắn muốn xóa giá trị này?",
      async () => {
        try {
          const res = await attributeServices.deleteAttributeValue(id);
          toast.success(res.message || "Xóa giá trị thành công");
          loadAttributes();
          if (editValueId === id) handleCancelEditValue();
        } catch (error) {
          toast.error(error.response?.data?.message || "Không thể xóa giá trị");
        }
      },
      "danger",
      "Xóa giá trị thuộc tính"
    );
  };

  const handleValueSubmit = async (event) => {
    event.preventDefault();
    // Nếu không dùng màu thì gửi description rỗng
    const desc = valueForm.useColor ? (valueForm.description || "") : "";
    try {
      if (editValueId) {
        const res = await attributeServices.updateAttributeValue(editValueId, {
          value: valueForm.value,
          description: desc,
        });
        toast.success(res.message || "Cập nhật giá trị thành công");
        setEditValueId(null);
      } else {
        const res = await attributeServices.addAttributeValue(
          valueForm.attributeId,
          valueForm.value,
          desc
        );
        toast.success(res.message || "Thêm giá trị thành công");
      }
      setValueForm({ attributeId: "", value: "", description: "", useColor: false });
      loadAttributes();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        (editValueId ? "Không thể cập nhật giá trị" : "Không thể thêm giá trị")
      );
    }
  };

  return (
    <div>
      <PageHeader badge="Thuộc tính" title="Quản lý thuộc tính" />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          {/* ===== Form thuộc tính ===== */}
          <FormSection title={editAttributeId ? "Cập nhật thuộc tính" : "Tạo thuộc tính mới"}>
            <form onSubmit={handleAttributeSubmit} className="space-y-5">
              <Field label="Tên thuộc tính">
                <input
                  value={attributeForm.name}
                  onChange={(e) => setAttributeForm({ ...attributeForm, name: e.target.value })}
                  className="admin-input"
                  placeholder="Màu sắc"
                  required
                />
              </Field>
              <Field label="Mô tả">
                <input
                  value={attributeForm.description}
                  onChange={(e) => setAttributeForm({ ...attributeForm, description: e.target.value })}
                  className="admin-input"
                  placeholder="Mô tả thuộc tính (tùy chọn)"
                />
              </Field>
              <div className="flex items-center gap-3">
                {editAttributeId && (
                  <button
                    type="button"
                    onClick={handleCancelEditAttribute}
                    className="rounded-full bg-neutral-100 px-6 py-3 text-sm font-bold text-neutral-600 transition-colors hover:bg-neutral-200"
                  >
                    Hủy
                  </button>
                )}
                <SubmitButton isLoading={isLoading}>
                  {editAttributeId ? "Lưu thay đổi" : "Tạo thuộc tính"}
                </SubmitButton>
              </div>
            </form>

            {createdAttribute && !editAttributeId && (
              <div className="mt-6 rounded-2xl bg-neutral-50 p-4">
                <p className="font-black">
                  Thuộc tính vừa tạo: #{createdAttribute.id} {createdAttribute.name}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {createdAttribute.values?.map((item) => (
                    <span key={item.id} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-neutral-600">
                      #{item.id} {item.value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </FormSection>

          {/* ===== Form giá trị ===== */}
          <FormSection title={editValueId ? "Cập nhật giá trị thuộc tính" : "Thêm giá trị vào thuộc tính"}>
            <form onSubmit={handleValueSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Thuộc tính">
                  <select
                    value={valueForm.attributeId}
                    onChange={(e) => setValueForm({ ...valueForm, attributeId: e.target.value })}
                    className="admin-input"
                    required
                    disabled={!!editValueId}
                  >
                    <option value="" disabled>-- Chọn thuộc tính --</option>
                    {attributes.map((attr) => (
                      <option key={attr.id} value={attr.id}>
                        {attr.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Giá trị">
                  <input
                    value={valueForm.value}
                    onChange={(e) => setValueForm({ ...valueForm, value: e.target.value })}
                    className="admin-input"
                    placeholder="Đỏ"
                    required
                  />
                </Field>
              </div>

              {/* Checkbox bật màu */}
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3">
                <input
                  id="useColorCheckbox"
                  type="checkbox"
                  checked={valueForm.useColor}
                  onChange={(e) =>
                    setValueForm({ ...valueForm, useColor: e.target.checked, description: "" })
                  }
                  className="size-4 cursor-pointer rounded accent-blue-600"
                />
                <label
                  htmlFor="useColorCheckbox"
                  className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-neutral-700 select-none"
                >
                  <Palette className="size-4 text-blue-500" />
                  Thêm mã màu nếu là thuộc tính màu sắc
                </label>
              </div>

              {/* Color picker — chỉ hiện khi tích checkbox */}
              {valueForm.useColor && (
                <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                  <div className="flex flex-1 items-center gap-3">
                    {/* Native color picker dạng swatch */}
                    <label className="relative shrink-0 cursor-pointer">
                      <input
                        type="color"
                        value={isHexColor(valueForm.description) ? valueForm.description : "#000000"}
                        onChange={(e) => setValueForm({ ...valueForm, description: e.target.value })}
                        className="absolute inset-0 size-full cursor-pointer opacity-0"
                      />
                      <span
                        className="flex size-10 items-center justify-center rounded-xl border-2 border-white shadow-md transition-transform hover:scale-110"
                        style={{
                          backgroundColor: isHexColor(valueForm.description)
                            ? valueForm.description
                            : "#e5e7eb",
                        }}
                      />
                    </label>

                    {/* Ô nhập hex */}
                    <div className="flex flex-1 flex-col gap-1">
                      <label className="text-xs font-bold text-blue-700">Mã màu HEX</label>
                      <input
                        type="text"
                        value={valueForm.description}
                        onChange={(e) => setValueForm({ ...valueForm, description: e.target.value })}
                        className="admin-input font-mono uppercase"
                        placeholder="#FF5733"
                        maxLength={7}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                {editValueId && (
                  <button
                    type="button"
                    onClick={handleCancelEditValue}
                    className="rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-bold text-neutral-600 transition-colors hover:bg-neutral-200"
                  >
                    Hủy
                  </button>
                )}
                <SubmitButton>{editValueId ? "Lưu" : "Thêm"}</SubmitButton>
              </div>
            </form>
          </FormSection>
        </div>

        {/* ===== Cây dữ liệu ===== */}
        <div className="space-y-6">
          <FormSection title="Cây dữ liệu thuộc tính">
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {attributes.map((attribute) => (
                <div key={attribute.id} className="rounded-2xl border border-neutral-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-black"># {attribute.name}</p>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEditAttribute(attribute)}
                        className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAttribute(attribute.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {attribute.values.map((value) => {
                      const color = value.description?.trim().toLowerCase();
                      const hasColor = isHexColor(color);
                      return (
                        <div
                          key={value.id}
                          className="group flex items-center overflow-hidden rounded-full border border-blue-100 bg-blue-50 text-xs font-bold text-blue-700 transition-colors hover:border-blue-300"
                        >
                          {hasColor && (
                            <span
                              className="ml-2 size-3.5 shrink-0 rounded-full border border-white/60 shadow-sm"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => handleEditValue(attribute.id, value)}
                            className="px-3 py-1 hover:bg-blue-100 transition-colors"
                          >
                            {value.value}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteValue(value.id)}
                            className="px-2 py-1 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                            title="Xóa giá trị"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </FormSection>
        </div>
      </div>
      <ConfirmModal
        {...confirmModal}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default AttributesPage;
