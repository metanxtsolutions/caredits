import { prisma } from "@/lib/prisma";
import { CouponForm } from "@/components/admin/CouponForm";
import { CouponRow } from "@/components/admin/CouponRow";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-4xl text-ink">COUPONS</h1>

      <div className="mt-8">
        <CouponForm />
      </div>

      <div className="mt-8 divide-y divide-border border-y border-border">
        {coupons.map((coupon) => (
          <CouponRow key={coupon.id} coupon={coupon} />
        ))}
        {coupons.length === 0 && <p className="py-8 text-center text-grey">No coupons yet.</p>}
      </div>
    </div>
  );
}
