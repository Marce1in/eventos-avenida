'use client'
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks";

function home() {
  useAuth()


  return (
    <>
      <Button>fooo</Button>
    </>
  )
}

export default home;
