import type React from "react"
import { AlertCircle } from "lucide-react"

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
}

export function EmptyState({
  title = "Nenhum resultado encontrado",
  description = "Tente ajustar seus filtros ou pesquisa",
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-4 text-center px-4">
      {icon || <AlertCircle className="w-12 h-12 text-gray-400" />}
      <div>
        <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>
    </div>
  )
}
