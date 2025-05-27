'use client'

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import api, { ApiError } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Save } from "lucide-react"
import { useForm, UseFormReturn } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { SyncLoader } from "react-spinners"
import useAuth from "@/lib/loginContext"
import { useEffect } from "react"

const changeUserDataSchema = z
  .object({
    name: z.string().min(1, "O usuário precisa de um nome").max(64, "O nome não pode ser maior que 64 letras"),
    email: z.string().email("Email Inválido"),
    passwd: z.literal("").or(z.string().min(4, "Senha deve ter mais que 4 letras")),
    passconf: z.string(),
  })
  .refine(({ passwd, passconf }) => {
    if (passwd === "") {
      return true
    }

    return passwd === passconf
  }, {
    message: "Senhas não estão iguais",
    path: ["passconf"]
  })

type changeUserDataType = z.infer<typeof changeUserDataSchema>

interface changeUserDataResponse {
  message: string
}

interface getUserDataResponse {
  name: string
  email: string
}

function ChangeUserDataForm() {
  const { userId, logout } = useAuth()
  const queryClient = useQueryClient()

  const getUserData = useQuery<getUserDataResponse, ApiError>({
    queryKey: ["userData"],
    queryFn: () => api.get(`user/${userId}`),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const changeUserData = useMutation<changeUserDataResponse, ApiError, changeUserDataType>({
    mutationFn: (data) => api.patch("user/edit-user-info", data),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ["userData"] })
      logout()
    },
    onError: (data) => {
      toast.error(data.message)
    }
  })

  const form = useForm<changeUserDataType>({
    resolver: zodResolver(changeUserDataSchema),
    defaultValues: {
      name: "",
      email: "",
      passwd: "",
      passconf: "",
    }
  })

  useEffect(() => {
    if (getUserData.data) {
      form.reset({
        name: getUserData.data.name,
        email: getUserData.data.email,
        passwd: "",
        passconf: "",
      });
    }
  }, [getUserData.data, form]);

  function onSubmit(values: changeUserDataType) {
    changeUserData.mutate(values)
  }

  if (getUserData.isFetching) {
    return <div className="flex items-center justify-center"><SyncLoader /></div>
  }
  if (getUserData.isError) {
    return (
      <>
        <p className="text-2xl text-destructive">Ops! algo deu errado, tente recarregar a página.</p>
        <p className="text-2xl text-destructive">Erro: {getUserData.error.message}</p>
      </>
    )
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="pt-8">

          <FormField control={form.control} name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Separator className="my-5" />

          <FormField control={form.control} name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="E-mail" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <h3 className="text-xl font-semibold pt-5">Mudar senha</h3>
          <p className="text-base text-muted-foreground">Deixe em branco caso não queira mudar sua senha atual</p>

          <FormField control={form.control} name="passwd"
            render={({ field }) => (
              <FormItem className="my-5">
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField control={form.control} name="passconf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar nova senha</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex w-full justify-end pt-5">
            <Button type="submit" className="h-14">
              {changeUserData.isPending ?
                <SyncLoader color="#ffffff" size={5} /> :
                <>
                  <Save className="mr-1 h-4 w-4" /> Salvar Alterações
                </>
              }
            </Button>
          </div>

        </form>
      </Form>
    </>
  )
}

export default ChangeUserDataForm
