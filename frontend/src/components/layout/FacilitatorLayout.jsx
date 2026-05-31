import { logout } from "../../api/auth"



function FacilitatorLayout({ children, onLogout }) {



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
          
          <button
            className="px-4 py-3 rounded-xl hover:bg-blue-600/20 transition text-left"
          >
            Dashboard
          </button>



          <button
            className="px-4 py-3 rounded-xl hover:bg-blue-600/20 transition text-left"
          >
            Elections
          </button>



          <button
            className="px-4 py-3 rounded-xl hover:bg-blue-600/20 transition text-left"
          >
            Party Lists
          </button>



          <button
            className="px-4 py-3 rounded-xl hover:bg-blue-600/20 transition text-left"
          >
            Students
          </button>



          <button
            className="px-4 py-3 rounded-xl hover:bg-blue-600/20 transition text-left"
          >
            Results
          </button>
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