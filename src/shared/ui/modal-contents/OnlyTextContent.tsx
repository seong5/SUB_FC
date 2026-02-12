import { Button } from '@/shared'
import type { OnlyTextModalProps } from '@/shared/config/modal'

export function OnlyTextContent({ message, onClose }: OnlyTextModalProps) {
  return (
    <div className="flex h-140 w-320 flex-col items-center justify-center gap-20 rounded-[30px] bg-white pt-10 md:h-170 md:w-400 md:gap-16">
      <p className="txt-16_B md:txt-18_B">{message}</p>
      <Button
        className="txt-14_B md:txt-16_B h-41 w-180 md:h-47 md:w-200"
        rounded="14"
        variant="primary"
        onClick={onClose}
      >
        확인
      </Button>
    </div>
  )
}
