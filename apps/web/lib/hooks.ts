'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAuth from "./loginContext";

export function useAuthGuard() {
  const { checkExpiration, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkExpiration()

    if (!isAuthenticated) {
      router.push("/login")
    } else {
      setLoading(false)
    }

  }, [isAuthenticated])

  return loading
}
