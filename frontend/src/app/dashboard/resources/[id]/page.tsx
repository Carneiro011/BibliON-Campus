'use client'
// src/app/dashboard/resources/[id]/page.tsx
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  FileText, Video, Link2, ExternalLink, Eye, Star,
  MessageSquare, Clock, User, ChevronLeft, Sparkles,
} from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { cn, timeAgo, formatDate, formatFileSize, RESOURCE_TYPE_LABELS } from '@/lib/utils'
import type { Resource, Comment } from '@/types'
import { toast } from 'sonner'

export default function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [resource, setResource] = useState<Resource | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [myRating, setMyRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Resource>(`/resources/${id}`),
      api.get<Comment[]>(`/resources/${id}/comments`),
    ]).then(([r, c]) => {
      setResource(r.data)
      setComments(c.data)
    }).finally(() => setLoading(false))

    if (user) {
      api.get(`/resources/${id}/ratings/mine`)
        .then(({ data }) => data && setMyRating(data.stars))
        .catch(() => {})
    }
  }, [id, user])

  async function handleRate(stars: number) {
    if (!user) return toast.error('Faça login para avaliar')
    await api.post(`/resources/${id}/ratings`, { stars })
    setMyRating(stars)
    // Atualiza avg local
    setResource(prev => prev ? { ...prev, avgRating: stars } : prev)
    toast.success('Avaliação salva!')
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentText.trim()) return
    const { data } = await api.post(`/resources/${id}/comments`, { body: commentText })
    setComments(prev => [data, ...prev])
    setCommentText('')
    toast.success('Comentário adicionado!')
  }

  if (loading) return (
    <div className="container-app py-8">
      <div className="skeleton h-8 w-48 mb-4" />
      <div className="skeleton h-64 rounded-xl" />
    </div>
  )
  if (!resource) return (
    <div className="container-app py-16 text-center">
      <p className="text-gray-500">Recurso não encontrado.</p>
    </div>
  )

  return (
    <div className="container-app py-8 max-w-4xl">
      {/* Voltar */}
      <Link href="/dashboard" className="btn-ghost mb-6 inline-flex text-sm px-0 hover:underline">
        <ChevronLeft className="h-4 w-4" /> Voltar
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header do recurso */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge bg-gray-100 text-gray-700">
                {RESOURCE_TYPE_LABELS[resource.type]}
              </span>
              {resource.discipline && (
                <span className="badge text-white" style={{ backgroundColor: resource.discipline.color }}>
                  {resource.discipline.name}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{resource.title}</h1>
            {resource.description && <p className="text-gray-500 text-sm leading-relaxed">{resource.description}</p>}

            {/* Ação principal */}
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-4 inline-flex"
            >
              {resource.type === 'PDF' ? <FileText className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
              {resource.type === 'PDF' ? 'Abrir PDF' : 'Acessar recurso'}
            </a>
          </div>

          {/* Resumo IA */}
          {resource.summary && (
            <div className="card p-6 border-brand-100 bg-gradient-to-br from-brand-50 to-white">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-brand-600" />
                <span className="text-sm font-semibold text-brand-700">Resumo gerado por IA</span>
                <span className="badge bg-brand-100 text-brand-600 text-xs">Llama 3</span>
              </div>
              <ul className="space-y-2">
                {resource.summary.split('\n').filter(Boolean).map((line, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-0.5 text-brand-500">•</span>
                    <span>{line.replace('• ', '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Avaliação */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400" /> Avalie este material
            </h3>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star className={cn(
                    'h-7 w-7 transition-colors',
                    star <= (hoverRating || myRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-200',
                  )} />
                </button>
              ))}
              {myRating > 0 && (
                <span className="ml-2 text-sm text-gray-500">Sua avaliação: {myRating}/5</span>
              )}
            </div>
          </div>

          {/* Comentários */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comentários ({comments.length})
            </h3>

            {user && (
              <form onSubmit={handleComment} className="mb-6">
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Deixe seu comentário sobre este material..."
                  rows={3}
                  className="input resize-none mb-2"
                />
                <button type="submit" className="btn-primary text-sm">
                  Comentar
                </button>
              </form>
            )}

            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                    {comment.user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{comment.user.name}</span>
                      <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{comment.body}</p>
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3 ml-4 space-y-3 border-l-2 border-gray-100 pl-4">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="flex gap-2">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                              {reply.user.name.charAt(0)}
                            </div>
                            <div>
                              <span className="text-xs font-medium text-gray-900">{reply.user.name} </span>
                              <span className="text-xs text-gray-500">{timeAgo(reply.createdAt)}</span>
                              <p className="text-xs text-gray-700 mt-0.5">{reply.body}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-6">
                  Nenhum comentário ainda. Seja o primeiro!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar direita */}
        <div className="space-y-4">
          <div className="card p-5">
            <h4 className="section-label mb-4">Informações</h4>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-400 mb-0.5">Enviado por</dt>
                <dd className="flex items-center gap-2 font-medium text-gray-900">
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  {resource.user.name}
                </dd>
              </div>
              <div>
                <dt className="text-gray-400 mb-0.5">Data</dt>
                <dd className="flex items-center gap-2 font-medium text-gray-900">
                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                  {formatDate(resource.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-gray-400 mb-0.5">Visualizações</dt>
                <dd className="flex items-center gap-2 font-medium text-gray-900">
                  <Eye className="h-3.5 w-3.5 text-gray-400" />
                  {resource.viewCount}
                </dd>
              </div>
              {resource.avgRating != null && (
                <div>
                  <dt className="text-gray-400 mb-0.5">Avaliação média</dt>
                  <dd className="flex items-center gap-1 font-medium text-gray-900">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {resource.avgRating} / 5 ({resource.ratingCount})
                  </dd>
                </div>
              )}
              {resource.fileSize && (
                <div>
                  <dt className="text-gray-400 mb-0.5">Tamanho</dt>
                  <dd className="font-medium text-gray-900">{formatFileSize(resource.fileSize)}</dd>
                </div>
              )}
            </dl>
          </div>

          {resource.tags.length > 0 && (
            <div className="card p-5">
              <h4 className="section-label mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map(tag => (
                  <Link
                    key={tag.id}
                    href={`/dashboard/search?q=${tag.name}`}
                    className="badge bg-gray-100 text-gray-600 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
