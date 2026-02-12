import { Button } from '@/shared'
import type { WarningModalProps } from '@/shared/config/modal'

export function WarningContent({
  message,
  onConfirm,
  onCancel,
  cancelText = '아니오',
  confirmText = '취소하기',
}: WarningModalProps) {
  return (
    <div className="flex w-320 flex-col items-center justify-center rounded-[30px] bg-white p-24 md:w-400 md:p-30">
      <p className="txt-16_B md:txt-18_B mb-20 md:mb-24">{message}</p>
      <div className="flex gap-8 md:gap-12">
        <Button
          className="txt-14_M md:txt-16_M h-41 w-113 rounded-[12px] md:h-47 md:w-135 md:rounded-[14px]"
          variant="secondary"
          onClick={onCancel}
        >
          {cancelText}
        </Button>
        <Button
          className="md:s-200 txt-14_B md:txt-16_B h-41 w-113 md:h-47 md:w-135"
          variant="primary"
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </div>
  )
}
