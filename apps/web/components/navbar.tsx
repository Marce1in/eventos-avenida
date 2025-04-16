import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { logout } from "@/lib/utils"

function Navbar() {
  const router = useRouter()

  return (
    <>
      <nav className="bg-foreground p-2.5 flex justify-between items-center">
        <a
          className="text-primary-foreground text-xl"
          onClick={() => router.push("")}
        >
          Eventos Avenida
        </a>
        <Button variant={"secondary"} onClick={() => logout()}>Sair</Button>
      </nav>
    </>
  )
}

export default Navbar
