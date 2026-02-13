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
} from '@/shared/config/buttonStyles'
import { cn } from '@/shared/utils/cn'

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
  /** 스크린리더용 접근 가능 이름 (아이콘만 있는 버튼 등) */
  'aria-label'?: string
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
  'aria-label': ariaLabel,
}: ButtonProps) {
  const resolvedRounded = rounded ?? (size ? DEFAULT_BUTTON_ROUNDED[size] : '12')
  const isGhost = variant === 'ghost'

  return (
    <button
      className={cn(
        BUTTON_VARIANTS[variant],
        !isGhost && BUTTON_ROUNDED[resolvedRounded],
        !isGhost && size && BUTTON_SIZE[size],
        BUTTON_TEXT_SIZE(variant, size),
        'transition',
        className
      )}
      disabled={disabled}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon && icon}
      {children}
    </button>
  )
}
