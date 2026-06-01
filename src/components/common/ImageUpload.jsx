import { useRef, useState } from "react";
import { Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import cloudinaryServices from "@/services/cloudinaryServices";

const ImageUpload = ({ value, onChange, className = "" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh hợp lệ");
      return;
    }

    setIsUploading(true);
    try {
      const data = await cloudinaryServices.uploadImage(file);
      onChange(data.secure_url);
      toast.success("Tải ảnh lên thành công!");
    } catch (error) {
      toast.error(
        error.message === "Cloudinary configuration is missing. Please check .env file."
          ? error.message
          : "Có lỗi xảy ra khi tải ảnh lên Cloudinary"
      );
    } finally {
      setIsUploading(false);
      // Reset input value to allow uploading the same file again if needed
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className={`relative ${className}`}>
      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 group">
          <img
            src={value}
            alt="Uploaded preview"
            className="h-full w-full object-contain"
            style={{ maxHeight: "200px", minHeight: "100px" }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity flex items-center justify-center group-hover:opacity-100">
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600 transition-colors"
              title="Xóa ảnh"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-6 text-center transition-colors hover:border-blue-500 hover:bg-blue-50"
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center text-blue-500">
              <Loader2 className="mb-2 size-8 animate-spin" />
              <p className="text-sm font-medium">Đang tải lên...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-neutral-500 group">
              <UploadCloud className="mb-2 size-8 transition-transform group-hover:-translate-y-1 group-hover:text-blue-500" />
              <p className="text-sm font-medium">Bấm để chọn ảnh tải lên</p>
              <p className="mt-1 text-xs text-neutral-400">Hỗ trợ JPG, PNG, WEBP</p>
            </div>
          )}
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
