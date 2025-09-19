import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Spinner from './Spinner'

jest.mock('../Icon', () => ({
  __esModule: true,
  default: (props: { icon: string; className?: string }) => (
    <div data-testid="icon" data-icon={props.icon} className={props.className}>
      {props.icon}
    </div>
  ),
}))

describe('<Spinner />', () => {
  it('SoccerBall 아이콘을 렌더링한다', () => {
    render(<Spinner />)

    const icon = screen.getByTestId('icon')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveAttribute('data-icon', 'SoccerBall')
    // 아이콘 텍스트가 노출되도록 mock했으니 이 검증도 가능
    expect(screen.getByText(/SoccerBall/i)).toBeInTheDocument()
  })
})
