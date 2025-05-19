import { useRouter } from "next/navigation"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { User } from "lucide-react"
import useAuth from "@/lib/loginContext"

function Navbar() {
  const router = useRouter()
  const { logout } = useAuth()

  return (
    <>
      <nav className="bg-foreground p-2.5 flex justify-between items-center">
        <Link
          className="text-primary-foreground text-xl"
          href={"/"}
        >
          Eventos Avenida
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="border-background border-2 rounded-full cursor-pointer">
            <User color="#FFFFFF" size={30} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Bem-vindo</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>Perfil</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { logout(); router.push("/login") }}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </>
  )
}

export default Navbar
