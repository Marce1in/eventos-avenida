'use client'
import { ComponentType, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import FullScreenLoading from "./fullScreenLoading"
import * as jose from 'jose'

function withAuth(Component: ComponentType<any>) {
  return function ProtectedRoute(props: any) {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
      const token = localStorage.getItem("ACCESS_TOKEN")
      if (!token) {
        router.replace("/login")
        return
      }
      const decodedToken = jose.decodeJwt(token)

      if (decodedToken.exp && Date.now() > decodedToken.exp * 1000) {
        router.replace("/login")
        localStorage.removeItem("ACCESS_TOKEN")
        return
      }

      setIsAuthorized(true)
    }, [])

    if (!isAuthorized) {
      return <FullScreenLoading />
    }

    return <Component {...props} />
  }
}

export default withAuth
