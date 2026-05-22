'use client'
// src/app/dashboard/my-resources/page.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, FileText, Eye, Star } from 'lucide-react'
import { api } from '@/lib/api'
import { cn, timeAgo, STATUS_LABELS, STATUS_COLORS, RESOURCE_TYPE_LABELS } from '@/lib/utils'
import type { Resource } from '@/types'

export default function MyResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Resource[]>('/users/me/resources')
      .then(({ data }) => setResources(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container-app py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="page-title">Meus materiais</h1>
          <p className="mt-1 text-sm text-gray-500">{resources.length} material(is) enviado(s)</p>
        </div>
        <Link href="/dashboard/resources/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Enviar material
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}
        </div>
      ) : resources.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <h3 className="font-semibold text-gray-600">Nenhum material enviado</h3>
          <p className="text-sm text-gray-400 mt-1 mb-4">Compartilhe seu primeiro material com a comunidade.</p>
          <Link href="/dashboard/resources/new" className="btn-primary inline-flex">
            <Plus className="h-4 w-4" /> Enviar agora
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {resources.map(r => (
            <Link key={r.id} href={`/dashboard/resources/${r.id}`} className="block">
              <div className="card p-5 hover:shadow-md transition-shadow flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-medium text-gray-500">{RESOURCE_TYPE_LABELS[r.type]}</span>
                    <span className={cn('badge text-xs', STATUS_COLORS[r.status])}>
                      {STATUS_LABELS[r.status]}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{r.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{timeAgo(r.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 shrink-0">
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{r.viewCount}</span>
                  {r.avgRating && <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-400" />{r.avgRating}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
