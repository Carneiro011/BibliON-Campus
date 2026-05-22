'use client'
// src/components/resources/ResourceCard.tsx
import Link from 'next/link'
import { FileText, Video, Link2, Eye, Star, MessageSquare, Clock } from 'lucide-react'
import { cn, timeAgo, formatFileSize, RESOURCE_TYPE_COLORS, RESOURCE_TYPE_LABELS } from '@/lib/utils'
import type { Resource } from '@/types'

const TypeIcon = ({ type }: { type: string }) => {
  if (type === 'PDF')   return <FileText className="h-4 w-4" />
  if (type === 'VIDEO') return <Video    className="h-4 w-4" />
  return                       <Link2   className="h-4 w-4" />
}

interface Props { resource: Resource }

export default function ResourceCard({ resource }: Props) {
  return (
    <Link href={`/dashboard/resources/${resource.id}`} className="block group">
      <article className="card h-full p-5 transition-shadow hover:shadow-md flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className={cn('badge flex items-center gap-1', RESOURCE_TYPE_COLORS[resource.type])}>
              <TypeIcon type={resource.type} />
              {RESOURCE_TYPE_LABELS[resource.type]}
            </span>
          </div>
          {resource.discipline && (
            <span
              className="badge text-white shrink-0"
              style={{ backgroundColor: resource.discipline.color }}
            >
              {resource.discipline.name.split(' ')[0]}
            </span>
          )}
        </div>

        {/* Título */}
        <h3 className="font-semibold text-gray-900 leading-snug group-hover:text-brand-700 transition-colors line-clamp-2">
          {resource.title}
        </h3>

        {/* Resumo IA */}
        {resource.summary && (
          <div className="rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-800 leading-relaxed line-clamp-3 border border-brand-100">
            <span className="font-semibold block mb-0.5">✦ Resumo IA</span>
            {resource.summary.split('\n')[0].replace('• ', '')}
          </div>
        )}

        {/* Tags */}
        {resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {resource.tags.slice(0, 3).map(tag => (
              <span key={tag.id} className="badge bg-gray-100 text-gray-600">
                #{tag.name}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="badge bg-gray-100 text-gray-400">+{resource.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {resource.viewCount}
            </span>
            {resource.avgRating != null && (
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {resource.avgRating}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {resource._count?.comments ?? 0}
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            {timeAgo(resource.createdAt)}
          </span>
        </div>
      </article>
    </Link>
  )
}
