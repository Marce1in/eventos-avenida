"use client"

import { useMutation } from "@tanstack/react-query"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { z } from "zod"
import api from "@/lib/api"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { SyncLoader } from "react-spinners"
import { useRouter } from "next/navigation"

const otpSchema = z.object({
  otp: z.string().length(6, "O código de segurança precisa ter 6 digitos")
})

type otpType = z.infer<typeof otpSchema>

function MailVerification() {
  const router = useRouter()

  const verifyMail = useMutation({
    mutationFn: (data: otpType) => api.post(`user/register/${data.otp}`),
    onSuccess: () => {
      toast.success("E-mail verificado com sucesso")
      router.push("/login")
    },
    onError: () => {
      toast.error("Ops, algo deu errado!")
    }
  })

  const form = useForm<otpType>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ""
    }
  })

  function onSubmit(values: otpType) {
    verifyMail.mutate(values)
  }

  return (
    <main className="w-96 mt-[30vh] mx-auto rounded border border-accent-fore pt-10 pb-5 px-10">
      <h1 className="font-bold text-xl">
        Código de verificação
      </h1>
      <p className="pb-5 font-light">
        Envimos um código de verificação para o seu E-mail! Por favor digite-o abaixo:
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <FormField control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} {...field}>

                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>

                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className={`w-min ${verifyMail.isError && "bg-red-500 hover:bg-red-600"}`}>
            {verifyMail.isPending ? <SyncLoader color="#ffffff" size={5} /> : "Verificar"}
          </Button>
        </form>
      </Form>
    </main>
  )
}

export default MailVerification
