'use client'

import DeleteEventForm from "@/components/deleteEventForm";
import EditEventForm from "@/components/editEventForm";
import Navbar from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import withAuth from "@/components/withAuth";
import api, { ApiError } from "@/lib/api";
import { EventI } from "@/lib/schemas";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, MapPin } from "lucide-react";
import { use } from "react";
import { SyncLoader } from "react-spinners";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface EventPageQueryI extends EventI {
  is_owner: boolean
}

function EventPage({ params }: PageProps) {
  const { id } = use(params)

  const getEvent = useQuery<EventPageQueryI, ApiError>({
    queryKey: ["event"],
    queryFn: () => api.get(`events/${id}`)
  })


  if (getEvent.isError) {
    return (
      <p className="text-center text-destructive text-3xl pt-5">
        {getEvent.error.message}
      </p>
    )
  } else if (getEvent.isSuccess) {
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
                  </ul>
                </CardContent>
              </Card>

              {getEvent.data.is_owner && (
                <div className="flex space-x-4 mt-6">
                  <DeleteEventForm eventId={getEvent.data.id} />
                  <EditEventForm event={getEvent.data} />
                </div>
              )}
            </div>
        </main>
      </>
    )
  } else {
    return (
      <div className="flex justify-center items-center pt-[50vh]">
        <SyncLoader />
      </div>
    )
  }
}

export default withAuth(EventPage)
