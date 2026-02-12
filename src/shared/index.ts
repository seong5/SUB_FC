// Public API for shared layer
export { Button, type ButtonProps } from './ui/button'
export { Icon, default as IconDefault } from './ui/icon'
export { Input } from './ui/input'
export { Modal } from './ui/modal'
export { Pagination } from './ui/pagination'
export { DropDown } from './ui/dropdown'
export { Spinner, default as SpinnerDefault } from './ui/spinner'
export { Skeleton, type SkeletonProps, type SkeletonVariant } from './ui/skeleton'
export { GlobalSpinner } from './ui/global-spinner'
export { Notification } from './ui/notification'
export { cn } from './utils/cn'
export { generateId } from './utils/uuid'
export { formatKoreanDate } from './utils/dateUtils'
export { parseScoreString, getResultFromFinalScore, getResultFromQuarters, type MatchResult } from './utils/scoreCalculator'
export {
  isSameDate,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  getCalendarDates,
  formatDate,
  formatDateKorean,
  getMonthName,
  formatDateForAPI,
} from './utils/calenderUtils'
export {
  BUTTON_ROUNDED,
  BUTTON_SIZE,
  BUTTON_TEXT_SIZE,
  BUTTON_VARIANTS,
  DEFAULT_BUTTON_ROUNDED,
  type buttonRoundedPixel,
  type buttonVariants,
  type buttonSize,
} from './config/buttonStyles'
export { default as ICON_MAP, type IconName } from './config/iconMap'
export {
  ContentMap,
  type ModalVariant,
  type Formation,
  type ModalProps,
  type OnlyTextModalProps,
  type WarningModalProps,
  type PostMatchProps,
  type PostRosterContentProps,
  type PostQuartersContentProps,
  type PostScoresContentProps,
  type PostMomContentProps,
} from './config/modal'
export { FORMATION_442, FORMATION_433, FORMATION_4231, FORMATIONS, type FormationKey } from './config/formation'
export {
  POSITION_COLORS,
  POSITION_GRADIENT,
  POSITION_BADGE_BG,
  POSITION_BORDER,
  type Position,
} from './config/positionColor'
export { useClickOutside } from './hooks/useClickOutside'
export { useControlledSpinner } from './hooks/useControllSpinner'
export { default as api } from './api/axios'
export * from './lib/store'
export type { QuarterLabel } from './types/quarter'
