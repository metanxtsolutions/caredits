import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkCoupon } from "@/lib/coupons";

const schema = z.object({
  code: z.string().min(1),
  subtotal: z.number().nonnegative(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ valid: false, error: "Invalid request" }, { status: 400 });
  }

  const coupon = await prisma.coupon.findUnique({ where: { code: parsed.data.code.toUpperCase() } });
  const result = checkCoupon(coupon, parsed.data.subtotal);

  if (!result.valid) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json({
    valid: true,
    code: result.coupon.code,
    percentOff: result.coupon.percentOff,
    amountOff: result.coupon.amountOff,
    discount: result.discount,
  });
}
