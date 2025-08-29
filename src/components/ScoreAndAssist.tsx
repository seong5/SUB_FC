'use client'

import Image from 'next/image'
import { sampleMatch, QuarterScore } from '@/mocks/QuarterScores'

type Props = {
  selectedLabel: QuarterScore['label'] | '' // ''일 때는 안내만 표시
}

export default function ScoreAndAssist({ selectedLabel }: Props) {
  const quarter = selectedLabel
    ? sampleMatch.quarters.find((q) => q.label === selectedLabel)
    : undefined

  return (
    <section>
      <h1 className="txt-28_M md:txt-32_M text-gray-800 mt-30">Score</h1>

      <h2 className="text-center text-[18px] md:text-[24px] font-bold my-20">
        SubFC : {sampleMatch.opponent}
      </h2>
      <h1 className="text-center text-[28px] md:txt-32_B">{quarter?.scoreAfter ?? ''}</h1>

      <div className="py-30 px-20 grid grid-cols-3 gap-4 text-center txt-12_M">
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
            {quarter ? (
              quarter.goals.length ? (
                quarter.goals.map((n, i) => <p key={`g-${i}`}>{n}</p>)
              ) : (
                <p className="text-gray-400">-</p>
              )
            ) : (
              <p className="text-gray-400">쿼터를 선택하세요</p>
            )}
          </div>
        </div>
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
            {quarter ? (
              quarter.assists.length ? (
                quarter.assists.map((n, i) => <p key={`a-${i}`}>{n}</p>)
              ) : (
                <p className="text-gray-400">-</p>
              )
            ) : (
              <p className="text-gray-400">쿼터를 선택하세요</p>
            )}
          </div>
        </div>
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
            {quarter ? (
              quarter.conceded > 0 ? (
                Array.from({ length: quarter.conceded }).map((_, i) => <p key={`c-${i}`}>실점</p>)
              ) : (
                <p className="text-gray-400">-</p>
              )
            ) : (
              <p className="text-gray-400">쿼터를 선택하세요</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
