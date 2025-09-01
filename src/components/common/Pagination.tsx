import { cn } from '@/utils/cn'

import Icon from '@/components/common/Icon'

interface PaginationProps {
  currentPage: number // 현재 보고있는 페이지
  totalCount: number // 총 경기 수
  pageSize: number // 한 페이지에 보여줄 경기 수
  onPageChange: (page: number) => void // 페이지 변경 시 실행될 함수
}

export default function Pagination({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize) // 총 페이지 갯수를 구함
  const currentGroup = Math.floor((currentPage - 1) / 5) // 페이지그룹을 5개 단위로 나눠서 구분 1~5, 6~10 이런식으로 구성
  const firstPage = currentGroup * 5 + 1 // 페이지그룹의 첫번째 번호 1, 6 이런식으로 구성
  const lastPage = Math.min(firstPage + 4, totalPages) // 페이지그룹의 마지막 번호
  const pageCount = Math.max(0, lastPage - firstPage + 1) // 보여줄 페이지의 갯수

  const pageNumbers = new Array(pageCount).fill(0).map((_, i) => firstPage + i)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className="flex gap-4">
      <button
        className="flex size-40 items-center justify-center p-8 text-gray-950 disabled:text-gray-300"
        disabled={currentPage === 0}
        onClick={handlePrevPage}
      >
        <Icon className="size-20" icon="ChevLeft" />
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          className={cn(
            'txt-14_M size-40 p-8 leading-24 transition-colors duration-150',
            page === currentPage
              ? 'border-primary-500 border-b-2 text-gray-950'
              : 'text-gray-300 hover:text-gray-500'
          )}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="flex size-40 items-center justify-center p-8 text-gray-950 disabled:text-gray-300"
        disabled={currentPage === totalPages}
        onClick={handleNextPage}
      >
        <Icon className="size-20" icon="ChevRight" />
      </button>
    </div>
  )
}
