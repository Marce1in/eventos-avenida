'use client'
import { ComponentType, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import FullScreenLoading from "./fullScreenLoading"

function withAuth(Component: ComponentType<any>) {
  return function ProtectedRoute(props: any) {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
      const token = localStorage.getItem("ACCESS_TOKEN")
      if (!token) {
        router.replace("/login")
      } else {
        setIsAuthorized(true)
      }
    }, [])

    if (!isAuthorized){
      return <FullScreenLoading />
    }

    return <Component {...props} />
  }
}

export default withAuth
