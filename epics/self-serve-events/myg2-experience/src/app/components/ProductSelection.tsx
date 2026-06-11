import { useState, useRef, useEffect } from "react";
import { Search, X, Trash2, Plus, AlertCircle, Star, Package } from "lucide-react";

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
  initialSelectedProductIds?: string[];
  onSelectedProductsChange?: (productNames: string[], productIds: string[]) => void;
}

export function ProductSelection({ locked = false, initialSelectedProductIds, onSelectedProductsChange }: ProductSelectionProps = {}) {
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
    if (isProductSelected(product.id)) {
      setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts(prev => [...prev, { id: product.id }]);
    }
    setShowError(false);
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleUpdateProductConfig = (productId: string, field: keyof SelectedProductConfig, value: any) => {
    setSelectedProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, [field]: value } : p))
    );
  };

  const getProductById = (id: string) => MOCK_PRODUCTS.find(p => p.id === id);

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

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className="w-3 h-3"
            fill={star <= Math.floor(rating) ? "var(--palette-rorange-100)" : "var(--palette-neutral-20)"}
            stroke="none"
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Selected Product Tokens */}
      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {selectedProducts.map(selected => {
            const product = getProductById(selected.id);
            if (!product) return null;
            return (
              <div
                key={selected.id}
                className="flex items-center gap-2 bg-[var(--palette-purple-10)] border border-[var(--palette-purple-20)] rounded-full px-2.5 py-1"
              >
                <span className="text-[13px] font-medium text-[var(--palette-purple-100)]">
                  {product.name}
                </span>
                <button
                  onClick={() => handleRemoveProduct(selected.id)}
                  disabled={locked}
                  className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50"
                  aria-label="Remove product"
                >
                  <X className="w-3.5 h-3.5 text-[var(--palette-purple-100)]" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--palette-neutral-40)]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search your products…"
            value={searchQuery}
            disabled={locked}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => !locked && setIsDropdownOpen(true)}
            className={`w-full h-10 pl-10 pr-4 border rounded-lg text-sm placeholder:text-[var(--palette-neutral-40)] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--palette-neutral-5)] ${
              showError
                ? "border-[var(--palette-rorange-120)]"
                : isDropdownOpen && !locked
                ? "border-[var(--palette-purple-100)] ring-[3px] ring-[rgba(87,70,178,0.15)]"
                : "border-[var(--palette-neutral-20)]"
            }`}
          />
        </div>

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

      {/* Single Product Mode */}
      {selectedProducts.length === 1 && (
        <div className="mt-4 bg-[var(--palette-neutral-5)] border border-[var(--palette-neutral-20)] rounded-[10px] p-4">
          {(() => {
            const product = getProductById(selectedProducts[0].id);
            if (!product) return null;
            return (
              <div className="flex items-center justify-between">
                {/* Left Column - Product Info */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded bg-[var(--palette-neutral-20)] flex items-center justify-center">
                    <Package className="w-5 h-5 text-[var(--palette-neutral-40)]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--palette-neutral-100)]">
                      {product.name}
                    </div>
                    <div className="text-xs text-[var(--palette-neutral-70)] mt-0.5">
                      {product.category}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(product.rating)}
                      <span className="text-xs text-[var(--palette-neutral-70)]">
                        {product.rating} · {product.reviewCount} reviews
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Review Goal */}
                <div className="flex flex-col items-end">
                  <label className="text-[13px] font-medium text-[var(--palette-neutral-80)] mb-1">
                    Review goal
                  </label>
                  <input
                    type="number"
                    placeholder="50"
                    value={selectedProducts[0].reviewGoal || ""}
                    disabled={locked}
                    onChange={(e) =>
                      handleUpdateProductConfig(
                        selectedProducts[0].id,
                        "reviewGoal",
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    className="w-[100px] h-10 px-3 border border-[var(--palette-neutral-20)] rounded-lg text-sm outline-none focus:border-[var(--palette-purple-100)] focus:ring-[3px] focus:ring-[rgba(87,70,178,0.15)] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--palette-neutral-5)]"
                  />
                  <div className="text-xs text-[var(--palette-neutral-70)] mt-1 text-right">
                    Optional. Track progress toward a target.
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

    </div>
  );
}
