"use client"

import Image from "next/image"
import { Heart, MapPin, Star, Shield, Crown } from "lucide-react"
import { AppLink } from "@/components/app-link"
import { cn } from "@/lib/utils"

interface InstructorCardProps {
  instructor: {
    id: string
    name: string
    role: string
    city: string
    state: string
    neighborhood?: string
    price: string
    rating: string
    studentsApproved?: number
    photo?: string
    image?: string
    isSponsored?: boolean
    isVerified?: boolean
    planBadge?: "verificado" | "pro" | null
  }
  categories: string[]
  slug: string
  isFavorited: boolean
  onFavorite: () => void
  viewMode: "grid" | "list"
}

const PLAN_BADGES = {
  verificado: {
    label: "Verificado",
    icon: Shield,
    color: "text-emerald-700",
    bgColor: "bg-emerald-100",
  },
  pro: {
    label: "PRO",
    icon: Crown,
    color: "text-amber-700",
    bgColor: "bg-amber-100",
  },
}

export function InstructorCard({
  instructor,
  categories,
  slug,
  isFavorited,
  onFavorite,
  viewMode,
}: InstructorCardProps) {
  const price = instructor.price?.replace(/[^\d]/g, "") || "0"
  const rating = Number.parseFloat(instructor.rating || "0")
  const planBadge = instructor.planBadge ? PLAN_BADGES[instructor.planBadge] : null

  if (viewMode === "list") {
    return (
      <AppLink href={`/instrutores/${slug}`}>
        <div className="flex bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all overflow-hidden">
          <div className="relative w-32 h-24 flex-shrink-0">
            <Image
              src={instructor.photo || instructor.image || "/placeholder.svg?height=96&width=128&query=instructor"}
              alt={instructor.name}
              fill
              className="object-cover"
            />
            {instructor.isSponsored && (
              <div className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                Destaque
              </div>
            )}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onFavorite()
              }}
              className="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-full shadow-sm hover:scale-110 transition-transform"
            >
              <Heart className={cn("w-3.5 h-3.5", isFavorited ? "fill-red-500 text-red-500" : "text-gray-400")} />
            </button>
          </div>

          <div className="flex-1 p-2.5 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{instructor.name}</h3>
                    {planBadge && (
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-0.5",
                          planBadge.bgColor,
                          planBadge.color,
                        )}
                      >
                        <planBadge.icon className="w-2.5 h-2.5" />
                        {planBadge.label}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-0.5 mt-0.5">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">
                      {instructor.city}/{instructor.state}
                    </span>
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-emerald-700">R$ {price}</div>
                  <div className="text-[10px] text-gray-500">por aula</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-1.5">
              <div className="flex items-center gap-1.5">
                {categories.slice(0, 2).map((cat) => (
                  <span
                    key={cat}
                    className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-medium rounded"
                  >
                    {cat}
                  </span>
                ))}
                {instructor.isVerified && !planBadge && <Shield className="w-3 h-3 text-emerald-600" />}
              </div>
              <div className="flex items-center gap-0.5 text-xs text-amber-600">
                <Star className="w-3 h-3 fill-current" />
                <span className="font-medium">{rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </AppLink>
    )
  }

  // Grid view - compacto
  return (
    <AppLink href={`/instrutores/${slug}`}>
      <div className="bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all overflow-hidden group">
        <div className="relative h-28">
          <Image
            src={instructor.photo || instructor.image || "/placeholder.svg?height=112&width=192&query=instructor"}
            alt={instructor.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {instructor.isSponsored && (
            <div className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              Destaque
            </div>
          )}
          {planBadge && (
            <div
              className={cn(
                "absolute top-1.5 right-8 px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-0.5",
                planBadge.bgColor,
                planBadge.color,
              )}
            >
              <planBadge.icon className="w-2.5 h-2.5" />
              {planBadge.label}
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onFavorite()
            }}
            className="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-full shadow-sm hover:scale-110 transition-transform"
          >
            <Heart className={cn("w-3.5 h-3.5", isFavorited ? "fill-red-500 text-red-500" : "text-gray-400")} />
          </button>
        </div>

        <div className="p-2.5 space-y-1.5">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 truncate">{instructor.name}</h3>
            <p className="text-xs text-gray-500 flex items-center gap-0.5">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">
                {instructor.city}/{instructor.state}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {categories.slice(0, 3).map((cat) => (
              <span key={cat} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-medium rounded">
                {cat}
              </span>
            ))}
            {instructor.isVerified && !planBadge && <Shield className="w-3 h-3 text-emerald-600" />}
          </div>

          <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
            <div className="flex items-center gap-0.5 text-xs text-amber-600">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-medium">{rating.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-sm font-bold text-emerald-700">R$ {price}</span>
              <span className="text-[10px] text-gray-500">/aula</span>
            </div>
          </div>
        </div>
      </div>
    </AppLink>
  )
}
