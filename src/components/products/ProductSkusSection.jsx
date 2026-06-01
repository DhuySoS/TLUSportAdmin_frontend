import { Plus } from "lucide-react";
import SkuItem from "./SkuItem";

const ProductSkusSection = ({ skus, attributes, updateNestedValue, removeItem, addItem }) => {
  return (
    <div className="rounded-3xl bg-neutral-50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-black">Phiên bản</h3>
      </div>

      <div className="space-y-10">
        {skus.map((sku, index) => (
          <SkuItem
            key={index}
            sku={sku}
            index={index}
            attributes={attributes}
            updateNestedValue={updateNestedValue}
            removeItem={removeItem}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => addItem("skus", {
          skuCode: "", price: "", stockQuantity: "", isActive: true, imageUrls: [], attributes: [
            { attributeId: "2", valueId: "" },
            { attributeId: "3", valueId: "" },]
        })}
        className="admin-mini-button mt-5"
      >
        <Plus className="size-4" /> Thêm SKU
      </button>
    </div>
  );
};

export default ProductSkusSection;
