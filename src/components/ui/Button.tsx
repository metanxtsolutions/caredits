import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CommonProps = {
  variant?: "primary" | "dark" | "outline" | "outline-light" | "ghost";
  size?: "md" | "lg";
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
};

const base =
  "font-label inline-flex items-center justify-center gap-3 font-semibold uppercase tracked-tight transition-all duration-300 whitespace-nowrap disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<NonNullable<CommonProps["variant"]>, string> = {
  primary: "bg-accent text-white hover:bg-[var(--color-accent-hover)]",
  dark: "bg-ink text-white hover:bg-ink-deep",
  outline: "bg-transparent text-ink border-2 border-ink hover:bg-ink hover:text-white",
  "outline-light":
    "bg-transparent text-white border-2 border-white/60 hover:bg-white hover:text-ink",
  ghost: "bg-transparent text-ink hover:text-accent",
};

const sizes: Record<NonNullable<CommonProps["size"]>, string> = {
  md: "text-sm px-7 py-4",
  lg: "text-base px-9 py-5",
};

export function Button({
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  href,
  ...rest
}: CommonProps & { href?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
        {arrow && <ArrowRight className="size-4" strokeWidth={2.5} />}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
      {arrow && <ArrowRight className="size-4" strokeWidth={2.5} />}
    </button>
  );
}
