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
import { z } from "zod";
import type { EventI } from "@/lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Edit } from "lucide-react";
import { SyncLoader } from "react-spinners";

const editEventFormSchema = z.object({
  name: z
    .string()
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
});

type EditEventFormType = z.infer<typeof editEventFormSchema>;

interface EditEventFormProps {
  event: EventI;
}

function EditEventForm({ event }: EditEventFormProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<EditEventFormType>({
    resolver: zodResolver(editEventFormSchema),
    defaultValues: {
      name: event.name,
      description: event.description,
      location: event.location,
      time: event.time,
      date: event.date,
    },
  });

  // Mock mutation function for updating event
  function mockUpdateEvent(data: EditEventFormType) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...data, id: event.id }), 800);
    });
  }

  const editEvent = useMutation({
    mutationFn: mockUpdateEvent,
    onSuccess: () => {
      toast.success("Evento atualizado com sucesso!");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["event"] });
    },
    onError: (error) => {
      toast.error(`Ops! algo deu errado ${error.message}`);
    },
  });

  function handleSubmit(data: EditEventFormType) {
    editEvent.mutate(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center">
          <Edit className="mr-2 h-4 w-4" /> Update
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Evento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
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
            />
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
            />
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
              />
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
              />
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={editEvent.isPending}>
                {editEvent.isPending ? <SyncLoader color="#ffffff" size={5} /> : "Editar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditEventForm
