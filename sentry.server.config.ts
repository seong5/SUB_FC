// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://34becb51eb35831d94b0ef0093b1b751@o4510990074970112.ingest.us.sentry.io/4510990078443520',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  /* 서버(특히 /api)에서 발생한 에러에 태그/추가 정보를 붙여 알림 메시지에서 에러 타입과 위치를 더 명확히 볼 수 있게 한다. */
  beforeSend(event, hint) {
    const originalException = hint?.originalException

    // 에러 타입/메시지 태그 추가
    if (originalException instanceof Error) {
      event.tags = {
        ...(event.tags || {}),
        error_type: originalException.name,
      }
      event.extra = {
        ...(event.extra || {}),
        error_message: originalException.message,
      }
    }

    // API 요청인 경우, API 관련 태그 추가
    const url = event.request?.url
    if (url && url.includes('/api/')) {
      let path = url
      try {
        // url이 절대 경로라면 pathname만 추출
        path = new URL(url).pathname
      } catch {
        // 상대 경로일 경우 그대로 둔다
      }

      event.tags = {
        ...(event.tags || {}),
        layer: 'api',
        api_path: path,
      }
    }

    return event
  },
})
