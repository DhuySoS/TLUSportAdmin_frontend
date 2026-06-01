import Field from "@/components/common/Field";
import RichTextEditor from "@/components/common/RichTextEditor";

const ProductFormInfo = ({ form, categories, updateField }) => {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Field label="Tên sản phẩm">
        <input
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="admin-input"
          placeholder="Áo thun TLUSport"
          required
        />
      </Field>

      <Field label="Slug">
        <input
          value={form.slug}
          onChange={(e) => updateField("slug", e.target.value)}
          className="admin-input"
          placeholder="ao-thun-tlusport"
          required
        />
      </Field>

      <Field label="Giá gốc">
        <input
          value={form.basePrice}
          onChange={(e) => updateField("basePrice", e.target.value)}
          type="number"
          className="admin-input"
          placeholder="299000"
          required
        />
      </Field>

      <Field label="Danh mục">
        <select
          value={form.categoryId}
          onChange={(e) => updateField("categoryId", e.target.value)}
          className="admin-input"
          required
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Trạng thái">
        <label className="flex items-center gap-2 mt-2 ml-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => updateField("isActive", e.target.checked)}
            className="size-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="font-medium text-neutral-700">Hiển thị</span>
        </label>
      </Field>

      <div className="md:col-span-2">
        <div className="block space-y-2">
          <span className="ml-1 text-sm font-bold text-neutral-700">Mô tả</span>
          <RichTextEditor
            value={form.description}
            onChange={(content) => updateField("description", content)}
            placeholder="Mô tả chi tiết sản phẩm..."
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFormInfo;
