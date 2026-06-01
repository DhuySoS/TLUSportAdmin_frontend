import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import Field from "@/components/common/Field";
import FormSection from "@/components/common/FormSection";
import PageHeader from "@/components/common/PageHeader";
import SubmitButton from "@/components/common/SubmitButton";
import ImageUpload from "@/components/common/ImageUpload";
import { slugify } from "@/lib/utils";
import categoryServices from "@/services/categoryServices";
import attributeServices from "@/services/attributeServices";

const initialForm = {
  name: "",
  slug: "",
  imageUrl: "",
  parentId: "",
  isActive: true,
};

const CategoryNode = ({ category, level = 0, onEdit, onDelete }) => {
  const children = category.subCategories || category.children || [];
  const hasChildren = children.length > 0;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`mt-2 ${level > 0 ? "ml-4 border-l-2 border-neutral-100 pl-4" : ""}`}>
      <div
        className={`flex items-center justify-between rounded-xl p-3 hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-200 ${hasChildren ? "cursor-pointer" : ""}`}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {hasChildren ? (
            isOpen ? <ChevronDown className="size-4 text-neutral-500" /> : <ChevronRight className="size-4 text-neutral-500" />
          ) : (
            <div className="size-4" />
          )}
          <span className="font-bold text-neutral-800">{category.name}</span>
          <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-bold text-neutral-500">
            ID: {category.id}
          </span>
          {category.slug && (
            <span className="text-xs font-medium text-neutral-400">({category.slug})</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-xs font-bold ${category.isActive ? "text-green-600" : "text-neutral-400"}`}>
            {category.isActive ? "Bật" : "Ẩn"}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onEdit(category); }}
              className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete(category.id); }}
              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {hasChildren && isOpen && (
        <div className="animate-in slide-in-from-top-1 fade-in duration-200">
          {children.map((child) => (
            <CategoryNode key={child.id} category={child} level={level + 1} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoriesPage = () => {
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [attributes, setAttributes] = useState([]);
  const [assignedAttributes, setAssignedAttributes] = useState([]);
  const [editAttributeId, setEditAttributeId] = useState(null);
  const [assignForm, setAssignForm] = useState({
    categoryId: "",
    attributeId: "",
    isRequired: true,
    isFilterable: true,
  });

  const flattenCategories = (cats, level = 0, result = []) => {
    cats.forEach((cat) => {
      result.push({ ...cat, level });
      const children = cat.subCategories || cat.children || [];
      if (children.length > 0) {
        flattenCategories(children, level + 1, result);
      }
    });
    return result;
  };

  const flattenedCategories = useMemo(() => flattenCategories(categories), [categories]);

  const loadCategories = async () => {
    try {
      const res = await categoryServices.getCategoryTree();
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadAttributes = async () => {
    const res = await attributeServices.getAttributes();
    setAttributes(Array.isArray(res.data) ? res.data : []);
  };

  const loadAssignedAttributes = async (categoryId) => {
    if (!categoryId) {
      setAssignedAttributes([]);
      return;
    }
    try {
      const res = await categoryServices.getCategoryAttributes(categoryId);
      setAssignedAttributes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setAssignedAttributes([]);
    }
  };

  useEffect(() => {
    loadCategories();
    loadAttributes();
  }, []);

  useEffect(() => {
    loadAssignedAttributes(assignForm.categoryId);
  }, [assignForm.categoryId]);

  const handleAssignSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      categoryId: Number(assignForm.categoryId),
      attributeId: Number(assignForm.attributeId),
      isRequired: assignForm.isRequired,
      isFilterable: assignForm.isFilterable,
    };

    try {
      if (editAttributeId) {
        const res = await categoryServices.updateCategoryAttribute(editAttributeId, payload);
        toast.success(res.message || "Cập nhật thuộc tính thành công");
        setEditAttributeId(null);
        setAssignForm(prev => ({ ...prev, attributeId: "", isRequired: true, isFilterable: true }));
      } else {
        const res = await categoryServices.assignAttributeToCategory(assignForm.categoryId, payload);
        toast.success(res.message || "Thêm thuộc tính thành công");
      }
      loadAssignedAttributes(assignForm.categoryId);
    } catch (error) {
      toast.error(error.response?.data?.message || (editAttributeId ? "Không thể cập nhật" : "Không thể thêm thuộc tính"));
    }
  };

  const handleEditAttribute = (attr) => {
    setEditAttributeId(attr.id);
    setAssignForm({
      categoryId: assignForm.categoryId, // giữ nguyên danh mục đang chọn
      attributeId: attr.attributeId.toString(),
      isRequired: attr.isRequired,
      isFilterable: attr.isFilterable,
    });
  };

  const handleCancelEditAttribute = () => {
    setEditAttributeId(null);
    setAssignForm(prev => ({ ...prev, attributeId: "", isRequired: true, isFilterable: true }));
  };

  const handleDeleteAttribute = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thuộc tính này khỏi danh mục?")) return;
    try {
      const res = await categoryServices.deleteCategoryAttribute(id);
      toast.success(res.message || "Xóa thành công");
      if (editAttributeId === id) handleCancelEditAttribute();
      loadAssignedAttributes(assignForm.categoryId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể xóa thuộc tính");
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => {
      const nextForm = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "name") nextForm.slug = slugify(value);
      return nextForm;
    });
  };

  const handleEdit = (category) => {
    setEditId(category.id);
    setForm({
      name: category.name || "",
      slug: category.slug || "",
      imageUrl: category.imageUrl || "",
      parentId: category.parentId || "",
      isActive: category.isActive !== undefined ? category.isActive : true,
    });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm(initialForm);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này? Các danh mục con cũng sẽ bị ảnh hưởng.")) return;

    try {
      const res = await categoryServices.deleteCategory(id);
      toast.success(res.message || "Xóa danh mục thành công");
      loadCategories();
      if (editId === id) handleCancelEdit();
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể xóa danh mục");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const payload = {
      name: form.name,
      slug: form.slug,
      imageUrl: form.imageUrl || null,
      parentId: form.parentId ? Number(form.parentId) : null,
      isActive: form.isActive,
    };

    try {
      if (editId) {
        const res = await categoryServices.updateCategory(editId, payload);
        toast.success(res.message || "Cập nhật danh mục thành công");
        setEditId(null);
      } else {
        const res = await categoryServices.createCategory(payload);
        toast.success(res.message || "Tạo danh mục thành công");
      }
      setForm(initialForm);
      loadCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || (editId ? "Không thể cập nhật danh mục" : "Không thể tạo danh mục"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        badge="Danh mục"
        title="Quản lý danh mục"
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-6">
          <FormSection title={editId ? "Cập nhật danh mục" : "Tạo danh mục mới"}>
            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              <Field label="Tên danh mục">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="admin-input"
                  placeholder="Đồ thể thao"
                  required
                />
              </Field>
              <Field label="Slug">
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  className="admin-input"
                  placeholder="do-the-thao"
                  required
                />
              </Field>
              <div className="space-y-2">
                <label className="ml-1 text-sm font-bold text-neutral-700">Ảnh danh mục</label>
                <ImageUpload
                  value={form.imageUrl}
                  onChange={(url) => setForm({ ...form, imageUrl: url })}
                />
              </div>
              <Field label="Danh mục cha">
                <select
                  name="parentId"
                  value={form.parentId}
                  onChange={handleChange}
                  className="admin-input"
                >
                  <option value="">-- Trống (Danh mục gốc) --</option>
                  {flattenedCategories.map((cat) => (
                    <option key={cat.id} value={cat.id} disabled={cat.id === editId}>
                      {"— ".repeat(cat.level)}{cat.name}
                    </option>
                  ))}
                </select>
              </Field>

              <label className="md:col-span-2 flex w-max cursor-pointer items-center gap-3 rounded-2xl bg-neutral-50 p-4 text-sm font-bold transition-colors hover:bg-neutral-100">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="size-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                Trạng thái: {form.isActive ? "Đang bật (Hiển thị)" : "Đã tắt (Ẩn)"}
              </label>

              <div className="md:text-right flex items-center justify-end gap-3 md:col-span-2">
                {editId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="rounded-full bg-neutral-100 px-6 py-3 text-sm font-bold text-neutral-600 transition-colors hover:bg-neutral-200"
                  >
                    Hủy
                  </button>
                )}
                <SubmitButton isLoading={isLoading}>{editId ? "Lưu thay đổi" : "Tạo danh mục"}</SubmitButton>
              </div>
            </form>
          </FormSection>

          <FormSection title="Thêm thuộc tính cho danh mục" >
            <form onSubmit={handleAssignSubmit} className="grid gap-5 md:grid-cols-2">
              <Field label="Danh mục">
                <select
                  value={assignForm.categoryId}
                  onChange={(event) => setAssignForm({ ...assignForm, categoryId: event.target.value })}
                  className="admin-input"
                  required
                >
                  <option value="" disabled>-- Chọn danh mục --</option>
                  {flattenedCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {"— ".repeat(cat.level)}{cat.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Thuộc tính">
                <select
                  value={assignForm.attributeId}
                  onChange={(event) => setAssignForm({ ...assignForm, attributeId: event.target.value })}
                  className="admin-input"
                  required
                >
                  <option value="" disabled>-- Chọn thuộc tính --</option>
                  {attributes.map(attr => (
                    <option key={attr.id} value={attr.id}>#{attr.id} - {attr.name}</option>
                  ))}
                </select>
              </Field>
              <label className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-4 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={assignForm.isRequired}
                  onChange={(event) => setAssignForm({ ...assignForm, isRequired: event.target.checked })}
                  className="size-4"
                />
                Bắt buộc
              </label>
              <label className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-4 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={assignForm.isFilterable}
                  onChange={(event) => setAssignForm({ ...assignForm, isFilterable: event.target.checked })}
                  className="size-4"
                />
                Cho phép lọc
              </label>
              <div className="md:col-span-2 text-right flex items-center justify-end gap-3">
                {editAttributeId && (
                  <button
                    type="button"
                    onClick={handleCancelEditAttribute}
                    className="rounded-full bg-neutral-100 px-6 py-3 text-sm font-bold text-neutral-600 transition-colors hover:bg-neutral-200"
                  >
                    Hủy
                  </button>
                )}
                <SubmitButton>{editAttributeId ? "Lưu thay đổi" : "Thêm thuộc tính"}</SubmitButton>
              </div>
            </form>

            {assignForm.categoryId && (
              <div className="mt-6 border-t border-neutral-100 pt-6">
                <h4 className="mb-4 text-sm font-bold text-neutral-800">Thuộc tính đã gán:</h4>
                <div className="space-y-3">
                  {assignedAttributes.length === 0 && (
                    <p className="rounded-xl bg-neutral-50 p-4 text-sm font-medium text-neutral-500">
                      Danh mục này chưa có thuộc tính nào.
                    </p>
                  )}
                  {assignedAttributes.map(attr => (
                    <div key={attr.id} className="flex items-center justify-between rounded-xl border border-neutral-200 p-3 hover:bg-neutral-50">
                      <div>
                        <p className="font-bold text-neutral-800">#{attr?.attributeId} - {attr?.attributeName}</p>
                        <div className="mt-1 flex gap-2 text-xs font-bold text-neutral-500">
                          <span className={attr.isRequired ? "text-blue-600" : ""}>{attr.isRequired ? "Bắt buộc" : "Không bắt buộc"}</span>
                          <span>•</span>
                          <span className={attr.isFilterable ? "text-green-600" : ""}>{attr.isFilterable ? "Cho phép lọc" : "Không cho phép lọc"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditAttribute(attr)}
                          className="p-1.5 text-neutral-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAttribute(attr.id)}
                          className="p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </FormSection>
        </div>

        <div className="sticky top-22 h-fit max-h-[calc(100vh-2rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <FormSection title="Cây danh mục" >
            <div className="space-y-3 ">
              {categories.length === 0 && (
                <p className="rounded-2xl bg-neutral-50 p-4 text-sm font-medium text-neutral-500">
                  Chưa có dữ liệu mẫu.
                </p>
              )}
              {categories.map((category) => (
                <CategoryNode
                  key={category.id}
                  category={category}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </FormSection>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
