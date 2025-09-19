import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

// Jest에 대한 상세 설정을 정의합니다.
const config: Config = {
  // 각 테스트가 실행되기 전에 환경을 설정하는 파일을 지정합니다.
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // 테스트 환경으로 jsdom(브라우저 모방)을 사용합니다.
  testEnvironment: 'jest-environment-jsdom',
  // import 경로에서 '@/'를 '<rootDir>/src/'로 인식하도록 매핑합니다.
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default createJestConfig(config)
