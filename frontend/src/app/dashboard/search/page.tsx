'use client'
// src/app/dashboard/search/page.tsx
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useSearch } from '@/hooks/useResources'
import ResourceCard from '@/components/resources/ResourceCard'
import ResourceCardSkeleton from '@/components/resources/ResourceCardSkeleton'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [input, setInput] = useState(searchParams.get('q') || '')
  const [type, setType] = useState('')

  const { data, meta, loading } = useSearch(query, { type: type || undefined })

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setQuery(input)
    router.push(`/dashboard/search?q=${encodeURIComponent(input)}`, { scroll: false })
  }

  return (
    <div className="container-app py-8">
      <div className="mb-8">
        <h1 className="page-title mb-4">Buscar materiais</h1>

        {/* Search input */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Busque por título, disciplina, tag..."
              className="input pl-10 py-3 text-base"
            />
          </div>
          <button type="submit" className="btn-primary px-6">
            Buscar
          </button>
        </form>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex items-center gap-3">
        <SlidersHorizontal className="h-4 w-4 text-gray-400" />
        <div className="flex gap-2 overflow-x-auto">
          {[
            { label: 'Todos', value: '' },
            { label: 'PDF', value: 'PDF' },
            { label: 'Vídeo', value: 'VIDEO' },
            { label: 'Link', value: 'LINK' },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setType(f.value)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                type === f.value
                  ? 'bg-brand-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resultados */}
      {query && (
        <p className="mb-4 text-sm text-gray-500">
          {loading ? 'Buscando...' : `${meta.total} resultado(s) para "${query}"`}
        </p>
      )}

      {!query ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Search className="mb-4 h-12 w-12 text-gray-200" />
          <h3 className="text-lg font-semibold text-gray-600">Digite algo para buscar</h3>
          <p className="mt-1 text-sm text-gray-400">Busque por título, tags ou disciplina</p>
        </div>
      ) : loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <ResourceCardSkeleton key={i} />)}
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Search className="mb-4 h-12 w-12 text-gray-200" />
          <h3 className="text-lg font-semibold text-gray-600">Nenhum resultado</h3>
          <p className="mt-1 text-sm text-gray-400">Tente termos diferentes ou remova os filtros</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map(resource => <ResourceCard key={resource.id} resource={resource} />)}
        </div>
      )}
    </div>
  )
}
