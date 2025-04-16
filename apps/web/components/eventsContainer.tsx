import { ApiError } from "@/lib/api"
import { EventsI } from "@/lib/schemas"
import { UseQueryResult } from "@tanstack/react-query"
import { SyncLoader } from "react-spinners"
import EventsCards from "./eventsCards"

interface EventsProps {
  eventsQuery: UseQueryResult<EventsI, ApiError>
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
      <main className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5 p-5">
        <EventsCards events={eventsQuery.data.events} />
      </main>
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
