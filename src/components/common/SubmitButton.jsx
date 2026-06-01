const SubmitButton = ({ isLoading, children = "Lưu dữ liệu" }) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="inline-flex min-h-11 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-bold text-white transition-all hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? "Đang xử lý..." : children}
    </button>
  );
};

export default SubmitButton;
