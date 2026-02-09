'use client'

export type SkeletonVariant = 'bar' | 'circle' | 'box'

export interface SkeletonProps {
  variant?: SkeletonVariant
  className?: string
}

const variantStyles: Record<SkeletonVariant, string> = {
  bar: 'rounded',
  circle: 'rounded-full shrink-0',
  box: 'rounded-lg',
}

export default function Skeleton({ variant, className = '' }: SkeletonProps) {
  const base = 'animate-pulse bg-gray-200 dark:bg-gray-700'
  const variantClass = variant ? variantStyles[variant] : ''
  const combined = [base, variantClass, className].filter(Boolean).join(' ')

  return <div className={combined} aria-hidden />
}
