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
    expect(screen.getByText(/SoccerBall/i)).toBeInTheDocument()
  })
})
