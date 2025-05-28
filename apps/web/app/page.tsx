'use client'
import CreateEventForm from "@/components/createEventForm";
import EventsContainer from "@/components/eventsContainer";
import FullScreenLoading from "@/components/fullScreenLoading";
import Navbar from "@/components/navbar";
import SearchBar from "@/components/searchBar";
import api, { ApiError } from "@/lib/api";
import { useAuthGuard } from "@/lib/hooks";
import { EventI } from "@/lib/schemas";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";


function home() {
  const isLoading = useAuthGuard()

  const [query, setQuery] = useState("")

  const getEvents = useQuery<EventI[], ApiError>({
    queryKey: ["events", query],
    queryFn: () => api.get(`events?q=${query}`)
  })

  if (isLoading)
    return <FullScreenLoading />

  return (
    <>
      <Navbar />

      <div className="flex justify-between p-5">
        <SearchBar querySetter={setQuery} />
        <CreateEventForm />
      </div>

      <EventsContainer eventsQuery={getEvents} />
    </>
  )
}

export default home;
