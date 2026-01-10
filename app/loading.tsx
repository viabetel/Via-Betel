export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-emerald-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-emerald-600 rounded-full animate-spin" />
        </div>
        <p className="text-emerald-700 font-medium">Carregando...</p>
      </div>
    </div>
  )
}
