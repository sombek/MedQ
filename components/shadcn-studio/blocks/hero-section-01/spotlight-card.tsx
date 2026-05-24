"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function SpotlightCard({ children, className }: SpotlightCardProps) {
  const blobRef = useRef<HTMLDivElement>(null);
  const fakeBlobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blob = blobRef.current;
    const fblob = fakeBlobRef.current;
    if (!blob || !fblob) return;

    const handleMouseMove = (ev: MouseEvent) => {
      const rec = fblob.getBoundingClientRect();
      blob.style.opacity = "1";
      blob.animate(
        [
          {
            transform: `translate(${ev.clientX - rec.left - rec.width / 2}px, ${
              ev.clientY - rec.top - rec.height / 2
            }px)`,
          },
        ],
        { duration: 300, fill: "forwards" }
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={cn(
        "spotlight-card group bg-border relative overflow-hidden rounded-xl p-px transition-all duration-300 ease-in-out",
        className
      )}
    >
      <div className="h-full rounded-[11px] bg-card p-6 transition-all duration-300 ease-in-out group-hover:bg-card/90 group-hover:backdrop-blur-[20px]">
        {children}
      </div>
      <div
        ref={blobRef}
        className="blob absolute top-0 left-0 size-32 rounded-full bg-sky-600/60 opacity-0 blur-2xl transition-all duration-300 ease-in-out dark:bg-sky-400/60"
      />
      <div ref={fakeBlobRef} className="fake-blob absolute top-0 left-0 size-32 rounded-full" />
    </div>
  );
}
