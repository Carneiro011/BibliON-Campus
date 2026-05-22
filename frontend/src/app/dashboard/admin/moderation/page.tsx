'use client'
// src/app/dashboard/admin/moderation/page.tsx
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Shield, Check, X, Eye, Sparkles, Loader2, Clock } from 'lucide-react'
import { api } from '@/lib/api'
import { timeAgo, RESOURCE_TYPE_LABELS, STATUS_COLORS } from '@/lib/utils'
import Link from 'next/link'

interface PendingResource {
  id: string
  title: string
  type: string
  description?: string
  createdAt: string
  user: { name: string; email: string }
  discipline?: { name: string }
  tags: { tag: { name: string } }[]
  moderation?: { aiFlags: string[] }
}

export default function ModerationPage() {
  const [resources, setResources] = useState<PendingResource[]>([])
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [aiCheckId, setAiCheckId] = useState<string | null>(null)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    const [r, s] = await Promise.all([
      api.get('/moderation/pending'),
      api.get('/moderation/stats'),
    ])
    setResources(r.data.data)
    setStats(s.data)
    setLoading(false)
  }

  async function approve(id: string) {
    await api.post(`/moderation/${id}/approve`)
    toast.success('Recurso aprovado!')
    setResources(prev => prev.filter(r => r.id !== id))
    setStats(s => ({ ...s, pending: s.pending - 1, approved: s.approved + 1 }))
  }

  async function reject(id: string) {
    if (!rejectReason.trim()) return toast.error('Informe o motivo da rejeição')
    await api.post(`/moderation/${id}/reject`, { reason: rejectReason })
    toast.success('Recurso rejeitado')
    setResources(prev => prev.filter(r => r.id !== id))
    setStats(s => ({ ...s, pending: s.pending - 1, rejected: s.rejected + 1 }))
    setRejectingId(null)
    setRejectReason('')
  }

  async function aiCheck(id: string) {
    setAiCheckId(id)
    const { data } = await api.post(`/moderation/${id}/ai-check`)
    setAiCheckId(null)
    if (data.flags.length === 0) toast.success('IA: conteúdo sem problemas detectados')
    else toast.warning(`IA detectou: ${data.flags.join(', ')}`)
  }

  return (
    <div className="container-app py-8">
      <div className="mb-8 flex items-center gap-3">
        <Shield className="h-6 w-6 text-brand-600" />
        <div>
          <h1 className="page-title">Moderação de conteúdo</h1>
          <p className="text-sm text-gray-500 mt-0.5">Revise e aprove os materiais enviados pelos alunos</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {[
          { label: 'Pendentes', value: stats.pending, color: 'text-amber-600 bg-amber-50' },
          { label: 'Aprovados', value: stats.approved, color: 'text-green-600 bg-green-50' },
          { label: 'Rejeitados', value: stats.rejected, color: 'text-red-600 bg-red-50' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-5 text-center">
            <p className={`text-3xl font-bold ${color.split(' ')[0]}`}>{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Lista de pendentes */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
        </div>
      ) : resources.length === 0 ? (
        <div className="card p-12 text-center">
          <Check className="mx-auto mb-3 h-10 w-10 text-green-400" />
          <h3 className="font-semibold text-gray-700">Nenhum recurso pendente</h3>
          <p className="text-sm text-gray-400 mt-1">Todos os materiais foram revisados!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {resources.map(r => (
            <div key={r.id} className="card p-6">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="badge bg-gray-100 text-gray-700 text-xs">
                      {RESOURCE_TYPE_LABELS[r.type] || r.type}
                    </span>
                    {r.discipline && (
                      <span className="badge bg-blue-100 text-blue-700 text-xs">{r.discipline.name}</span>
                    )}
                    {(r.moderation?.aiFlags?.length ?? 0) > 0 && (
                      <span className="badge bg-red-100 text-red-700 text-xs">
                        ⚠ IA: {r.moderation?.aiFlags?.join(', ')}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{r.title}</h3>
                  {r.description && <p className="text-sm text-gray-500 line-clamp-2">{r.description}</p>}
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                    <span>Por: {r.user.name}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {timeAgo(r.createdAt)}
                    </span>
                  </div>
                  {r.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {r.tags.map(({ tag }) => (
                        <span key={tag.name} className="badge bg-gray-100 text-gray-500 text-xs">#{tag.name}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex flex-col gap-2 shrink-0">
                  <Link href={`/dashboard/resources/${r.id}`} className="btn-secondary text-xs px-3 py-1.5">
                    <Eye className="h-3.5 w-3.5" /> Ver
                  </Link>
                  <button
                    onClick={() => aiCheck(r.id)}
                    disabled={aiCheckId === r.id}
                    className="btn-ghost text-xs px-3 py-1.5 text-brand-600"
                  >
                    {aiCheckId === r.id
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Sparkles className="h-3.5 w-3.5" />}
                    IA
                  </button>
                  <button onClick={() => approve(r.id)} className="btn-primary text-xs px-3 py-1.5 bg-green-600 hover:bg-green-700">
                    <Check className="h-3.5 w-3.5" /> Aprovar
                  </button>
                  <button
                    onClick={() => setRejectingId(rejectingId === r.id ? null : r.id)}
                    className="btn-danger text-xs px-3 py-1.5"
                  >
                    <X className="h-3.5 w-3.5" /> Rejeitar
                  </button>
                </div>
              </div>

              {/* Form de rejeição */}
              {rejectingId === r.id && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Motivo da rejeição</label>
                  <textarea
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    rows={2}
                    placeholder="Ex: Conteúdo sem relação acadêmica, spam..."
                    className="input resize-none mb-2"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => reject(r.id)} className="btn-danger text-sm">
                      Confirmar rejeição
                    </button>
                    <button onClick={() => setRejectingId(null)} className="btn-secondary text-sm">
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
