import { RefObject, useEffect } from 'react'

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  /** HTMLElement가 아니라 ref 객체 */
  ref: RefObject<T | null>,
  /** react의 MouseEvent가 아니라 DOM 기본 MouseEvent */
  handler: (e: MouseEvent) => void
) {
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) handler(e)
    }

    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [ref, handler])
}
