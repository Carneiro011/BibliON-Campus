'use client'
// src/app/dashboard/profile/page.tsx
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { User, Save, Loader2, BookOpen, Star, MessageSquare } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import type { User as UserType } from '@/types'
import { formatDate } from '@/lib/utils'

export default function ProfilePage() {
  const { user: authUser } = useAuth()
  const [profile, setProfile] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<{
    name: string; bio: string; institution: string
  }>()

  useEffect(() => {
    api.get<UserType>('/users/me').then(({ data }) => {
      setProfile(data)
      reset({ name: data.name, bio: data.bio || '', institution: data.institution || '' })
    }).finally(() => setLoading(false))
  }, [reset])

  async function onSubmit(data: any) {
    const { data: updated } = await api.put('/users/me', data)
    setProfile(prev => prev ? { ...prev, ...updated } : prev)
    toast.success('Perfil atualizado!')
  }

  if (loading) return <div className="container-app py-8"><div className="skeleton h-64 rounded-xl" /></div>

  return (
    <div className="container-app py-8 max-w-2xl">
      <h1 className="page-title mb-8">Meu perfil</h1>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {[
          { label: 'Materiais', value: profile?._count?.resources ?? 0, icon: BookOpen },
          { label: 'Avaliações', value: profile?._count?.ratings ?? 0, icon: Star },
          { label: 'Comentários', value: profile?._count?.comments ?? 0, icon: MessageSquare },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-4 text-center">
            <Icon className="mx-auto mb-1 h-5 w-5 text-brand-600" />
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-2xl font-bold">
            {profile?.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-lg">{profile?.name}</p>
            <p className="text-sm text-gray-500">{profile?.email}</p>
            <span className="badge bg-brand-100 text-brand-700 text-xs mt-1">
              {profile?.role === 'ADMIN' ? 'Administrador' : profile?.role === 'MODERATOR' ? 'Moderador' : 'Aluno'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Nome</label>
            <input {...register('name')} className="input" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Instituição</label>
            <input {...register('institution')} placeholder="Universidade Federal do Ceará" className="input" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Bio</label>
            <textarea {...register('bio')} rows={3} placeholder="Conte um pouco sobre você..." className="input resize-none" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-400">
              Membro desde {profile?.createdAt ? formatDate(profile.createdAt) : '—'}
            </p>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
