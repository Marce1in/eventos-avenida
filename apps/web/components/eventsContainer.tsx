import { ApiError } from "@/lib/api"
import { UseQueryResult } from "@tanstack/react-query"
import { SyncLoader } from "react-spinners"
import EventsCards from "./eventsCards"
import { Separator } from "./ui/separator"
import { EventI } from "@/lib/schemas"

interface EventsProps {
  eventsQuery: UseQueryResult<EventI[], ApiError>
}

function EventsContainer({ eventsQuery }: EventsProps) {
  if (eventsQuery.isError) {
    return (
      <p className="text-center text-destructive text-3xl pt-5">
        {eventsQuery.error.message}
      </p>
    )
  } else if (eventsQuery.isSuccess) {
    return (
      <>
        <h3 className="text-xl pl-2">Meus Eventos</h3>
        <Separator />
        <section className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5 p-5">
          <EventsCards
            events={(eventsQuery.data || []).filter((event) => event.isOwner)}
          />
        </section>

        <h3 className="text-xl pl-2">Eventos Participados</h3>
        <Separator />
        <section className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5 p-5">
          <EventsCards
            events={(eventsQuery.data || []).filter((event) => event.isParticipant)}
          />
        </section>

        <h3 className="text-xl pl-2">Eventos disponíveis</h3>
        <Separator />
        <section className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5 p-5">
          <EventsCards events={(eventsQuery.data || []).filter((event) => !event.isParticipant && !event.isOwner)} />
        </section>
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

export default EventsContainer
