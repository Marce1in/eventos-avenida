'use client'

import FullScreenLoading from "@/components/fullScreenLoading"
import { useMutation } from "@tanstack/react-query"
import { use, useEffect } from "react"
import api, { ApiError } from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface PageProps {
    params: Promise<{ token: string }>
}

interface verifyMailChangeResponse {
    message: ""
}

function MailChangeVerification({ params }: PageProps) {
    const { token } = use(params)
    const router = useRouter()

    const verifyMailChange = useMutation<verifyMailChangeResponse, ApiError, string>({
        mutationFn: (token) => api.post(`user/edit-user-info/${token}`),
        onSuccess: (data) => {
            toast.success(data.message)
            router.push("/login")
        },
        onError: (data) => {
            toast.error(data.message)
            router.push("/login")
        }
    })

    useEffect(() => {
        verifyMailChange.mutate(token)
    }, [])

    return (
        <FullScreenLoading />
    )

}
export default MailChangeVerification
