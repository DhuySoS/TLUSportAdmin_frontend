import { useEffect, useState } from "react";
import { toast } from "sonner";
import Field from "@/components/common/Field";
import FormSection from "@/components/common/FormSection";
import PageHeader from "@/components/common/PageHeader";
import SubmitButton from "@/components/common/SubmitButton";
import ImageUpload from "@/components/common/ImageUpload";
import { slugify } from "@/lib/utils";
import brandServices from "@/services/brandServices";

const initialForm = {
  name: "",
  slug: "",
  logoUrl: "",
  description: "",
  isActive: true,
};

const BrandsPage = () => {
  const [form, setForm] = useState(initialForm);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadBrands = async () => {
    const res = await brandServices.getBrands();
    setBrands(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => {
      const nextForm = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "name") nextForm.slug = slugify(value);
      return nextForm;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const res = await brandServices.createBrand(form);
      setForm(initialForm);
      loadBrands();
      toast.success(res.message || "Tạo thương hiệu thành công");
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể tạo thương hiệu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        badge="Thương hiệu"
        title="Quản lý thương hiệu"
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <FormSection title="Tạo thương hiệu">
          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <Field label="Tên thương hiệu">
              <input name="name" value={form.name} onChange={handleChange} className="admin-input" placeholder="Nike" required />
            </Field>
            <Field label="Slug">
              <input name="slug" value={form.slug} onChange={handleChange} className="admin-input" placeholder="nike" required />
            </Field>
            <div className="space-y-2">
              <label className="ml-1 text-sm font-bold text-neutral-700">Logo thương hiệu</label>
              <ImageUpload
                value={form.logoUrl}
                onChange={(url) => setForm({ ...form, logoUrl: url })}
              />
            </div>
            <Field label="Mô tả">
              <textarea name="description" value={form.description} onChange={handleChange} className="admin-input min-h-32 rounded-3xl" placeholder="Mô tả ngắn về thương hiệu" />
            </Field>
            <div className="flex items-end md:justify-end">
              <SubmitButton isLoading={isLoading}>Tạo thương hiệu</SubmitButton>
            </div>
          </form>
        </FormSection>

        <FormSection title="Dữ liệu thương hiệu mẫu">
          <div className="space-y-3">
            {brands.map((brand) => (
              <div key={brand.id} className="rounded-2xl border border-neutral-200 p-4">
                <p className="font-black">#{brand.id} {brand.name}</p>
                <p className="mt-1 text-sm font-medium text-neutral-500">{brand.slug}</p>
                <p className="mt-3 text-sm text-neutral-500">{brand.description}</p>
              </div>
            ))}
          </div>
        </FormSection>
      </div>
    </div>
  );
};

export default BrandsPage;
