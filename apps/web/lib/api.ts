import axios from "axios"
import useAuth from "./loginContext"

const axiosBase = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
})

axiosBase.interceptors.response.use(
  res => {
    switch (res.status) {
      case 401:
        useAuth.getState().logout()
    }

    return res.data
  },
  err => err.response ? Promise.reject(err.response.data) : Promise.reject(err)
)

axiosBase.interceptors.request.use(
  conf => {
    const token = useAuth.getState().token

    if (token) {
      conf.headers.Authorization = `Bearer ${token}`
    }

    return conf
  }
)

export default axiosBase

export interface ApiError {
  message: string
  error: string
  statusCode: number
}
