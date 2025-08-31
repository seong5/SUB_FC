import Image from 'next/image'

export default function FirstPrize() {
  return (
    <>
      <h1 className="text-center text-[30px] md:text-[60px] font-bold mb-10">
        SUB FC <br />
        부문별 1위
      </h1>
      <section className="text-center flex flex-row justify-center items-center gap-50">
        <div className="flex flex-col gap-5">
          <Image
            src="/score-icon.png"
            alt="득점"
            width={100}
            height={100}
            className="w-60 h-60 md:w-80 md:h-80"
          />
          <h3 className="txt-16_B md:txt-24_B">득점</h3>
          <h1 className="txt-20_B md:txt-32_B text-primary-500 mt-10">신성오</h1>
        </div>
        <div className="flex flex-col gap-5">
          <Image
            src="/assist-icon.png"
            alt="도움"
            width={100}
            height={100}
            className="w-60 h-60 md:w-80 md:h-80"
          />
          <h3 className="txt-16_B md:txt-24_B">도움</h3>
          <h1 className="txt-20_B md:txt-32_B text-green-500 mt-10">차우현</h1>
        </div>
        <div className="flex flex-col gap-5">
          <Image
            src="/attendance-icon.png"
            alt="참석"
            width={100}
            height={100}
            className="w-60 h-60 md:w-80 md:h-80"
          />
          <h3 className="txt-16_B md:txt-24_B">참석률</h3>
          <h1 className="txt-20_B md:txt-32_B text-yellow-500 mt-10">문현준</h1>
        </div>
      </section>
    </>
  )
}
