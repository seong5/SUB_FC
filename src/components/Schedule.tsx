export default function Schedule() {
  return (
    <section>
      <p className="border-t border-gray-100 pt-20 txt-20_B">SUB 일정</p>
      <div className="txt-16_B flex flex-row gap-5 mt-10 items-center">
        <p className="card-shadow rounded-full text-center min-w-50 bg-orange-300">매치</p>
        <p className="card-shadow rounded-full text-center min-w-50 bg-purple-300">회식</p>
        <p className="card-shadow rounded-full text-center min-w-50 bg-gray-300">기타</p>
      </div>
    </section>
  )
}
