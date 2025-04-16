'use client'
import Navbar from "@/components/navbar";
import withAuth from "@/components/withAuth";


function home() {

  return (
    <>
      <Navbar />
      <Events />
    </>
  )
}

export default withAuth(home);
