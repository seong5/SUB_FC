'use client'
import { useState, ChangeEvent } from 'react'
import { Button, Input } from '@/shared'
import type { ScheduleContentProps } from '@/features/team-schedule'

type EventsType = '매치' | '회식' | '기타'

type Touched = {
  date: boolean
}

export default function ScheduleContent({ onClose, onSubmit }: ScheduleContentProps) {
  const [date, setDate] = useState('')
  const [type, setType] = useState<EventsType>('매치')
  const [title, setTitle] = useState('')
  const [place, setPlace] = useState('')
  const [touched, setTouched] = useState<Touched>({ date: false })

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    const iso = v.includes('-') ? v : ('20' + v).replaceAll('/', '-')
    setDate(iso)
  }

  const isValid = Boolean(date)

  const submit = () => {
    setTouched({ date: true })
    if (!isValid) return
    onSubmit({
      date,
      type,
      title: title.trim() || undefined,
      place: place.trim() || undefined,
    })
    onClose()
  }
  return (
    <div className="flex items-center justify-center w-full max-w-[560px] mx-auto bg-black/20 rounded-[2.5rem]">
      <div className="relative w-full h-auto min-h-0 md:min-h-[60vh] bg-[#0f172a] rounded-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] md:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] border-t md:border border-white/10 overflow-hidden flex flex-col">
        <div className="relative z-10 flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-8 text-center text-white">
            일정 등록
          </h2>
          <div className="flex flex-col gap-20">
            <Input
              id="event-date"
              label="날짜"
              variant="date-custom"
              className="[&_label]:text-slate-200"
              onChange={handleDateChange}
              onBlur={() => setTouched({ date: true })}
              errorMessage={!date && touched.date ? '날짜를 선택해 주세요.' : undefined}
            />
            <div>
              <p className="mb-2 text-sm font-medium text-slate-200">유형</p>
              <div className="flex gap-5">
                {(['매치', '회식', '기타'] as EventsType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-colors border ${
                  type === t
                    ? t === '매치'
                      ? 'bg-orange-400/10 border-orange-400/30 text-orange-300 shadow-orange-400/30 shadow-[0_0_24px_rgba(251,146,60,0.35)]'
                      : t === '회식'
                        ? 'bg-purple-400/10 border-purple-400/30 text-purple-300 shadow-purple-400/30 shadow-[0_0_24px_rgba(192,132,252,0.35)]'
                        : 'bg-slate-400/10 border-slate-400/30 text-slate-200 shadow-slate-400/30 shadow-[0_0_24px_rgba(148,163,184,0.35)]'
                    : 'bg-slate-900/40 border-white/5 text-slate-300 hover:bg-slate-800/80'
                }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <Input
              id="event-title"
              label="제목"
              variant="input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="일정을 적어주세요."
            />
            <Input
              id="event-place"
              label="장소"
              variant="input"
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
          className="[&_label]:text-slate-200"
              placeholder="장소를 적어주세요."
            />
          </div>
          <div className="mt-20 flex gap-5 justify-evenly">
            <Button className="flex-1 py-2" size="lg" variant="secondary" onClick={onClose}>
              취소
            </Button>
            <Button
              className="flex-1 text-white py-2"
              size="lg"
              variant="primary"
              disabled={!isValid}
              onClick={submit}
            >
              등록
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
