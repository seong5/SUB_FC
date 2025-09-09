import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  timeout: 10_000,
  withCredentials: false,
})

// 요청 인터셉터: 토큰 자동 첨부
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터: 공통 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('인증 만료 또는 권한 없음')
      // TODO: 여기서 로그인 페이지로 이동 처리 가능
    }
    return Promise.reject(error)
  }
)

export default api
