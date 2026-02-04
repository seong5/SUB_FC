'use client'
import ReactDOM from 'react-dom'

import { ContentMap, ModalProps } from '@/constants/modal'

export default function Modal<P extends ModalProps>(props: P) {
  const Content = ContentMap[props.variant] as React.FC<P>

  if (!Content) return null

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center overflow-y-auto p-10">
      <div className="relative rounded-2xl my-auto w-full max-w-[560px] mx-auto">
        <Content {...props} />
      </div>
    </div>,
    document.body
  )
}
