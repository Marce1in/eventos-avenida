import { EventI } from "@/lib/schemas"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

interface pageProps {
  events: EventI[]
}

function EventsCards({ events }: pageProps) {
  const router = useRouter()

  if (events.length == 0) {
    return (
      <p>
        Nenhum evento encontrado :(
      </p>
    )
  }

  return events.map(event => (
    <Card key={event.id}>
      <CardHeader>
        <CardTitle>
          {event.name}
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <MapPin size={15} />{event.location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Dia {event.date} as {event.time.slice(0, 5)}</p>
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
