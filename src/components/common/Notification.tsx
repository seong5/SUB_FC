'use client'

import { useNotifications, useRemoveNotification } from '@/store/useNotificationStore'
import { cn } from '@/utils/cn'

export default function Notification() {
  const notifications = useNotifications()
  const removeNotification = useRemoveNotification()

  if (notifications.length === 0) return null

  return (
    <div
      className={cn(
        'absolute z-50 top-full mt-10',
        'flex flex-col w-[360px] md:w-[420px]',
        'shadow-md rounded-[16px] border border-gray-50 bg-white',
        'max-h-[60vh] overflow-y-auto',
        'right-0'
      )}
      style={{
        maxWidth: 'min(300px, calc(100vw - 40px))',
        transform: 'translateX(100px)',
      }}
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="flex items-start gap-12 p-15 md:p-20 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
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
