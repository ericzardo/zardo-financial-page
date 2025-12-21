import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showBeta?: boolean;
}

export function Logo({ className, size = "md", showBeta = true }: LogoProps) {
  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div className={cn("flex items-start gap-0.5 text-primary", className)}>
      
      {/* Texto Logo */}
      <span className={cn("font-bold tracking-tight leading-none", textSizes[size])}>
        finza.
      </span>

      {/* Tag Beta Minimalista */}
      {showBeta && (
        <span
          className={cn(
            "font-semibold tracking-widest uppercase select-none",
            "opacity-50",
            size === "lg" ? "text-[0.65rem] mt-1" : "text-[0.5rem] mt-0.5"
          )}
        >
          BETA
        </span>
      )}
    </div>
  );
}