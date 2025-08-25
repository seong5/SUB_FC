'use client'
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
      <DropDown
        trigger={<Icon icon="Kakao" />}
        items={[
          { text: '수정하기', onClick: () => console.log('수정하기') },
          { text: '삭제하기', onClick: () => console.log('삭제하기') },
        ]}
        position="bottom"
      />
    </div>
  )
}
