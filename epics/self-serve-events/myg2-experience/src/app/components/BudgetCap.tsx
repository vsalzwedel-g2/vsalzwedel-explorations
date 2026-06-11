import { useState } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

interface BudgetCapProps {
  budgetCapEnabled?: boolean;
  onBudgetCapEnabledChange?: (enabled: boolean) => void;
  currency?: string;
  onCurrencyChange?: (currency: string) => void;
  amount?: string;
  onAmountChange?: (amount: string) => void;
}

export function BudgetCap({
  budgetCapEnabled: controlledBudgetCapEnabled,
  onBudgetCapEnabledChange,
  currency: controlledCurrency,
  onCurrencyChange,
  amount: controlledAmount,
  onAmountChange,
}: BudgetCapProps = {}) {
  const [internalBudgetCapEnabled, setInternalBudgetCapEnabled] = useState(false);
  const [internalCurrency, setInternalCurrency] = useState("USD");
  const [internalAmount, setInternalAmount] = useState("");
  const [showValidationError, setShowValidationError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const budgetCapEnabled = controlledBudgetCapEnabled !== undefined ? controlledBudgetCapEnabled : internalBudgetCapEnabled;
  const currency = controlledCurrency !== undefined ? controlledCurrency : internalCurrency;
  const amount = controlledAmount !== undefined ? controlledAmount : internalAmount;

  const handleToggle = () => {
    const newValue = !budgetCapEnabled;
    if (onBudgetCapEnabledChange) {
      onBudgetCapEnabledChange(newValue);
    } else {
      setInternalBudgetCapEnabled(newValue);
    }
    setShowValidationError(false);
    setErrorMessage("");
  };

  const handleAmountChange = (value: string) => {
    if (onAmountChange) {
      onAmountChange(value);
    } else {
      setInternalAmount(value);
    }
    setShowValidationError(false);
    setErrorMessage("");
  };

  const handleCurrencyChange = (value: string) => {
    if (onCurrencyChange) {
      onCurrencyChange(value);
    } else {
      setInternalCurrency(value);
    }
  };

  const validateBudget = () => {
    if (!budgetCapEnabled) return true;

    if (!amount.trim()) {
      setErrorMessage("Enter a budget amount or turn off the cap.");
      setShowValidationError(true);
      return false;
    }

    const numValue = parseFloat(amount);
    if (isNaN(numValue) || numValue <= 0) {
      setErrorMessage("Budget must be greater than zero.");
      setShowValidationError(true);
      return false;
    }

    return true;
  };

  const getCurrencySymbol = (currencyCode: string) => {
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      CAD: "$",
      AUD: "$",
    };
    return symbols[currencyCode] || "$";
  };

  return (
    <div>
      {/* Toggle Row */}
      <div className="flex items-start gap-3">
        {/* Toggle Switch */}
        <button
          onClick={handleToggle}
          className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 mt-0.5 ${
            budgetCapEnabled ? "bg-[var(--palette-purple-100)]" : "bg-[var(--palette-neutral-20)]"
          }`}
        >
          <div
            className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${
              budgetCapEnabled ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </button>

        {/* Label and Description */}
        <div className="flex-1">
          <div className="text-sm font-semibold text-[var(--palette-neutral-100)]">
            Set a total budget cap
          </div>
          <p className="text-[13px] font-normal text-[var(--palette-neutral-70)] mt-0.5">
            By default your campaign runs until the event ends, regardless of how many gift cards
            are sent.
          </p>
        </div>
      </div>

      {/* Toggle OFF State - Recommendation Banner */}
      {!budgetCapEnabled && (
        <div className="bg-[var(--palette-green-20)] border border-[var(--palette-green-20)] rounded-lg p-3 mt-4 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[var(--palette-green-120)] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[13px] font-semibold text-[var(--palette-green-160)]">
              Recommended: keep your budget unlimited.
            </div>
            <div className="text-[13px] font-normal text-[var(--palette-green-160)] mt-0.5 leading-relaxed">
              Capping your budget can cut off reviewers mid-event if the limit is reached.
              Unlimited ensures every attendee who wants to review can.
            </div>
          </div>
        </div>
      )}

      {/* Toggle ON State - Budget Input + Warning */}
      {budgetCapEnabled && (
        <>
          {/* Budget Input Row */}
          <div className="mt-4">
            <label className="block text-[13px] font-medium text-[var(--palette-neutral-80)] mb-1.5">
              Total budget
            </label>

            {/* Currency + Amount Input */}
            <div className="flex">
              {/* Currency Selector */}
              <select
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className={`w-[88px] h-10 px-3 border text-sm font-medium text-[var(--palette-neutral-100)] outline-none rounded-l-lg transition-all ${
                  showValidationError
                    ? "border-[var(--palette-rorange-120)]"
                    : "border-[var(--palette-neutral-20)] focus:border-[var(--palette-purple-100)] focus:ring-[3px] focus:ring-[rgba(87,70,178,0.15)]"
                }`}
                style={{ borderRight: "none" }}
              >
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
                <option value="GBP">GBP £</option>
                <option value="CAD">CAD $</option>
                <option value="AUD">AUD $</option>
              </select>

              {/* Amount Input */}
              <input
                type="number"
                placeholder="e.g. 2500"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className={`flex-1 h-10 px-3 border text-sm text-[var(--palette-neutral-100)] outline-none rounded-r-lg transition-all ${
                  showValidationError
                    ? "border-[var(--palette-rorange-120)]"
                    : "border-[var(--palette-neutral-20)] focus:border-[var(--palette-purple-100)] focus:ring-[3px] focus:ring-[rgba(87,70,178,0.15)]"
                }`}
              />
            </div>

            {/* Helper Text or Error */}
            {showValidationError ? (
              <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--palette-rorange-120)]">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMessage}</span>
              </div>
            ) : (
              <p className="text-xs text-[var(--palette-neutral-70)] mt-1">
                This is the total across all products in this campaign, not per product.
              </p>
            )}
          </div>

          {/* Warning Banner */}
          <div className="bg-[var(--palette-yellow-20)] border border-[var(--palette-yellow-20)] rounded-lg p-3 mt-4 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[var(--palette-yellow-160)] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[13px] font-semibold text-[var(--palette-yellow-160)]">
                Setting a cap may end your campaign early.
              </div>
              <div className="text-[13px] font-normal text-[var(--palette-yellow-160)] mt-0.5 leading-relaxed">
                Reviewers who arrive after the limit is reached won't receive a gift card. Make
                sure this is intentional before scheduling.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
