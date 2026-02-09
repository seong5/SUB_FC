'use client'

import { useEffect, useMemo, useState, ChangeEvent } from 'react'
import { Trophy, ChevronRight } from 'lucide-react'
import type { PostMatchProps } from '@/constants/modal'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

type Touched = {
  date: boolean
  place: boolean
  score: boolean
  opponent: boolean
}

function parseScore(scoreStr: string): { our: string; opponent: string } {
  if (!scoreStr.trim()) return { our: '', opponent: '' }
  const match = scoreStr.trim().match(/^(\d+)\s*[:\-]\s*(\d+)$/)
  if (match) return { our: match[1], opponent: match[2] }
  return { our: '', opponent: '' }
}

export function PostMatchContent({ mode = 'create', initial, onClose, onSubmit }: PostMatchProps) {
  const safe = useMemo(
    () => ({
      date: initial?.date ?? '',
      place: initial?.place ?? '',
      score: initial?.score ?? '',
      opponent: initial?.opponent ?? '',
    }),
    [initial]
  )

  const parsed = useMemo(() => parseScore(safe.score), [safe.score])

  const [date, setDate] = useState(safe.date)
  const [place, setPlace] = useState(safe.place)
  const [ourScore, setOurScore] = useState(parsed.our)
  const [opponentScore, setOpponentScore] = useState(parsed.opponent)
  const [opponent, setOpponent] = useState(safe.opponent)

  useEffect(() => {
    setDate(safe.date)
    setPlace(safe.place)
    const p = parseScore(safe.score)
    setOurScore(p.our)
    setOpponentScore(p.opponent)
    setOpponent(safe.opponent)
  }, [safe])

  const [touched, setTouched] = useState<Touched>({
    date: false,
    place: false,
    score: false,
    opponent: false,
  })

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    const iso = v.includes('-') ? v : ('20' + v).replaceAll('/', '-')
    setDate(iso)
  }

  const ourNum = ourScore === '' ? NaN : parseInt(ourScore, 10)
  const oppNum = opponentScore === '' ? NaN : parseInt(opponentScore, 10)
  const scoresValid = !Number.isNaN(ourNum) && !Number.isNaN(oppNum) && ourNum >= 0 && oppNum >= 0

  const isValid = Boolean(date && place.trim() && opponent.trim()) && scoresValid

  const submit = () => {
    setTouched({ date: true, place: true, score: true, opponent: true })
    if (!isValid) return
    const scoreStr = `${ourScore}-${opponentScore}`
    onSubmit({ date, opponent, place, score: scoreStr })
  }

  return (
    <div className="flex items-center justify-center w-full max-w-[560px] mx-auto bg-black/20 rounded-[2.5rem]">
      <div className="relative w-full h-auto min-h-0 md:min-h-[85vh] bg-[#0f172a] rounded-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] md:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] border-t md:border border-white/10 overflow-hidden flex flex-col">
        {/* 모바일 상단 핸들 */}
        <div className="flex justify-center pt-3 sm:pt-4 md:hidden shrink-0">
          <div className="w-12 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Pitch Pattern Background Overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[400px] border border-white/20 rounded-[100%] scale-110" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-white/20" />
        </div>

        <div className="relative z-10 flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 lg:mb-10 sm:pt-2 p-10 sm:pr-14">
            <div className="min-w-0">
              <p className="text-emerald-400 text-[12px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-0.5 sm:mb-1">
                Match Result
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight">
                {mode === 'edit' ? '경기 결과 수정' : '경기 결과 등록'}
              </h2>
            </div>
            <div className="hidden md:flex w-12 h-12 lg:w-14 lg:h-14 rounded-2xl lg:rounded-3xl bg-white/5 border border-white/10 items-center justify-center shrink-0">
              <Trophy size={24} className="md:w-6 md:h-6 lg:w-7 lg:h-7 text-emerald-400" />
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5 md:space-y-7 lg:space-y-8 flex-1 flex flex-col min-h-0">
            <div className="grid grid-cols-2 gap-10 mt-15 shrink-0">
              <Input
                id="match-date"
                variant="input"
                type="date"
                label="일시"
                value={date}
                onChange={handleDateChange}
                onBlur={() => setTouched((t) => ({ ...t, date: true }))}
                errorMessage={touched.date && !date ? '날짜를 선택해 주세요.' : undefined}
                className="gap-2 [&_input]:bg-white/5 [&_input]:border [&_input]:border-white/5 [&_input]:rounded-xl [&_input]:sm:rounded-2xl [&_input]:px-4 [&_input]:py-3 [&_input]:text-white [&_input]:font-bold [&_input]:text-sm [&_input]:focus:border-emerald-500/50 [&_input]:focus:bg-white/10 [&_input]:focus:outline-none [&_label]:text-slate-500"
              />
              <Input
                id="match-place"
                variant="input"
                type="text"
                label="장소"
                placeholder="예시 : 다락원"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, place: true }))}
                errorMessage={touched.place && !place.trim() ? '장소를 입력해 주세요.' : undefined}
                className="gap-2 [&_input]:bg-white/5 [&_input]:border [&_input]:border-white/5 [&_input]:rounded-xl [&_input]:sm:rounded-2xl [&_input]:px-4 [&_input]:py-3 [&_input]:text-white [&_input]:font-bold [&_input]:text-sm [&_input]:placeholder:text-slate-700 [&_input]:focus:border-emerald-500/50 [&_input]:focus:bg-white/10 [&_input]:focus:outline-none [&_label]:text-slate-500"
              />
            </div>

            {/* Scoreboard: Home vs Away */}
            <div className="shrink-0">
              <p className="text-slate-500 text-16_M mb-2">최종 스코어</p>
              <div className="relative bg-white/[0.02] rounded-xl sm:rounded-2xl lg:rounded-[2.5rem] p-4 sm:p-6 md:p-8 mb-15 border border-white/5 shadow-inner min-h-[200px] sm:min-h-[240px] md:min-h-[280px] lg:min-h-[320px]">
                <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-4 h-full min-h-[180px] sm:min-h-[220px] md:min-h-[260px] lg:min-h-[300px]">
                  {/* Home Team (Our Team) */}
                  <div className="flex-1 min-w-0 flex flex-col items-center gap-2 sm:gap-3 md:gap-4">
                    <div className="w-full text-center min-w-0">
                      <p className="text-[20px] font-black text-emerald-400 uppercase mb-0.5 sm:mb-1">
                        SUB-FC
                      </p>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={ourScore}
                        onChange={(e) => setOurScore(e.target.value.replace(/\D/g, '').slice(0, 2))}
                        onBlur={() => setTouched((t) => ({ ...t, score: true }))}
                        className="w-full bg-transparent border-none text-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white focus:ring-0 outline-none p-0 min-h-[56px] touch-manipulation"
                      />
                    </div>
                  </div>

                  {/* VS Divider */}
                  <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4 px-1 sm:px-2 shrink-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/10 shadow-lg backdrop-blur-md">
                      <span className="text-[30px] font-black text-white">VS</span>
                    </div>
                  </div>

                  {/* Away Team (Opponent) */}
                  <div className="flex-1 min-w-0 flex flex-col items-center gap-6 sm:gap-3 md:gap-4">
                    <div className="w-full text-center min-w-0">
                      <p className="text-[20px] font-black text-slate-500 uppercase mb-0.5 sm:mb-1">
                        Away
                      </p>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={opponentScore}
                        onChange={(e) =>
                          setOpponentScore(e.target.value.replace(/\D/g, '').slice(0, 2))
                        }
                        onBlur={() => setTouched((t) => ({ ...t, score: true }))}
                        className="w-full bg-transparent border-none text-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white focus:ring-0 outline-none p-0 min-h-[56px] touch-manipulation"
                      />
                    </div>
                  </div>
                </div>
                {touched.score && !scoresValid && (
                  <p className="text-center text-xs sm:text-sm text-red-400 mt-2 sm:mt-3">
                    스코어를 숫자로 입력해 주세요.
                  </p>
                )}
              </div>
            </div>

            {/* Opponent Team Name Input */}
            <div className="relative group mb-15 shrink-0">
              <Input
                id="match-opponent"
                variant="input"
                type="text"
                label="상대팀명"
                placeholder="상대 팀명을 입력하세요..."
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, opponent: true }))}
                errorMessage={
                  touched.opponent && !opponent.trim() ? '상대팀을 입력해 주세요.' : undefined
                }
                className="gap-2 [&_label]:text-slate-500 [&_label]:text-sm [&_input]:bg-white/5 [&_input]:border [&_input]:border-white/5 [&_input]:rounded-xl [&_input]:sm:rounded-2xl [&_input]:lg:rounded-3xl [&_input]:py-3.5 [&_input]:sm:py-4 [&_input]:md:py-5 [&_input]:lg:py-6 [&_input]:pl-9 [&_input]:sm:pl-10 [&_input]:md:pl-12 [&_input]:lg:pl-14 [&_input]:text-white [&_input]:font-bold [&_input]:focus:border-emerald-500/50 [&_input]:focus:bg-white/10 [&_input]:placeholder:text-slate-700"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-row justify-between gap-2 mb-15 px-10 shrink-0">
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="flex-1"
                onClick={onClose}
              >
                취소하기
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                disabled={!isValid}
                className="flex-[2] flex items-center justify-center gap-2"
                onClick={submit}
              >
                다음
                <ChevronRight size={18} className="shrink-0" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
