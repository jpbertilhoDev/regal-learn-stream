import { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: "slide-up" | "slide-left" | "slide-right" | "scale-in";
  className?: string;
  delay?: number;
  threshold?: number;
}

export const ScrollReveal = ({
  children,
  animation = "slide-up",
  className = "",
  delay = 0,
  threshold = 0.1,
}: ScrollRevealProps) => {
  const { ref, isVisible } = useScrollReveal({ threshold });

  return (
    <div
      ref={ref}
      className={cn(
        "scroll-reveal",
        animation,
        isVisible && "is-visible",
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};
