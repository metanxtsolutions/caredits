import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/dashboard/ProfileForm";

export default async function ProfilePage() {
  const session = await requireUser();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.id } });

  return (
    <div>
      <h1 className="font-display text-4xl text-ink">PROFILE</h1>
      <div className="mt-8">
        <ProfileForm
          initial={{
            name: user.name,
            email: user.email || "",
            phone: user.phone,
            city: user.city || "",
            state: user.state || "",
          }}
        />
      </div>
    </div>
  );
}
