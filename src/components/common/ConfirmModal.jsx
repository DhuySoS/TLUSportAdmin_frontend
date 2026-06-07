import React from "react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận hành động",
  message = "Bạn có chắc chắn muốn thực hiện hành động này không?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "primary", // 'primary' | 'danger'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-neutral-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-black text-neutral-900">{title}</h3>
          <p className="text-sm font-bold text-neutral-500 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-neutral-100 text-sm font-bold text-neutral-600 hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2.5 rounded-full text-sm font-bold text-white transition-colors cursor-pointer ${
              type === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-neutral-950 hover:bg-neutral-800"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
