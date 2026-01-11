export function LoadingState({ message = "Carregando..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-4" role="status" aria-live="polite">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-600 border-r-emerald-600 animate-spin" />
      </div>
      <p className="text-gray-600 text-center font-medium">{message}</p>
    </div>
  )
}
