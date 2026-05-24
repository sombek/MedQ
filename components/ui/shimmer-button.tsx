'use client'

import * as React from 'react'

import { motion, type HTMLMotionProps } from 'motion/react'

import { cn } from '@/lib/utils'

interface ShimmerButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode
}

function ShimmerButton({ children, className, ...props }: ShimmerButtonProps) {
  return (
    <motion.button
      className='relative inline-flex overflow-hidden rounded-lg p-0.5 bg-[linear-gradient(120deg,var(--primary)_calc(var(--shimmer-button-x)-25%),var(--primary-foreground)_var(--shimmer-button-x),var(--primary)_calc(var(--shimmer-button-x)+25%))] [--shimmer-button-x:0%] [--shimmer-gutter:0.125rem]'
      initial={{
        scale: 1,
        '--shimmer-button-x': '-100%'
      }}
      animate={{
        '--shimmer-button-x': '200%'
      }}
      transition={{
        stiffness: 500,
        damping: 20,
        type: 'spring',
        '--shimmer-button-x': {
          duration: 3,
          repeat: Infinity,
          ease: [0.445, 0.05, 0.55, 0.95]
        }
      }}
      whileTap={{
        scale: 0.95
      }}
      whileHover={{
        scale: 1.05
      }}
      {...props}
    >
      <span
        className={cn(
          'bg-background block rounded-[calc(var(--radius-lg)-var(--shimmer-gutter))] px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm',
          className
        )}
      >
        {children}
      </span>
    </motion.button>
  )
}

export { ShimmerButton, type ShimmerButtonProps }
