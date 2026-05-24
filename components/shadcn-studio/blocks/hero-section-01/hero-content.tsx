"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { HeroCta } from "@/components/auth/hero-cta";
import { cn } from "@/lib/utils";

interface HeroContentProps {
  badge: string;
  subtitle: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  descriptionLine1: string;
  descriptionLine2: string;
}

export function HeroContent({
  badge,
  subtitle,
  titleBefore,
  titleHighlight,
  titleAfter,
  descriptionLine1,
  descriptionLine2,
}: HeroContentProps) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 text-center sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-muted flex items-center gap-2.5 rounded-full border px-2 py-1 text-sm"
      >
        <Badge className="rounded-sm border-transparent bg-linear-to-r from-indigo-500 to-pink-500 bg-size-[105%] bg-center text-white">
          {badge}
        </Badge>
        <span className="text-muted-foreground">{subtitle}</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl leading-[1.2] font-bold text-balance sm:text-5xl lg:text-7xl tracking-tight"
      >
        {titleBefore}
        <br />
        <span className="relative inline-block text-primary">
          {titleHighlight}
          <motion.svg
            width="223"
            height="12"
            viewBox="0 0 223 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-x-0 bottom-0 w-full translate-y-1/2 max-sm:hidden rtl:scale-x-[-1]"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <motion.path
              d="M1.11716 10.428C39.7835 4.97282 75.9074 2.70494 114.894 1.98894C143.706 1.45983 175.684 0.313587 204.212 3.31596C209.925 3.60546 215.144 4.59884 221.535 5.74551"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </motion.svg>
        </span>{" "}
        {titleAfter}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-muted-foreground text-lg sm:text-xl max-w-2xl"
      >
        {descriptionLine1}
        <br />
        {descriptionLine2}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <HeroCta />
      </motion.div>
    </div>
  );
}
