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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { SyncLoader } from "react-spinners";
import axiosBase from "@/lib/api";
import { useRouter } from "next/navigation";

const deleteEventSchema = z.object({});
type DeleteEventFormType = z.infer<typeof deleteEventSchema>;

interface DeleteEventFormProps {
  eventId: string;
}

function DeleteEventForm({ eventId }: DeleteEventFormProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteEvent = useMutation({
    mutationFn: () => axiosBase.delete(`events/${eventId}`),
    onSuccess: () => {
      toast.success("Evento deletado com sucesso!");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["events", "event"] });
      router.push("/")
    },
    onError: (error) => {
      toast.error(`Ops! algo deu errado ${error.message}`);
    },
  });

  const form = useForm<DeleteEventFormType>({
    resolver: zodResolver(deleteEventSchema),
    defaultValues: {},
  });

  function handleDelete() {
    deleteEvent.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="flex items-center">
          <Trash2 className="mr-2 h-4 w-4" /> Deletar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Deleção</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleDelete)}>
            <p className="mb-4 text-destructive">Tem certeza que deseja deletar este evento? Esta ação não pode ser desfeita.</p>
            <DialogFooter>
              <Button type="submit" variant="destructive">
                {deleteEvent.isPending ? <SyncLoader color="#ffffff" size={5} /> : "Deletar"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={deleteEvent.isPending}>
                Cancelar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteEventForm
