import Icon from '../common/Icon'

type HeaderProps = {
  title: string
  subtitle?: string
  onPrev: () => void
  onNext: () => void
}

export default function CalendarHeader({ title, onPrev, onNext }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3">
      <button
        onClick={onPrev}
        className="p-2 rounded-lg hover:bg-gray-100 active:scale-95"
        aria-label="이전 달"
      >
        <Icon icon="ChevLeft" />
      </button>

      <div className="text-center">
        <div className="text-[18px] md:text-[20px] font-bold">{title}</div>
      </div>

      <button
        onClick={onNext}
        className="p-2 rounded-lg hover:bg-gray-100 active:scale-95"
        aria-label="다음 달"
      >
        <Icon icon="ChevRight" />
      </button>
    </header>
  )
}
