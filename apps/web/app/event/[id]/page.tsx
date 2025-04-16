'use client'

import Navbar from "@/components/navbar";
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

function EventPage({params}: PageProps) {
  const { id } = use(params)

  return (
    <>
      <Navbar />
      {id}
    </>
  )
}

export default EventPage
