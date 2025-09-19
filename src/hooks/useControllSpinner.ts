'use client'

import { useEffect, useRef, useState } from 'react'

type Options = {
  delayBeforeShow?: number // 표시 지연 시간
  minVisibleMs?: number // 최소 표시 시간
}

export function useControlledSpinner(active: boolean, opts: Options = {}) {
  const { delayBeforeShow = 50, minVisibleMs = 500 } = opts
  const [visible, setVisible] = useState(false)
  const showTimer = useRef<number | null>(null)
  const hideTimer = useRef<number | null>(null)
  const shownAt = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (showTimer.current) window.clearTimeout(showTimer.current)
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
    }
  }, [])

  useEffect(() => {
    if (active) {
      // 로딩 시작
      if (hideTimer.current) {
        window.clearTimeout(hideTimer.current)
        hideTimer.current = null
      }
      if (!visible && showTimer.current == null) {
        showTimer.current = window.setTimeout(() => {
          showTimer.current = null
          shownAt.current = Date.now()
          setVisible(true)
        }, delayBeforeShow)
      }
    } else {
      // 로딩 끝 → 최소 시간 보장
      if (showTimer.current) {
        window.clearTimeout(showTimer.current)
        showTimer.current = null
        return
      }
      if (!visible) return

      const elapsed = shownAt.current ? Date.now() - shownAt.current : 0
      const remain = Math.max(0, minVisibleMs - elapsed)
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
      hideTimer.current = window.setTimeout(() => {
        hideTimer.current = null
        shownAt.current = null
        setVisible(false)
      }, remain)
    }
  }, [active, visible, delayBeforeShow, minVisibleMs])

  return visible
}
