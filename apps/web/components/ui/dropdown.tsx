import * as React from "react";
import { cn } from "../../lib/utils";

// A very lightweight local state dropdown for Phase 1.
// In a real app we'd use Radix or similar for fully accessible dropdowns.

export function Dropdown({ trigger, children, align = "right" }: { trigger: React.ReactNode; children: React.ReactNode; align?: "left" | "right" }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-56 rounded-md border border-slate-200 bg-white shadow-sm ring-1 ring-black ring-opacity-5 focus:outline-none",
            align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left"
          )}
          onClick={(e) => {
            // close on click inside if it's a menu item (simple heuristic)
            if ((e.target as HTMLElement).tagName !== 'INPUT') {
              setIsOpen(false);
            }
          }}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
}
