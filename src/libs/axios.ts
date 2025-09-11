import axios from 'axios'

const isServer = typeof window === 'undefined'

const api = axios.create({
  baseURL: isServer
    ? process.env.NEXT_PUBLIC_SITE_URL + '/api' //서버에서는 절대 URL
    : '/api', //클라이언트에서는 상대 URL
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
  (error) => Promise.reject(error)
)

// 응답 인터셉터: 공통 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('인증 만료 또는 권한 없음')
      // TODO: 로그인 페이지로 이동 처리 가능
    }
    return Promise.reject(error)
  }
)

export default api
