import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90 shadow-glow",
        outline: "border border-border bg-card/60 text-white hover:bg-card",
        ghost: "text-muted hover:text-white hover:bg-white/5",
      },
      size: {
        default: "h-10 px-4 py-2",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
));
Button.displayName = "Button";

export { Button, buttonVariants };
