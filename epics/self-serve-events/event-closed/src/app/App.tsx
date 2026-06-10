import { ArrowUpRight } from "lucide-react";
import g2LogoUrl from "@/assets/G2 Logo.svg";
import partnerLogoUrl from "@/assets/Asana.svg";

const COMPANY_NAME = "Asana";
const COMPANY_G2_URL = "https://www.g2.com/products/asana/reviews";

export default function App() {
  return (
    <div className="min-h-screen bg-background font-['Figtree'] flex flex-col">
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
              That&rsquo;s a wrap!
            </h1>

            <p className="mt-4 text-base sm:text-lg text-text-subtle max-w-2xl mx-auto">
              This event has ended. If you would like to leave a review,
              please visit the G2 profile page.
            </p>

            <div className="mt-10">
              <a
                href={COMPANY_G2_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-10 px-5 text-sm font-semibold text-text-primary bg-transparent border border-border rounded-[var(--radius-pill-md)] hover:bg-purple-10 hover:border-purple-20 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
              >
                Leave a review on G2
                <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-8 py-6 text-center text-xs text-text-nonessential">
          &copy; {new Date().getFullYear()} my.G2 &mdash; Powered by Elevate design system
        </div>
      </footer>
    </div>
  );
}
