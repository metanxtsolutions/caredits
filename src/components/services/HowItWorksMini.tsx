import { CalendarCheck, Car, Clapperboard } from "lucide-react";

const steps = [
  { icon: CalendarCheck, title: "You Book", description: "Pick date, time & city" },
  { icon: Car, title: "We Arrive", description: "Our crew reaches your location" },
  { icon: Clapperboard, title: "We Shoot", description: "Full coverage, ready to share" },
];

export function HowItWorksMini() {
  return (
    <div className="grid grid-cols-3 gap-3 border-y border-border py-5">
      {steps.map((step, i) => (
        <div key={step.title} className="flex flex-col items-center gap-2 text-center">
          <div className="relative flex size-11 items-center justify-center rounded-full bg-grey-light">
            <step.icon className="size-5 text-accent" />
            <span className="font-label absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
              {i + 1}
            </span>
          </div>
          <div>
            <p className="font-label text-xs font-bold text-ink">{step.title}</p>
            <p className="text-[11px] text-grey">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
