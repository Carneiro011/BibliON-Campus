'use client'
// src/app/dashboard/admin/stats/page.tsx
import { useEffect, useState } from 'react'
import { BarChart3, Users, BookOpen, Star, MessageSquare, Shield } from 'lucide-react'
import { api } from '@/lib/api'

export default function StatsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/moderation/stats').then(({ data }) => setStats(data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="container-app py-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[1,2,3,4].map(i => <div key={i} className="skeleton h-32 rounded-xl" />)}
      </div>
    </div>
  )

  return (
    <div className="container-app py-8">
      <div className="mb-8 flex items-center gap-3">
        <BarChart3 className="h-6 w-6 text-brand-600" />
        <h1 className="page-title">Estatísticas da plataforma</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: 'Total de recursos', value: stats?.total ?? 0, icon: BookOpen, color: 'bg-blue-50 text-blue-600' },
          { label: 'Aprovados', value: stats?.approved ?? 0, icon: Shield, color: 'bg-green-50 text-green-600' },
          { label: 'Pendentes', value: stats?.pending ?? 0, icon: Shield, color: 'bg-amber-50 text-amber-600' },
          { label: 'Rejeitados', value: stats?.rejected ?? 0, icon: Shield, color: 'bg-red-50 text-red-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-6">
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
