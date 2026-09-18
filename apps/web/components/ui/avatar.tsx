import * as React from "react";
import { cn } from "../../lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  initials?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ className, src, initials, size = "md", ...props }: AvatarProps) {
  const sizes = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-8 w-8 text-xs",
    lg: "h-10 w-10 text-sm",
  };

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-white items-center justify-center font-medium text-slate-700",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt="Avatar" className="aspect-square h-full w-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
