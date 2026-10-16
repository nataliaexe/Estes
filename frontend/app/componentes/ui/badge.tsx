import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-bg-tertiary text-text-primary border border-border",
        verde: "bg-accent-primary/20 text-bg-primary",
        dourado: "bg-accent-secondary/20 text-accent-secondary",
        agua: "bg-blue-100 text-blue-800",
        solo: "bg-amber-100 text-amber-800",
        ar: "bg-sky-100 text-sky-800",
        queimada: "bg-red-100 text-red-800",
        desmatamento: "bg-lime-100 text-lime-800",
        residuos: "bg-orange-100 text-orange-800",
        mercurio: "bg-purple-100 text-purple-800",
        agrotoxico: "bg-yellow-100 text-yellow-800",
        enchente: "bg-cyan-100 text-cyan-800",
        hypothesis: "bg-gray-100 text-gray-800",
        supported: "bg-yellow-100 text-yellow-800",
        simulated: "bg-orange-100 text-orange-800",
        prototype: "bg-blue-100 text-blue-800",
        "experimentally-evaluated": "bg-green-100 text-green-800",
        "independently-validated": "bg-emerald-100 text-emerald-800",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
