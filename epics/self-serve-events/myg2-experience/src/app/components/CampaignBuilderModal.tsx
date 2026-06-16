import { useState, useMemo } from "react";
import { X, ChevronLeft, ChevronRight, Check, Lock } from "lucide-react";
import { YourDetails } from "./YourDetails";
import { CampaignDetails } from "./CampaignDetails";
import { EventDetails } from "./EventDetails";
import { Branding } from "./Branding";
import { LoginFlowSelector } from "./LoginFlowSelector";
import { IncentiveTypeSelector } from "./IncentiveTypeSelector";
import { ReviewAndPublish } from "./ReviewAndPublish";

type IncentiveType = "gift-card" | "g2-gives" | "swag" | "non-incentivized" | null;

interface UploadedImage {
  file: File;
  url: string;
  name: string;
  size: number;
}

interface Step {
  id: number;
  label: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  optional?: boolean;
}

interface CampaignBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails?: () => void;
  isEditMode?: boolean;
  campaignStatus?: "active" | "completed" | "scheduled" | "draft";
}

export function CampaignBuilderModal({ isOpen, onClose, onViewDetails, isEditMode = false, campaignStatus }: CampaignBuilderModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loginFlow, setLoginFlow] = useState<"regular" | "delayed">("regular");
  const [incentiveType, setIncentiveType] = useState<IncentiveType>(null);
  const [isPublished, setIsPublished] = useState(false);
  const isEditingLiveCampaign = isEditMode && (campaignStatus === "active" || campaignStatus === undefined);
  const isLive = isPublished || isEditingLiveCampaign;

  // Incentive state
  const [giftCardAmount, setGiftCardAmount] = useState("25");
  const [giftCardDistribution, setGiftCardDistribution] = useState<"per-review" | "per-reviewer">("per-review");
  const [giftCardBrand, setGiftCardBrand] = useState<"amazon" | "global-choice-link">("amazon");
  const [selectedCharity, setSelectedCharity] = useState("");
  const [budgetCurrency, setBudgetCurrency] = useState("USD");
  const [budgetAmount, setBudgetAmount] = useState("");

  // Product state
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const handleSelectedProductsChange = (names: string[], ids: string[]) => {
    setSelectedProducts(names);
    setSelectedProductIds(ids);
  };

  // Campaign details state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [campaignTitle, setCampaignTitle] = useState("");
  const [targetReviewCount, setTargetReviewCount] = useState<number | undefined>(undefined);
  const [targetCategories, setTargetCategories] = useState<string[]>([]);

  // Event details state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [targetCountry, setTargetCountry] = useState("");

  // Branding state
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const [reviewGoal, setReviewGoal] = useState<number | undefined>(100);
  const [donationGoal, setDonationGoal] = useState<number | undefined>(10000);
  const [budgetGoal, setBudgetGoal] = useState<number | undefined>(2000);

  // Payment state (Checkout)
  const [paymentMethod, setPaymentMethod] = useState<"saved-card" | "new-card" | "invoice">("saved-card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingCompany, setBillingCompany] = useState("");
  const [billingStreet, setBillingStreet] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [billingCountry, setBillingCountry] = useState("United States");
  const [poNumber, setPoNumber] = useState("");

  const allSteps: Step[] = useMemo(() => [
    {
      id: 1,
      label: "Campaign setup",
      title: "Set up your campaign",
      component: (
        <div className="space-y-8">
          <YourDetails
            locked={isLive}
            contactName={contactName}
            onContactNameChange={setContactName}
            contactEmail={contactEmail}
            onContactEmailChange={setContactEmail}
          />
          <CampaignDetails
            locked={isLive}
            campaignTitle={campaignTitle}
            onCampaignTitleChange={setCampaignTitle}
            selectedProductIds={selectedProductIds}
            onSelectedProductsChange={handleSelectedProductsChange}
            targetReviewCount={targetReviewCount}
            onTargetReviewCountChange={setTargetReviewCount}
            targetCategories={targetCategories}
            onTargetCategoriesChange={setTargetCategories}
          />
          <div>
            <h3 className="text-base font-semibold text-[var(--palette-neutral-100)] mb-3">Event</h3>
            <EventDetails
              locked={isLive}
              startDate={startDate}
              onStartDateChange={setStartDate}
              endDate={endDate}
              onEndDateChange={setEndDate}
              timeZone={timeZone}
              onTimeZoneChange={setTimeZone}
              targetCountry={targetCountry}
              onTargetCountryChange={setTargetCountry}
            />
          </div>
        </div>
      ),
    },
    {
      id: 2,
      label: "Login & Incentive",
      title: "Authentication and incentive",
      component: (
        <div className="space-y-6">
          <LoginFlowSelector value={loginFlow} onChange={setLoginFlow} locked={isLive} />
          <IncentiveTypeSelector
            loginFlow={loginFlow}
            value={incentiveType}
            onChange={setIncentiveType}
            giftCardAmount={giftCardAmount}
            onGiftCardAmountChange={setGiftCardAmount}
            giftCardDistribution={giftCardDistribution}
            onGiftCardDistributionChange={setGiftCardDistribution}
            giftCardBrand={giftCardBrand}
            onGiftCardBrandChange={setGiftCardBrand}
            selectedCharity={selectedCharity}
            onCharityChange={setSelectedCharity}
            budgetCurrency={budgetCurrency}
            onBudgetCurrencyChange={setBudgetCurrency}
            budgetAmount={budgetAmount}
            onBudgetAmountChange={setBudgetAmount}
            targetReviewCount={targetReviewCount}
          />
        </div>
      ),
    },
    {
      id: 3,
      label: "Branding",
      title: "Customize your landing page",
      description: "Customize your landing page below, or leave blank to use defaults shown in preview.",
      component: (
        <Branding
          locked={isLive}
          heroSubtitle={heroSubtitle}
          onHeroSubtitleChange={setHeroSubtitle}
          customDescription={customDescription}
          onCustomDescriptionChange={setCustomDescription}
          uploadedImage={uploadedImage}
          onImageChange={setUploadedImage}
          showProgressTracker={showProgressTracker}
          onShowProgressTrackerChange={setShowProgressTracker}
          reviewGoal={reviewGoal}
          onReviewGoalChange={setReviewGoal}
          donationGoal={donationGoal}
          onDonationGoalChange={setDonationGoal}
          targetReviewCount={targetReviewCount}
          incentiveType={incentiveType}
          giftCardAmount={giftCardAmount}
          giftCardDistribution={giftCardDistribution}
          selectedCharity={selectedCharity}
          productNames={selectedProducts}
        />
      ),
    },
    {
      id: 4,
      label: "Review",
      title: "Review your campaign",
      description: "Take one last look at your campaign details before you schedule.",
      component: (
        <ReviewAndPublish
          mode="review"
          isPublished={isPublished}
          hasValidationErrors={false}
          errorCount={0}
          errorSections={[]}
          heroSubtitle={heroSubtitle}
          customDescription={customDescription}
          uploadedImageUrl={uploadedImage?.url}
          customCtaLabel="Leave a review"
          incentiveType={incentiveType}
          giftCardAmount={giftCardAmount}
          giftCardDistribution={giftCardDistribution}
          giftCardBrand={giftCardBrand}
          selectedCharity={selectedCharity}
          productNames={selectedProducts}
          showProgressTracker={showProgressTracker}
          reviewGoal={reviewGoal}
          donationGoal={donationGoal}
          budgetGoal={budgetGoal}
          targetReviewCount={targetReviewCount}
          campaignTitle={campaignTitle}
          contactName={contactName}
          contactEmail={contactEmail}
          targetCategories={targetCategories}
          loginFlow={loginFlow}
          startDate={startDate}
          endDate={endDate}
          timeZone={timeZone}
          targetCountry={targetCountry}
          locked={isLive}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          cardNumber={cardNumber}
          onCardNumberChange={setCardNumber}
          cardExp={cardExp}
          onCardExpChange={setCardExp}
          cardCvc={cardCvc}
          onCardCvcChange={setCardCvc}
          cardName={cardName}
          onCardNameChange={setCardName}
          billingEmail={billingEmail}
          onBillingEmailChange={setBillingEmail}
          billingCompany={billingCompany}
          onBillingCompanyChange={setBillingCompany}
          billingStreet={billingStreet}
          onBillingStreetChange={setBillingStreet}
          billingCity={billingCity}
          onBillingCityChange={setBillingCity}
          billingState={billingState}
          onBillingStateChange={setBillingState}
          billingZip={billingZip}
          onBillingZipChange={setBillingZip}
          billingCountry={billingCountry}
          onBillingCountryChange={setBillingCountry}
          poNumber={poNumber}
          onPoNumberChange={setPoNumber}
          onViewDetails={onViewDetails}
          isEditMode={isEditMode}
        />
      ),
    },
    {
      id: 5,
      label: "Schedule",
      title: "Schedule your campaign",
      description: "Confirm how you'd like to pay and schedule your campaign.",
      component: (
        <ReviewAndPublish
          mode="schedule"
          isPublished={isPublished}
          hasValidationErrors={false}
          errorCount={0}
          errorSections={[]}
          heroSubtitle={heroSubtitle}
          customDescription={customDescription}
          uploadedImageUrl={uploadedImage?.url}
          customCtaLabel="Leave a review"
          incentiveType={incentiveType}
          giftCardAmount={giftCardAmount}
          giftCardDistribution={giftCardDistribution}
          giftCardBrand={giftCardBrand}
          selectedCharity={selectedCharity}
          productNames={selectedProducts}
          showProgressTracker={showProgressTracker}
          reviewGoal={reviewGoal}
          donationGoal={donationGoal}
          budgetGoal={budgetGoal}
          targetReviewCount={targetReviewCount}
          campaignTitle={campaignTitle}
          contactName={contactName}
          contactEmail={contactEmail}
          targetCategories={targetCategories}
          loginFlow={loginFlow}
          startDate={startDate}
          endDate={endDate}
          timeZone={timeZone}
          targetCountry={targetCountry}
          locked={isLive}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          cardNumber={cardNumber}
          onCardNumberChange={setCardNumber}
          cardExp={cardExp}
          onCardExpChange={setCardExp}
          cardCvc={cardCvc}
          onCardCvcChange={setCardCvc}
          cardName={cardName}
          onCardNameChange={setCardName}
          billingEmail={billingEmail}
          onBillingEmailChange={setBillingEmail}
          billingCompany={billingCompany}
          onBillingCompanyChange={setBillingCompany}
          billingStreet={billingStreet}
          onBillingStreetChange={setBillingStreet}
          billingCity={billingCity}
          onBillingCityChange={setBillingCity}
          billingState={billingState}
          onBillingStateChange={setBillingState}
          billingZip={billingZip}
          onBillingZipChange={setBillingZip}
          billingCountry={billingCountry}
          onBillingCountryChange={setBillingCountry}
          poNumber={poNumber}
          onPoNumberChange={setPoNumber}
          onViewDetails={onViewDetails}
          isEditMode={isEditMode}
        />
      ),
    },
  ], [loginFlow, incentiveType, giftCardAmount, giftCardDistribution, giftCardBrand, selectedCharity, budgetCurrency, budgetAmount, heroSubtitle, customDescription, uploadedImage, showProgressTracker, reviewGoal, donationGoal, budgetGoal, selectedProducts, selectedProductIds, isPublished, onViewDetails, isEditMode, isLive, paymentMethod, cardNumber, cardExp, cardCvc, cardName, billingEmail, billingCompany, billingStreet, billingCity, billingState, billingZip, billingCountry, poNumber, contactName, contactEmail, campaignTitle, targetReviewCount, targetCategories, startDate, endDate, timeZone, targetCountry]);

  const steps = allSteps;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = () => {
    setIsPublished(true);
  };

  const handleClose = () => {
    if (window.confirm("Are you sure you want to close? Your progress will be lost.")) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="border-b border-[var(--palette-neutral-20)] px-8 py-6 flex items-center justify-between flex-shrink-0">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[var(--palette-neutral-100)]">
              {isEditMode ? "Edit Campaign" : "Self-Serve Event Campaign Builder"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-[var(--palette-neutral-70)] hover:text-[var(--palette-neutral-100)] transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        {!isPublished && (
          <div className="border-b border-[var(--palette-neutral-20)] px-8 py-4 flex-shrink-0">
            <div className="flex items-start">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start flex-1 last:flex-none">
                  <div className="flex flex-col items-center flex-none">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                        index < currentStep
                          ? "bg-[var(--palette-green-120)] text-white"
                          : index === currentStep
                          ? "bg-[var(--palette-purple-100)] text-white"
                          : "bg-[var(--palette-neutral-10)] text-[var(--palette-neutral-40)]"
                      }`}
                    >
                      {index < currentStep ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium whitespace-nowrap ${
                        index === currentStep
                          ? "text-[var(--palette-neutral-100)]"
                          : index < currentStep
                          ? "text-[var(--palette-green-120)]"
                          : "text-[var(--palette-neutral-40)]"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-3 mt-5 ${
                        index < currentStep ? "bg-[var(--palette-green-120)]" : "bg-[var(--palette-neutral-20)]"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {!isPublished && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[var(--palette-neutral-100)]">
                {currentStepData.title}
              </h3>
              {currentStepData.description && (
                <p className="text-sm text-[var(--palette-neutral-70)] mt-1">
                  {currentStepData.description}
                </p>
              )}
            </div>
          )}
          {isLive && !isPublished && currentStep < 3 && (
            <div className="mb-6 bg-[var(--palette-blue-20)] border border-[var(--palette-blue-20)] rounded-lg p-4 flex items-start gap-3">
              <Lock className="w-5 h-5 text-[var(--palette-blue-100)] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[var(--palette-blue-160)]">
                  <span className="font-semibold">This campaign is live.</span> You can only change the incentive and the campaign goal. Other settings are locked.
                </p>
              </div>
            </div>
          )}
          <div className="pb-4">{currentStepData.component}</div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[var(--palette-neutral-20)] px-8 py-4 flex items-center justify-between flex-shrink-0 bg-[var(--palette-neutral-5)]">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep || isPublished}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
              isFirstStep || isPublished
                ? "text-[var(--palette-neutral-20)] cursor-not-allowed"
                : "text-[var(--palette-neutral-100)] hover:bg-[var(--palette-neutral-20)]"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex gap-3">
            {!isPublished && !isEditMode && (
              <button
                onClick={handleClose}
                className="px-5 py-2.5 text-sm font-semibold text-[var(--palette-neutral-70)] hover:text-[var(--palette-neutral-100)] transition-colors"
              >
                Save as Draft
              </button>
            )}
            {isPublished ? (
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--palette-blue-100)] rounded-lg hover:bg-[var(--palette-blue-120)] transition-colors"
              >
                Done
              </button>
            ) : isLastStep ? (
              <button
                onClick={handlePublish}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--palette-blue-100)] rounded-lg hover:bg-[var(--palette-blue-120)] transition-colors"
              >
                {isEditMode ? "Save Changes" : "Schedule Campaign"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[var(--palette-purple-100)] rounded-lg hover:bg-[var(--palette-purple-120)] transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
