const FormSection = ({ title, description, children, actions }) => {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 border-b border-neutral-100 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
          {description && (
            <p className="mt-1 max-w-2xl text-sm font-medium text-neutral-500">
              {description}
            </p>
          )}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
};

export default FormSection;
