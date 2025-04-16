import { SyncLoader } from "react-spinners";

function FullScreenLoading(){
  return(
    <div className="flex items-center justify-center h-screen">
      <SyncLoader />
    </div>
  )
}

export default FullScreenLoading
