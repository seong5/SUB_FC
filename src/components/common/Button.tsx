'use client'
import { ReactNode } from 'react'

import {
  BUTTON_ROUNDED,
  BUTTON_SIZE,
  BUTTON_TEXT_SIZE,
  BUTTON_VARIANTS,
  buttonRoundedPixel,
  buttonSize,
  buttonVariants,
  DEFAULT_BUTTON_ROUNDED,
} from '@/constants/buttonStyles'
import { cn } from '@/utils/cn'

export interface ButtonProps {
  children: ReactNode
  className?: string
  size?: buttonSize
  variant?: buttonVariants
  rounded?: buttonRoundedPixel
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  icon?: ReactNode
}

export default function Button({
  children,
  variant = 'primary',
  size,
  rounded,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  icon,
}: ButtonProps) {
  // size에 따라 기본 rounded 적용
  const resolvedRounded = rounded ?? (size ? DEFAULT_BUTTON_ROUNDED[size] : '12')

  return (
    <button
      className={cn(
        BUTTON_VARIANTS[variant],
        BUTTON_ROUNDED[resolvedRounded],
        size && BUTTON_SIZE[size],
        BUTTON_TEXT_SIZE(variant, size),
        'transition',
        className
      )}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {icon && icon}
      {children}
    </button>
  )
}
