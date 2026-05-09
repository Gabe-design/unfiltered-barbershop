import { Metadata } from "next";
import Link from "next/link";
import { Star, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Leave a Review | Unfiltered Barbershop",
  description: "Love your cut? Share your experience on Google.",
  robots: { index: false, follow: false },
};

export default async function ReviewPage() {
  const settings = await prisma.appSettings.findUnique({ where: { id: "global" } });
  const googleReviewUrl = settings?.googleReviewUrl;

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white tracking-wider mb-1">UNFILTERED</h1>
          <p className="text-blue-400 text-xs tracking-widest font-medium">BARBERSHOP</p>
        </div>

        <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-8 space-y-6">
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            ))}
          </div>

          <div>
            <h2 className="text-white text-xl font-bold mb-2">How was your experience?</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Your review helps other guys in Simi Valley discover us — and it means the world to our team.
            </p>
          </div>

          {googleReviewUrl ? (
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Leave a Google Review
            </a>
          ) : (
            <div className="py-4 bg-zinc-900 rounded-xl text-zinc-500 text-sm">
              Review link not configured yet.
            </div>
          )}

          <p className="text-zinc-600 text-xs">Takes less than 60 seconds.</p>
        </div>

        <div className="mt-8 space-y-2">
          <p className="text-zinc-600 text-xs">1706 Erringer Rd Suite #4 · Simi Valley, CA</p>
          <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors">
            ← Back to website
          </Link>
        </div>
      </div>
    </main>
  );
}
