import Button from '@/components/Button'
import Icon from '@/components/Icon'
import DropDown from '@/components/DropDown'

export default function Home() {
  return (
    <div>
      <Button variant="kakao" size="lg" rounded="12">
        <Icon icon="Kakao" className="w-25 h-25" />
        카카오 로그인
      </Button>
      <DropDown />
    </div>
  )
}
