import { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { ProductSelection } from "./ProductSelection";

const SAMPLE_CATEGORIES: string[] = [
  "Sales Intelligence",
  "Marketing Automation",
  "Recruiting Software",
  "Business Operations",
  "Talent Management",
  "CRM Software",
  "Email Marketing",
  "Customer Data Platforms",
  "Account-Based Marketing",
  "Lead Generation",
  "Sales Engagement",
  "Conversational Intelligence",
  "Revenue Operations",
  "Data Enrichment",
  "Contact Database",
  "Sales Analytics",
  "Marketing Analytics",
  "Web Analytics",
  "Customer Success",
  "Help Desk",
];

const MAX_CATEGORIES = 3;
const TITLE_MAX = 80;

interface CampaignDetailsProps {
  locked?: boolean;
  campaignTitle: string;
  onCampaignTitleChange: (value: string) => void;
  selectedProductIds: string[];
  onSelectedProductsChange: (names: string[], ids: string[]) => void;
  targetReviewCount: number | undefined;
  onTargetReviewCountChange: (value: number | undefined) => void;
  targetCategories: string[];
  onTargetCategoriesChange: (categories: string[]) => void;
}

export function CampaignDetails({
  locked = false,
  campaignTitle,
  onCampaignTitleChange,
  selectedProductIds,
  onSelectedProductsChange,
  targetReviewCount,
  onTargetReviewCountChange,
  targetCategories,
  onTargetCategoriesChange,
}: CampaignDetailsProps) {
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCategories = SAMPLE_CATEGORIES.filter(
    (c) =>
      c.toLowerCase().includes(categorySearch.toLowerCase()) &&
      !targetCategories.includes(c)
  );

  const atLimit = targetCategories.length >= MAX_CATEGORIES;
  const titleCharCount = campaignTitle.length;
  const titleNearLimit = titleCharCount >= TITLE_MAX - 10;

  const handleAddCategory = (category: string) => {
    if (locked || atLimit) return;
    onTargetCategoriesChange([...targetCategories, category]);
    setCategorySearch("");
    inputRef.current?.focus();
  };

  const handleRemoveCategory = (category: string) => {
    if (locked) return;
    onTargetCategoriesChange(targetCategories.filter((c) => c !== category));
  };

  const inputClass =
    "w-full h-10 px-3 border border-[var(--palette-neutral-20)] rounded-lg text-sm outline-none transition-all focus:border-[var(--palette-purple-100)] focus:ring-[3px] focus:ring-[rgba(87,70,178,0.15)] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--palette-neutral-5)]";

  return (
    <div>
      <h3 className="text-base font-semibold text-[var(--palette-neutral-100)] mb-3">
        Campaign
      </h3>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[var(--palette-neutral-80)] mb-1.5">
            Campaign title <span className="text-[var(--palette-rorange-120)]">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Dreamforce 2025"
            maxLength={TITLE_MAX}
            value={campaignTitle}
            disabled={locked}
            onChange={(e) => onCampaignTitleChange(e.target.value)}
            className={inputClass}
          />
          <div className="flex items-center justify-between mt-1.5">
            <p className="text-xs text-[var(--palette-neutral-70)]">
              For internal reference only. Reviewers will not see this title.
            </p>
            <div
              className={`text-xs ${
                titleNearLimit ? "text-[var(--palette-rorange-120)]" : "text-[var(--palette-neutral-40)]"
              }`}
            >
              {titleCharCount} / {TITLE_MAX}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--palette-neutral-80)] mb-1.5">
            Products <span className="text-[var(--palette-rorange-120)]">*</span>
          </label>
          <ProductSelection
            locked={locked}
            initialSelectedProductIds={selectedProductIds}
            onSelectedProductsChange={onSelectedProductsChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--palette-neutral-80)] mb-1.5">
            About how many reviews do you want? <span className="text-[var(--palette-rorange-120)]">*</span>
          </label>
          <input
            type="number"
            min="1"
            placeholder="e.g. 100"
            value={targetReviewCount ?? ""}
            disabled={locked}
            onChange={(e) =>
              onTargetReviewCountChange(e.target.value ? parseInt(e.target.value, 10) : undefined)
            }
            className={`${inputClass} w-40`}
          />
          <p className="text-xs text-[var(--palette-neutral-70)] mt-1.5">
            Once this number has been reached, new reviews will be directed to a non-incentivized landing page.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--palette-neutral-80)] mb-1.5">
            Select (up to 3) target categories <span className="text-[var(--palette-rorange-120)]">*</span>
          </label>

          {targetCategories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {targetCategories.map((category) => (
                <div
                  key={category}
                  className="flex items-center gap-2 bg-[var(--palette-purple-10)] border border-[var(--palette-purple-20)] rounded-full px-2.5 py-1"
                >
                  <span className="text-[13px] font-medium text-[var(--palette-purple-100)]">
                    {category}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(category)}
                    disabled={locked}
                    className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50"
                    aria-label={`Remove ${category}`}
                  >
                    <X className="w-3.5 h-3.5 text-[var(--palette-purple-100)]" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div ref={categoryRef} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--palette-neutral-40)] pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                placeholder={atLimit ? "You've selected the maximum of 3 categories" : "Search categories…"}
                value={categorySearch}
                disabled={locked || atLimit}
                onChange={(e) => {
                  setCategorySearch(e.target.value);
                  setCategoryDropdownOpen(true);
                }}
                onFocus={() => !locked && !atLimit && setCategoryDropdownOpen(true)}
                className={`w-full h-10 pl-10 pr-10 border border-[var(--palette-neutral-20)] rounded-lg text-sm outline-none transition-all focus:border-[var(--palette-purple-100)] focus:ring-[3px] focus:ring-[rgba(87,70,178,0.15)] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--palette-neutral-5)]`}
              />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--palette-neutral-40)] pointer-events-none" />
            </div>

            {categoryDropdownOpen && !locked && !atLimit && (
              <div className="absolute top-full mt-2 w-full bg-white border border-[var(--palette-neutral-20)] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-h-60 overflow-y-auto z-10">
                {filteredCategories.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-[13px] text-[var(--palette-neutral-40)]">
                    No categories found
                  </div>
                ) : (
                  filteredCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleAddCategory(category)}
                      className="w-full text-left px-4 py-2.5 text-sm text-[var(--palette-neutral-100)] hover:bg-[var(--palette-neutral-5)] transition-colors"
                    >
                      {category}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <p className="text-xs text-[var(--palette-neutral-70)] mt-1.5">
            Reviewers will see these pre-selected categories, helping you direct reviews toward strategic categories.
          </p>
        </div>
      </div>
    </div>
  );
}
