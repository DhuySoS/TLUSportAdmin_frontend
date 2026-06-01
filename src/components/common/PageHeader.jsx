const PageHeader = ({ title, description, badge }) => {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {badge && (
          <p className="mb-3 inline-flex rounded-full bg-blue-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
            {badge}
          </p>
        )}
        <h1 className="text-4xl font-black tracking-tight text-neutral-950">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-3xl text-base font-medium text-neutral-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
