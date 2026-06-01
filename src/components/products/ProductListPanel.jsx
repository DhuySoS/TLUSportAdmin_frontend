import { useState, useEffect } from "react";
import { Pencil, Trash2, Search, X } from "lucide-react";
import FormSection from "@/components/common/FormSection";
import { formatCurrency } from "@/lib/formatCurrency";

const ProductListPanel = ({ products, pageNumber, onEdit, onDelete, onPrevPage, onNextPage, onSearch }) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(inputValue);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <div className="sticky top-23 h-fit">
      <FormSection title="Danh sách sản phẩm">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-9 text-sm font-medium placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => setInputValue("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          {products.length === 0 && (
            <p className="rounded-2xl bg-neutral-50 p-4 text-sm font-medium text-neutral-500">
              Chưa có dữ liệu mẫu.
            </p>
          )}
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-neutral-200 p-4 transition-colors hover:border-neutral-300"
            >
              <div className="flex gap-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-black">{product.name}</p>
                  <p className="mt-1 text-sm font-bold text-blue-700">
                    {formatCurrency(product.basePrice)}
                  </p>
                  <p className="mt-1 text-xs font-medium text-neutral-400">
                    {product.categoryName || `Category ID: ${product.categoryId || "N/A"}`}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="admin-icon-button text-blue-600 hover:bg-blue-50"
                    title="Chỉnh sửa"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    className="admin-icon-button text-red-500 hover:bg-red-50"
                    title="Xóa"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Phân trang */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onPrevPage}
            className="admin-mini-button"
          >
            Trang trước
          </button>
          <span className="text-sm font-black">Trang {pageNumber}</span>
          <button
            type="button"
            onClick={onNextPage}
            className="admin-mini-button"
          >
            Trang sau
          </button>
        </div>
      </FormSection>
    </div>
  );
};

export default ProductListPanel;
