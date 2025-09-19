import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import GlobalSpinner from './GlobalSpinner'
import { useIsFetching, useIsMutating } from '@tanstack/react-query'

jest.mock('@tanstack/react-query', () => ({
  useIsFetching: jest.fn(),
  useIsMutating: jest.fn(),
}))

jest.mock('@/components/common/spinner/Spinner', () => ({
  __esModule: true,
  default: () => <div data-testid="spinner" />,
}))

const mockFetch = useIsFetching as jest.Mock
const mockMutate = useIsMutating as jest.Mock

describe('GlobalSpinner (timers, with mocked Spinner)', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it('50ms 전에는 안 보이고, 50ms 지나면 보인다', () => {
    mockFetch.mockReturnValue(1)
    mockMutate.mockReturnValue(0)

    render(<GlobalSpinner />)
    expect(screen.queryByTestId('spinner')).toBeNull()

    act(() => {
      jest.advanceTimersByTime(50)
    })
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })
})
