import { cn } from '@/utils/cn'

export type buttonRoundedPixel = '16' | '14' | '12' | '8'

export type buttonVariants = 'primary' | 'secondary' | 'kakao'

export type buttonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const DISABLED_CLASSES = [
  'disabled:bg-gray-200',
  'disabled:text-gray-50',
  'disabled:cursor-not-allowed',
  'disabled:font-bold',
]

const SECONDARY_DISABLED_CLASSES = ['disabled:text-gray-200', 'disabled:cursor-not-allowed']

const SECONDARY_BASE_CLASSEES = [
  'bg-white',
  'text-gray-600',
  'border border-gray-200',
  'cursor-pointer',
  ...SECONDARY_DISABLED_CLASSES,
]

const KAKAO_BASE = ['bg-yellow', 'text-kakao-black', 'rounded-[12px]']

/* 버튼 배경색, 텍스트색상, 테두리 색상
  primary: 대표색 : 하늘색 배경, 텍스트 흰색
  secondary : 흰색 배경, 회색 테두리, 텍스트 검정색
  kakaoButton : 카카오 로그인/회원가입에 사용하는 버튼을 보여줍니다. */
export const BUTTON_VARIANTS: Record<buttonVariants, string> = {
  primary: cn(
    'bg-sub-navy',
    'text-white',
    'cursor-pointer',
    'active:bg-navy-400',
    ...DISABLED_CLASSES
  ),
  secondary: cn('active:bg-gray-100', ...SECONDARY_BASE_CLASSEES),
  kakao: cn('flex flex-row gap-2 items-center justify-center', ...KAKAO_BASE),
} as const

/* 버튼 테두리 rounded 값

rounded='14' 이런식으로 작성하시면 됩니다.
*/
export const BUTTON_ROUNDED: Record<buttonRoundedPixel, string> = {
  '16': 'rounded-[16px]',
  '14': 'rounded-[14px]',
  '12': 'rounded-[12px]',
  '8': 'rounded-[8px]',
} as const

/* 버튼 사이즈와 텍스트 */
export const BUTTON_SIZE: Record<buttonSize, string> = {
  xs: 'w-full max-w-68 h-29',
  sm: 'w-full max-w-120 h-41',
  md: 'w-full max-w-135 h-47',
  lg: 'w-full max-w-200 h-47',
  xl: 'w-full max-w-640 h-54',
} as const

// button 사이즈에 사용되는 rounded 기본값
export const DEFAULT_BUTTON_ROUNDED: Record<buttonSize, buttonRoundedPixel> = {
  xl: '16',
  lg: '14',
  md: '12',
  sm: '12',
  xs: '8',
} as const

export const BUTTON_TEXT_SIZE = (variant: buttonVariants, size?: buttonSize): string => {
  if (variant === 'primary') {
    if (size === 'lg' || size === 'md') return 'txt-16_B'
    if (size === 'sm') return 'txt-14_B'
  }
  if (variant === 'secondary') {
    if (size === 'lg' || size === 'md') return 'txt-16_M'
    if (size === 'sm') return 'txt-14_M'
  }
  return '' // 나머지는 직접 className으로 설정
}
