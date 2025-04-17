import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { logout } from "@/lib/utils"
import Link from "next/link"

function Navbar() {
  return (
    <>
      <nav className="bg-foreground p-2.5 flex justify-between items-center">
        <Link
          className="text-primary-foreground text-xl"
          href={"/"}
        >
          Eventos Avenida
        </Link>
        <Button variant={"secondary"} onClick={() => logout()}>Sair</Button>
      </nav>
    </>
  )
}

export default Navbar
