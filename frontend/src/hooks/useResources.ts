'use client'
// src/hooks/useResources.ts
import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import type { Resource, PaginatedResponse } from '@/types'

interface UseResourcesParams {
  page?: number
  limit?: number
  type?: string
  disciplineId?: string
}

export function useResources(params: UseResourcesParams = {}) {
  const [data, setData] = useState<Resource[]>([])
  const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0, pages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: res } = await api.get<PaginatedResponse<Resource>>('/resources', { params })
      setData(res.data)
      setMeta(res.meta)
    } catch (e: any) {
      setError(e.response?.data?.message || 'Erro ao carregar recursos')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => { fetch() }, [fetch])

  return { data, meta, loading, error, refetch: fetch }
}

export function useResource(id: string) {
  const [data, setData] = useState<Resource | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    api.get<Resource>(`/resources/${id}`)
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false))
  }, [id])

  return { data, loading }
}

export function useSearch(query: string, filters: { type?: string; disciplineId?: string } = {}) {
  const [data, setData] = useState<Resource[]>([])
  const [meta, setMeta] = useState({ total: 0, pages: 0, query: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) { setData([]); return }
    const controller = new AbortController()
    setLoading(true)
    api.get('/search', { params: { q: query, ...filters }, signal: controller.signal })
      .then(({ data: res }) => { setData(res.data); setMeta(res.meta) })
      .catch(() => {})
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [query, JSON.stringify(filters)])

  return { data, meta, loading }
}
