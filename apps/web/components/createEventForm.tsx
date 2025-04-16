import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import api, { ApiError } from "@/lib/api";

const createEventFormSchema = z.object({
  name: z.
    string()
    .min(1, "Nome é obrigatório")
    .max(128, "O evento não pode ter um nome maior que 128 letras"),
  description: z.string()
    .min(1, "Descrição é obrigatória")
    .max(512, "Descrição não pode ser maior que 512 letras"),
  location: z
    .string()
    .min(1, "O evento deve ter uma localização")
    .max(64, "O evento não pode ser maior que 64 letras"),
  time: z
    .string()
    .transform(time => `${time}:00`).pipe(z
      .string()
      .time()
    ),
  date: z
    .string()
    .date("Data inválida"),
})

type CreateEventFormType = z.infer<typeof createEventFormSchema>

function CreateEventForm() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<CreateEventFormType>({
    resolver: zodResolver(createEventFormSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      time: "",
      date: "",
    },
  });
  const createEvent = useMutation<null, ApiError, CreateEventFormType>({
    mutationFn: (data) => api.post("events", data),
    onSuccess: () => {
      toast.success("Evento criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error) => {
      toast.error(`Ops! algo deu errado ${error.message}`);
    },
  });

  function handleSubmit(data: CreateEventFormType) {
    console.log(data)
    createEvent.mutate(data);
    if (createEvent.isSuccess) {
      setOpen(false);
      form.reset();
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default">Criar Evento</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criador de Eventos</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <div className="flex justify-around">

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>

              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Criar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateEventForm
