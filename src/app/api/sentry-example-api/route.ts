import * as Sentry from '@sentry/nextjs'
export const dynamic = 'force-dynamic'

class SentryExampleAPIError extends Error {
  constructor(message: string | undefined) {
    super(message)
    this.name = 'SentryExampleAPIError'
  }
}

// A faulty API route to test Sentry's error monitoring
export function GET() {
  Sentry.logger.info('Sentry example API called')
  throw new SentryExampleAPIError('[테스트 에러]- 이 에러는 테스트용으로 의도된 에러입니다.')
}
