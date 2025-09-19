import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import GlobalSpinner from './GlobalSpinner'
import { useIsFetching, useIsMutating } from '@tanstack/react-query'

jest.mock('@tanstack/react-query', () => ({
  useIsFetching: jest.fn(),
  useIsMutating: jest.fn(),
}))

jest.mock('../spinner/Spinner', () => ({
  __esModule: true,
  default: () => <div data-testid="spinner" />,
}))

const mockUseIsFetching = useIsFetching as jest.Mock
const mockUseIsMutating = useIsMutating as jest.Mock

describe('<GlobalSpinner />', () => {
  afterEach(() => jest.clearAllMocks())

  it('로딩이 없으면 아무것도 렌더링하지 않는다', () => {
    mockUseIsFetching.mockReturnValue(0)
    mockUseIsMutating.mockReturnValue(0)
    render(<GlobalSpinner />)
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
  })

  it('패칭 중이면 Spinner가 렌더링된다', () => {
    mockUseIsFetching.mockReturnValue(1)
    mockUseIsMutating.mockReturnValue(0)
    render(<GlobalSpinner />)
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('뮤테이션 중이면 Spinner가 렌더링된다', () => {
    mockUseIsFetching.mockReturnValue(0)
    mockUseIsMutating.mockReturnValue(2)
    render(<GlobalSpinner />)
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })
})
