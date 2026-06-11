import { useState, type ReactNode } from "react";
import { ArrowLeft, Download, Copy, ExternalLink, Pencil } from "lucide-react";

type CampaignStatus = "active" | "completed" | "scheduled" | "draft";

interface CampaignSummary {
  name: string;
  dates: string;
  status: CampaignStatus;
  location?: string;
  details?: string;
}

interface CampaignDetailViewProps {
  campaign: CampaignSummary;
  onBack: () => void;
  onEdit: () => void;
}

const STATUS_LABELS: Record<CampaignStatus, string> = {
  active: "Active",
  scheduled: "Scheduled",
  completed: "Completed",
  draft: "Draft",
};

const STATUS_BADGE_STYLES: Record<
  CampaignStatus,
  { bg: string; text: string; border: string }
> = {
  active: { bg: "#d0f6f1", text: "#0f5249", border: "#1fa896" },
  scheduled: { bg: "#fef3c7", text: "#92400e", border: "#d97706" },
  completed: { bg: "#e5e7eb", text: "#374151", border: "#9ca3af" },
  draft: { bg: "#f3f4f6", text: "#4b5563", border: "#9ca3af" },
};

// ──────────────────────────────────────────────────────────────────────────
// Design tokens pulled from the Figma export (MyG2 Campaign Details Page)
// Centralized so the rest of the file reads cleanly.
// ──────────────────────────────────────────────────────────────────────────
const TOKENS = {
  pageBg: "#fafafa",
  cardBorder: "#dfdfe2",
  cardShadow:
    "0 0 1px 0 rgba(32, 31, 35, 0.32), 0 4px 4px 0 rgba(32, 31, 35, 0.04)",
  textPrimary: "#201f23", // labels, section headings
  textSecondary: "#4c4b53", // body values
  textMuted: "#6f6d78", // input text
  textHeading: "#252530", // page title
  textEstimationTitle: "#111827", // sidebar card title
  textEstimationLabel: "#374151", // sidebar card row label
  textEstimationSubtle: "#6b7280", // sidebar card row sub-label
  fieldBg: "#fafafa",
  fieldBorder: "#a8a8ac",
  qrFrameBg: "#f9fafb",
  qrFrameBorder: "#e5e7eb",
  divider: "#e5e7eb",
  purple: "#5746b2",
  badgeActiveBg: "#d0f6f1",
  badgeActiveBorder: "#1fa896",
  badgeActiveText: "#0f5249",
};

// ──────────────────────────────────────────────────────────────────────────
// Building blocks
// ──────────────────────────────────────────────────────────────────────────

/** One label + value cell. Two of these typically sit side-by-side in a Row. */
function Field({
  label,
  children,
  trailing,
}: {
  label: string;
  children: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-1 justify-center">
      <div
        className="text-sm font-semibold leading-5"
        style={{ color: TOKENS.textPrimary, fontFamily: "Figtree, sans-serif" }}
      >
        {label}
      </div>
      <div className="flex gap-2 items-start">
        <div
          className="text-sm font-normal leading-5"
          style={{ color: TOKENS.textSecondary, fontFamily: "Figtree, sans-serif" }}
        >
          {children}
        </div>
        {trailing}
      </div>
    </div>
  );
}

/** A horizontal row containing 1 or 2 Fields. */
function Row({ children }: { children: ReactNode }) {
  return <div className="flex items-start w-full">{children}</div>;
}

/** White content card matching the Figma `ContentCardHeader` component. */
function ContentCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      className="bg-white rounded-xl w-full p-6"
      style={{
        border: `0.5px solid ${TOKENS.cardBorder}`,
        boxShadow: TOKENS.cardShadow,
      }}
    >
      <div className="flex flex-col gap-6 w-full">
        <h2
          className="font-bold leading-7"
          style={{
            color: TOKENS.textPrimary,
            fontFamily: "Figtree, sans-serif",
            fontSize: "21px",
          }}
        >
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

/** Sidebar card with a 12px gap below the heading and 1px border. */
function SidebarCard({
  title,
  titleColor,
  children,
}: {
  title: string;
  titleColor?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="bg-white rounded-xl w-full p-6"
      style={{ border: `1px solid ${TOKENS.qrFrameBorder}` }}
    >
      <h2
        className="font-bold leading-7 pb-3"
        style={{
          color: titleColor ?? TOKENS.textEstimationTitle,
          fontFamily: "Figtree, sans-serif",
          fontSize: "21px",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Main view
// ──────────────────────────────────────────────────────────────────────────

export function CampaignDetailView({ campaign, onBack, onEdit }: CampaignDetailViewProps) {
  const [copied, setCopied] = useState(false);

  const campaignUrl = "https://g2.com/campaign/dreamforce-2025-abc123";

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(campaignUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusBadge = STATUS_BADGE_STYLES[campaign.status];
  const isScheduled = campaign.status === "scheduled";

  const campaignData = {
    title: campaign.name,
    ownerName: "Jane Doe",
    ownerEmail: "jane.doe@zoominfo.com",
    eventDates: campaign.dates,
    timezone: "America/Los Angeles (PST)",
    giftCardRegion: "United States",
    products: ["ZoomInfo", "ZoomSales"],
    targetCategories: ["Sales Intelligence", "Marketing Automation"],
    targetReviewCount: 100,
    incentive: "Gift Card",
    incentiveAmount: 25,
    giftCardDistribution: "per-review" as "per-review" | "per-reviewer",
    giftCardBrand: "Amazon",
    charity: null as string | null,
    loginFlow: "Regular login",
    budget: "Unlimited",
    paymentMethod: "Visa ending in 0771",
    availableCredit: 99999,
    heroSubtitle: "Meet us at Booth 412 and share your experience",
    description:
      "Leave an honest review and receive a $25 gift card as a thank you for your time and insight.",
    heroImage: "event-booth.jpg",
  };

  const isFreeIncentive =
    campaignData.incentive === "G2 Gives" ||
    campaignData.incentive === "Physical incentive (swag)" ||
    campaignData.incentive === "Non-incentivized";

  const estimatedReviews = campaignData.targetReviewCount ?? 0;
  const subtotal = isFreeIncentive ? 0 : estimatedReviews * campaignData.incentiveAmount;
  const estimatedTotal = Math.max(0, subtotal - campaignData.availableCredit);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: TOKENS.pageBg,
        fontFamily: "Figtree, sans-serif",
      }}
    >
      {/* Back link */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70"
          style={{ color: TOKENS.textSecondary }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Campaigns
        </button>
      </div>

      {/* Page content */}
      <div className="max-w-7xl mx-auto px-6 pb-12 pt-6 flex flex-col gap-6">
        {/* Title bar: campaign title + status badge + primary action (Edit / Disable) */}
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-3 items-center">
            <h1
              className="font-bold leading-9"
              style={{
                color: TOKENS.textHeading,
                fontFamily: "Figtree, sans-serif",
                fontSize: "28px",
              }}
            >
              {campaignData.title}
            </h1>
            <span
              className="inline-flex items-center justify-center px-2 py-0.5 rounded-lg text-sm font-semibold leading-5"
              style={{
                backgroundColor: statusBadge.bg,
                color: statusBadge.text,
                border: `0.5px solid ${statusBadge.border}`,
              }}
            >
              {STATUS_LABELS[campaign.status]}
            </span>
          </div>
          {(isScheduled || campaign.status === "draft") && (
            <button
              type="button"
              onClick={onEdit}
              className="h-8 px-3 rounded-[20px] inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{
                backgroundColor: TOKENS.purple,
                fontFamily: "Figtree, sans-serif",
              }}
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
          {campaign.status === "active" && (
            <button
              type="button"
              onClick={onEdit}
              className="h-8 px-3 rounded-[20px] text-sm font-semibold bg-white transition-colors hover:bg-[#fef2f2]"
              style={{
                color: "#b91c1c",
                border: "1px solid #dc2626",
                fontFamily: "Figtree, sans-serif",
              }}
            >
              Disable
            </button>
          )}
        </div>

        {/* Two-column layout: main cards (left) + sidebar (right) */}
        <div className="flex items-start gap-6 w-full">
          {/* Main column */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">
            {/* ── Campaign ─────────────────────────────────────── */}
            <ContentCard title="Campaign">
              <Row>
                <Field label="Campaign Owner">{campaignData.ownerName}</Field>
                <Field label="Event Dates">{campaignData.eventDates}</Field>
              </Row>
              <Row>
                <Field label="Products">{campaignData.products.join(", ")}</Field>
                <Field label="Time Zone">{campaignData.timezone}</Field>
              </Row>
              <Row>
                <Field label="Target Categories">
                  {campaignData.targetCategories.join(", ")}
                </Field>
                <Field label="Target Country">{campaignData.giftCardRegion}</Field>
              </Row>
              <Row>
                <Field label="Review Goal">
                  {campaignData.targetReviewCount.toLocaleString()} reviews
                </Field>
              </Row>
            </ContentCard>

            {/* ── Login & Incentive ────────────────────────────── */}
            <ContentCard title="Login & Incentive">
              <Row>
                <Field label="Login Flow">{campaignData.loginFlow}</Field>
                <Field label="Budget Cap">{campaignData.budget}</Field>
              </Row>
              <Row>
                <Field label="Incentive Type">{campaignData.incentive}</Field>
                <Field label="Gift Card Amount">
                  ${campaignData.incentiveAmount}{" "}
                  {campaignData.giftCardDistribution === "per-reviewer"
                    ? "per reviewer"
                    : "per review"}
                </Field>
              </Row>
              <Row>
                <Field label="Gift Card Type">
                  {campaignData.giftCardBrand ?? "—"}
                </Field>
                <Field label="Payment Method">{campaignData.paymentMethod}</Field>
              </Row>
            </ContentCard>

            {/* ── Branding ─────────────────────────────────────── */}
            <ContentCard title="Branding">
              <Row>
                <Field label="Hero Subtitle">
                  <span className="italic">
                    &ldquo;{campaignData.heroSubtitle}&rdquo;
                  </span>
                </Field>
              </Row>
              <Row>
                <Field label="Description">
                  <span className="italic">
                    &ldquo;{campaignData.description}&rdquo;
                  </span>
                </Field>
              </Row>
              <Row>
                <Field label="Progress Tracker">
                  Tracking {campaignData.targetReviewCount.toLocaleString()} reviews
                </Field>
              </Row>
              <Row>
                <Field label="Hero Image">
                  {campaignData.heroImage
                    ? `Uploaded: ${campaignData.heroImage}`
                    : "No image uploaded"}
                </Field>
              </Row>
            </ContentCard>
          </div>

          {/* Sidebar */}
          <div className="w-[380px] shrink-0 flex flex-col gap-6">
            {/* ── QR Code ──────────────────────────────────────── */}
            <SidebarCard title="QR Code" titleColor="#374151">
              <div className="flex flex-col items-center gap-4 pt-2">
                <div
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: TOKENS.qrFrameBg,
                    border: `1px solid ${TOKENS.qrFrameBorder}`,
                  }}
                >
                  {/* Visual QR placeholder (matches design's QR slot) */}
                  <div className="w-[144px] h-[144px] bg-white rounded flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-2 grid grid-cols-10 grid-rows-10 gap-px">
                      {Array.from({ length: 100 }).map((_, i) => (
                        <div
                          key={i}
                          className={
                            // Pseudo-random but stable QR-ish pattern.
                            (i * 37 + 13) % 3 === 0
                              ? "bg-[#1F2937]"
                              : "bg-transparent"
                          }
                        />
                      ))}
                    </div>
                    {/* Corner finder squares */}
                    <div className="absolute top-2 left-2 w-5 h-5 border-[3px] border-[#1F2937]" />
                    <div className="absolute top-2 right-2 w-5 h-5 border-[3px] border-[#1F2937]" />
                    <div className="absolute bottom-2 left-2 w-5 h-5 border-[3px] border-[#1F2937]" />
                  </div>
                </div>

                <div className="flex gap-3 items-center justify-center flex-nowrap w-full">
                  <button
                    type="button"
                    className="h-10 px-3 rounded-[20px] inline-flex items-center justify-center gap-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
                    style={{
                      backgroundColor: TOKENS.fieldBg,
                      color: TOKENS.purple,
                      border: `0.5px solid #b0afb6`,
                    }}
                  >
                    <Download className="w-4 h-4 shrink-0" />
                    Download PNG
                  </button>
                  <button
                    type="button"
                    className="h-10 px-3 rounded-[20px] inline-flex items-center justify-center gap-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
                    style={{
                      backgroundColor: TOKENS.fieldBg,
                      color: TOKENS.purple,
                      border: `0.5px solid #b0afb6`,
                    }}
                  >
                    <Download className="w-4 h-4 shrink-0" />
                    Download SVG
                  </button>
                </div>
              </div>
            </SidebarCard>

            {/* ── Landing Page URL ─────────────────────────────── */}
            <SidebarCard title="Landing Page URL" titleColor="#374151">
              <div
                className="h-10 rounded-lg w-full flex items-center pl-2 pr-1"
                style={{ backgroundColor: TOKENS.fieldBg }}
              >
                <input
                  type="text"
                  value={campaignUrl}
                  readOnly
                  className="flex-1 min-w-0 bg-transparent text-base leading-6 outline-none truncate"
                  style={{
                    color: TOKENS.textMuted,
                    fontFamily: "Figtree, sans-serif",
                  }}
                />
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/5 transition-colors"
                  aria-label="Copy URL"
                >
                  <Copy className="w-5 h-5" style={{ color: TOKENS.purple }} />
                </button>
              </div>
              {copied && (
                <p
                  className="text-xs mt-2"
                  style={{ color: TOKENS.badgeActiveBorder }}
                >
                  ✓ Copied to clipboard
                </p>
              )}
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-1 text-base font-semibold transition-opacity hover:opacity-80"
                style={{ color: TOKENS.purple }}
              >
                Open Landing Page
                <ExternalLink className="w-4 h-4" />
              </button>
            </SidebarCard>

            {/* ── Campaign Price Estimation ────────────────────── */}
            <SidebarCard title="Campaign Price Estimation">
              <div className="flex flex-col w-full">
                <PriceRow
                  label="Estimated Reviews"
                  value={estimatedReviews.toLocaleString()}
                />
                <PriceRow
                  label={
                    <>
                      Incentive Amount{" "}
                      <span style={{ color: TOKENS.textEstimationSubtle }}>
                        (per review)
                      </span>
                    </>
                  }
                  value={`$${campaignData.incentiveAmount.toFixed(2)}`}
                />
                <Divider />
                <PriceRow
                  label="Subtotal"
                  value={`$${subtotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}`}
                />
                <PriceRow
                  label="Available Credit"
                  value={`$${campaignData.availableCredit.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}`}
                  valueColor={TOKENS.textPrimary}
                />
                <Divider />
                <div className="flex items-start justify-between w-full pt-4">
                  <span
                    className="font-bold text-base leading-6"
                    style={{ color: TOKENS.textEstimationTitle }}
                  >
                    Estimated Total
                  </span>
                  <span
                    className="font-bold text-base leading-6"
                    style={{ color: TOKENS.textEstimationTitle }}
                  >
                    ${estimatedTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </SidebarCard>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Price-row helpers (sidebar Campaign Price Estimation)
// ──────────────────────────────────────────────────────────────────────────

function PriceRow({
  label,
  value,
  valueColor,
}: {
  label: ReactNode;
  value: ReactNode;
  valueColor?: string;
}) {
  return (
    <div className="flex items-start justify-between w-full pt-3">
      <span
        className="text-sm leading-5"
        style={{
          color: TOKENS.textEstimationLabel,
          fontFamily: "Figtree, sans-serif",
        }}
      >
        {label}
      </span>
      <span
        className="text-sm leading-5"
        style={{
          color: valueColor ?? TOKENS.textEstimationLabel,
          fontFamily: "Figtree, sans-serif",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return (
    <div
      className="h-px w-full mt-4"
      style={{ backgroundColor: TOKENS.divider }}
    />
  );
}
