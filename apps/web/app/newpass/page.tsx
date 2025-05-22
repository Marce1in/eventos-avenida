'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import api, { ApiError } from "@/lib/api"
import { toast } from "sonner"
import { SyncLoader } from "react-spinners"
import { useRouter } from "next/navigation"

const resetPasswordSchema = z.object({
    token: z.string().nonempty("Token é obrigatório"),
    newPasswd: z.string().min(4, "Senha deve ter mais que 4 letras"),
    confirmPassword: z.string().min(4, "Senha deve ter mais que 4 letras"),
}).refine(data => data.newPasswd === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["newPasswd"],
})

type ResetPasswordType = z.infer<typeof resetPasswordSchema>

function ResetPassword() {
    const router = useRouter()

    const resetPasswordMutation = useMutation<void, ApiError, ResetPasswordType>({
        mutationFn: (data) => api.patch(`user/change-pass`, {
            otp: data.token,
            newPasswd: data.newPasswd
        }),

        onSuccess: (data) => {
            toast.success("Senha alterada com sucesso")
            router.push("/login")
        },
    })

    const form = useForm<ResetPasswordType>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token: "",
            newPasswd: "",
            confirmPassword: "",
        }
    })

    function onSubmit(values: ResetPasswordType) {
        resetPasswordMutation.mutate(values)
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <main className="w-96 shadow rounded border border-border pt-10 pb-5 px-10">
                <h1 className="text-center pb-5 font-extrabold text-2xl">Alterar Senha</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

                        {/* Token Field */}
                        <FormField
                            control={form.control}
                            name="token"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Token</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Token recebido por e-mail" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* New Password Field */}
                        <FormField
                            control={form.control}
                            name="newPasswd"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nova Senha</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Nova Senha" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Confirm Password Field */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirmar Nova Senha</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Confirmar Nova Senha" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className={`w-full ${resetPasswordMutation.isError && "bg-red-500 hover:bg-red-600"}`}>
                            {resetPasswordMutation.isPending ? <SyncLoader color="#ffffff" size={5} /> : "Alterar Senha"}
                        </Button>

                        {resetPasswordMutation.isError && (
                            <p className="text-red-500 text-sm font-semibold text-center">
                                {resetPasswordMutation.error.message}
                            </p>
                        )}

                    </form>
                </Form>
            </main>
        </div>
    )
}

export default ResetPassword
