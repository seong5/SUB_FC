import Image from 'next/image'

export default function ScoreAndAssist() {
  return (
    <section>
      <h1 className="txt-32_M text-gray-800 mt-30">Score</h1>
      <h2 className="text-center text-[24px] font-bold my-20">SubFC : 짱구FC</h2>
      <h1 className="text-center txt-32_B">3 : 0</h1>
      <div className="py-30 px-20 flex flex-row text-center items-center justify-between txt-12_M">
        <div>
          <Image src={'/score-icon.png'} alt="득점" width={40} height={40} />
          득점
        </div>
        <div>
          <Image src={'/assist-icon.png'} alt="도움" width={40} height={40} />
          도움
        </div>
        <div>
          <Image src={'/lost-score-icon.png'} alt="실점" width={40} height={40} />
          실점
        </div>
      </div>
    </section>
  )
}
