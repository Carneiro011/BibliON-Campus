'use client'
// src/app/dashboard/admin/users/page.tsx
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import {
  Users, Search, Shield, ShieldOff, UserCheck,
  UserX, ChevronLeft, ChevronRight, Loader2,
  Crown, GraduationCap, ShieldCheck
} from 'lucide-react'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

type Role = 'STUDENT' | 'MODERATOR' | 'ADMIN'

interface User {
  id: string
  name: string
  email: string
  role: Role
  institution?: string
  isActive: boolean
  createdAt: string
  _count: { resources: number }
}

const ROLE_CONFIG: Record<Role, { label: string; icon: any; color: string }> = {
  STUDENT: { label: 'Aluno', icon: GraduationCap, color: 'bg-gray-100 text-gray-700' },
  MODERATOR: { label: 'Moderador', icon: ShieldCheck, color: 'bg-blue-100 text-blue-700' },
  ADMIN: { label: 'Admin', icon: Crown, color: 'bg-purple-100 text-purple-700' },
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ total: 0, pages: 1 })
  const [actionId, setActionId] = useState<string | null>(null)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/users', { params: { page, limit: 15 } })
      setUsers(data.data)
      setMeta({ total: data.meta.total, pages: data.meta.pages })
    } catch {
      toast.error('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { loadUsers() }, [loadUsers])

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  async function toggleActive(user: User) {
    setActionId(user.id)
    try {
      await api.patch(`/users/${user.id}/toggle-active`, { isActive: !user.isActive })
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u))
      toast.success(user.isActive ? 'Usuário desativado' : 'Usuário ativado')
    } catch {
      toast.error('Erro ao alterar status')
    } finally {
      setActionId(null)
    }
  }

  async function changeRole(user: User, role: Role) {
    if (user.role === role) return
    setActionId(user.id)
    try {
      await api.patch(`/users/${user.id}/role`, { role })
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role } : u))
      toast.success(`${user.name} agora é ${ROLE_CONFIG[role].label}`)
    } catch {
      toast.error('Erro ao alterar papel')
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="container-app py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
            <Users className="h-5 w-5 text-purple-700" />
          </div>
          <div>
            <h1 className="page-title">Gerenciar Usuários</h1>
            <p className="text-sm text-gray-500 mt-0.5">{meta.total} usuários cadastrados</p>
          </div>
        </div>
      </div>

      {/* Busca */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input pl-10 w-full max-w-md"
        />
      </div>

      {/* Tabela */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Papel</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materiais</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(user => {
                  const roleConfig = ROLE_CONFIG[user.role]
                  const RoleIcon = roleConfig.icon
                  const isLoading = actionId === user.id

                  return (
                    <tr key={user.id} className={cn('hover:bg-gray-50 transition-colors', !user.isActive && 'opacity-60')}>
                      {/* Usuário */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-bold shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            {user.institution && (
                              <p className="text-xs text-gray-400 truncate">{user.institution}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Papel */}
                      <td className="px-4 py-3">
                        <select
                          value={user.role}
                          onChange={e => changeRole(user, e.target.value as Role)}
                          disabled={isLoading}
                          className={cn(
                            'text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer',
                            roleConfig.color,
                          )}
                        >
                          <option value="STUDENT">Aluno</option>
                          <option value="MODERATOR">Moderador</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>

                      {/* Materiais */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{user._count.resources}</span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={cn(
                          'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                          user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        )}>
                          <span className={cn('h-1.5 w-1.5 rounded-full', user.isActive ? 'bg-green-500' : 'bg-red-500')} />
                          {user.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>

                      {/* Ações */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleActive(user)}
                          disabled={isLoading}
                          className={cn(
                            'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors',
                            user.isActive
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          )}
                        >
                          {isLoading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : user.isActive ? (
                            <><UserX className="h-3.5 w-3.5" /> Desativar</>
                          ) : (
                            <><UserCheck className="h-3.5 w-3.5" /> Ativar</>
                          )}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {meta.pages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
              <p className="text-xs text-gray-500">Página {page} de {meta.pages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary p-1.5 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(meta.pages, p + 1))}
                  disabled={page === meta.pages}
                  className="btn-secondary p-1.5 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
