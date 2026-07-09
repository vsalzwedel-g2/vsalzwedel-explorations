import { useState, useRef, useEffect } from "react";
import { Search, X, Trash2, Plus, AlertCircle, ChevronDown } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
}

const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "ZoomInfo Sales", category: "Sales Intelligence", rating: 4.5, reviewCount: 320 },
  { id: "2", name: "ZoomInfo Marketing", category: "Marketing Automation", rating: 4.3, reviewCount: 245 },
  { id: "3", name: "ZoomInfo Recruit", category: "Recruiting Software", rating: 4.6, reviewCount: 180 },
  { id: "4", name: "ZoomInfo Operations", category: "Business Operations", rating: 4.4, reviewCount: 156 },
  { id: "5", name: "ZoomInfo Talent", category: "Talent Management", rating: 4.2, reviewCount: 98 },
];

interface SelectedProductConfig {
  id: string;
  reviewGoal?: number;
  rewardPerReview?: number;
  ctaLabel?: string;
}

interface ProductSelectionProps {
  locked?: boolean;
  mode?: "single" | "multi";
  initialSelectedProductIds?: string[];
  onSelectedProductsChange?: (productNames: string[], productIds: string[]) => void;
}

export function ProductSelection({ locked = false, mode = "multi", initialSelectedProductIds, onSelectedProductsChange }: ProductSelectionProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProductConfig[]>(
    () => (initialSelectedProductIds ?? []).map(id => ({ id }))
  );
  const [showError, setShowError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredProducts = MOCK_PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isProductSelected = (productId: string) =>
    selectedProducts.some(p => p.id === productId);

  const handleToggleProduct = (product: Product) => {
    if (mode === "single") {
      // Single-select: clicking the selected product clears it, otherwise replace.
      setSelectedProducts(prev => (prev.some(p => p.id === product.id) ? [] : [{ id: product.id }]));
      setIsDropdownOpen(false);
    } else if (isProductSelected(product.id)) {
      setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts(prev => [...prev, { id: product.id }]);
    }
    setShowError(false);
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const getProductById = (id: string) => MOCK_PRODUCTS.find(p => p.id === id);

  useEffect(() => {
    if (mode === "single") {
      setSelectedProducts(prev => (prev.length > 1 ? [prev[0]] : prev));
    }
  }, [mode]);

  useEffect(() => {
    if (!onSelectedProductsChange) return;
    const names = selectedProducts
      .map(p => getProductById(p.id)?.name)
      .filter((n): n is string => Boolean(n));
    const ids = selectedProducts.map(p => p.id);
    onSelectedProductsChange(names, ids);
  }, [selectedProducts, onSelectedProductsChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const singleSelected =
    mode === "single" ? getProductById(selectedProducts[0]?.id ?? "") : undefined;

  return (
    <div>
      <div className="relative">
        {mode === "single" ? (
          /* Single mode: searchable select — type to filter, pick one */
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--palette-neutral-40)] pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search your products…"
              value={isDropdownOpen ? searchQuery : singleSelected?.name ?? ""}
              disabled={locked}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => {
                if (locked) return;
                setSearchQuery("");
                setIsDropdownOpen(true);
              }}
              className={`w-full h-10 pl-10 pr-10 border rounded-lg text-sm placeholder:text-[var(--palette-neutral-40)] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--palette-neutral-5)] ${
                showError
                  ? "border-[var(--palette-rorange-120)]"
                  : isDropdownOpen && !locked
                  ? "border-[var(--palette-purple-100)] ring-[3px] ring-[rgba(87,70,178,0.15)]"
                  : "border-[var(--palette-neutral-20)]"
              }`}
            />
            <ChevronDown
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--palette-neutral-40)] pointer-events-none transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        ) : (
          /* Multi mode: combo box — selected products render as inline tags */
          <div
            onClick={() => !locked && inputRef.current?.focus()}
            className={`w-full min-h-10 flex flex-wrap items-center gap-1.5 pl-10 pr-3 py-1.5 border rounded-lg text-sm transition-all relative ${
              locked
                ? "opacity-50 cursor-not-allowed bg-[var(--palette-neutral-5)]"
                : "cursor-text"
            } ${
              showError
                ? "border-[var(--palette-rorange-120)]"
                : isDropdownOpen && !locked
                ? "border-[var(--palette-purple-100)] ring-[3px] ring-[rgba(87,70,178,0.15)]"
                : "border-[var(--palette-neutral-20)]"
            }`}
          >
            <Search className="absolute left-3 top-3 w-4 h-4 text-[var(--palette-neutral-40)] pointer-events-none" />

            {selectedProducts.map(selected => {
              const product = getProductById(selected.id);
              if (!product) return null;
              return (
                <div
                  key={selected.id}
                  className="flex items-center gap-1.5 bg-[var(--palette-purple-10)] border border-[var(--palette-purple-20)] rounded-full pl-2.5 pr-1 py-0.5"
                >
                  <span className="text-[13px] font-medium text-[var(--palette-purple-100)]">
                    {product.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveProduct(selected.id);
                    }}
                    disabled={locked}
                    className="w-4 h-4 flex items-center justify-center hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50"
                    aria-label="Remove product"
                  >
                    <X className="w-3 h-3 text-[var(--palette-purple-100)]" />
                  </button>
                </div>
              );
            })}

            <input
              ref={inputRef}
              type="text"
              placeholder={selectedProducts.length === 0 ? "Search your products…" : ""}
              value={searchQuery}
              disabled={locked}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => !locked && setIsDropdownOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && searchQuery === "" && selectedProducts.length > 0) {
                  handleRemoveProduct(selectedProducts[selectedProducts.length - 1].id);
                }
              }}
              className="flex-1 min-w-[80px] h-7 bg-transparent outline-none border-none text-sm text-[var(--palette-neutral-100)] placeholder:text-[var(--palette-neutral-40)] disabled:cursor-not-allowed"
            />
          </div>
        )}

        {/* Dropdown */}
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-full mt-2 w-full bg-white border border-[var(--palette-neutral-20)] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-h-60 overflow-y-auto z-10"
          >
            {filteredProducts.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-[13px] text-[var(--palette-neutral-40)]">
                No products found
              </div>
            ) : (
              filteredProducts.map((product) => {
                const selected = isProductSelected(product.id);
                return (
                  <button
                    key={product.id}
                    onClick={() => handleToggleProduct(product)}
                    className="w-full flex items-center justify-between px-4 py-3 h-10 text-sm text-[var(--palette-neutral-100)] hover:bg-[var(--palette-neutral-5)] transition-colors"
                  >
                    <span className={selected ? "text-[var(--palette-purple-100)]" : ""}>
                      {product.name}
                    </span>
                    {selected && (
                      <svg className="w-4 h-4 text-[var(--palette-purple-100)]" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M13.3337 4L6.00033 11.3333L2.66699 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {showError && (
        <div className="flex items-center gap-1.5 mt-2 text-[var(--palette-rorange-120)] text-xs">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Select at least one product to continue.</span>
        </div>
      )}

    </div>
  );
}
