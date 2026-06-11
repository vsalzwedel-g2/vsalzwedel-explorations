import { useState } from "react";
import { Plus, Calendar, Zap } from "lucide-react";
import { CampaignBuilderModal } from "./components/CampaignBuilderModal";
import { CampaignDetailView } from "./components/CampaignDetailView";

type View = "list" | "detail";

type Status = "active" | "completed" | "scheduled" | "draft";

type Campaign = {
  name: string;
  dates: string;
  status: Status;
  location: string;
  details: string;
  reviews: string;
  spentLabel: string;
  spent: string;
  goal: string;
  goalTone: "progress" | "complete" | "muted";
};

const campaigns: Campaign[] = [
  {
    name: "Dreamforce 2025",
    dates: "Sep 15 - Sep 18, 2025",
    status: "active",
    location: "San Francisco, CA",
    details: "2 products \u2022 Gift card incentive",
    reviews: "47",
    spentLabel: "Spent",
    spent: "$1,175",
    goal: "47%",
    goalTone: "progress",
  },
  {
    name: "AWS re:Invent 2024",
    dates: "Dec 2 - Dec 6, 2024",
    status: "completed",
    location: "Las Vegas, NV",
    details: "1 product \u2022 G2 Gives",
    reviews: "128",
    spentLabel: "Donated",
    spent: "$1,280",
    goal: "100%",
    goalTone: "complete",
  },
  {
    name: "SaaStr Annual 2026",
    dates: "Sep 9 - Sep 11, 2026",
    status: "scheduled",
    location: "San Mateo, CA",
    details: "3 products \u2022 Gift card",
    reviews: "\u2014",
    spentLabel: "Spent",
    spent: "\u2014",
    goal: "\u2014",
    goalTone: "muted",
  },
  {
    name: "INBOUND 2026",
    dates: "Sep 17 - Sep 20, 2026",
    status: "draft",
    location: "Boston, MA",
    details: "1 product \u2022 Swag",
    reviews: "\u2014",
    spentLabel: "Spent",
    spent: "\u2014",
    goal: "\u2014",
    goalTone: "muted",
  },
  {
    name: "Web Summit 2025",
    dates: "Nov 3 - Nov 6, 2025",
    status: "active",
    location: "Lisbon, Portugal",
    details: "1 product \u2022 Non-incentivized",
    reviews: "12",
    spentLabel: "Spent",
    spent: "$0",
    goal: "24%",
    goalTone: "progress",
  },
  {
    name: "Collision 2025",
    dates: "Jun 24 - Jun 27, 2025",
    status: "completed",
    location: "Toronto, Canada",
    details: "2 products \u2022 Gift card",
    reviews: "85",
    spentLabel: "Spent",
    spent: "$2,125",
    goal: "85%",
    goalTone: "complete",
  },
];

const statusChipClass: Record<Status, string> = {
  active: "bg-success-20 text-success-160",
  completed: "bg-neutral-10 text-neutral-80",
  scheduled: "bg-warning-20 text-warning-160",
  draft: "bg-neutral-10 text-neutral-70",
};

const statusLabel: Record<Status, string> = {
  active: "Active",
  completed: "Completed",
  scheduled: "Scheduled",
  draft: "Draft",
};

const goalToneClass: Record<Campaign["goalTone"], string> = {
  progress: "text-text-primary",
  complete: "text-success-120",
  muted: "text-neutral-40",
};

export default function App() {
  const [currentView, setCurrentView] = useState<View>("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const handleEditCampaign = () => {
    setCurrentView("list");
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedCampaign(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setCurrentView("detail");
  };

  if (currentView === "detail" && selectedCampaign) {
    return (
      <CampaignDetailView
        campaign={selectedCampaign}
        onBack={() => setCurrentView("list")}
        onEdit={handleEditCampaign}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background font-['Figtree']">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-[28px] leading-9 font-bold text-text-default tracking-tight">
              my.G2
            </h1>
            <p className="text-sm text-text-nonessential mt-1">
              Event Review Campaigns
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-1.5 h-10 px-4 text-sm font-semibold text-primary-foreground bg-primary rounded-[var(--radius-pill-md)] hover:bg-purple-120 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            New campaign
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <article
              key={c.name}
              className="bg-card rounded-xl border border-border overflow-hidden transition-shadow duration-150 hover:shadow-[0_4px_16px_0_rgba(32,31,35,0.10)]"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[21px] leading-7 font-bold text-text-default truncate">
                      {c.name}
                    </h3>
                    <p className="text-xs text-text-nonessential mt-1">
                      {c.dates}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center h-6 px-2 rounded text-xs font-semibold ${statusChipClass[c.status]}`}
                  >
                    {statusLabel[c.status]}
                  </span>
                </div>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-sm text-text-subtle">
                    <Calendar className="w-4 h-4 text-text-nonessential" />
                    <span>{c.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-subtle">
                    <Zap className="w-4 h-4 text-text-nonessential" />
                    <span>{c.details}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-center">
                    <div
                      className={`text-xl font-bold ${c.reviews === "\u2014" ? "text-neutral-40" : "text-text-default"}`}
                    >
                      {c.reviews}
                    </div>
                    <div className="text-xs text-text-nonessential mt-0.5">
                      Reviews
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-xl font-bold ${c.spent === "\u2014" ? "text-neutral-40" : "text-text-default"}`}
                    >
                      {c.spent}
                    </div>
                    <div className="text-xs text-text-nonessential mt-0.5">
                      {c.spentLabel}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${goalToneClass[c.goalTone]}`}>
                      {c.goal}
                    </div>
                    <div className="text-xs text-text-nonessential mt-0.5">
                      Goal
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleViewDetails(c)}
                  className="w-full mt-5 inline-flex items-center justify-center h-10 px-4 text-sm font-semibold text-text-primary bg-transparent border border-border rounded-[var(--radius-pill-md)] hover:bg-purple-10 hover:border-purple-20 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
                >
                  View details
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      <CampaignBuilderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
        }}
        onViewDetails={() => {
          setIsModalOpen(false);
          setCurrentView("detail");
        }}
        isEditMode={isEditMode}
        campaignStatus={isEditMode ? selectedCampaign?.status : undefined}
      />
    </div>
  );
}
