import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  variant = "dark",
  height = 28,
  className,
  href = "/",
}: {
  variant?: "dark" | "light";
  height?: number;
  className?: string;
  href?: string | null;
}) {
  const width = Math.round(height * 2.05);

  const mark = (
    <Image
      src="/images/logo.png"
      alt="Car Edits"
      width={width}
      height={height}
      priority
      className={cn(variant === "light" && "logo-invert", className)}
      style={{ height, width: "auto" }}
    />
  );

  if (href === null) return mark;

  return (
    <Link href={href} aria-label="Car Edits Home" className="inline-flex items-center">
      {mark}
    </Link>
  );
}
