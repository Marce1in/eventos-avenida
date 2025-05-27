'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import api, { ApiError } from "@/lib/api"
import { toast } from "sonner"
import { SyncLoader } from "react-spinners"
import useAuth from "@/lib/loginContext"

const loginSchema = z.object({
  email: z.string().email("Email Inválido"),
  passwd: z.string().min(4, "Senha deve ter mais que 4 letras"),
})

type loginType = z.infer<typeof loginSchema>

interface loginResponse {
  message: string
  access_token: string
}

function Login() {
  const router = useRouter()
  const { login } = useAuth()

  const loginUser = useMutation<loginResponse, ApiError, loginType>({
    mutationFn: (data) => api.post("auth/login", data),
    onSuccess: (data) => {
      login(data.access_token)
      toast.success("Usuário logado com sucesso")
      router.push("/")
    },
  })

  const form = useForm<loginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      passwd: "",
    }
  })

  function onSubmit(values: loginType) {
    loginUser.mutate(values)
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <main className="w-96 shadow rounded border border-border pt-10 pb-5 px-10">
        <h1 className="text-center pb-5 font-extrabold text-2xl">Login</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

            {/* Fields */}

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

            <FormField
              control={form.control}
              name="passwd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className={`w-full ${loginUser.isError && "bg-red-500 hover:bg-red-600"}`}>
              {loginUser.isPending ? <SyncLoader color="#ffffff" size={5} /> : "Entrar"}
            </Button>

            {loginUser.isError && (
              <p className="text-red-500 text-sm font-semibold text-center">
                {loginUser.error.message}
              </p>
            )}

          </form>
        </Form>
        <p className="text-right text-sm pt-5">Não tem uma conta? {" "}
          <Link href="/register" className="hover:underline font-bold">Registre-se</Link>
        </p>
        <p className="text-right text-sm pt-5">Esqueceu sua senha? {" "}
          <Link href="/newpassreq" className="hover:underline font-bold">Recuperar</Link>
        </p>
      </main>
    </div>
  )
}

export default Login
