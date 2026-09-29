import * as React from "react";
import { cn } from "../../lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  initials?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ className, src, initials, size = "md", ...props }: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  const sizes = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-8 w-8 text-xs",
    lg: "h-10 w-10 text-sm",
  };

  const showImage = Boolean(src && src.trim() && !hasError);

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-slate-700 to-slate-900 ring-2 ring-white items-center justify-center font-bold text-white select-none shadow-sm",
        sizes[size],
        className
      )}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt={initials || "User avatar"}
          onError={() => setHasError(true)}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <span>{initials || "U"}</span>
      )}
    </div>
  );
}
