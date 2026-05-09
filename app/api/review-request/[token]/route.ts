import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params;

  const reviewRequest = await prisma.reviewRequest.findUnique({
    where: { id: token },
  });

  if (!reviewRequest) {
    return NextResponse.redirect(
      new URL("https://g.page/r/review", req.url)
    );
  }

  // Mark as clicked if not already reviewed
  if (reviewRequest.status === "REQUESTED") {
    await prisma.reviewRequest.update({
      where: { id: token },
      data: { status: "CLICKED", clickedAt: new Date() },
    });

    await prisma.booking.update({
      where: { id: reviewRequest.bookingId },
      data: { reviewStatus: "CLICKED" },
    }).catch(() => {});
  }

  const settings = await prisma.appSettings.findUnique({ where: { id: "global" } });
  const googleReviewUrl = settings?.googleReviewUrl;

  if (googleReviewUrl) {
    return NextResponse.redirect(googleReviewUrl);
  }

  return NextResponse.redirect(new URL("/review", req.url));
}
