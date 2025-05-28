'use client'

import DeleteEventForm from "@/components/deleteEventForm";
import EditEventForm from "@/components/editEventForm";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import api, { ApiError } from "@/lib/api";
import { useAuthGuard } from "@/lib/hooks";
import { EventI } from "@/lib/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Check, Clock, MapPin, PersonStandingIcon, X } from "lucide-react";
import { use } from "react";
import { SyncLoader } from "react-spinners";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface EventPageQueryI extends EventI {
  is_owner: boolean
  is_assignee: string
  total_participants: number
}

interface enterEventResponse {
  message: string
}

function EventPage({ params }: PageProps) {
  const loading = useAuthGuard()
  const { id } = use(params)
  const queryClient = useQueryClient()

  const getEvent = useQuery<EventPageQueryI, ApiError>({
    queryKey: ["event"],
    queryFn: () => api.get(`events/${id}`)
  })

  const enterEvent = useMutation<enterEventResponse, ApiError, string>({
    mutationFn: (eventId) => api.post(`events/assign/${eventId}`),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({
        queryKey: ["event"]
      })
    }
  })

  const leaveEvent = useMutation<enterEventResponse, ApiError, string>({
    mutationFn: (eventId) => api.delete(`events/assign/${eventId}`),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({
        queryKey: ["event"]
      })
    }
  })

  function assignUser(eventId: string) {
    enterEvent.mutate(eventId)
  }

  function unassignUser(eventId: string) {
    leaveEvent.mutate(eventId)
  }

  if (getEvent.isLoading || loading)
    return (
      <div className="flex justify-center items-center pt-[50vh]">
        <SyncLoader />
      </div>
    )

  if (getEvent.isError)
    return (
      <p className="text-center text-destructive text-3xl pt-5">
        {getEvent.error.message}
      </p>
    )

  if (getEvent.isSuccess)
    return (
      <>
        <Navbar />
        <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="p-8">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-slate-800">
                {getEvent.data.name}
              </h1>
            </div>

            <Separator className="my-6" />

            <p className="text-xl text-slate-600 mb-8">
              {getEvent.data.description}
            </p>

            <Card className="mb-8">
              <CardContent className="p-3">
                <ul className="space-y-4">
                  <li className="flex items-center text-slate-700 ">
                    <MapPin className="mr-3 h-5 w-5 text-slate-500" />
                    <span>{getEvent.data.location}</span>
                  </li>
                  <li className="flex items-center text-slate-700 ">
                    <Calendar className="mr-3 h-5 w-5 text-slate-500" />
                    <span>{getEvent.data.date}</span>
                  </li>
                  <li className="flex items-center text-slate-700">
                    <Clock className="mr-3 h-5 w-5 text-slate-500" />
                    <span>{getEvent.data.time.slice(0, 5)}</span>
                  </li>
                  <li className="flex items-center text-slate-700">
                    <PersonStandingIcon className="mr-3 h-5 w-5 text-slate-500" />
                    <span>{getEvent.data.total_participants}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex space-x-4 mt-6">
              {getEvent.data.is_assignee ?
                <Button
                  variant="destructive"
                  className="flex items-center w-20"
                  onClick={() => unassignUser(id)}>
                  {leaveEvent.isPending ?
                    <SyncLoader color="#ffffff" size={5} /> :
                    <>
                      <X className="mr-2 h-4 w-4" /> Sair
                    </>
                  }
                </Button>
                :
                <Button
                  variant="outline"
                  className="flex items-center w-32"
                  onClick={() => assignUser(id)}>
                  {enterEvent.isPending ?
                    <SyncLoader size={5} /> :
                    <>
                      <Check className="mr-2 h-4 w-4" /> Participar
                    </>
                  }
                </Button>
              }
              {getEvent.data.is_owner && (
                <>
                  <EditEventForm event={getEvent.data} />
                  <DeleteEventForm eventId={getEvent.data.id} />
                </>
              )}
            </div>
          </div>
        </main>
      </>
    )
}

export default EventPage
