'use client'
import Icon from '@/components/Icon'
import DropDown from '@/components/DropDown'

export default function Home() {
  return (
    <div>
      <DropDown
        trigger={<Icon icon="More" className="w-25 h-25" />}
        items={[
          { text: '수정하기', onClick: () => console.log('수정하기') },
          { text: '삭제하기', onClick: () => console.log('삭제하기') },
        ]}
        position="bottom"
      />
    </div>
  )
}
