"use client"

import dynamic from "next/dynamic"

const InstrutoresClient = dynamic(() => import("./instrutores-client"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-600">Carregando instrutores...</p>
      </div>
    </div>
  ),
})

export default function InstrutoresDynamic() {
  return <InstrutoresClient />
}
