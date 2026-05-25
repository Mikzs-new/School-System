function StudentLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-blue-900 text-white p-5">
          <h1 className="text-2xl font-bold">
            Student Portal
          </h1>
        </aside>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default StudentLayout