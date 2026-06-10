import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import g2LogoUrl from "@/assets/G2 Logo.svg";
import partnerLogoUrl from "@/assets/Asana.svg";

const COMPANY_NAME = "Asana";
const COMPANY_G2_URL = "https://www.g2.com/products/asana/reviews";
const EVENT_START_LABEL = "Starts 9:00 AM PT \u00b7 Sep 15, 2026";
const EVENT_TARGET_ISO = "2026-09-15T09:00:00-07:00";

type TimeParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

function getTimeParts(target: Date): TimeParts {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, done: false };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export default function App() {
  const target = new Date(EVENT_TARGET_ISO);
  const [time, setTime] = useState<TimeParts>(() => getTimeParts(target));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeParts(target)), 1000);
    return () => clearInterval(id);
  }, []);

  const units: { label: string; value: number }[] = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <div className="min-h-screen bg-background font-['Figtree'] flex flex-col">
      {/* Hero / Countdown */}
      <main className="flex-1">
        <section
          className="px-4 py-12 sm:px-8 sm:py-24"
          style={{ background: "var(--bg-hero)" }}
        >
          <div className="max-w-3xl mx-auto text-center">
            {/* G2 + partner lockup */}
            <div className="flex items-center justify-center gap-5 mb-10">
              <img
                src={g2LogoUrl}
                alt="G2"
                className="h-8 w-auto"
              />
              <span
                aria-hidden="true"
                className="block h-8 w-px bg-border"
              />
              <img
                src={partnerLogoUrl}
                alt={COMPANY_NAME}
                className="h-6 w-auto"
              />
            </div>

            <h1 className="text-[44px] sm:text-[56px] leading-[1.08] font-bold text-text-default tracking-tight">
              Almost time&hellip;
            </h1>

            <p className="mt-4 text-base sm:text-lg text-text-subtle max-w-2xl mx-auto">
              We're counting down to kickoff! Once the countdown ends, you'll
              be able to share your review of {COMPANY_NAME} right from this page.
            </p>

            {/* Countdown */}
            <div className="mt-12">
              {time.done ? (
                <div className="inline-block bg-card border border-border rounded-xl px-8 py-10 shadow-[var(--shadow-floating)]">
                  <p className="text-2xl font-bold text-text-primary">
                    The event is live.
                  </p>
                  <p className="mt-2 text-sm text-text-subtle">
                    You can now share your review of {COMPANY_NAME}.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-2 sm:gap-4">
                    {units.map((u) => (
                      <div
                        key={u.label}
                        className="bg-card border border-border rounded-xl px-1 py-4 sm:px-4 sm:py-8 shadow-[var(--shadow-floating)]"
                      >
                        <div
                          className="text-[26px] sm:text-[56px] leading-none font-bold text-text-primary tabular-nums"
                          aria-live="polite"
                        >
                          {u.label === "Days" ? u.value : pad(u.value)}
                        </div>
                        <div className="mt-2 text-[10px] sm:text-sm font-semibold uppercase tracking-wider text-text-nonessential">
                          {u.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p
                    className="mt-6 text-sm font-semibold text-text-subtle"
                    aria-label={`Event starts ${EVENT_START_LABEL}`}
                  >
                    {EVENT_START_LABEL}
                  </p>

                  <div className="mt-10">
                    <a
                      href={COMPANY_G2_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 h-10 px-5 text-sm font-semibold text-text-primary bg-transparent border border-border rounded-[var(--radius-pill-md)] hover:bg-purple-10 hover:border-purple-20 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
                    >
                      Explore {COMPANY_NAME} on G2
                      <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-8 py-6 text-center text-xs text-text-nonessential">
          &copy; {new Date().getFullYear()} my.G2 &mdash; Powered by Elevate design system
        </div>
      </footer>
    </div>
  );
}
