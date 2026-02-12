'use client'

import { create } from 'zustand'
import { generateId } from '@/shared/utils/uuid'

export type NotificationType = 'match' | 'schedule'

export type NotificationItem = {
  id: string
  type: NotificationType
  message: string
  timestamp: number
  createdBy?: string // 등록한 사용자 id
  matchId?: number // 경기 id
  scheduleId?: string // 일정 id
  date?: string // 일정 날짜 (예: "2024년 12월 7일")
}

type NotificationState = {
  notifications: NotificationItem[]
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: generateId(),
          timestamp: Date.now(),
        },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearAll: () => set({ notifications: [] }),
}))

export const useNotifications = () => useNotificationStore((s) => s.notifications)
export const useAddNotification = () => useNotificationStore((s) => s.addNotification)
export const useRemoveNotification = () => useNotificationStore((s) => s.removeNotification)
