'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import api from "@/lib/api"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { SyncLoader } from "react-spinners"
import { toast } from "sonner"

const registerSchema = z
  .object({
    name: z.string().min(1, "O usuário precisa de um nome").max(64, "O nome não pode ser maior que 64 letras"),
    email: z.string().email("Email Inválido"),
    passwd: z.string().min(4, "Senha deve ter mais que 4 letras"),
    passconf: z.string().min(1, "Confirme sua senha"),
  })
  .refine(({ passwd, passconf }) => passwd === passconf, {
    message: "Senhas não estão iguais",
    path: ["passconf"]
  })

type registerType = z.infer<typeof registerSchema>

function Register() {
  const router = useRouter()

  const registerUser = useMutation({
    mutationFn: (data: registerType) => api.post("user/register", data),
    onSuccess: () => {
      toast.error("Usuário registrado com sucesso!")
      router.push("/mail-verification")
    },
    onError: () => {
      toast.error("Ops! algo deu errado")
    }
  })

  const form = useForm<registerType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      passwd: "",
      passconf: "",
    }
  })

  function onSubmit(values: registerType) {
    registerUser.mutate(values)
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <main className="w-96 rounded border border-border shadow pt-10 pb-5 px-10">

        <h1 className="text-center pb-5 font-extrabold text-2xl">
          Registro
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

            {/* Fields */}

            <FormField control={form.control} name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="passconf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirme sua senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className={`w-full ${registerUser.isError && "bg-red-500 hover:bg-red-600"}`}>
              {registerUser.isPending ? <SyncLoader color="#ffffff" size={5} /> : "Criar"}
            </Button>
          </form>
        </Form>

        <p className="text-right text-sm pt-5">Já tem uma conta? {" "}
          <Link href="/login" className="hover:underline font-bold">Faça login</Link>
        </p>
      </main>
    </div>
  )
}

export default Register
