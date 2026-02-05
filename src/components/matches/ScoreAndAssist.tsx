'use client'

import { useEffect, useState } from 'react'
import { Trophy, Target, Zap, ShieldAlert, Activity, Star, Flame, Award, Sword } from 'lucide-react'

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

function formatQuarterScoreDisplay(score: string): string {
  const trimmed = score.trim()
  if (!trimmed) return ''
  // "1-1", "1 - 1" 등을 "1:1" 형태로 통일
  return trimmed.replace(/\s*-\s*/g, ':')
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

  if (loading)
    return (
      <section className="space-y-6">
        <div className="w-full h-64 flex flex-col items-center justify-center space-y-4 bg-white/5 rounded-[2.5rem] border border-white/10 animate-pulse">
          <Activity className="text-emerald-500 animate-spin" size={32} />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            Analyzing Match Data...
          </p>
        </div>
      </section>
    )

  if (error || !data)
    return (
      <section className="space-y-6">
        <div className="w-full p-10 bg-rose-500/5 rounded-[2.5rem] border border-rose-500/20 text-center">
          <ShieldAlert className="mx-auto text-rose-500 mb-4" size={32} />
          <p className="text-sm font-bold text-rose-400">데이터를 불러오지 못했습니다.</p>
          {error && <p className="mt-2 text-[11px] text-rose-300">{error}</p>}
        </div>
      </section>
    )

  const quarter = selectedLabel ? data.quarters.find((q) => q.label === selectedLabel) : undefined
  const goals = quarter?.goals ?? []
  const assists = quarter?.assists ?? []
  const conceded = quarter?.conceded ?? 0
  const rawScoreAfter = quarter?.scoreAfter ?? '0 - 0'
  const scoreAfter = formatQuarterScoreDisplay(rawScoreAfter)

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* 섹션 타이틀 */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">
            Score & Assist
          </h3>
        </div>
      </div>

      {/* 메인 스코어보드 카드 */}
      <div className="relative group">
        {/* 배경 조명 효과 */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-transparent to-indigo-500/20 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000" />

        <div className="relative bg-[#020617]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl">
          {/* 상단: 전체 스코어 써머리 */}
          <div className="flex flex-col items-center justify-center mb-12 relative">
            <div className="absolute top-0 opacity-[0.03] scale-[2] pointer-events-none group-hover:rotate-12 transition-transform duration-[2000ms]">
              <Trophy size={180} />
            </div>

            <p className="mb-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">
              전체 스코어
            </p>

            <div className="flex items-center justify-center gap-6 md:gap-12 w-full">
              <div className="flex-1 text-right">
                <h4 className="text-xs md:text-sm font-black text-white uppercase tracking-tighter mb-1">
                  SUB FC
                </h4>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  {data.finalScore.split('-')[0]}
                </span>
                <span className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  {data.finalScore.split('-')[1]}
                </span>
              </div>

              <div className="flex-1 text-left">
                <h4 className="text-xs md:text-sm font-black text-white uppercase tracking-tighter mb-1">
                  {data.opponent}
                </h4>
              </div>
            </div>
          </div>

          {/* 중단: 쿼터별 상태 바 */}
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex flex-col items-center gap-3">
              <div
                className={`px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-[0.25em] transition-all duration-500 ${
                  selectedLabel
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_18px_rgba(16,185,129,0.5)]'
                    : 'bg-white/10 text-slate-500'
                }`}
              >
                {selectedLabel || 'Select Quarter'}
              </div>
              {selectedLabel && (
                <p className="text-[40px] font-black text-white uppercase tracking-tight">
                  {scoreAfter}
                </p>
              )}
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* 하단: 데이터 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {!selectedLabel && (
              <div className="absolute inset-0 z-20 bg-slate-950/60 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center border border-white/5 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Target className="text-emerald-500 animate-bounce" size={24} />
                </div>
                <p className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic text-center px-6">
                  쿼터를 선택하여 정보를 확인하세요.
                </p>
              </div>
            )}

            {/* 득점 카드 */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                  <Flame size={18} fill="currentColor" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  득점
                </span>
              </div>
              <div className="space-y-2 min-h-[40px]">
                {selectedLabel ? (
                  goals.length > 0 ? (
                    goals.map((n, i) => (
                      <div
                        key={`g-${i}`}
                        className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/10 px-4 py-3 rounded-2xl"
                      >
                        <span className="text-xs font-black text-emerald-400 italic uppercase">
                          {n}
                        </span>
                        <Award size={14} className="text-emerald-500/40" />
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] font-bold text-slate-700 italic uppercase py-2">
                      득점이 없습니다.
                    </p>
                  )
                ) : (
                  <p className="text-[10px] font-bold text-slate-700 italic uppercase py-2">
                    쿼터를 선택하세요
                  </p>
                )}
              </div>
            </div>

            {/* 도움 카드 */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-500">
                  <Star size={18} fill="currentColor" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  도움
                </span>
              </div>
              <div className="space-y-2 min-h-[40px]">
                {selectedLabel ? (
                  assists.length > 0 ? (
                    assists.map((n, i) => (
                      <div
                        key={`a-${i}`}
                        className="flex items-center justify-between bg-indigo-500/5 border border-indigo-500/10 px-4 py-3 rounded-2xl"
                      >
                        <span className="text-xs font-black text-indigo-400 italic uppercase">
                          {n}
                        </span>
                        <Zap size={14} className="text-indigo-500/40" />
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] font-bold text-slate-700 italic uppercase py-2">
                      도움이 없습니다.
                    </p>
                  )
                ) : (
                  <p className="text-[10px] font-bold text-slate-700 italic uppercase py-2">
                    쿼터를 선택하세요
                  </p>
                )}
              </div>
            </div>

            {/* 실점 카드 */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-500">
                  <ShieldAlert size={18} fill="currentColor" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  실점
                </span>
              </div>
              <div className="space-y-2 min-h-[40px]">
                {selectedLabel ? (
                  conceded > 0 ? (
                    Array.from({ length: conceded }).map((_, i) => (
                      <div
                        key={`c-${i}`}
                        className="flex items-center justify-between bg-rose-500/5 border border-rose-500/10 px-4 py-3 rounded-2xl"
                      >
                        <span className="text-xs font-black text-rose-400 italic uppercase">
                          Lost Goal
                        </span>
                        <Sword size={14} className="text-rose-500/40" />
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] font-bold text-slate-700 italic uppercase py-2">
                      Clean Sheet
                    </p>
                  )
                ) : (
                  <p className="text-[10px] font-bold text-slate-700 italic uppercase py-2">
                    쿼터를 선택하세요
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
