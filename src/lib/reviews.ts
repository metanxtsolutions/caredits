import { prisma } from "@/lib/prisma";

export async function getAggregateRating() {
  const result = await prisma.review.aggregate({
    where: { approved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return {
    average: result._avg.rating ? Number(result._avg.rating.toFixed(1)) : 5,
    count: result._count.rating,
  };
}
