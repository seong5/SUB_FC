import Icon from '@/components/common/Icon'

type HeaderProps = {
  title: string
  subtitle?: string
  onPrev: () => void
  onNext: () => void
}

export default function CalendarHeader({ title, onPrev, onNext }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-2 py-4 text-white md:py-6">
      <button
        onClick={onPrev}
        className="rounded-lg p-3 hover:bg-white/10 active:scale-95 md:p-4"
        aria-label="이전 달"
      >
        <Icon icon="ChevLeft" className="size-20" />
      </button>

      <div className="text-center">
        <div className="text-xl font-bold text-white md:text-2xl lg:text-3xl">{title}</div>
      </div>

      <button
        onClick={onNext}
        className="rounded-lg p-3 hover:bg-white/10 active:scale-95 md:p-4"
        aria-label="다음 달"
      >
        <Icon icon="ChevRight" className="size-20" />
      </button>
    </header>
  )
}
