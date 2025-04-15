"use client"

import { useMutation } from "@tanstack/react-query"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { z } from "zod"
import api, { ApiError } from "@/lib/api"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { SyncLoader } from "react-spinners"
import { useRouter } from "next/navigation"

const verifyMailSchema = z.object({
  otp: z.string().length(6, "O código de segurança precisa ter 6 digitos")
})

type verifyMailType = z.infer<typeof verifyMailSchema>

interface verifyMailResponse {
  message: string
}

function MailVerification() {
  const router = useRouter()

  const verifyMail = useMutation<verifyMailResponse, ApiError, verifyMailType>({
    mutationFn: (data) => api.post(`user/register/${data.otp}`),
    onSuccess: (data) => {
      toast.success(data.message)
      router.push("/login")
    },
  })

  const form = useForm<verifyMailType>({
    resolver: zodResolver(verifyMailSchema),
    defaultValues: {
      otp: ""
    }
  })

  function onSubmit(values: verifyMailType) {
    verifyMail.mutate(values)
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <main className="w-96 rounded border border-border shadow pt-10 pb-5 px-10">
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

            {verifyMail.isError && (
              <p className="text-red-500 text-sm font-semibold text-center">
                  {verifyMail.error.message}
              </p>
            )}

          </form>
        </Form>
      </main>
    </div>
  )
}

export default MailVerification
