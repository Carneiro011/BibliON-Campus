'use client'
// src/app/dashboard/layout.tsx
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen, Home, Search, Upload, Star,
  Shield, User, LogOut, Menu, X, BarChart3,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { href: '/dashboard', label: 'Início', icon: Home },
  { href: '/dashboard/search', label: 'Buscar', icon: Search },
  { href: '/dashboard/resources/new', label: 'Enviar material', icon: Upload },
  { href: '/dashboard/my-resources', label: 'Meus materiais', icon: Star },
]

const adminItems = [
  { href: '/dashboard/admin/moderation', label: 'Moderação', icon: Shield },
  { href: '/dashboard/admin/stats', label: 'Estatísticas', icon: BarChart3 },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout, isModerator } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [user, loading, router])

  if (loading || !user) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
    </div>
  )

  const Sidebar = ({ mobile = false }) => (
    <aside className={cn(
      'flex h-full flex-col bg-white border-r border-gray-100',
      mobile ? 'w-64' : 'hidden lg:flex w-64',
    )}>
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-gray-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
          <BookOpen className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-gray-900">BibliON Campus</span>
      </div>

      {/* Nav principal */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <p className="section-label px-3 mb-3">Menu</p>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-brand-50 text-brand-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}

        {isModerator && (
          <>
            <div className="my-4 border-t border-gray-100" />
            <p className="section-label px-3 mb-3">Administração</p>
            {adminItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  pathname.startsWith(href)
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* Usuário */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
            <p className="truncate text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
        <div className="space-y-1">
          <Link href="/dashboard/profile" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <User className="h-4 w-4" /> Perfil
          </Link>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar desktop */}
      <Sidebar />

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative h-full">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar mobile */}
        <header className="flex h-16 items-center gap-4 border-b border-gray-100 bg-white px-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="btn-ghost p-2">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold text-gray-900">BibliON Campus</span>
        </header>

        {/* Conteúdo */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
