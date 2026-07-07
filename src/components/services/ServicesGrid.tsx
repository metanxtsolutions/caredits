import { ServiceCard } from "@/components/services/ServiceCard";
import { services } from "@/lib/data/services";

export function ServicesGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.slug} service={service} />
      ))}
    </div>
  );
}
