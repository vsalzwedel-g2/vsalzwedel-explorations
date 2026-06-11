interface SectionCardProps {
  label: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SectionCard({ label, title, description, children }: SectionCardProps) {
  return (
    <div className="bg-white border border-[var(--palette-neutral-20)] rounded-[12px] p-6">
      {/* Section Header */}
      <div className="mb-5">
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--palette-neutral-40)] mb-1">
          {label}
        </div>
        <h2 className="text-base font-semibold text-[var(--palette-neutral-100)] mt-1">
          {title}
        </h2>
        {description && (
          <p className="text-[13px] font-normal text-[var(--palette-neutral-70)] mt-0.5">
            {description}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--palette-neutral-20)] mb-5" />

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
