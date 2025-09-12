'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

/** 서버에서 올 수 있는 goal의 가능한 형태 */
type GoalLike =
  | string
  | {
      minute?: number | null
      scorer?: string | null
      assist?: string | null
    }

/** 화면에서 쓰는 확정 타입 */
type QuarterScore = {
  label: string // "1 쿼터"
  goals: string[] // 득점자 이름들
  assists: string[] // 도움자 이름들
  conceded: number // 실점 수
  scoreAfter: string // "2 - 1"
}
type MatchSummary = {
  matchId: number
  date: string
  opponent: string
  finalScore: string
  quarters: QuarterScore[]
  place?: string
}

type Props = {
  matchId: number | string
  selectedLabel: QuarterScore['label'] | '' // ''이면 안내만 표시
}

/** 응답을 화면용 구조로 정규화 */
function normalizeSummary(raw: unknown): MatchSummary {
  const r = (raw ?? {}) as Record<string, unknown>

  const quartersRaw = Array.isArray(r.quarters) ? (r.quarters as Record<string, unknown>[]) : []

  const quarters: QuarterScore[] = quartersRaw.map((q) => {
    // goals: string[] 또는 GoalLike[] 가능 → 항상 득점자 이름 string[]로
    const rawGoals = Array.isArray(q.goals) ? (q.goals as GoalLike[]) : []
    const goals: string[] = rawGoals
      .map((g) => (typeof g === 'string' ? g : (g?.scorer ?? '')))
      .filter((s): s is string => Boolean(s && s.trim()))

    // assists: 서버가 안 주면 goals의 assist에서 파생
    const assistsFromGoals: string[] = rawGoals
      .map((g) => (typeof g === 'string' ? null : (g?.assist ?? null)))
      .filter((s): s is string => Boolean(s && s.trim()))

    const assistsRaw = Array.isArray(q.assists) ? (q.assists as unknown[]) : []
    const assists: string[] =
      assistsRaw.length > 0
        ? assistsRaw.map((a) => String(a ?? '').trim()).filter((s): s is string => Boolean(s))
        : assistsFromGoals

    return {
      label: String(q.label ?? ''),
      goals,
      assists,
      conceded: Number.isFinite(Number(q.conceded)) ? Number(q.conceded) : 0,
      scoreAfter: String(q.scoreAfter ?? ''),
    }
  })

  return {
    matchId: Number(r.matchId ?? 0),
    date: String(r.date ?? ''),
    opponent: String(r.opponent ?? ''),
    finalScore: String(r.finalScore ?? ''),
    place: r.place ? String(r.place) : undefined,
    quarters,
  }
}

export default function ScoreAndAssist({ matchId, selectedLabel }: Props) {
  const [data, setData] = useState<MatchSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`/api/matches/${matchId}`, { cache: 'no-store' })
        if (!res.ok) throw new Error('상세 데이터를 불러오지 못했습니다.')
        const json = await res.json()
        const normalized = normalizeSummary(json)

        if (alive) setData(normalized)
      } catch (e) {
        if (!alive) return
        setError(e instanceof Error ? e.message : '알 수 없는 오류')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [matchId])

  if (loading) return <section className="text-gray-500">불러오는 중…</section>
  if (error || !data)
    return <section className="text-red-500">불러오지 못했어요. {error ?? ''}</section>

  const quarter = selectedLabel ? data.quarters.find((q) => q.label === selectedLabel) : undefined
  const goals = quarter?.goals ?? []
  const assists = quarter?.assists ?? []
  const conceded = quarter?.conceded ?? 0
  const scoreAfter = quarter?.scoreAfter ?? ''

  return (
    <section className="my-10">
      <h1 className="txt-28_M md:txt-32_M text-gray-800 my-20">Score</h1>
      <div className="bg-white rounded-[16px] py-5">
        <h1 className="txt-30_M md:text-[28px] font-semibold text-center text-gray-800 mt-30">
          전체 스코어 <div>{data.finalScore}</div>
        </h1>

        <h2 className="text-center text-[18px] md:text-[24px] font-bold my-20">
          SubFC : {data.opponent}
        </h2>

        <h1 className="text-center text-[28px] md:txt-32_B">{scoreAfter}</h1>

        <div className="py-30 px-20 grid grid-cols-3 gap-4 text-center txt-12_M">
          {/* 득점 */}
          <div>
            <Image
              src="/score-icon.png"
              alt="득점"
              width={40}
              height={40}
              className="w-30 h-30 md:w-40 md:h-40 mx-auto"
            />
            <div className="mt-2 font-semibold">득점</div>
            <div className="mt-10 space-y-1 text-primary-500 txt-16_B md:txt-20_M min-h-[24px]">
              {selectedLabel ? (
                goals.length ? (
                  goals.map((n, i) => <p key={`g-${i}`}>{n}</p>)
                ) : (
                  <p className="text-gray-400">-</p>
                )
              ) : (
                <p className="text-gray-400">쿼터를 선택하세요</p>
              )}
            </div>
          </div>

          {/* 도움 */}
          <div>
            <Image
              src="/assist-icon.png"
              alt="도움"
              width={40}
              height={40}
              className="w-30 h-30 md:w-40 md:h-40 mx-auto"
            />
            <div className="mt-2 font-semibold">도움</div>
            <div className="mt-10 space-y-1 text-green-500 txt-16_B md:txt-20_M min-h-[24px]">
              {selectedLabel ? (
                assists.length ? (
                  assists.map((n, i) => <p key={`a-${i}`}>{n}</p>)
                ) : (
                  <p className="text-gray-400">-</p>
                )
              ) : (
                <p className="text-gray-400">쿼터를 선택하세요</p>
              )}
            </div>
          </div>

          {/* 실점 */}
          <div>
            <Image
              src="/lost-score-icon.png"
              alt="실점"
              width={40}
              height={40}
              className="w-30 h-30 md:w-40 md:h-40 mx-auto"
            />
            <div className="mt-2 font-semibold">실점</div>
            <div className="mt-10 space-y-1 text-red-500 txt-16_B md:txt-20_M min-h-[24px]">
              {selectedLabel ? (
                conceded > 0 ? (
                  Array.from({ length: conceded }).map((_, i) => <p key={`c-${i}`}>실점</p>)
                ) : (
                  <p className="text-gray-400">-</p>
                )
              ) : (
                <p className="text-gray-400">쿼터를 선택하세요</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
