'use client'
// src/app/dashboard/page.tsx
import { useState } from 'react'
import { FileText, Video, Link2, BookOpen, TrendingUp, Clock } from 'lucide-react'
import { useResources } from '@/hooks/useResources'
import ResourceCard from '@/components/resources/ResourceCard'
import ResourceCardSkeleton from '@/components/resources/ResourceCardSkeleton'
import { useAuth } from '@/hooks/useAuth'
import type { ResourceType } from '@/types'

const typeFilters: { label: string; value?: ResourceType; icon: any }[] = [
  { label: 'Todos', icon: BookOpen },
  { label: 'PDFs', value: 'PDF', icon: FileText },
  { label: 'Vídeos', value: 'VIDEO', icon: Video },
  { label: 'Links', value: 'LINK', icon: Link2 },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [activeType, setActiveType] = useState<ResourceType | undefined>()
  const { data: resources, loading, meta } = useResources({ type: activeType, limit: 12 })

  return (
    <div className="container-app py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title">
          Olá, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="mt-1 text-gray-500">
          Explore os materiais compartilhados pela comunidade acadêmica.
        </p>
      </div>

      {/* Stats rápidas */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Materiais', value: meta.total, icon: BookOpen, color: 'text-brand-600 bg-brand-50' },
          { label: 'Esta semana', value: 12, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
          { label: 'Mais vistos', value: 89, icon: Clock, color: 'text-purple-600 bg-purple-50' },
          { label: 'Disciplinas', value: 6, icon: BookOpen, color: 'text-amber-600 bg-amber-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4 flex items-center gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros por tipo */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        {typeFilters.map(({ label, value, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActiveType(value)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
              activeType === value
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Grid de recursos */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <ResourceCardSkeleton key={i} />)}
        </div>
      ) : resources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BookOpen className="mb-4 h-12 w-12 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-700">Nenhum material encontrado</h3>
          <p className="mt-1 text-sm text-gray-400">Seja o primeiro a compartilhar!</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-gray-400">
            Mostrando {resources.length} de {meta.total} materiais
          </p>
        </>
      )}
    </div>
  )
}
