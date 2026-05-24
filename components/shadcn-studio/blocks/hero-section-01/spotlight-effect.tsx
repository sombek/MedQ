"use client";

import { useEffect } from "react";

export function SpotlightEffect() {
  useEffect(() => {
    const handleMouseMove = (ev: MouseEvent) => {
      const cards = document.querySelectorAll(".spotlight-card");
      cards.forEach((card) => {
        const blob = card.querySelector(".blob") as HTMLElement;
        const fblob = card.querySelector(".fake-blob") as HTMLElement;

        if (!blob || !fblob) return;

        const rec = fblob.getBoundingClientRect();

        blob.style.opacity = "1";
        blob.style.transform = `translate(${
          ev.clientX - rec.left - rec.width / 2
        }px, ${ev.clientY - rec.top - rec.height / 2}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return null;
}
