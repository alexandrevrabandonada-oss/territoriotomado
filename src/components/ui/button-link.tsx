import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
  target?: string;
  rel?: string;
}

const variantClasses = {
  primary: "tt-button-primary",
  secondary: "tt-button-secondary",
  ghost: "tt-button-ghost",
  danger: "tt-button-danger",
};

export function ButtonLink({ href, children, variant = "primary", className, target, rel }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={cn(
        "tt-button",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
