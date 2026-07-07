import { cn } from "@/lib/utils";

export function Badge({
  variant = "solid",
  dot = false,
  className,
  children,
}: {
  variant?: "solid" | "dark" | "outline" | "light";
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const variants: Record<string, string> = {
    solid: "bg-accent text-white",
    dark: "bg-ink text-white",
    outline: "border-2 border-accent text-accent bg-transparent",
    light: "bg-grey-light text-ink",
  };

  return (
    <span
      className={cn(
        "font-label inline-flex items-center gap-2 text-xs font-bold uppercase tracked-tight px-4 py-2.5",
        variants[variant],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-accent" />}
      {children}
    </span>
  );
}
