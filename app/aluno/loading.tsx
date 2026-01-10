export default function AlunoLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-emerald-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-emerald-600 rounded-full animate-spin" />
          </div>
          <p className="text-emerald-700 font-medium text-lg">Carregando formulário...</p>
        </div>
      </div>
    </div>
  )
}
