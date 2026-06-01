import { Plus, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import cloudinaryServices from "@/services/cloudinaryServices";

const SkuItem = ({ sku, index, attributes, updateNestedValue, removeItem }) => {
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const toastId = toast.loading(`Đang tải lên ${files.length} ảnh...`);
    try {
      const uploadPromises = files.map((file) => cloudinaryServices.uploadImage(file));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((r) => r.secure_url);
      const currentUrls = sku.imageUrls.filter(Boolean);
      updateNestedValue("skus", index, "imageUrls", [...currentUrls, ...newUrls]);
      toast.success(`Đã tải lên ${files.length} ảnh thành công!`, { id: toastId });
    } catch {
      toast.error("Có lỗi khi tải ảnh lên", { id: toastId });
    }
    e.target.value = "";
  };

  const handleRemoveImage = (imgUrl) => {
    const nextImageUrls = sku.imageUrls.filter((u) => u !== imgUrl);
    updateNestedValue("skus", index, "imageUrls", nextImageUrls);
  };

  const handleAddSkuAttribute = () => {
    const nextAttrs = [...sku.attributes, { attributeId: "", valueId: "" }];
    updateNestedValue("skus", index, "attributes", nextAttrs);
  };

  const handleRemoveSkuAttribute = (attrIndex) => {
    const nextAttrs = sku.attributes.filter((_, i) => i !== attrIndex);
    updateNestedValue("skus", index, "attributes", nextAttrs);
  };

  const handleSkuAttributeChange = (attrIndex, field, value) => {
    const nextAttrs = [...sku.attributes];
    if (field === "attributeId") {
      nextAttrs[attrIndex] = { attributeId: value, valueId: "" };
    } else {
      nextAttrs[attrIndex] = { ...nextAttrs[attrIndex], [field]: value };
    }
    updateNestedValue("skus", index, "attributes", nextAttrs);
  };

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-4">
      {/* Header SKU */}
      <div className="mb-3 flex items-center justify-between">
        <p className="font-black">SKU #{index + 1}</p>
        <button
          type="button"
          onClick={() => removeItem("skus", index)}
          className="admin-icon-button"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {/* Thông tin cơ bản SKU */}
        <input
          value={sku.skuCode}
          onChange={(e) => updateNestedValue("skus", index, "skuCode", e.target.value)}
          className="admin-input"
          placeholder="SKU-CODE"
          required
        />
        <input
          value={sku.price}
          onChange={(e) => updateNestedValue("skus", index, "price", e.target.value)}
          className="admin-input"
          type="number"
          placeholder="Giá bán"
          required
        />
        <input
          value={sku.stockQuantity}
          onChange={(e) => updateNestedValue("skus", index, "stockQuantity", e.target.value)}
          className="admin-input"
          type="number"
          placeholder="Tồn kho"
          required
        />

        <div className="flex items-center">
          <label className="flex items-center gap-2 px-1">
            <input
              type="checkbox"
              checked={sku.isActive ?? true}
              onChange={(e) => updateNestedValue("skus", index, "isActive", e.target.checked)}
              className="size-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm font-medium text-neutral-700">Hiển thị</span>
          </label>
        </div>

        {/* Thuộc tính phiên bản */}
        <div className="md:col-span-2 xl:col-span-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-neutral-600">Thuộc tính phiên bản</p>
            <button
              type="button"
              onClick={handleAddSkuAttribute}
              className="admin-mini-button"
            >
              <Plus className="size-4" /> Thêm thuộc tính
            </button>
          </div>
          <div className="space-y-6">
            {sku.attributes.map((attrItem, attrIndex) => {
              const selectedAttr = attributes.find((a) => a.id === Number(attrItem.attributeId));
              return (
                <div key={attrIndex} className="grid gap-3 grid-cols-[1fr_1fr_auto]">
                  <select
                    className="admin-input"
                    value={attrItem.attributeId}
                    onChange={(e) => handleSkuAttributeChange(attrIndex, "attributeId", e.target.value)}
                  >
                    <option value="">Chọn thuộc tính...</option>
                    {attributes.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="admin-input"
                    value={attrItem.valueId}
                    onChange={(e) => handleSkuAttributeChange(attrIndex, "valueId", e.target.value)}
                    disabled={!selectedAttr}
                  >
                    <option value="">Chọn giá trị...</option>
                    {selectedAttr?.values?.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.value}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkuAttribute(attrIndex)}
                    className="admin-icon-button"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ảnh SKU */}
        <div className="md:col-span-2 xl:col-span-3">
          <p className="mb-2 text-sm font-bold text-neutral-600">Ảnh riêng SKU (không bắt buộc)</p>
          <div className="flex flex-wrap gap-3">
            {sku.imageUrls.filter(Boolean).map((imgUrl, imgIndex) => (
              <div
                key={imgIndex}
                className="relative size-24 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 group"
              >
                <img src={imgUrl} alt="SKU preview" className="size-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity flex items-center justify-center group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(imgUrl)}
                    className="rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
            <label className="flex size-24 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 text-neutral-500 transition-colors hover:border-blue-500 hover:bg-blue-50">
              <UploadCloud className="mb-1 size-6" />
              <span className="text-[10px] font-medium text-center">Thêm nhiều ảnh</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkuItem;
