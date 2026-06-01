const Field = ({ label, children, hint }) => {
  return (
    <label className="block space-y-2">
      <span className="ml-1 text-sm font-bold text-neutral-700">{label}</span>
      {children}
      {hint && <span className="ml-1 text-xs font-medium text-neutral-400">{hint}</span>}
    </label>
  );
};

export default Field;
