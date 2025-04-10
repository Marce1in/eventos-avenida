'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const registerSchema = z.object({
  name: z.string().min(1, "O usuário precisa de um nome").max(64, "O nome não pode ser maior que 64 letras"),
  email: z.string().email("Email Inválido"),
  passwd: z.string().min(4, "Senha deve ter mais que 4 letras"),
})

type registerType = z.infer<typeof registerSchema>

function Login() {

  const form = useForm<registerType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      passwd: "",
    }
  })

  function onSubmit(values: registerType) {
    console.log(values)
  }

  return (
    <main className="w-96 mt-[30vh] mx-auto rounded border border-accent-fore pt-10 pb-5 px-10">
      <h1 className="text-center pb-5 font-extrabold text-2xl">Registro</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
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

          <Button type="submit" className="w-full">
            Criar
          </Button>
        </form>
      </Form>
      <p className="text-right text-sm pt-5">Já tem uma conta? {" "}
        <Link href="/login" className="hover:underline font-bold">Faça login</Link>
      </p>
    </main>
  )
}

export default Login
