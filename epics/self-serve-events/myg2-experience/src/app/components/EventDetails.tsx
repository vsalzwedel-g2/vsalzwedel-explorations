import { useState, useRef, useEffect } from "react";
import { AlertCircle, AlertTriangle, ChevronDown } from "lucide-react";

interface EventDetailsData {
  startDate: string;
  endDate: string;
  timeZone: string;
  targetCountry: string;
}

interface ValidationErrors {
  startDate?: string;
  endDate?: string;
  timeZone?: string;
  targetCountry?: string;
}

const TIME_ZONES = [
  { region: "Americas", zones: [
    "America/New_York (EST, UTC−5)",
    "America/Chicago (CST, UTC−6)",
    "America/Denver (MST, UTC−7)",
    "America/Los_Angeles (PST, UTC−8)",
    "America/Phoenix (MST, UTC−7)",
    "America/Anchorage (AKST, UTC−9)",
    "America/Toronto (EST, UTC−5)",
    "America/Mexico_City (CST, UTC−6)",
  ]},
  { region: "Europe", zones: [
    "Europe/London (GMT, UTC±0)",
    "Europe/Paris (CET, UTC+1)",
    "Europe/Berlin (CET, UTC+1)",
    "Europe/Rome (CET, UTC+1)",
    "Europe/Madrid (CET, UTC+1)",
    "Europe/Amsterdam (CET, UTC+1)",
  ]},
  { region: "Asia Pacific", zones: [
    "Asia/Tokyo (JST, UTC+9)",
    "Asia/Shanghai (CST, UTC+8)",
    "Asia/Singapore (SGT, UTC+8)",
    "Asia/Hong_Kong (HKT, UTC+8)",
    "Asia/Dubai (GST, UTC+4)",
    "Australia/Sydney (AEDT, UTC+11)",
  ]},
];

const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
];

interface EventDetailsProps {
  locked?: boolean;
  startDate?: string;
  onStartDateChange?: (value: string) => void;
  endDate?: string;
  onEndDateChange?: (value: string) => void;
  timeZone?: string;
  onTimeZoneChange?: (value: string) => void;
  targetCountry?: string;
  onTargetCountryChange?: (value: string) => void;
}

export function EventDetails({
  locked = false,
  startDate: controlledStartDate,
  onStartDateChange,
  endDate: controlledEndDate,
  onEndDateChange,
  timeZone: controlledTimeZone,
  onTimeZoneChange,
  targetCountry: controlledTargetCountry,
  onTargetCountryChange,
}: EventDetailsProps = {}) {
  const [internalFormData, setInternalFormData] = useState<EventDetailsData>({
    startDate: "",
    endDate: "",
    timeZone: detectTimeZone(),
    targetCountry: "",
  });

  const formData: EventDetailsData = {
    startDate: controlledStartDate !== undefined ? controlledStartDate : internalFormData.startDate,
    endDate: controlledEndDate !== undefined ? controlledEndDate : internalFormData.endDate,
    timeZone: controlledTimeZone !== undefined ? controlledTimeZone : internalFormData.timeZone,
    targetCountry:
      controlledTargetCountry !== undefined ? controlledTargetCountry : internalFormData.targetCountry,
  };

  const setFormData = (updater: EventDetailsData | ((prev: EventDetailsData) => EventDetailsData)) => {
    const next = typeof updater === "function" ? updater(formData) : updater;
    if (controlledStartDate !== undefined && onStartDateChange && next.startDate !== formData.startDate) {
      onStartDateChange(next.startDate);
    } else if (controlledStartDate === undefined) {
      setInternalFormData(prev => ({ ...prev, startDate: next.startDate }));
    }
    if (controlledEndDate !== undefined && onEndDateChange && next.endDate !== formData.endDate) {
      onEndDateChange(next.endDate);
    } else if (controlledEndDate === undefined) {
      setInternalFormData(prev => ({ ...prev, endDate: next.endDate }));
    }
    if (controlledTimeZone !== undefined && onTimeZoneChange && next.timeZone !== formData.timeZone) {
      onTimeZoneChange(next.timeZone);
    } else if (controlledTimeZone === undefined) {
      setInternalFormData(prev => ({ ...prev, timeZone: next.timeZone }));
    }
    if (controlledTargetCountry !== undefined && onTargetCountryChange && next.targetCountry !== formData.targetCountry) {
      onTargetCountryChange(next.targetCountry);
    } else if (controlledTargetCountry === undefined) {
      setInternalFormData(prev => ({ ...prev, targetCountry: next.targetCountry }));
    }
  };

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [timeZoneDropdownOpen, setTimeZoneDropdownOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [timeZoneSearch, setTimeZoneSearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");

  const timeZoneRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);

  function detectTimeZone(): string {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const match = TIME_ZONES.flatMap(r => r.zones).find(z => z.startsWith(tz));
      return match || "";
    } catch {
      return "";
    }
  }

  const handleChange = (field: keyof EventDetailsData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (showErrors) {
      validateField(field, value);
    }
  };

  const validateField = (field: keyof EventDetailsData, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case "startDate":
        if (!value) {
          newErrors.startDate = "Start date is required.";
        } else {
          delete newErrors.startDate;
        }
        break;
      case "endDate":
        if (!value) {
          newErrors.endDate = "End date is required.";
        } else if (formData.startDate && new Date(value) < new Date(formData.startDate)) {
          newErrors.endDate = "End date must be after start date.";
        } else {
          delete newErrors.endDate;
        }
        break;
      case "timeZone":
        if (!value) {
          newErrors.timeZone = "Time zone is required.";
        } else {
          delete newErrors.timeZone;
        }
        break;
      case "targetCountry":
        if (!value) {
          newErrors.targetCountry = "Target country is required.";
        } else {
          delete newErrors.targetCountry;
        }
        break;
    }

    setErrors(newErrors);
  };

  const validateAll = () => {
    const newErrors: ValidationErrors = {};

    if (!formData.startDate) newErrors.startDate = "Start date is required.";
    if (!formData.endDate) {
      newErrors.endDate = "End date is required.";
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = "End date must be after start date.";
    }
    if (!formData.timeZone) newErrors.timeZone = "Time zone is required.";
    if (!formData.targetCountry) newErrors.targetCountry = "Target country is required.";

    setErrors(newErrors);
    setShowErrors(true);
    return Object.keys(newErrors).length === 0;
  };

  const errorCount = Object.keys(errors).length;
  const errorFields = Object.keys(errors).map(key => {
    const fieldNames: Record<string, string> = {
      startDate: "Start date",
      endDate: "End date",
      timeZone: "Time zone",
      targetCountry: "Target country",
    };
    return fieldNames[key];
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timeZoneRef.current && !timeZoneRef.current.contains(event.target as Node)) {
        setTimeZoneDropdownOpen(false);
        setTimeZoneSearch("");
      }
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
        setCountrySearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTimeZones = TIME_ZONES.map(region => ({
    ...region,
    zones: region.zones.filter(zone =>
      zone.toLowerCase().includes(timeZoneSearch.toLowerCase())
    ),
  })).filter(region => region.zones.length > 0);

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const selectedCountry = COUNTRIES.find(c => c.name === formData.targetCountry);

  return (
    <div>
      {/* Error Summary Bar */}
      {showErrors && errorCount >= 2 && (
        <div className="flex items-start gap-3 bg-[var(--palette-rorange-20)] border border-[var(--palette-rorange-40)] rounded-lg p-3 mb-4">
          <AlertTriangle className="w-4 h-4 text-[var(--palette-rorange-120)] flex-shrink-0 mt-0.5" />
          <div className="text-[13px] font-medium text-[var(--palette-rorange-120)]">
            Fix {errorCount} errors to continue: {errorFields.join(", ")}
          </div>
        </div>
      )}

      {/* Start Date & End Date */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-[var(--palette-neutral-80)] mb-1.5">
            Start date <span className="text-[var(--palette-rorange-120)]">*</span>
          </label>
          <input
            type="date"
            value={formData.startDate}
            disabled={locked}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className={`w-full h-10 px-3 border rounded-lg text-sm outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--palette-neutral-5)] ${
              errors.startDate
                ? "border-[var(--palette-rorange-120)]"
                : "border-[var(--palette-neutral-20)] focus:border-[var(--palette-purple-100)] focus:ring-[3px] focus:ring-[rgba(87,70,178,0.15)]"
            }`}
          />
          {errors.startDate && showErrors && (
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--palette-rorange-120)]">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.startDate}</span>
            </div>
          )}
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-[var(--palette-neutral-80)] mb-1.5">
            End date <span className="text-[var(--palette-rorange-120)]">*</span>
          </label>
          <input
            type="date"
            value={formData.endDate}
            disabled={locked}
            onChange={(e) => handleChange("endDate", e.target.value)}
            className={`w-full h-10 px-3 border rounded-lg text-sm outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--palette-neutral-5)] ${
              errors.endDate
                ? "border-[var(--palette-rorange-120)]"
                : "border-[var(--palette-neutral-20)] focus:border-[var(--palette-purple-100)] focus:ring-[3px] focus:ring-[rgba(87,70,178,0.15)]"
            }`}
          />
          {errors.endDate && showErrors && (
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--palette-rorange-120)]">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.endDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Time Zone & Target Country */}
      <div className="grid grid-cols-2 gap-4">
        {/* Time Zone */}
        <div ref={timeZoneRef}>
          <label className="block text-sm font-medium text-[var(--palette-neutral-80)] mb-1.5">
            Time zone <span className="text-[var(--palette-rorange-120)]">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Select time zone…"
              value={timeZoneDropdownOpen ? timeZoneSearch : formData.timeZone}
              disabled={locked}
              onChange={(e) => {
                setTimeZoneSearch(e.target.value);
                setTimeZoneDropdownOpen(true);
              }}
              onFocus={() => !locked && setTimeZoneDropdownOpen(true)}
              className={`w-full h-10 px-3 pr-10 border rounded-lg text-sm outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--palette-neutral-5)] ${
                errors.timeZone
                  ? "border-[var(--palette-rorange-120)]"
                  : "border-[var(--palette-neutral-20)] focus:border-[var(--palette-purple-100)] focus:ring-[3px] focus:ring-[rgba(87,70,178,0.15)]"
              }`}
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--palette-neutral-40)] pointer-events-none" />

            {timeZoneDropdownOpen && (
              <div className="absolute top-full mt-2 w-full bg-white border border-[var(--palette-neutral-20)] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-h-60 overflow-y-auto z-10">
                {filteredTimeZones.map((region) => (
                  <div key={region.region}>
                    <div className="sticky top-0 bg-[var(--palette-neutral-5)] px-4 py-2 text-[11px] font-semibold text-[var(--palette-neutral-40)] uppercase tracking-wide">
                      {region.region}
                    </div>
                    {region.zones.map((zone) => (
                      <button
                        key={zone}
                        onClick={() => {
                          handleChange("timeZone", zone);
                          setTimeZoneDropdownOpen(false);
                          setTimeZoneSearch("");
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-[var(--palette-neutral-100)] hover:bg-[var(--palette-neutral-5)] transition-colors"
                      >
                        {zone}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.timeZone && showErrors && (
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--palette-rorange-120)]">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.timeZone}</span>
            </div>
          )}
        </div>

        {/* Target Country */}
        <div ref={countryRef}>
          <label className="block text-sm font-medium text-[var(--palette-neutral-80)] mb-1.5">
            Target country <span className="text-[var(--palette-rorange-120)]">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Select country…"
              value={countryDropdownOpen ? countrySearch : (selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : "")}
              disabled={locked}
              onChange={(e) => {
                setCountrySearch(e.target.value);
                setCountryDropdownOpen(true);
              }}
              onFocus={() => !locked && setCountryDropdownOpen(true)}
              className={`w-full h-10 px-3 pr-10 border rounded-lg text-sm outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--palette-neutral-5)] ${
                errors.targetCountry
                  ? "border-[var(--palette-rorange-120)]"
                  : "border-[var(--palette-neutral-20)] focus:border-[var(--palette-purple-100)] focus:ring-[3px] focus:ring-[rgba(87,70,178,0.15)]"
              }`}
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--palette-neutral-40)] pointer-events-none" />

            {countryDropdownOpen && (
              <div className="absolute top-full mt-2 w-full bg-white border border-[var(--palette-neutral-20)] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-h-60 overflow-y-auto z-10">
                {filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      handleChange("targetCountry", country.name);
                      setCountryDropdownOpen(false);
                      setCountrySearch("");
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[var(--palette-neutral-100)] hover:bg-[var(--palette-neutral-5)] transition-colors flex items-center gap-2"
                  >
                    <span className="text-base">{country.flag}</span>
                    <span>{country.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.targetCountry && showErrors && (
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--palette-rorange-120)]">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.targetCountry}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
