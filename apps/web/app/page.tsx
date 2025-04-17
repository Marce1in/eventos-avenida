'use client'
import CreateEventForm from "@/components/createEventForm";
import EventsContainer from "@/components/eventsContainer";
import Navbar from "@/components/navbar";
import SearchBar from "@/components/searchBar";
import withAuth from "@/components/withAuth";
import api, { ApiError } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";


function home() {
  const [query, setQuery] = useState("")

  const getEvents = useQuery<Event[], ApiError>({
    queryKey: ["events", query],
    queryFn: () => api.get("events")
  })

return (
    <>
      <Navbar />

      <div className="flex justify-between p-5">
        <SearchBar querySetter={setQuery}/>
        <CreateEventForm />
      </div>

      <EventsContainer eventsQuery={getEvents} />
    </>
  )
}

export default withAuth(home);
