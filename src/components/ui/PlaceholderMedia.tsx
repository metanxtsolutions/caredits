import { Camera, Clapperboard } from "lucide-react";
import { cn } from "@/lib/utils";

function hash(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

const GRADIENTS = [
  "radial-gradient(120% 100% at 20% 0%, #262626 0%, #111111 55%, #0a0a0a 100%)",
  "radial-gradient(120% 100% at 80% 100%, #1a1a1a 0%, #111111 55%, #0a0a0a 100%)",
  "linear-gradient(135deg, #1c1c1c 0%, #111111 60%, #0a0a0a 100%)",
  "radial-gradient(100% 120% at 50% 0%, #262626 0%, #0a0a0a 100%)",
];

/**
 * Stands in for real production photography until the brand's shoot library is uploaded.
 * Deterministic per-id gradient keeps the grid visually varied while staying strictly on-palette.
 */
export function PlaceholderMedia({
  id,
  label,
  type = "photo",
  className,
}: {
  id: string;
  label?: string;
  type?: "photo" | "video";
  className?: string;
}) {
  const gradient = GRADIENTS[hash(id) % GRADIENTS.length];
  const Icon = type === "video" ? Clapperboard : Camera;

  return (
    <div
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
      style={{ backgroundImage: gradient }}
    >
      <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay [background-image:repeating-linear-gradient(45deg,#fff_0,#fff_1px,transparent_1px,transparent_6px)]" />
      <Icon className="size-7 text-white/15" strokeWidth={1.5} />
      {type === "video" && (
        <span className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
          <span className="ml-0.5 size-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-white/70" />
        </span>
      )}
      {label && (
        <span className="font-label absolute bottom-4 left-4 right-4 text-[11px] font-semibold uppercase tracked-tight text-white/35">
          {label}
        </span>
      )}
    </div>
  );
}
