"use client";

import { ReactNode } from "react";
import { usePrivacy } from "@/contexts/privacy-context";
import { cn } from "@/lib/utils";

interface SensitiveValueProps {
  children: ReactNode;
  className?: string;
}

export function SensitiveValue({ children, className }: SensitiveValueProps) {
  const { isPrivacyEnabled } = usePrivacy();

  return (
    <span
      className={cn(
        "transition-all duration-300 inline-block align-text-bottom",
        isPrivacyEnabled ? "blur-[6px] select-none" : "blur-none",
        className
      )}
      aria-hidden={isPrivacyEnabled}
    >
      {children}
    </span>
  );
}