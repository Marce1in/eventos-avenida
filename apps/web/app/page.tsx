'use client'
import CreateEventForm from "@/components/createEventForm";
import EventsContainer from "@/components/eventsContainer";
import Navbar from "@/components/navbar";
import SearchBar from "@/components/searchBar";
import withAuth from "@/components/withAuth";
import { ApiError } from "@/lib/api";
import { EventsI } from "@/lib/schemas";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";


async function mockEvents(query: string): Promise<EventsI> {
  if (query) {
    console.log("TENHO UMA QUERY FRESQUINHA")
  } else {
    console.log("Não tenho uma query papai :(")
  }

  return new Promise(resolve => { setTimeout(() => resolve({ events: mockData }), 300) })
}

function home() {
  const [query, setQuery] = useState("")

  const getEvents = useQuery<EventsI, ApiError>({
    queryKey: ["events", query],
    queryFn: () => mockEvents(query)
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

const mockData = [
  {
    "id": "e1a1fdd1-1111-4bdf-baaa-111111111111",
    "name": "Tech Conference 2025",
    "date": "2025-06-15",
    "time": "09:00",
    "location": "San Francisco, CA",
    "description": "Annual tech conference covering AI, blockchain, and more.",
    "userId": "user-uuid-1"
  },
  {
    "id": "e1a1fdd1-2222-4bdf-baaa-222222222222",
    "name": "Startup Pitch Night",
    "date": "2025-05-20",
    "time": "18:00",
    "location": "New York, NY",
    "description": "Networking event for startup founders and investors.",
    "userId": "user-uuid-2"
  },
  {
    "id": "e1a1fdd1-3333-4bdf-baaa-333333333333",
    "name": "Frontend Dev Meetup",
    "date": "2025-04-28",
    "time": "19:00",
    "location": "Berlin, Germany",
    "description": "Monthly meetup to discuss the latest in frontend tech.",
    "userId": "user-uuid-3"
  },
  {
    "id": "e1a1fdd1-4444-4bdf-baaa-444444444444",
    "name": "React Native Workshop",
    "date": "2025-07-10",
    "time": "10:00",
    "location": "Toronto, Canada",
    "description": "Hands-on workshop for building apps with React Native.",
    "userId": "user-uuid-1"
  },
  {
    "id": "e1a1fdd1-5555-4bdf-baaa-555555555555",
    "name": "Cybersecurity Summit",
    "date": "2025-09-12",
    "time": "08:30",
    "location": "London, UK",
    "description": "Talks and panels on security trends and best practices.",
    "userId": "user-uuid-4"
  },
  {
    "id": "e1a1fdd1-6666-4bdf-baaa-666666666666",
    "name": "Cloud Native Days",
    "date": "2025-08-01",
    "time": "11:00",
    "location": "Amsterdam, Netherlands",
    "description": "Conference focused on Kubernetes, containers, and DevOps.",
    "userId": "user-uuid-2"
  },
  {
    "id": "e1a1fdd1-7777-4bdf-baaa-777777777777",
    "name": "Product Design Sprint",
    "date": "2025-06-03",
    "time": "14:00",
    "location": "Austin, TX",
    "description": "Collaborative sprint to rapidly prototype product ideas.",
    "userId": "user-uuid-3"
  },
  {
    "id": "e1a1fdd1-8888-4bdf-baaa-888888888888",
    "name": "Hackathon Weekend",
    "date": "2025-05-05",
    "time": "17:00",
    "location": "Remote",
    "description": "48-hour hackathon for coders and designers.",
    "userId": "user-uuid-4"
  },
  {
    "id": "e1a1fdd1-9999-4bdf-baaa-999999999999",
    "name": "AI for Good",
    "date": "2025-07-20",
    "time": "13:00",
    "location": "Geneva, Switzerland",
    "description": "Exploring ethical uses of AI in solving global challenges.",
    "userId": "user-uuid-5"
  },
  {
    "id": "e1a1fdd1-aaaa-4bdf-baaa-aaaaaaaaaaaa",
    "name": "DevOps Bootcamp",
    "date": "2025-08-18",
    "time": "15:00",
    "location": "Seattle, WA",
    "description": "Beginner-friendly bootcamp on DevOps tools and practices.",
    "userId": "user-uuid-1"
  }
]
