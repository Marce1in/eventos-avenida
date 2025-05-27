'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAuth from "./loginContext";

export function useAuthGuard() {
  const { checkExpiration, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkExpiration()

    if (isLoading) return

    if (!isAuthenticated) {
      router.push("/login")
    } else {
      setLoading(false)
    }

  }, [isLoading, isAuthenticated])

  return loading
}
