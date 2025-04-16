import axios from "axios"
import { logout } from "./utils"

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
        logout()
    }

    return res.data
  },
  err => err.response ? Promise.reject(err.response.data) : Promise.reject(err)
)

axiosBase.interceptors.request.use(
  conf => {
    const token = localStorage.getItem("ACCESS_TOKEN")

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
