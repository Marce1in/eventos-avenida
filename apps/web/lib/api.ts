import axios from "axios"

const axiosBase = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
})

axiosBase.interceptors.response.use(
  res => res.data,
  err => err.response ? Promise.reject(err.response.data) : Promise.reject(err)
)

export default axiosBase

export interface ApiError {
  message: string
  error: string
  statusCode: number
}
