import { ComponentType } from "react"
import RedirectComponent from "./redirectComponent"

function withAuth(Component: ComponentType<any>) {
  return function ProtectedRoute(props: any) {
    if (typeof window === 'undefined') {
      return (
        <RedirectComponent path="/login" message="Usuário deslogado!" />
      )
    }

    const token = localStorage.getItem("ACCESS_TOKEN")
    if (!token) {
      return (
        <RedirectComponent path="/login" message="Usuário deslogado!" />
      )
    }
    return <Component {...props} />
  }
}

export default withAuth
