import axios from "axios"

const axiosBase = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
})

export default axiosBase
