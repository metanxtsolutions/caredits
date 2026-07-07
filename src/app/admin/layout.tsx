import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { Container } from "@/components/ui/Container";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  if (session.role !== "ADMIN") redirect("/dashboard");

  return (
    <section className="bg-white pt-24 pb-16 md:pt-28">
      <Container className="max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <AdminNav />
          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </section>
  );
}
