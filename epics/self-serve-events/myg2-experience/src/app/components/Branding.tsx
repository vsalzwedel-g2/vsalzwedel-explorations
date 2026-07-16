import { useState, type ReactNode } from "react";
import { Upload, X, Maximize2 } from "lucide-react";
import defaultG2GivesImage from "../../imports/Layer_2.png";
import defaultGiftCardImage from "../../imports/1GiveReviewGetGiftcard.png";
import defaultSwagImage from "../../imports/1Illustration-Review.png";

interface UploadedImage {
  file: File;
  url: string;
  name: string;
  size: number;
}

type IncentiveType = "gift-card" | "g2-gives" | "swag" | "non-incentivized" | null;
type GiftCardDistribution = "per-review" | "per-reviewer";

interface BrandingProps {
  locked?: boolean;
  heroSubtitle?: string;
  onHeroSubtitleChange?: (subtitle: string) => void;
  customDescription?: string;
  onCustomDescriptionChange?: (description: string) => void;
  uploadedImage?: UploadedImage | null;
  onImageChange?: (image: UploadedImage | null) => void;
  showProgressTracker?: boolean;
  onShowProgressTrackerChange?: (show: boolean) => void;
  reviewGoal?: number;
  onReviewGoalChange?: (goal: number | undefined) => void;
  donationGoal?: number;
  onDonationGoalChange?: (goal: number | undefined) => void;
  targetReviewCount?: number;
  incentiveType?: IncentiveType;
  giftCardAmount?: string;
  giftCardDistribution?: GiftCardDistribution;
  selectedCharity?: string;
  productNames?: string[];
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

function getDefaultHeadline(incentiveType: IncentiveType): string {
  switch (incentiveType) {
    case "gift-card":
      return "Your review earns you rewards.";
    case "g2-gives":
      return "Your review creates impact.";
    case "swag":
      return "Your review earns you rewards.";
    case "non-incentivized":
      return "Your experience matters.";
    default:
      return "Your review earns you rewards.";
  }
}

export function Branding({
  locked = false,
  heroSubtitle: controlledHeroSubtitle,
  onHeroSubtitleChange,
  customDescription: controlledCustomDescription,
  onCustomDescriptionChange,
  uploadedImage: controlledUploadedImage,
  onImageChange,
  showProgressTracker: controlledShowProgressTracker,
  onShowProgressTrackerChange,
  reviewGoal: controlledReviewGoal,
  onReviewGoalChange,
  donationGoal: controlledDonationGoal,
  onDonationGoalChange,
  targetReviewCount,
  incentiveType = null,
  giftCardAmount = "25",
  giftCardDistribution = "per-review",
  selectedCharity = "",
  productNames = [],
}: BrandingProps = {}) {
  const [internalHeroSubtitle, setInternalHeroSubtitle] = useState("");
  const [internalCustomDescription, setInternalCustomDescription] = useState("");
  const [internalUploadedImage, setInternalUploadedImage] = useState<UploadedImage | null>(null);
  const [internalShowProgressTracker, setInternalShowProgressTracker] = useState(false);
  const [internalReviewGoal, setInternalReviewGoal] = useState<number | undefined>(100);
  const [internalDonationGoal, setInternalDonationGoal] = useState<number | undefined>(10000);

  const heroSubtitle = controlledHeroSubtitle !== undefined ? controlledHeroSubtitle : internalHeroSubtitle;
  const customDescription = controlledCustomDescription !== undefined ? controlledCustomDescription : internalCustomDescription;
  const uploadedImage = controlledUploadedImage !== undefined ? controlledUploadedImage : internalUploadedImage;
  const showProgressTracker = controlledShowProgressTracker !== undefined ? controlledShowProgressTracker : internalShowProgressTracker;
  const reviewGoal = controlledReviewGoal !== undefined ? controlledReviewGoal : internalReviewGoal;
  const donationGoal = controlledDonationGoal !== undefined ? controlledDonationGoal : internalDonationGoal;

  const requiredDescription = getRequiredDescription(incentiveType, giftCardAmount, selectedCharity, productNames, giftCardDistribution);
  const isG2Gives = incentiveType === "g2-gives";

  const handleHeroSubtitleChange = (value: string) => {
    if (onHeroSubtitleChange) {
      onHeroSubtitleChange(value);
    } else {
      setInternalHeroSubtitle(value);
    }
  };

  const handleCustomDescriptionChange = (value: string) => {
    if (onCustomDescriptionChange) {
      onCustomDescriptionChange(value);
    } else {
      setInternalCustomDescription(value);
    }
  };

  const handleShowProgressTrackerChange = (show: boolean) => {
    if (onShowProgressTrackerChange) {
      onShowProgressTrackerChange(show);
    } else {
      setInternalShowProgressTracker(show);
    }
  };

  const handleReviewGoalChange = (goal: number | undefined) => {
    if (onReviewGoalChange) {
      onReviewGoalChange(goal);
    } else {
      setInternalReviewGoal(goal);
    }
  };

  const handleDonationGoalChange = (goal: number | undefined) => {
    if (onDonationGoalChange) {
      onDonationGoalChange(goal);
    } else {
      setInternalDonationGoal(goal);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      const imageData: UploadedImage = {
        file,
        url,
        name: file.name,
        size: file.size,
      };
      if (onImageChange) {
        onImageChange(imageData);
      } else {
        setInternalUploadedImage(imageData);
      }
    }
  };

  const handleRemoveImage = () => {
    if (onImageChange) {
      onImageChange(null);
    } else {
      setInternalUploadedImage(null);
    }
  };

  const maxChars = 120;
  const maxCustomDescriptionChars = 150;
  const charCount = heroSubtitle.length;
  const customDescriptionCharCount = customDescription.length;
  const isNearLimit = charCount >= maxChars - 10;
  const isCustomDescriptionNearLimit = customDescriptionCharCount >= maxCustomDescriptionChars - 10;

  return (
    <div>
      {/* Headline */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--palette-neutral-80)] mb-1.5">
          Headline <span className="text-[var(--palette-neutral-40)] font-normal">(optional)</span>
        </label>
        <textarea
          value={heroSubtitle}
          disabled={locked}
          onChange={(e) => {
            if (e.target.value.length <= maxChars) {
              handleHeroSubtitleChange(e.target.value);
            }
          }}
          placeholder={getDefaultHeadline(incentiveType)}
          className="w-full h-[72px] px-3 py-2 border border-[var(--palette-neutral-20)] rounded-lg text-sm resize-none outline-none transition-all focus:border-[var(--palette-purple-100)] focus:ring-[3px] focus:ring-[rgba(87,70,178,0.15)] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--palette-neutral-5)]"
        />
        <div className="flex justify-end mt-1">
          <div className={`text-xs ${isNearLimit ? "text-[var(--palette-rorange-120)]" : "text-[var(--palette-neutral-40)]"}`}>
            {charCount} / {maxChars}
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--palette-neutral-80)]">
          Hero image
        </label>
        {!uploadedImage && (
          <p className="text-xs text-[var(--palette-neutral-70)] mt-0.5 mb-1.5">
            A default image is shown below — replace it with your own if you'd like.
          </p>
        )}
        {uploadedImage && <div className="mb-1.5" />}

        {uploadedImage ? (
          /* Image Preview */
          <div className="relative border border-[var(--palette-neutral-20)] rounded-lg overflow-hidden">
            <img
              src={uploadedImage.url}
              alt="Uploaded hero"
              className="w-full h-48 object-cover"
            />
            <button
              onClick={handleRemoveImage}
              disabled={locked}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              <X className="w-4 h-4 text-[var(--palette-neutral-70)]" />
            </button>
            <div className="px-3 py-2 bg-white border-t border-[var(--palette-neutral-20)]">
              <p className="text-xs text-[var(--palette-neutral-70)]">
                {uploadedImage.name} ({(uploadedImage.size / 1024).toFixed(0)} KB)
              </p>
            </div>
          </div>
        ) : (
          /* Default Image Preview */
          <div className="relative border border-[var(--palette-neutral-20)] rounded-lg overflow-hidden">
            <img
              src={
                incentiveType === "gift-card"
                  ? defaultGiftCardImage
                  : incentiveType === "g2-gives"
                  ? defaultG2GivesImage
                  : defaultSwagImage
              }
              alt="Default hero"
              className="w-full h-48 object-contain bg-white"
            />

            <label
              aria-disabled={locked}
              className={`absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 bg-[var(--palette-purple-100)] rounded-md shadow-sm text-xs font-semibold text-white transition-colors ${
                locked
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:bg-[var(--palette-purple-120)]"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Replace image
              <input
                type="file"
                className="hidden"
                accept="image/*"
                disabled={locked}
                onChange={handleImageUpload}
              />
            </label>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--palette-neutral-20)] my-6" />

      {/* Description - Combined Required + Optional */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--palette-neutral-80)] mb-1.5">
          Description <span className="text-[var(--palette-neutral-40)] font-normal">(required)</span>
        </label>

        {/* Container for both required and optional */}
        <div className="border border-[var(--palette-neutral-20)] rounded-lg overflow-hidden">
          {/* Required Copy - Gray Section */}
          <div className="bg-[var(--palette-neutral-5)] px-3 py-2.5 text-sm text-[var(--palette-neutral-80)] leading-relaxed">
            {requiredDescription}
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--palette-neutral-20)]" />

          {/* Additional Description Section */}
          <div className="bg-white p-3">
            <label className="block text-xs font-medium text-[var(--palette-neutral-80)] mb-2">
              Add more <span className="text-[var(--palette-neutral-40)] font-normal">(optional)</span>
            </label>
            <textarea
              value={customDescription}
              disabled={locked}
              onChange={(e) => {
                if (e.target.value.length <= maxCustomDescriptionChars) {
                  handleCustomDescriptionChange(e.target.value);
                }
              }}
              placeholder="Add any additional context or instructions for reviewers..."
              className="w-full h-[60px] px-3 py-2 border border-[var(--palette-neutral-20)] rounded-lg text-sm resize-none outline-none transition-all focus:border-[var(--palette-purple-100)] focus:ring-[3px] focus:ring-[rgba(87,70,178,0.15)] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--palette-neutral-5)]"
            />
            <div className="flex justify-end mt-1">
              <div className={`text-xs ${isCustomDescriptionNearLimit ? "text-[var(--palette-rorange-120)]" : "text-[var(--palette-neutral-40)]"}`}>
                {customDescriptionCharCount} / {maxCustomDescriptionChars}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--palette-neutral-20)] my-6" />

      {/* Progress Tracker - G2 Gives (Required) */}
      {isG2Gives && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--palette-neutral-80)] mb-1.5">
            Donation goal
          </label>
          <div className="flex items-center gap-2">
            <span className="text-base font-medium text-[var(--palette-neutral-70)]">$</span>
            <input
              type="number"
              min="100"
              step="100"
              placeholder="10000"
              value={donationGoal || ""}
              onChange={(e) => handleDonationGoalChange(e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-32 h-10 px-3 border border-[var(--palette-neutral-20)] rounded-lg text-sm outline-none focus:border-[var(--palette-purple-100)] focus:ring-[3px] focus:ring-[rgba(87,70,178,0.15)]"
            />
            <span className="text-sm text-[var(--palette-neutral-70)]">total donation goal</span>
          </div>
        </div>
      )}

      {/* Live Preview */}
      <div className="mt-6 pt-6 border-t-2 border-[var(--palette-neutral-20)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-[var(--palette-neutral-100)]">
              Live preview
            </h3>
            <p className="text-xs text-[var(--palette-neutral-70)] mt-0.5">
              Updates as you type
            </p>
          </div>
          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--palette-neutral-80)] border border-[var(--palette-neutral-20)] rounded-lg hover:bg-[var(--palette-neutral-5)] transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
            Full screen
          </button>
        </div>

        {/* Preview Container */}
        <div className="border border-[var(--palette-neutral-20)] rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="p-6 flex gap-6">
            {/* Left Side - Content */}
            <div className="flex-1">
              {/* Headline */}
              <h1 className="text-2xl font-bold text-[var(--palette-neutral-100)] mb-3">
                {heroSubtitle || getDefaultHeadline(incentiveType)}
              </h1>

              {/* Description */}
              <div className="mb-4">
                <p className="text-sm text-[var(--palette-neutral-80)] leading-relaxed">
                  {requiredDescription}
                  {customDescription && ` ${customDescription}`}
                </p>
              </div>

              {/* CTA Button */}
              <button className="px-6 py-3 bg-[var(--palette-purple-100)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--palette-purple-120)] transition-colors">
                Leave a review
              </button>

              {/* Progress Tracker */}
              {(isG2Gives || incentiveType === "gift-card") && (() => {
                const mockRaised = 3250;
                const mockReviews = 10;

                const heading = isG2Gives ? "Impact Progress" : "Review Progress";
                const currentNumber = isG2Gives ? mockRaised : mockReviews;
                const hasGoal = isG2Gives
                  ? true
                  : typeof targetReviewCount === "number" && targetReviewCount > 0;
                const goalNumber = isG2Gives
                  ? (donationGoal || 10000)
                  : (targetReviewCount || 0);
                const percent = hasGoal
                  ? Math.min(100, Math.round((currentNumber / goalNumber) * 100))
                  : 0;
                const remaining = hasGoal ? Math.max(0, goalNumber - currentNumber) : 0;

                return (
                  <div className="mt-6 p-4 bg-white rounded-lg border border-[var(--palette-neutral-20)] shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-[var(--palette-neutral-100)]">
                        {heading}
                      </h3>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[var(--palette-green-120)]">
                          {isG2Gives ? `$${currentNumber.toLocaleString()}` : `${currentNumber}`}
                        </div>
                        <div className="text-xs text-[var(--palette-neutral-70)] mt-0.5">
                          {isG2Gives ? "raised so far" : "reviews collected so far"}
                        </div>
                      </div>
                    </div>

                    {hasGoal && (
                      <>
                        <div className="mb-2">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs text-[var(--palette-neutral-70)]">
                              {isG2Gives
                                ? `Goal: $${goalNumber.toLocaleString()}`
                                : `Goal: ${goalNumber} reviews`}
                            </span>
                            <span className="text-xs font-semibold text-[var(--palette-green-120)]">
                              {percent}% Complete
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-[var(--palette-neutral-20)] rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--palette-green-120)] rounded-full transition-all" style={{ width: `${percent}%` }} />
                          </div>
                        </div>

                        <p className="text-xs text-center text-[var(--palette-neutral-70)] mt-2">
                          {isG2Gives
                            ? `Only $${remaining.toLocaleString()} away from our goal!`
                            : `${remaining} more reviews to reach our goal!`}
                        </p>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Right Side - Hero Image */}
            <div className="w-64 h-64 flex-shrink-0 rounded-lg overflow-hidden">
              {uploadedImage ? (
                <img
                  src={uploadedImage.url}
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
              ) : incentiveType === "gift-card" ? (
                <img
                  src={defaultGiftCardImage}
                  alt="Default hero"
                  className="w-full h-full object-contain bg-white"
                />
              ) : incentiveType === "g2-gives" ? (
                <img
                  src={defaultG2GivesImage}
                  alt="Default hero"
                  className="w-full h-full object-contain bg-white"
                />
              ) : (
                <img
                  src={defaultSwagImage}
                  alt="Default hero"
                  className="w-full h-full object-contain bg-white"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
