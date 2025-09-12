export default function WinRate() {
  return (
    <section className="bg-white rounded-[16px] p-20 text-[25px] md:text-[50px] font-bold text-center">
      <h1>2025 SUB FC</h1>
      <h2>전체 경기</h2>
      <h3>15 경기</h3>
      <div className="flex flex-row gap-10 text-[18px] md:text-[25px] font-bold justify-center items-center">
        <div>
          <h2 className="text-blue-500">승리</h2>
          <h2>12</h2>
        </div>
        <div>
          <h2 className="text-green-500">무승부</h2>
          <h2>2</h2>
        </div>
        <div>
          <h2 className="text-red-500">패배</h2>
          <h2>1</h2>
        </div>
      </div>
      <h1>승률 80 %</h1>
    </section>
  )
}
