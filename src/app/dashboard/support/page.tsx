import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { SupportTicketForm } from "@/components/dashboard/SupportTicketForm";

const statusVariant: Record<string, "solid" | "outline" | "light"> = {
  OPEN: "outline",
  IN_PROGRESS: "solid",
  RESOLVED: "light",
};

export default async function SupportPage() {
  const session = await requireUser();

  const tickets = await prisma.supportTicket.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-4xl text-ink">SUPPORT</h1>
      <p className="mt-2 text-grey">Have a question about a booking? Send us a message and we&apos;ll get back to you.</p>

      <div className="mt-8">
        <SupportTicketForm />
      </div>

      {tickets.length > 0 && (
        <div className="mt-10 divide-y divide-border border-y border-border">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-ink">{ticket.subject}</p>
                <Badge variant={statusVariant[ticket.status] || "outline"}>{ticket.status.replace("_", " ")}</Badge>
              </div>
              <p className="mt-1 text-sm text-grey">{ticket.message}</p>
              <p className="mt-1 text-xs text-grey">{formatDate(ticket.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
