'use client'

import ReactDOM from 'react-dom'
import { useRef } from 'react'

import { ContentMap, ModalProps } from '@/constants/modal'
import { useClickOutside } from '@/hooks/useClickOutside'

function hasOnClose(p: ModalProps | (ModalProps & { onClose?: () => void })): p is ModalProps & {
  onClose: () => void
} {
  return 'onClose' in p && typeof p.onClose === 'function'
}

export default function Modal<P extends ModalProps>(props: P) {
  const Content = ContentMap[props.variant] as React.FC<P>
  const containerRef = useRef<HTMLDivElement | null>(null)

  useClickOutside(containerRef, () => {
    if (hasOnClose(props)) {
      props.onClose()
    }
  })

  if (!Content) return null

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center overflow-y-auto p-10">
      <div ref={containerRef} className="relative rounded-2xl my-auto w-full max-w-[560px] mx-auto">
        <Content {...props} />
      </div>
    </div>,
    document.body
  )
}
