import { Link, Outlet } from "react-router-dom"

import { useAuth } from "../context/AuthContext"



function FacilitatorLayout() {
  const { logout } = useAuth()



  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex">
      
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#111827] border-r border-white/10 p-6 flex flex-col">
        
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-wide">
            RMMC Voting
          </h1>

          <p className="text-sm text-blue-300 mt-1">
            Facilitator Portal
          </p>
        </div>



        <nav className="flex flex-col gap-2">
          
          <Link
            to="/facilitator/dashboard"
            className="px-4 py-3 rounded-xl hover:bg-blue-600/20 transition"
          >
            Dashboard
          </Link>



          <Link
            to="/facilitator/elections"
            className="px-4 py-3 rounded-xl hover:bg-blue-600/20 transition"
          >
            Elections
          </Link>



          <Link
            to="/facilitator/candidates"
            className="px-4 py-3 rounded-xl hover:bg-blue-600/20 transition"
          >
            Candidates
          </Link>



          <Link
            to="/facilitator/students"
            className="px-4 py-3 rounded-xl hover:bg-blue-600/20 transition"
          >
            Students
          </Link>



          <Link
            to="/facilitator/results"
            className="px-4 py-3 rounded-xl hover:bg-blue-600/20 transition"
          >
            Results
          </Link>
        </nav>



        <div className="mt-auto">
          <button
            onClick={logout}
            className="w-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 py-3 rounded-xl transition"
          >
            Logout
          </button>
        </div>
      </aside>



      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <Outlet />
      </main>
    </div>
  )
}



export default FacilitatorLayout