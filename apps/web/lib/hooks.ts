'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function useAuth(){
  const router = useRouter()

  useEffect(() => {

    if (!localStorage.getItem("ACCESS_TOKEN")) {
      toast.error("Usuário deslogado")
      router.push("/login")
    }
  },[])
}
