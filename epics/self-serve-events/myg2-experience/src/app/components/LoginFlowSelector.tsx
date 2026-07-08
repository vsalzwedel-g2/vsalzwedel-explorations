import { useState } from "react";
import { UserCheck, Clock, Info } from "lucide-react";

type LoginFlowType = "regular" | "delayed";

interface RadioCardProps {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

function RadioCard({ selected, onSelect, title, description, icon, disabled = false }: RadioCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={disabled ? undefined : onSelect}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-disabled={disabled}
      className={`flex-1 border rounded-[10px] p-4 transition-all ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${
        selected
          ? "border-[2px] border-[var(--palette-purple-100)] bg-[var(--palette-purple-10)]"
          : isHovered && !disabled
          ? "border-[1.5px] border-[var(--palette-neutral-20)] bg-[var(--palette-neutral-5)]"
          : "border-[1.5px] border-[var(--palette-neutral-20)] bg-white"
      }`}
    >
      {/* Top Row: Radio + Title */}
      <div className="flex items-center gap-2.5 mb-3">
        {/* Radio Button */}
        <div
          className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 ${
            selected ? "border-[var(--palette-purple-100)]" : "border-[var(--palette-neutral-20)]"
          }`}
        >
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-[var(--palette-purple-100)]" />}
        </div>

        {/* Title */}
        <div className="text-sm font-semibold text-[var(--palette-neutral-100)]">{title}</div>
      </div>

      {/* Icon */}
      <div className="flex justify-center mb-3">
        <div className={selected ? "text-[var(--palette-purple-100)]" : "text-[var(--palette-neutral-70)]"}>
          {icon}
        </div>
      </div>

      {/* Description */}
      <p className="text-[13px] font-normal text-[var(--palette-neutral-70)] leading-relaxed">
        {description}
      </p>
    </div>
  );
}

interface LoginFlowSelectorProps {
  value?: LoginFlowType;
  onChange?: (flow: LoginFlowType) => void;
  locked?: boolean;
}

export function LoginFlowSelector({ value, onChange, locked = false }: LoginFlowSelectorProps) {
  const [internalSelectedFlow, setInternalSelectedFlow] = useState<LoginFlowType>("regular");

  const selectedFlow = value !== undefined ? value : internalSelectedFlow;

  const handleSelectFlow = (flow: LoginFlowType) => {
    if (onChange) {
      onChange(flow);
    } else {
      setInternalSelectedFlow(flow);
    }
  };

  return (
    <div>
      {/* Section Header */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-[var(--palette-neutral-100)]">
          When should reviewers verify their identity?
        </h3>
      </div>

      {/* Radio Cards */}
      <div className="flex gap-4 mb-4">
        {/* Regular Login */}
        <RadioCard
          selected={selectedFlow === "regular"}
          onSelect={() => handleSelectFlow("regular")}
          title="Regular login"
          description="Reviewers create or log in to their G2 account before leaving their review. Best for campaigns where you want verification completed upfront and all incentive types available."
          icon={<UserCheck className="w-8 h-8" />}
          disabled={locked}
        />

        {/* Delayed Login */}
        <RadioCard
          selected={selectedFlow === "delayed"}
          onSelect={() => handleSelectFlow("delayed")}
          title="Delayed login"
          description="Best for maximizing initial review submissions with less event-day friction. Reviewers verify their G2 account later via email, and only verified, approved reviews count toward your incentive budget."
          icon={<Clock className="w-8 h-8" />}
          disabled={locked}
        />
      </div>

      {/* Consequence Banner - Only shown when Delayed Login is selected */}
      {selectedFlow === "delayed" && (
        <div className="bg-[var(--palette-blue-20)] border border-[var(--palette-blue-20)] rounded-lg p-3 mb-4 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[var(--palette-blue-100)] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[13px] font-semibold text-[var(--palette-blue-160)]">
              Note: Two incentive options are not available with delayed login.
            </div>
            <div className="text-[13px] font-normal text-[var(--palette-blue-160)] mt-0.5">
              Physical Incentive (Swag) and Non-Incentivized require identity verification at the time of review.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
