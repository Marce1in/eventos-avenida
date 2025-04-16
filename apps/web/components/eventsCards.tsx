import { EventsI } from "@/lib/schemas"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

function EventsCards({ events }: EventsI) {
  const router = useRouter()

  return events.map(event => (
    <Card key={event.id}>
      <CardHeader>
        <CardTitle>
          {event.name}
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
            <MapPin size={15}/>{event.location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Dia {event.date} as {event.time}</p>
      </CardContent>
      <CardFooter>
        <Button
          variant={"outline"}
          onClick={() => router.push(`/event/${event.id}`)}
        >
          Expandir
        </Button>
      </CardFooter>
    </Card>
  ))
}

export default EventsCards
