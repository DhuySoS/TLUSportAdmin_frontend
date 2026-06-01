import { Plus, Trash2 } from "lucide-react";

const ProductSpecsSection = ({ specs, attributes, updateNestedValue, updateNestedValues, addItem, removeItem }) => {
  return (
    <div className="rounded-3xl bg-neutral-50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-black">Thêm thuộc tính</h3>
        <button
          type="button"
          onClick={() => addItem("specs", { attributeId: "", attributeValueId: "" })}
          className="admin-mini-button"
        >
          <Plus className="size-4" /> Thêm thuộc tính
        </button>
      </div>

      <div className="space-y-3">
        {specs.map((spec, index) => {
          const selectedAttr = attributes.find((a) => a.id === Number(spec.attributeId));
          return (
            <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <select
                value={spec.attributeId}
                onChange={(e) =>
                  updateNestedValues("specs", index, {
                    attributeId: e.target.value,
                    attributeValueId: "",
                  })
                }
                className="admin-input"
              >
                <option value="">Chọn thuộc tính...</option>
                {attributes.map((attr) => (
                  <option key={attr.id} value={attr.id}>
                    {attr.name}
                  </option>
                ))}
              </select>

              <select
                value={spec.attributeValueId}
                onChange={(e) => updateNestedValue("specs", index, "attributeValueId", e.target.value)}
                className="admin-input"
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
                onClick={() => removeItem("specs", index)}
                className="admin-icon-button"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductSpecsSection;
