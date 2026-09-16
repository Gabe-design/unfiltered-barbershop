import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface LegalPageProps {
  eyebrow: string;
  title: string;
  titleAccent: string;
  intro: string;
  lastUpdated: string;
  children: ReactNode;
}

/** Shared shell for long-form policy pages (Privacy Policy, Terms of Service). */
export function LegalPage({ eyebrow, title, titleAccent, intro, lastUpdated, children }: LegalPageProps) {
  return (
    <>
      <Navbar />
      <main className="bg-[#0A0A0A] min-h-screen">
        <section className="relative pt-32 pb-12 px-4 sm:px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-700/7 rounded-full blur-[120px]" />
          </div>

          <div className="relative max-w-3xl mx-auto text-center">
            <span
              className="inline-block text-xs font-bold tracking-[0.3em] uppercase mb-5 text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}
            >
              {eyebrow}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-none">
              {title}{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #DC2626, #ffffff 50%, #2563EB)" }}
              >
                {titleAccent}
              </span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed max-w-xl mx-auto">{intro}</p>
            <p className="text-white/30 text-xs uppercase tracking-[0.2em] mt-6">Last updated {lastUpdated}</p>
          </div>
        </section>

        <section className="pb-24 px-4 sm:px-6">
          <article className="max-w-3xl mx-auto space-y-10 text-white/60 text-[15px] leading-relaxed [&_h2]:text-white [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-red-400">
            {children}
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}
