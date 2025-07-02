import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Importe o Button
import { User, X, Loader2 } from "lucide-react"; // Importe o X e o ícone de loading
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Importe os hooks
import api, { ApiError } from "@/lib/api"; // Importe sua instância da API e o tipo de erro
import { toast } from "sonner"; // Para notificações

interface Participant {
  id: string;
  name: string;
}

// Atualize as Props para incluir o eventId
interface ParticipantListProps {
  participants: Participant[];
  eventId: string;
}

// Interface para os dados da mutação
interface RemoveParticipantData {
  eventId: string;
  userId: string;
}

export default function ParticipantList({ participants, eventId }: ParticipantListProps) {
  const queryClient = useQueryClient();

  const removeParticipantMutation = useMutation<any, ApiError, RemoveParticipantData>({
    mutationFn: (data) => api.delete(`events/${data.eventId}/participants/${data.userId}`),
    onSuccess: (data) => {
      toast.success(data.message || "Participante removido com sucesso!");
      // Invalida a query do evento para forçar a atualização da lista na tela
      queryClient.invalidateQueries({ queryKey: ["event"] });
    },
    onError: (error) => {
      toast.error(error.message || "Falha ao remover participante.");
    },
  });

  const handleRemove = (userId: string) => {
    removeParticipantMutation.mutate({ eventId, userId });
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Inscritos no Evento</CardTitle>
      </CardHeader>
      <CardContent>
        {participants && participants.length > 0 ? (
          <ul className="space-y-3">
            {participants.map((participant) => (
              <li key={participant.id} className="flex items-center justify-between text-slate-800">
                <div className="flex items-center">
                  <User className="mr-3 h-5 w-5 text-slate-500" />
                  <span>{participant.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(participant.id)}
                  // Desabilita o botão enquanto uma remoção está em andamento
                  disabled={removeParticipantMutation.isPending}
                >
                  {/* Mostra um spinner APENAS no item que está sendo removido */}
                  {removeParticipantMutation.isPending && removeParticipantMutation.variables?.userId === participant.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-600">Ninguém se inscreveu neste evento ainda.</p>
        )}
      </CardContent>
    </Card>
  );
}