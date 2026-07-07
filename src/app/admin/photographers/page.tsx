import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { AddPhotographerForm } from "@/components/admin/AddPhotographerForm";

export default async function AdminPhotographersPage() {
  const photographers = await prisma.user.findMany({
    where: { role: "PHOTOGRAPHER" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { photographerFor: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-4xl text-ink">PHOTOGRAPHERS</h1>

      <div className="mt-8">
        <AddPhotographerForm />
      </div>

      <div className="mt-8 divide-y divide-border border-y border-border">
        {photographers.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="font-semibold text-ink">{p.name}</p>
              <p className="text-sm text-grey">{p.phone} {p.email ? `· ${p.email}` : ""}</p>
            </div>
            <div className="text-right text-sm text-grey">
              <p>{p._count.photographerFor} shoots assigned</p>
              <p className="text-xs">Joined {formatDate(p.createdAt)}</p>
            </div>
          </div>
        ))}
        {photographers.length === 0 && <p className="py-8 text-center text-grey">No photographers yet.</p>}
      </div>
    </div>
  );
}
