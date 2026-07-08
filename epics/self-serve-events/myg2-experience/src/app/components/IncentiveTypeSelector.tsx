import { useState } from "react";
import { CreditCard, Heart, Package as PackageIcon, BanIcon, AlertCircle, Info } from "lucide-react";

type IncentiveType = "gift-card" | "g2-gives" | "swag" | "non-incentivized" | null;
type LoginFlowType = "regular" | "delayed";
type GiftCardDistribution = "per-review" | "per-reviewer";
type GiftCardBrand = "amazon" | "global-choice-link";

interface IncentiveOption {
  id: IncentiveType;
  title: string;
  description: string;
  icon: React.ReactNode;
  availableInDelayed: boolean;
  requiresCheckbox?: boolean;
}

interface RadioCardProps {
  selected: boolean;
  onSelect: () => void;
  option: IncentiveOption;
  showCheckbox?: boolean;
  checkboxChecked?: boolean;
  onCheckboxChange?: (checked: boolean) => void;
  checkboxError?: boolean;
}

function RadioCard({
  selected,
  onSelect,
  option,
  showCheckbox,
  checkboxChecked,
  onCheckboxChange,
  checkboxError,
}: RadioCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`border rounded-[10px] p-4 cursor-pointer transition-all ${
        selected
          ? "border-[2px] border-[var(--palette-purple-100)] bg-[var(--palette-purple-10)]"
          : isHovered
          ? "border-[1.5px] border-[var(--palette-neutral-20)] bg-[var(--palette-neutral-5)]"
          : "border-[1.5px] border-[var(--palette-neutral-20)] bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Radio Button */}
        <div
          className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 mt-0.5 ${
            selected ? "border-[var(--palette-purple-100)]" : "border-[var(--palette-neutral-20)]"
          }`}
        >
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-[var(--palette-purple-100)]" />}
        </div>

        {/* Content Block */}
        <div className="flex-1">
          <div className="text-[15px] font-semibold text-[var(--palette-neutral-100)]">{option.title}</div>
          <p className="text-[13px] font-normal text-[var(--palette-neutral-70)] mt-0.5 leading-relaxed">
            {option.description}
          </p>

          {/* Confirmation Checkbox for Swag */}
          {showCheckbox && selected && option.id === "swag" && (
            <>
              <div className="border-t border-[var(--palette-neutral-10)] my-3" />
              <div
                className="flex items-start gap-2.5"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={checkboxChecked}
                  onChange={(e) => onCheckboxChange?.(e.target.checked)}
                  className={`w-4 h-4 rounded border-[1.5px] mt-0.5 cursor-pointer accent-[var(--palette-purple-100)] ${
                    checkboxError ? "border-[var(--palette-rorange-120)]" : "border-[var(--palette-neutral-20)]"
                  }`}
                />
                <label
                  className={`text-[13px] font-medium cursor-pointer ${
                    checkboxError ? "text-[var(--palette-rorange-120)]" : "text-[var(--palette-neutral-80)]"
                  }`}
                  onClick={() => onCheckboxChange?.(!checkboxChecked)}
                >
                  I confirm I will distribute this incentive directly to reviewers at the event.
                </label>
              </div>
              {checkboxError && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-[var(--palette-rorange-120)]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>You must confirm distribution before scheduling.</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Icon */}
        <div className={`flex-shrink-0 ${selected ? "text-[var(--palette-purple-100)]" : "text-[var(--palette-neutral-40)]"}`}>
          {option.icon}
        </div>
      </div>
    </div>
  );
}

interface IncentiveTypeSelectorProps {
  loginFlow?: LoginFlowType;
  value?: IncentiveType;
  onChange?: (incentive: IncentiveType) => void;
  giftCardAmount?: string;
  onGiftCardAmountChange?: (amount: string) => void;
  giftCardDistribution?: GiftCardDistribution;
  onGiftCardDistributionChange?: (distribution: GiftCardDistribution) => void;
  giftCardBrand?: GiftCardBrand;
  onGiftCardBrandChange?: (brand: GiftCardBrand) => void;
  selectedCharity?: string;
  onCharityChange?: (charity: string) => void;
  budgetCurrency?: string;
  onBudgetCurrencyChange?: (currency: string) => void;
  budgetAmount?: string;
  onBudgetAmountChange?: (amount: string) => void;
}

export function IncentiveTypeSelector({
  loginFlow = "regular",
  value,
  onChange,
  giftCardAmount = "25",
  onGiftCardAmountChange,
  giftCardDistribution = "per-review",
  onGiftCardDistributionChange,
  giftCardBrand = "amazon",
  onGiftCardBrandChange,
  selectedCharity = "",
  onCharityChange,
  budgetCurrency,
  onBudgetCurrencyChange,
  budgetAmount,
  onBudgetAmountChange,
}: IncentiveTypeSelectorProps) {
  const [internalSelectedIncentive, setInternalSelectedIncentive] = useState<IncentiveType>(null);
  const [internalGiftCardAmount, setInternalGiftCardAmount] = useState("25");
  const [internalGiftCardDistribution, setInternalGiftCardDistribution] = useState<GiftCardDistribution>("per-review");
  const [internalGiftCardBrand, setInternalGiftCardBrand] = useState<GiftCardBrand>("amazon");
  const [internalSelectedCharity, setInternalSelectedCharity] = useState("");

  const selectedIncentive = value !== undefined ? value : internalSelectedIncentive;
  const currentGiftCardAmount = onGiftCardAmountChange ? giftCardAmount : internalGiftCardAmount;
  const currentGiftCardDistribution = onGiftCardDistributionChange ? giftCardDistribution : internalGiftCardDistribution;
  const currentGiftCardBrand = onGiftCardBrandChange ? giftCardBrand : internalGiftCardBrand;
  const currentCharity = onCharityChange ? selectedCharity : internalSelectedCharity;

  const handleDistributionChange = (next: GiftCardDistribution) => {
    if (onGiftCardDistributionChange) {
      onGiftCardDistributionChange(next);
    } else {
      setInternalGiftCardDistribution(next);
    }
  };

  const handleBrandChange = (next: GiftCardBrand) => {
    if (onGiftCardBrandChange) {
      onGiftCardBrandChange(next);
    } else {
      setInternalGiftCardBrand(next);
    }
  };

  const [swagCheckboxChecked, setSwagCheckboxChecked] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [showCheckboxError, setShowCheckboxError] = useState(false);

  const incentiveOptions: IncentiveOption[] = [
    {
      id: "gift-card",
      title: "Gift card",
      description: "Digital gift card on verified submissions",
      icon: <CreditCard className="w-6 h-6" />,
      availableInDelayed: true,
    },
    {
      id: "g2-gives",
      title: "G2 Gives",
      description: "Charitable donation made per review",
      icon: <Heart className="w-6 h-6" />,
      availableInDelayed: true,
    },
    {
      id: "swag",
      title: "Physical incentive (swag)",
      description: "You distribute the incentive directly to reviewers at the event. Reviews are still tagged as incentivized for legal compliance",
      icon: <PackageIcon className="w-6 h-6" />,
      availableInDelayed: false,
      requiresCheckbox: true,
    },
    {
      id: "non-incentivized",
      title: "Non-incentivized",
      description: "No reward offered. Reviewers participate voluntarily",
      icon: <BanIcon className="w-6 h-6" />,
      availableInDelayed: false,
    },
  ];

  const visibleOptions = incentiveOptions.filter(
    (option) => loginFlow === "regular" || option.availableInDelayed
  );

  const handleSelectIncentive = (incentiveId: IncentiveType) => {
    if (onChange) {
      onChange(incentiveId);
    } else {
      setInternalSelectedIncentive(incentiveId);
    }
    setShowValidationError(false);
    setShowCheckboxError(false);

    // Reset checkbox when switching away from swag
    if (incentiveId !== "swag") {
      setSwagCheckboxChecked(false);
    }
  };

  return (
    <div>
      {/* Section Header */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-[var(--palette-neutral-100)]">
          What incentive will reviewers receive?
        </h3>
      </div>

      {/* Incentive Option Cards */}
      <div className="grid grid-cols-2 gap-3">
        {visibleOptions.map((option) => (
          <RadioCard
            key={option.id}
            selected={selectedIncentive === option.id}
            onSelect={() => handleSelectIncentive(option.id)}
            option={option}
            showCheckbox={option.requiresCheckbox}
            checkboxChecked={swagCheckboxChecked}
            onCheckboxChange={setSwagCheckboxChecked}
            checkboxError={showCheckboxError}
          />
        ))}
      </div>

      {/* Delayed Login Recommendation */}
      {selectedIncentive === "gift-card" && loginFlow === "regular" && (
        <div className="mt-4 bg-[var(--palette-blue-20)] border border-[var(--palette-blue-20)] rounded-lg p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-[var(--palette-blue-100)] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-[var(--palette-blue-160)]">
              <span className="font-semibold">Recommendation:</span> Consider using delayed login for higher completion rates. Reviewers can write their review first without login friction.
            </p>
          </div>
        </div>
      )}

      {/* Charity Selector */}
      {selectedIncentive === "g2-gives" && (
        <div className="mt-4 bg-[var(--palette-neutral-5)] border border-[var(--palette-neutral-20)] rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold text-[var(--palette-neutral-40)] uppercase tracking-wide mb-4">
            Charity partner
          </div>
          <select
            value={currentCharity}
            onChange={(e) => {
              const newValue = e.target.value;
              if (onCharityChange) {
                onCharityChange(newValue);
              } else {
                setInternalSelectedCharity(newValue);
              }
            }}
            className="w-full px-3 py-2 border border-[var(--palette-neutral-20)] rounded-lg text-sm text-[var(--palette-neutral-100)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--palette-purple-100)] focus:border-transparent"
          >
            <option value="">Choose a charity</option>
            <option value="American Cancer Society">American Cancer Society</option>
            <option value="Angels Orphanage">Angels Orphanage</option>
            <option value="Australian Red Cross">Australian Red Cross</option>
            <option value="Girls Who Code">Girls Who Code</option>
            <option value="My Block My Hood My City">My Block My Hood My City</option>
            <option value="Navachethana">Navachethana</option>
            <option value="New Story">New Story</option>
            <option value="Outright Action International">Outright Action International</option>
            <option value="One Tree Planted">One Tree Planted</option>
            <option value="World Central Kitchen">World Central Kitchen</option>
            <option value="World Wildlife Fund">World Wildlife Fund</option>
          </select>
          <p className="text-xs text-[var(--palette-neutral-70)] mt-2">
            G2 will make a $10 donation to your selected charity for each review submitted.
          </p>
        </div>
      )}

      {/* Budget Configuration - Combined Amount & Cap */}
      {selectedIncentive === "gift-card" && (
        <div className="mt-4 bg-[var(--palette-neutral-5)] border border-[var(--palette-neutral-20)] rounded-lg p-4 shadow-sm">
          <div className="text-xs font-semibold text-[var(--palette-neutral-40)] uppercase tracking-wide mb-4">
            Gift card amount
          </div>

          {/* Brand Picker - Amazon vs Global Choice Link */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-[var(--palette-neutral-100)] mb-2">
              Gift card type
            </label>
            <select
              aria-label="Gift card type"
              value={currentGiftCardBrand}
              onChange={(e) => handleBrandChange(e.target.value as GiftCardBrand)}
              className="w-full max-w-xs h-10 px-3 border border-[var(--palette-neutral-20)] rounded-lg text-sm text-[var(--palette-neutral-100)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--palette-purple-100)] focus:border-transparent"
            >
              <option value="amazon">Amazon</option>
              <option value="global-choice-link">Global Choice Link</option>
            </select>
          </div>

          {/* Distribution Toggle - Per review vs Per reviewer */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-[var(--palette-neutral-100)] mb-2">
              How is the gift card awarded?
            </label>
            <div
              role="radiogroup"
              aria-label="Gift card distribution"
              className="inline-flex p-1 bg-white border border-[var(--palette-neutral-20)] rounded-lg"
            >
              {(
                [
                  { id: "per-review", label: "Per review" },
                  { id: "per-reviewer", label: "Per reviewer" },
                ] as { id: GiftCardDistribution; label: string }[]
              ).map((opt) => {
                const active = currentGiftCardDistribution === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => handleDistributionChange(opt.id)}
                    className={`px-4 h-8 text-sm font-medium rounded-md transition-all ${
                      active
                        ? "bg-[var(--palette-purple-100)] text-white shadow-sm"
                        : "text-[var(--palette-neutral-80)] hover:text-[var(--palette-neutral-100)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-[var(--palette-neutral-70)] mt-2">
              {currentGiftCardDistribution === "per-review"
                ? "Reviewers receive a gift card for each review they submit. Writing reviews for multiple products earns multiple gift cards."
                : "Reviewers receive one gift card regardless of how many reviews they submit, even across multiple products."}
            </p>
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left: Amount Per Review / Per Reviewer */}
            <div>
              <label className="block text-sm font-medium text-[var(--palette-neutral-100)] mb-1.5">
                {currentGiftCardDistribution === "per-review" ? "Amount per review" : "Amount per reviewer"}{" "}
                <span className="text-[var(--palette-rorange-120)]">*</span>
              </label>
              <div className="flex">
                <div
                  className="w-20 h-10 px-3 border border-[var(--palette-neutral-20)] text-sm font-medium text-[var(--palette-neutral-100)] rounded-l-lg bg-white flex items-center justify-center"
                  style={{ borderRight: "none" }}
                >
                  USD
                </div>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={currentGiftCardAmount}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (onGiftCardAmountChange) {
                      onGiftCardAmountChange(newValue);
                    } else {
                      setInternalGiftCardAmount(newValue);
                    }
                  }}
                  className="flex-1 h-10 px-3 border border-[var(--palette-neutral-20)] text-sm text-[var(--palette-neutral-100)] bg-white outline-none rounded-r-lg transition-all focus:border-[var(--palette-purple-100)] focus:ring-[3px] focus:ring-[rgba(87,70,178,0.15)]"
                  placeholder="e.g. 25"
                />
              </div>
              <p className="text-xs text-[var(--palette-neutral-70)] mt-1.5">
                Sent to reviewer after their submission is verified and approved.
              </p>
            </div>

            {/* Right: Budget Cap */}
            <div>
              <label className="block text-sm font-medium text-[var(--palette-neutral-100)] mb-1.5">
                Budget cap <span className="text-[var(--palette-neutral-40)] font-normal">(optional)</span>
              </label>
              <div className="flex">
                <div
                  className="w-20 h-10 px-3 border border-[var(--palette-neutral-20)] text-sm font-medium text-[var(--palette-neutral-100)] rounded-l-lg bg-white flex items-center justify-center"
                  style={{ borderRight: "none" }}
                >
                  USD
                </div>
                <input
                  type="number"
                  placeholder="Unlimited"
                  value={budgetAmount || ""}
                  onChange={(e) => {
                    if (onBudgetAmountChange) {
                      onBudgetAmountChange(e.target.value);
                    }
                  }}
                  className="flex-1 h-10 px-3 border border-[var(--palette-neutral-20)] text-sm text-[var(--palette-neutral-100)] bg-white outline-none rounded-r-lg transition-all focus:border-[var(--palette-purple-100)] focus:ring-[3px] focus:ring-[rgba(87,70,178,0.15)]"
                />
              </div>
              <p className="text-xs text-[var(--palette-neutral-70)] mt-1.5">
                {loginFlow === "delayed" ? (
                  <>
                    <span className="font-semibold">Unlimited (recommended).</span> Budget is only used for verified, approved reviews. If you set a cap, set it higher to account for reviewers who may submit a review but complete verification later.
                  </>
                ) : (
                  "Leave blank for unlimited. A cap can halt redemptions mid-event."
                )}
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Validation Error - No option selected */}
      {showValidationError && !selectedIncentive && (
        <div className="flex items-center gap-1.5 mt-3 text-xs text-[var(--palette-rorange-120)]">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Select an incentive type to continue.</span>
        </div>
      )}
    </div>
  );
}
