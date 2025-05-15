'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import api from "@/lib/api"
import { toast } from "sonner"
import { SyncLoader } from "react-spinners"

const passEmailReq = z.object({
    email: z.string().email("Email Inválido"),
})

const NewPassRequest = () => {
    const form = useForm({
        resolver: zodResolver(passEmailReq),
        defaultValues: { email: "" },
    })

    const requestPasswordReset = useMutation({
        mutationFn: async (data: { email: string }) => {
            await api.post("/password-reset", data)
        },
        onSuccess: () => {
            toast.success("Solicitação enviada com sucesso!")
            form.reset()
            window.location.href = "/newpass"
        },
        onError: () => {
            toast.error("Erro ao enviar solicitação.")
        },
    })

    const onSubmit = (data: { email: string }) => {
        requestPasswordReset.mutate(data)
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <main className="w-96 shadow rounded border border-border pt-10 pb-5 px-10">
                <h1 className="text-center pb-5 font-extrabold text-2xl">Recuperar Senha</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="E-mail" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            {requestPasswordReset.isPending ? <SyncLoader color="#ffffff" size={5} /> : "Enviar"}
                        </Button>
                    </form>
                </Form>
            </main>
        </div>
    )
}

export default NewPassRequest
