export default function ChatLoading() {
  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar skeleton */}
      <div className="w-80 lg:w-96 border-r bg-white flex-shrink-0">
        <div className="p-4 border-b bg-gradient-to-r from-emerald-600 to-teal-600 h-32 animate-pulse"></div>
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main skeleton */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando chat...</p>
        </div>
      </div>
    </div>
  )
}
