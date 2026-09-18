import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-elfo-verde-escuro text-elfo-off-white hover:bg-elfo-verde-escuro/90 shadow-md hover:shadow-lg",
        accent:
          "bg-elfo-verde-vivo text-elfo-verde-escuro hover:bg-elfo-verde-vivo/90 shadow-md",
        outline:
          "border-2 border-elfo-verde-escuro text-elfo-verde-escuro hover:bg-elfo-verde-escuro hover:text-elfo-off-white",
        ghost: "text-elfo-verde-escuro hover:bg-elfo-verde-escuro/10",
        gold:
          "bg-elfo-dourado text-elfo-preto-suave hover:bg-elfo-dourado/90 shadow-md",
        dark: "bg-elfo-preto-suave text-elfo-off-white hover:bg-elfo-preto-suave/90",
        ia: "bg-ia-roxo-neon text-white hover:bg-ia-roxo-neon/90 shadow-md",
        direito: "bg-dir-rubi text-white hover:bg-dir-rubi/90",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-5",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
