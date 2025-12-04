'use client'

import { useNotifications, useRemoveNotification } from '@/store/useNotificationStore'

export default function Notification() {
  const notifications = useNotifications()
  const removeNotification = useRemoveNotification()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-20 right-20 md:top-30 md:right-30 z-[100] flex flex-col gap-10 max-w-[320px] md:max-w-[400px]">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="card-shadow bg-white rounded-[16px] p-15 md:p-20 flex items-start gap-12"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-8 mb-4">
              {notification.type === 'match' ? (
                <span className="txt-12_B text-primary-500 bg-primary-100 px-8 py-2 rounded-full">
                  경기
                </span>
              ) : (
                <span className="txt-12_B text-green-500 bg-green-100 px-8 py-2 rounded-full">
                  일정
                </span>
              )}
            </div>
            <p className="txt-14_M text-gray-800 break-words">{notification.message}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0 w-24 h-24 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors txt-20_B"
            aria-label="알림 닫기"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
