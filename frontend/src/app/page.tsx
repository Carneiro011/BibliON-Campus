// src/app/page.tsx
import Link from 'next/link'
import { BookOpen, Search, Upload, Star, Users, Zap } from 'lucide-react'

export default function HomePage() {
  const features = [
    { icon: Upload, title: 'Compartilhe materiais', desc: 'Faça upload de PDFs ou adicione links de vídeos e artigos acadêmicos.' },
    { icon: Zap, title: 'IA que resume pra você', desc: 'Resumos automáticos e tags gerados pelo Llama 3 via Groq API.' },
    { icon: Search, title: 'Busca inteligente', desc: 'Full-text search em títulos, descrições, resumos e tags.' },
    { icon: Star, title: 'Avalie e comente', desc: 'Sistema de estrelas e comentários com respostas aninhadas.' },
    { icon: Users, title: 'Colaboração real', desc: 'Organize por disciplinas e descubra o que colegas compartilham.' },
    { icon: BookOpen, title: 'Moderação segura', desc: 'Fluxo de aprovação garante qualidade dos materiais publicados.' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container-app flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">BibliON Campus</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-sm">Entrar</Link>
            <Link href="/auth/register" className="btn-primary text-sm">Criar conta grátis</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container-app py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="badge bg-brand-50 text-brand-700 mb-6 text-xs font-semibold">
            ✦ Plataforma acadêmica com IA
          </span>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900">
            Materiais acadêmicos{' '}
            <span className="text-brand-600">organizados e resumidos</span>{' '}
            com IA
          </h1>
          <p className="mb-10 text-xl text-gray-500 leading-relaxed">
            Compartilhe PDFs, vídeos e links com sua turma. A IA gera resumos e
            tags automaticamente. Tudo organizado por disciplina.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/register" className="btn-primary px-8 py-3 text-base">
              Começar agora — é grátis
            </Link>
            <Link href="/dashboard" className="btn-secondary px-8 py-3 text-base">
              Ver materiais
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-100 bg-gray-50 py-24">
        <div className="container-app">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Tudo que você precisa</h2>
            <p className="text-gray-500">Uma plataforma completa para compartilhamento acadêmico colaborativo.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 hover:shadow-md transition-shadow">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                  <Icon className="h-5 w-5 text-brand-600" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container-app text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">Pronto para começar?</h2>
          <p className="mb-8 text-gray-500">Cadastre-se e comece a compartilhar materiais hoje mesmo.</p>
          <Link href="/auth/register" className="btn-primary px-10 py-3 text-base">
            Criar conta grátis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="container-app flex items-center justify-between text-sm text-gray-400">
          <span>© 2026 BibliON Campus. Projeto acadêmico. IFCE=TIANGUÁ </span>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-gray-600">Documentação</Link>
            <Link href="/api/docs" className="hover:text-gray-600">API</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
