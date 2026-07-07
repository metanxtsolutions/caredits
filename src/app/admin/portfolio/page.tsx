import { prisma } from "@/lib/prisma";
import { PortfolioItemForm } from "@/components/admin/PortfolioItemForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminPortfolioPage() {
  const items = await prisma.portfolioItem.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-4xl text-ink">PORTFOLIO</h1>

      <div className="mt-8">
        <PortfolioItemForm />
      </div>

      <div className="mt-8 divide-y divide-border border-y border-border">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4 py-3.5">
            <div>
              <p className="font-semibold text-ink">{item.title}</p>
              <p className="text-sm text-grey">{item.category} · {item.type} · {item.aspect}</p>
            </div>
            <DeleteButton url={`/api/admin/portfolio/${item.id}`} confirmMessage={`Delete "${item.title}"?`} />
          </div>
        ))}
        {items.length === 0 && <p className="py-8 text-center text-grey">No portfolio items yet.</p>}
      </div>
    </div>
  );
}
