import axios from "axios"
import { getCookie, setCookie } from "cookies-next"

const isValidValue = (value: any): boolean => {
  return value !== null && value !== undefined && value !== "" && value !== "null" && value !== "undefined"
}

const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname
    // Only redirect if not already on homepage or auth pages
    if (currentPath !== "/" && !currentPath.startsWith("/auth")) {
      window.location.href = "/auth"
    }
  }
}


const getNewAccessToken = async (refreshToken: string): Promise<string> => {
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/auth/refresh`, {
    refreshToken,
  })

  const { accessToken } = data.data
  if (isValidValue(accessToken)) {
    setCookie("userData", accessToken, { maxAge: 3600 })
    return accessToken
  } else {
    throw new Error("Invalid access token received")
  }
}

// Public API routes (no authentication required)
const publicApiRoutes = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh-token",
  "/api/auth/google",
  "/api/auth/callback",
  "/api/forget-password",
  "/api/reset-password",
]

const isPublicApiRoute = (url: string): boolean => {
  return publicApiRoutes.some((path) => url.includes(path))
}

const isHomePage = (url: string): boolean => {
  return url === "/" || url === ""
}

export const AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Request Interceptor: Add authorization token
AxiosInstance.interceptors.request.use(
  async (config) => {
    if (config.url && isPublicApiRoute(config.url)) {
      // Skip adding token for public API routes
      return config
    }

    let token = getCookie("userData")

    if (!isValidValue(token)) {
      const refreshToken = getCookie("userDataRefresh")

      if (isValidValue(refreshToken)) {
        try {
          token = await getNewAccessToken(refreshToken as string)
        } catch (error) {
          console.error("Unable to get token from refresh:", error)
          redirectToLogin()
          return Promise.reject("Unable to refresh token")
        }
      } else {
        redirectToLogin()
        return Promise.reject("Invalid or missing refresh token")
      }
    }

    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// Response Interceptor: Handle 401 errors and token refresh
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (originalRequest.url && (isPublicApiRoute(originalRequest.url) || isHomePage(originalRequest.url))) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const refreshToken = getCookie("userDataRefresh")

    if (!isValidValue(refreshToken)) {
      redirectToLogin()
      return Promise.reject("Invalid or missing refresh token")
    }

    try {
      const accessToken = await getNewAccessToken(refreshToken as string)
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return AxiosInstance(originalRequest)
    } catch (e) {
      console.error("Token refresh failed:", e)
      redirectToLogin()
      return Promise.reject("Token refresh failed")
    }
  },
)