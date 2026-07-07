import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Container } from "@/components/ui/Container";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard");

  return (
    <section className="bg-white pt-24 pb-16 md:pt-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <DashboardNav name={session.name} />
          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </section>
  );
}
