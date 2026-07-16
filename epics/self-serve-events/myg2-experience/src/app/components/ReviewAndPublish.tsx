import { useState, type ReactNode } from "react";
import { Monitor, ExternalLink, QrCode, Download, Copy, AlertCircle, CheckCircle2, ArrowRight, X, Clock, Lock } from "lucide-react";

type IncentiveType = "gift-card" | "g2-gives" | "swag" | "non-incentivized" | null;
type GiftCardDistribution = "per-review" | "per-reviewer";
type PaymentMethod = "saved-card" | "new-card" | "invoice";

function formatDate(iso: string): string {
  if (!iso) return "";
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const d = match
    ? new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10))
    : new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function SummaryRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <dt className="text-[var(--palette-neutral-70)] flex-shrink-0">{label}</dt>
      <dd className="font-medium text-[var(--palette-neutral-100)] text-right">{value}</dd>
    </div>
  );
}

function getRequiredDescription(
  incentiveType: IncentiveType,
  giftCardAmount: string = "25",
  selectedCharity: string = "",
  productNames: string[] = [],
  _giftCardDistribution: GiftCardDistribution = "per-review"
): ReactNode {
  let vendor: string;
  if (productNames.length === 1) {
    vendor = productNames[0];
  } else if (productNames.length > 1) {
    vendor = "[vendor name]";
  } else {
    vendor = "[product name]";
  }
  const charityName = selectedCharity || "[charity selected]";

  switch (incentiveType) {
    case "gift-card":
      return (
        <>
          Leave an honest {vendor} review and receive a <strong>${giftCardAmount} gift card</strong> — as a thank you for your time and insight.
        </>
      );
    case "g2-gives":
      return (
        <>
          Leave an honest {vendor} review and unlock a <strong>$10 donation</strong> to {charityName}.
        </>
      );
    case "swag":
      return <>Leave an honest {vendor} review.</>;
    case "non-incentivized":
      return <>Leave an honest {vendor} review and help others make informed decisions.</>;
    default:
      return (
        <>
          Leave an honest {vendor} review and receive a <strong>${giftCardAmount} gift card</strong> — as a thank you for your time and insight.
        </>
      );
  }
}

type ReviewMode = "review" | "schedule";

interface ReviewAndPublishProps {
  mode?: ReviewMode;
  isPublished?: boolean;
  hasValidationErrors?: boolean;
  errorCount?: number;
  errorSections?: string[];
  heroSubtitle?: string;
  customDescription?: string;
  uploadedImageUrl?: string;
  customCtaLabel?: string;
  incentiveType?: IncentiveType;
  giftCardAmount?: string;
  giftCardDistribution?: GiftCardDistribution;
  giftCardBrand?: "amazon" | "global-choice-link";
  selectedCharity?: string;
  productNames?: string[];
  campaignTitle?: string;
  contactName?: string;
  contactEmail?: string;
  targetCategories?: string[];
  loginFlow?: "regular" | "delayed";
  startDate?: string;
  endDate?: string;
  timeZone?: string;
  targetCountry?: string;
  showProgressTracker?: boolean;
  reviewGoal?: number;
  donationGoal?: number;
  budgetGoal?: number;
  targetReviewCount?: number;
  availableCredit?: number;
  onViewDetails?: () => void;
  isEditMode?: boolean;
  locked?: boolean;
  paymentMethod?: PaymentMethod;
  onPaymentMethodChange?: (method: PaymentMethod) => void;
  cardNumber?: string;
  onCardNumberChange?: (value: string) => void;
  cardExp?: string;
  onCardExpChange?: (value: string) => void;
  cardCvc?: string;
  onCardCvcChange?: (value: string) => void;
  cardName?: string;
  onCardNameChange?: (value: string) => void;
  billingEmail?: string;
  onBillingEmailChange?: (value: string) => void;
  billingCompany?: string;
  onBillingCompanyChange?: (value: string) => void;
  billingStreet?: string;
  onBillingStreetChange?: (value: string) => void;
  billingCity?: string;
  onBillingCityChange?: (value: string) => void;
  billingState?: string;
  onBillingStateChange?: (value: string) => void;
  billingZip?: string;
  onBillingZipChange?: (value: string) => void;
  billingCountry?: string;
  onBillingCountryChange?: (value: string) => void;
  poNumber?: string;
  onPoNumberChange?: (value: string) => void;
}

export function ReviewAndPublish({
  mode = "review",
  isPublished = false,
  hasValidationErrors = false,
  errorCount = 0,
  errorSections = [],
  heroSubtitle = "Meet us at Booth 412 and share your experience.",
  customDescription = "",
  uploadedImageUrl,
  customCtaLabel,
  incentiveType = "gift-card",
  giftCardAmount = "25",
  giftCardDistribution = "per-review",
  giftCardBrand = "amazon",
  selectedCharity = "",
  productNames = [],
  campaignTitle = "",
  contactName = "",
  contactEmail = "",
  targetCategories = [],
  loginFlow = "regular",
  startDate = "",
  endDate = "",
  timeZone = "",
  targetCountry = "",
  showProgressTracker = false,
  reviewGoal = 100,
  donationGoal = 2500,
  budgetGoal = 2000,
  targetReviewCount,
  availableCredit = 10000,
  onViewDetails,
  isEditMode = false,
  locked = false,
  paymentMethod = "saved-card",
  onPaymentMethodChange,
  cardNumber = "",
  onCardNumberChange,
  cardExp = "",
  onCardExpChange,
  cardCvc = "",
  onCardCvcChange,
  cardName = "",
  onCardNameChange,
  billingEmail = "",
  onBillingEmailChange,
  billingCompany = "",
  onBillingCompanyChange,
  billingStreet = "",
  onBillingStreetChange,
  billingCity = "",
  onBillingCityChange,
  billingState = "",
  onBillingStateChange,
  billingZip = "",
  onBillingZipChange,
  billingCountry = "United States",
  onBillingCountryChange,
  poNumber = "",
  onPoNumberChange,
}: ReviewAndPublishProps) {
  const requiredDescription = getRequiredDescription(incentiveType, giftCardAmount, selectedCharity, productNames, giftCardDistribution);
  const description: ReactNode = customDescription
    ? <>{requiredDescription} {customDescription}</>
    : requiredDescription;
  const isG2Gives = incentiveType === "g2-gives";
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const campaignUrl = "https://g2.com/campaign/event-abc123";

  // Simulated current values
  const currentReviews = 10;
  const currentDonations = 250; // $250 donated so far

  // Calculate progress based on tracker type
  let progressPercent = 0;
  let currentValue = 0;
  let goalValue = 0;
  let progressLabel = "";

  if (isG2Gives) {
    currentValue = currentDonations;
    goalValue = donationGoal || 2500;
    progressPercent = Math.round((currentValue / goalValue) * 100);
    progressLabel = "Donation Progress";
  } else if (incentiveType === "gift-card") {
    currentValue = currentReviews;
    goalValue = typeof targetReviewCount === "number" && targetReviewCount > 0 ? targetReviewCount : 0;
    progressPercent = goalValue > 0 ? Math.round((currentValue / goalValue) * 100) : 0;
    progressLabel = "Review Progress";
  }

  const remaining = Math.max(0, goalValue - currentValue);
  const hasReviewGoal = incentiveType === "gift-card" && goalValue > 0;

  const shouldShowProgressTracker = isG2Gives || incentiveType === "gift-card";

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(campaignUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Published Success State
  if (isPublished) {
    return (
      <div className="text-center py-10 px-6">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-12 h-12 text-[var(--palette-green-120)]" />
        </div>
        <h2 className="text-xl font-bold text-[var(--palette-neutral-100)]">
          {isEditMode ? "Changes saved successfully!" : "Campaign scheduled successfully!"}
        </h2>
        <p className="text-sm font-normal text-[var(--palette-neutral-70)] mt-2 max-w-md mx-auto leading-relaxed">
          {isEditMode
            ? "Your campaign has been updated. The changes will be reflected immediately."
            : "Your campaign will go live when your event starts. Download your QR code below and display it at your event."}
        </p>

        {/* Live Date Info */}
        {!isEditMode && (
          <div className="inline-flex items-center gap-2 mt-3 px-3 py-2 bg-[var(--palette-blue-20)] border border-[var(--palette-blue-20)] rounded-lg">
            <Clock className="w-4 h-4 text-[var(--palette-blue-100)]" />
            <span className="text-xs font-medium text-[var(--palette-blue-160)]">
              {startDate ? `Goes live on ${formatDate(startDate)}` : "Goes live on event start date"}
            </span>
          </div>
        )}

        {/* QR Code Block - Post-publish */}
        <div className="bg-white border border-[var(--palette-neutral-20)] rounded-[10px] p-6 mt-6">
          <div className="flex gap-6 items-start">
            {/* QR Code */}
            <div className="flex-shrink-0">
              <div className="w-[120px] h-[120px] bg-[var(--palette-neutral-100)] rounded-lg flex items-center justify-center relative">
                {/* QR Code Pattern Placeholder */}
                <div className="absolute inset-2 grid grid-cols-8 grid-rows-8 gap-0.5">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`${
                        Math.random() > 0.5 ? "bg-white" : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
                {/* G2 Logo Center */}
                <div className="w-4 h-4 bg-white rounded relative z-10" />
              </div>
              <p className="text-[11px] text-[var(--palette-neutral-40)] text-center mt-1.5">Scan to test</p>
            </div>

            {/* Info and Actions */}
            <div className="flex-1 text-left">
              <h3 className="text-sm font-semibold text-[var(--palette-neutral-100)]">Campaign QR code</h3>
              <p className="text-[13px] font-normal text-[var(--palette-neutral-70)] mt-1 leading-relaxed">
                Share this QR code at your event. Scanning opens the reviewer landing page
                directly.
              </p>

              {/* Download Buttons */}
              <div className="flex gap-2 mt-4">
                <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-[var(--palette-neutral-100)] border border-[var(--palette-neutral-20)] rounded-lg hover:bg-[var(--palette-neutral-5)] transition-colors">
                  <Download className="w-4 h-4" />
                  Download PNG
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-[var(--palette-neutral-100)] border border-[var(--palette-neutral-20)] rounded-lg hover:bg-[var(--palette-neutral-5)] transition-colors">
                  <Download className="w-4 h-4" />
                  Download SVG
                </button>
              </div>

              {/* Copy Link */}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={campaignUrl}
                  readOnly
                  className="flex-1 h-10 px-3 bg-[var(--palette-neutral-5)] border border-[var(--palette-neutral-20)] rounded-lg text-sm text-[var(--palette-neutral-70)] truncate outline-none"
                />
                <button
                  onClick={handleCopyUrl}
                  className="flex items-center justify-center gap-1.5 w-[72px] px-3 py-2 text-[13px] font-semibold text-[var(--palette-neutral-100)] border border-[var(--palette-neutral-20)] rounded-lg hover:bg-[var(--palette-neutral-5)] transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? "✓" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    if (locked) return;
    if (onPaymentMethodChange) {
      onPaymentMethodChange(method);
    }
  };

  const inputClass = `w-full h-10 px-3 border border-[var(--palette-neutral-20)] rounded-lg text-sm outline-none transition-all focus:border-[var(--palette-purple-100)] focus:ring-[3px] focus:ring-[rgba(87,70,178,0.15)] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--palette-neutral-5)]`;

  // Pre-publish State
  return (
    <div>
      {/* Validation Summary Bar */}
      {hasValidationErrors && errorCount > 0 && (
        <div className="bg-[var(--palette-rorange-20)] border border-[var(--palette-rorange-40)] rounded-lg p-4 mb-5 flex items-start gap-3">
          <AlertCircle className="w-[18px] h-[18px] text-[var(--palette-rorange-120)] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-[var(--palette-rorange-140)]">
              Your campaign has {errorCount} {errorCount === 1 ? "issue" : "issues"} to fix before
              scheduling.
            </div>
            <div className="text-[13px] font-medium text-[var(--palette-rorange-120)] mt-1">
              {errorSections.map((section, index) => (
                <span key={section}>
                  <a href="#" className="underline hover:opacity-80">
                    {section}
                  </a>
                  {index < errorSections.length - 1 && (
                    <span className="text-[var(--palette-rorange-40)] mx-1.5">·</span>
                  )}
                </span>
              ))}
            </div>
            <p className="text-[13px] font-normal text-[var(--palette-rorange-140)] mt-1.5">
              All required fields must be complete before your campaign can go live.
            </p>
          </div>
        </div>
      )}

      {/* Summary: Campaign */}
      {mode === "review" && (() => {
        const eventRange =
          startDate && endDate
            ? `${formatDate(startDate)} – ${formatDate(endDate)}`
            : startDate
            ? `Starts ${formatDate(startDate)}`
            : endDate
            ? `Ends ${formatDate(endDate)}`
            : "Dates not set";
        const ownerLine = contactName && contactEmail
          ? `${contactName} · ${contactEmail}`
          : contactName || contactEmail || "Owner not set";
        return (
          <div className="bg-white border border-[var(--palette-neutral-20)] rounded-xl p-5 mb-4 shadow-sm">
            <h3 className="text-base font-semibold text-[var(--palette-neutral-100)] mb-3">Campaign</h3>
            <dl className="space-y-2.5">
              <SummaryRow label="Title" value={campaignTitle || "—"} />
              <SummaryRow label="Owner" value={ownerLine} />
              <SummaryRow
                label="Products"
                value={productNames.length > 0 ? productNames.join(", ") : "—"}
              />
              <SummaryRow
                label="Target categories"
                value={targetCategories.length > 0 ? targetCategories.join(", ") : "—"}
              />
              <SummaryRow label="Event dates" value={eventRange} />
              <SummaryRow label="Time zone" value={timeZone || "—"} />
              <SummaryRow label="Target country" value={targetCountry || "—"} />
            </dl>
          </div>
        );
      })()}

      {/* Summary: Reviewer experience */}
      {mode === "review" && (() => {
        const incentiveLabel = (() => {
          if (incentiveType === "gift-card") {
            const brandName = giftCardBrand === "amazon" ? "Amazon" : "Global Choice Link";
            const distroLabel = giftCardDistribution === "per-reviewer" ? "per reviewer" : "per review";
            return `$${giftCardAmount} ${brandName} gift card, ${distroLabel}`;
          }
          if (incentiveType === "g2-gives") {
            return selectedCharity
              ? `G2 Gives — $10 donation per review to ${selectedCharity}`
              : "G2 Gives — $10 donation per review";
          }
          if (incentiveType === "swag") return "Physical incentive (swag) distributed at the event";
          if (incentiveType === "non-incentivized") return "Non-incentivized — no reward offered";
          return "—";
        })();
        const loginLabel = loginFlow === "delayed" ? "Delayed login" : "Regular login";
        return (
          <div className="bg-white border border-[var(--palette-neutral-20)] rounded-xl p-5 mb-4 shadow-sm">
            <h3 className="text-base font-semibold text-[var(--palette-neutral-100)] mb-3">Reviewer experience</h3>
            <dl className="space-y-2.5">
              <SummaryRow label="Incentive" value={incentiveLabel} />
              <SummaryRow label="Login flow" value={loginLabel} />
              <SummaryRow
                label="Review target"
                value={typeof targetReviewCount === "number" && targetReviewCount > 0 ? `${targetReviewCount.toLocaleString()} reviews` : "—"}
              />
            </dl>
            <div className="mt-4 pt-4 border-t border-[var(--palette-neutral-20)] flex items-center gap-3">
              <Monitor className="w-5 h-5 text-[var(--palette-neutral-70)] flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-[var(--palette-neutral-100)]">Preview landing page</div>
                <p className="text-xs text-[var(--palette-neutral-70)] mt-0.5">
                  See exactly what reviewers will see when they scan your QR code.
                </p>
              </div>
              <button
                onClick={() => setShowPreviewModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-[var(--palette-neutral-100)] border border-[var(--palette-neutral-20)] rounded-lg hover:bg-[var(--palette-neutral-5)] transition-colors flex-shrink-0"
              >
                Open preview
                <ExternalLink className="w-[13px] h-[13px]" />
              </button>
            </div>
          </div>
        );
      })()}

      {/* No payment needed (free incentives) */}
      {mode === "schedule" && (incentiveType === "swag" || incentiveType === "non-incentivized" || incentiveType === "g2-gives") && (
        <div className="bg-white border border-[var(--palette-neutral-20)] rounded-xl p-5 mb-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-[var(--palette-neutral-100)]">Checkout</h3>
            <p className="text-[13px] text-[var(--palette-neutral-70)] mt-0.5">
              No payment needed to schedule this campaign.
            </p>
          </div>
          <div className="bg-[var(--palette-green-20)] border border-[var(--palette-green-40)] rounded-lg p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[var(--palette-green-120)] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--palette-green-160)]">
                {incentiveType === "g2-gives"
                  ? "G2 covers the donations. No cost to you."
                  : incentiveType === "swag"
                  ? "You'll distribute your own swag at the event. G2 won't bill you."
                  : "Non-incentivized campaigns are free to run."}
              </p>
              <p className="text-[13px] text-[var(--palette-green-160)] mt-1 leading-relaxed">
                Click <span className="font-semibold">Schedule Campaign</span> below to launch.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Checkout / Payment Method */}
      {mode === "schedule" && incentiveType !== "swag" && incentiveType !== "non-incentivized" && incentiveType !== "g2-gives" && (
        <div className="bg-white border border-[var(--palette-neutral-20)] rounded-xl p-5 mb-5 shadow-sm">
          <h3 className="text-base font-semibold text-[var(--palette-neutral-100)] mb-4">Checkout</h3>

          {locked && (
            <div className="mb-4 bg-[var(--palette-blue-20)] border border-[var(--palette-blue-20)] rounded-lg p-3 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-[var(--palette-blue-100)] flex-shrink-0 mt-0.5" />
              <p className="text-[13px] text-[var(--palette-blue-160)]">
                Your payment method is locked once a campaign is live.
              </p>
            </div>
          )}

          <label className="block text-sm font-medium text-[var(--palette-neutral-80)] mb-1.5">
            Payment method
          </label>
          <select
            value={paymentMethod}
            disabled={locked}
            onChange={(e) => handlePaymentMethodSelect(e.target.value as PaymentMethod)}
            className={inputClass}
          >
            <option value="saved-card">Visa ending in 0771</option>
            <option value="new-card">Add a credit card</option>
            <option value="invoice">Invoice me</option>
          </select>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-45 flex items-center justify-center z-50 p-8"
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className="relative bg-white rounded-xl w-[360px] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Preview Badge */}
            <div className="absolute top-3 right-3 bg-[var(--palette-yellow-20)] border border-[var(--palette-yellow-20)] rounded-full px-2.5 py-1 z-10">
              <span className="text-[11px] font-semibold text-[var(--palette-yellow-160)]">
                Preview Only — Not Live
              </span>
            </div>

            {/* Modal Header Bar */}
            <div className="bg-[var(--palette-blue-160)] h-12 px-4 flex items-center justify-between">
              <div className="w-12 h-4 bg-white bg-opacity-20 rounded" />
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-xs font-medium text-white text-opacity-70 hover:text-opacity-100 transition-opacity flex items-center gap-1.5"
              >
                Close preview
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Hero Block */}
            <div className="bg-[var(--palette-blue-160)] px-5 py-6">
              {uploadedImageUrl ? (
                <img
                  src={uploadedImageUrl}
                  alt="Event"
                  className="w-14 h-14 rounded-lg object-cover mb-3"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-white bg-opacity-10 mb-3 flex items-center justify-center">
                  <div className="w-8 h-8 rounded bg-white bg-opacity-20" />
                </div>
              )}
              <div className="text-base font-bold text-white leading-snug">{heroSubtitle}</div>
              <p className="text-xs text-white text-opacity-75 mt-2 leading-relaxed">
                {description}
              </p>
              <p className="text-[11px] text-white text-opacity-55 mt-2">
                Powered by G2 · Reviews verified on G2.com
              </p>
            </div>

            {/* CTA Block */}
            <div className="bg-white px-5 py-5">
              <button className="w-full h-11 bg-[var(--palette-purple-100)] text-white text-[15px] font-semibold rounded-lg hover:bg-[var(--palette-purple-120)] transition-colors flex items-center justify-center gap-2">
                {customCtaLabel || "Leave a review"}
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-[var(--palette-neutral-40)] text-center mt-2">
                By submitting you agree to G2's review guidelines.
              </p>
            </div>

            {/* Progress Tracker */}
            {shouldShowProgressTracker && (isG2Gives || incentiveType === "gift-card") && (
              <div className="bg-white border-t border-[var(--palette-neutral-10)] px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--palette-green-120)]" />
                    <span className="text-sm font-semibold text-[var(--palette-neutral-100)]">{progressLabel}</span>
                  </div>
                  <span className="text-lg font-bold text-[var(--palette-green-120)]">
                    {isG2Gives ? `$${currentValue.toLocaleString()}` : currentValue}
                  </span>
                </div>

                {(isG2Gives || hasReviewGoal) && (
                  <>
                    <div className="mb-2">
                      <div className="h-4 bg-[rgba(3,2,19,0.2)] rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-[var(--palette-green-120)] transition-all duration-300 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                        <div className="absolute inset-0 rounded-full shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.05)]" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--palette-neutral-80)] font-medium">
                        {isG2Gives
                          ? `Goal: $${goalValue.toLocaleString()}`
                          : `Goal: ${goalValue} reviews`}
                      </span>
                      <span className="text-[var(--palette-green-120)] font-medium">
                        {progressPercent}% Complete
                      </span>
                    </div>
                  </>
                )}

                {!isG2Gives && hasReviewGoal && (
                  <div className="mt-3 pt-3 border-t border-[var(--palette-neutral-10)]">
                    <p className="text-xs text-center text-[var(--palette-neutral-70)]">
                      Only <span className="font-semibold text-[var(--palette-green-120)]">{remaining}</span> more reviews to reach our goal!
                    </p>
                  </div>
                )}

                {!isG2Gives && !hasReviewGoal && (
                  <p className="text-xs text-center text-[var(--palette-neutral-70)] mt-1">
                    Keep the reviews coming!
                  </p>
                )}

                {isG2Gives && (
                  <div className="mt-3 pt-3 border-t border-[var(--palette-neutral-10)]">
                    <p className="text-xs text-center text-[var(--palette-neutral-70)]">
                      <span className="font-semibold text-[var(--palette-green-120)]">${remaining.toLocaleString()}</span> more to reach our donation goal!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
