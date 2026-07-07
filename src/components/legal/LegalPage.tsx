import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} description={`Last updated: ${updated}`} />
      <section className="bg-white py-20 md:py-28">
        <Container className="max-w-3xl">
          <div className="space-y-8 [&_h2]:font-display [&_h2]:mt-12 [&_h2]:text-3xl [&_h2]:text-ink [&_h2]:first:mt-0 [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-grey [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:text-base [&_ul]:leading-relaxed [&_ul]:text-grey [&_li]:marker:text-accent">
            {children}
          </div>
        </Container>
      </section>
    </>
  );
}
