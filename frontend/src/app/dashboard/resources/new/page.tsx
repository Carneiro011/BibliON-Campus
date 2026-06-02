'use client'
// src/app/dashboard/resources/new/page.tsx
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useDropzone } from 'react-dropzone'
import { Upload, Link2, Sparkles, X, Loader2, FileText, Plus } from 'lucide-react'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { AiAnalysis } from '@/types'

const schema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres').max(200),
  description: z.string().max(1000).optional(),
  type: z.enum(['PDF', 'VIDEO', 'LINK', 'ARTICLE']),
  url: z.string().url('URL inválida').optional().or(z.literal('')),
  disciplineId: z.string().optional(),
  summary: z.string().optional(),
  tags: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function NewResourcePage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState<AiAnalysis | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'PDF' },
  })

  const type = watch('type')
  const title = watch('title')

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 20 * 1024 * 1024,
    multiple: false,
  })

  async function generateAi() {
    if (!title && !file) return toast.error('Preencha o título ou faça upload de um PDF')
    setAiLoading(true)
    try {
      const { data } = await api.post<AiAnalysis>('/ai/analyze', {
        title: title || file?.name,
        type: type === 'PDF' ? 'pdf' : 'link',
        description: watch('description'),
      })
      setAiResult(data)
      if (data.summary) setValue('summary', data.summary)
      if (data.tags?.length) setTags(prev => Array.from(new Set([...prev, ...data.tags])))
      toast.success('Resumo e tags gerados com IA!')
    } catch {
      toast.error('Erro ao gerar análise com IA')
    } finally {
      setAiLoading(false)
    }
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }

  async function onSubmit(data: FormData) {
    const fd = new FormData()
    fd.append('title', data.title)
    fd.append('type', data.type)
    if (data.description) fd.append('description', data.description)
    if (data.disciplineId) fd.append('disciplineId', data.disciplineId)
    if (data.summary) fd.append('summary', data.summary)
    if (data.url && data.type !== 'PDF') fd.append('url', data.url)
    tags.forEach(t => fd.append('tags', t))
    if (file && data.type === 'PDF') fd.append('file', file)

    try {
      await api.post('/resources', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Material enviado! Aguardando moderação.')
      router.push('/dashboard/my-resources')
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Erro ao enviar material')
    }
  }

  return (
    <div className="container-app py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="page-title">Enviar material</h1>
        <p className="mt-1 text-gray-500 text-sm">
          Compartilhe PDFs, vídeos ou links com a comunidade. A IA pode gerar resumo e tags automaticamente.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tipo */}
        <div className="card p-5">
          <label className="mb-3 block text-sm font-medium text-gray-700">Tipo de material</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(['PDF', 'VIDEO', 'LINK', 'ARTICLE'] as const).map(t => (
              <label key={t} className={cn(
                'flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all',
                type === t
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300',
              )}>
                <input {...register('type')} type="radio" value={t} className="sr-only" />
                {t === 'PDF' && <FileText className="h-4 w-4" />}
                {t !== 'PDF' && <Link2 className="h-4 w-4" />}
                {t}
              </label>
            ))}
          </div>
        </div>

        {/* Título */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Título *</label>
          <input {...register('title')} placeholder="Ex: Introdução a Grafos e BFS" className="input" />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
        </div>

        {/* Upload ou URL */}
        {type === 'PDF' ? (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Arquivo PDF *</label>
            <div
              {...getRootProps()}
              className={cn(
                'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 cursor-pointer transition-colors',
                isDragActive ? 'border-brand-400 bg-brand-50' : 'border-gray-200 hover:border-gray-300',
                file ? 'border-green-400 bg-green-50' : '',
              )}
            >
              <input {...getInputProps()} />
              {file ? (
                <>
                  <FileText className="mb-2 h-8 w-8 text-green-600" />
                  <p className="text-sm font-medium text-green-700">{file.name}</p>
                  <p className="text-xs text-green-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </>
              ) : (
                <>
                  <Upload className="mb-2 h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500">Arraste o PDF aqui ou clique para selecionar</p>
                  <p className="text-xs text-gray-400 mt-1">Máximo 20 MB</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">URL *</label>
            <input {...register('url')} placeholder="https://youtube.com/..." className="input" />
            {errors.url && <p className="mt-1 text-xs text-red-500">{errors.url.message}</p>}
          </div>
        )}

        {/* Descrição */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Descreva brevemente o conteúdo do material..."
            className="input resize-none"
          />
        </div>

        {/* Botão IA */}
        <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-100 p-4">
          <Sparkles className="h-5 w-5 text-brand-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">Gerar resumo e tags com IA</p>
            <p className="text-xs text-gray-500">O Llama 3 analisa e sugere automaticamente.</p>
          </div>
          <button
            type="button"
            onClick={generateAi}
            disabled={aiLoading}
            className="btn-primary shrink-0 text-sm"
          >
            {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {aiLoading ? 'Gerando...' : 'Gerar'}
          </button>
        </div>

        {/* Resumo */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Resumo {aiResult && <span className="badge bg-brand-100 text-brand-600 ml-1">IA</span>}
          </label>
          <textarea
            {...register('summary')}
            rows={5}
            placeholder="• Tópico 1&#10;• Tópico 2&#10;• Tópico 3"
            className="input resize-none font-mono text-xs"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="algoritmos"
              className="input flex-1"
            />
            <button type="button" onClick={addTag} className="btn-secondary px-3">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="badge bg-brand-100 text-brand-700 flex items-center gap-1">
                  #{tag}
                  <button type="button" onClick={() => setTags(prev => prev.filter(t => t !== tag))}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => router.back()} className="btn-secondary flex-1">
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Enviando...' : 'Enviar para moderação'}
          </button>
        </div>
      </form>
    </div>
  )
}
