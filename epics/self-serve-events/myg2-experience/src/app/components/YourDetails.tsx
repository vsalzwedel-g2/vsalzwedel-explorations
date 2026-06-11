interface YourDetailsProps {
  locked?: boolean;
  contactName: string;
  onContactNameChange: (value: string) => void;
  contactEmail: string;
  onContactEmailChange: (value: string) => void;
}

const inputClass =
  "w-full h-10 px-3 border border-[var(--palette-neutral-20)] rounded-lg text-sm outline-none transition-all focus:border-[var(--palette-purple-100)] focus:ring-[3px] focus:ring-[rgba(87,70,178,0.15)] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--palette-neutral-5)]";

export function YourDetails({
  locked = false,
  contactName,
  onContactNameChange,
  contactEmail,
  onContactEmailChange,
}: YourDetailsProps) {
  return (
    <div>
      <h3 className="text-base font-semibold text-[var(--palette-neutral-100)] mb-3">
        Your details
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--palette-neutral-80)] mb-1.5">
            Your name <span className="text-[var(--palette-rorange-120)]">*</span>
          </label>
          <input
            type="text"
            value={contactName}
            disabled={locked}
            onChange={(e) => onContactNameChange(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--palette-neutral-80)] mb-1.5">
            Your email <span className="text-[var(--palette-rorange-120)]">*</span>
          </label>
          <input
            type="email"
            value={contactEmail}
            disabled={locked}
            onChange={(e) => onContactEmailChange(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
