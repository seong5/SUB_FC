'use client'
import { useState, ChangeEvent } from 'react'
import { Button, Input } from '@/shared'
import { ScheduleContentProps } from '@/shared/config/modal'

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
    <div className="px-15 py-10 w-350 md:w-400">
      <h2 className="text-lg font-bold mb-4 text-center">일정 등록</h2>
      <div className="flex flex-col gap-20">
        <Input
          id="event-date"
          label="날짜"
          variant="date-custom"
          onChange={handleDateChange}
          onBlur={() => setTouched({ date: true })}
          errorMessage={!date && touched.date ? '날짜를 선택해 주세요.' : undefined}
        />
        <div>
          <p className="mb-2 text-sm font-medium">유형</p>
          <div className="flex gap-5">
            {(['매치', '회식', '기타'] as EventsType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-8 py-3 rounded-full text-sm ${
                  type === t
                    ? t === '매치'
                      ? 'bg-orange-300'
                      : t === '회식'
                        ? 'bg-purple-300'
                        : 'bg-gray-300'
                    : 'bg-gray-100 text-gray-950'
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
          placeholder="장소를 적어주세요."
        />
      </div>
      <div className="my-20 flex gap-5 justify-evenly">
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
  )
}
