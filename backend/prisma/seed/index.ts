// prisma/seed/index.ts
import { PrismaClient, Role, ResourceType, ResourceStatus } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes
  await prisma.moderation.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.rating.deleteMany()
  await prisma.resourceTag.deleteMany()
  await prisma.resource.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.discipline.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.user.deleteMany()

  // --- Usuários ---
  const hashedPassword = await bcrypt.hash('senha123', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin BibliON',
      email: 'admin@biblion.edu',
      password: hashedPassword,
      role: Role.ADMIN,
      institution: 'BibliON Campus',
      bio: 'Administrador da plataforma',
    },
  })

  const moderator = await prisma.user.create({
    data: {
      name: 'Ana Moderadora',
      email: 'moderador@biblion.edu',
      password: hashedPassword,
      role: Role.MODERATOR,
      institution: 'Universidade Federal',
      bio: 'Moderadora de conteúdo acadêmico',
    },
  })

  const student1 = await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'joao@aluno.edu',
      password: hashedPassword,
      role: Role.STUDENT,
      institution: 'Universidade Federal do Ceará',
      bio: 'Estudante de Ciência da Computação',
    },
  })

  const student2 = await prisma.user.create({
    data: {
      name: 'Maria Santos',
      email: 'maria@aluno.edu',
      password: hashedPassword,
      role: Role.STUDENT,
      institution: 'Universidade Estadual do Ceará',
      bio: 'Estudante de Engenharia de Software',
    },
  })

  console.log('✅ Usuários criados')

  // --- Disciplinas ---
  const disciplines = await Promise.all([
    prisma.discipline.create({ data: { name: 'Algoritmos e Estruturas de Dados', slug: 'algoritmos', color: '#6366f1' } }),
    prisma.discipline.create({ data: { name: 'Banco de Dados', slug: 'banco-de-dados', color: '#0ea5e9' } }),
    prisma.discipline.create({ data: { name: 'Engenharia de Software', slug: 'engenharia-de-software', color: '#10b981' } }),
    prisma.discipline.create({ data: { name: 'Inteligência Artificial', slug: 'ia', color: '#f59e0b' } }),
    prisma.discipline.create({ data: { name: 'Redes de Computadores', slug: 'redes', color: '#ef4444' } }),
    prisma.discipline.create({ data: { name: 'Cálculo', slug: 'calculo', color: '#8b5cf6' } }),
  ])

  console.log('✅ Disciplinas criadas')

  // --- Tags ---
  const tagNames = ['resumo', 'prova', 'exercícios', 'videoaula', 'slides', 'apostila', 'artigo', 'projeto', 'livro', 'dicas']
  const tags = await Promise.all(
    tagNames.map(name =>
      prisma.tag.create({ data: { name, slug: name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() } })
    )
  )

  console.log('✅ Tags criadas')

  // --- Recursos de exemplo ---
  const resource1 = await prisma.resource.create({
    data: {
      title: 'Introdução a Grafos e Algoritmos de Busca',
      description: 'Material completo sobre teoria dos grafos, BFS, DFS, Dijkstra e aplicações práticas.',
      type: ResourceType.PDF,
      url: 'https://storage.example.com/pdfs/grafos-intro.pdf',
      fileSize: 2_450_000,
      summary: '• Conceitos fundamentais de grafos: vértices, arestas e adjacências\n• Algoritmos de busca BFS e DFS com complexidade O(V+E)\n• Dijkstra para caminhos mínimos com heap de prioridade\n• Aplicações práticas: GPS, redes sociais e sistemas de recomendação\n• Implementações comentadas em Python e Java',
      status: ResourceStatus.APPROVED,
      userId: student1.id,
      disciplineId: disciplines[0].id,
      viewCount: 127,
      tags: { create: [{ tagId: tags[0].id }, { tagId: tags[1].id }] },
    },
  })

  const resource2 = await prisma.resource.create({
    data: {
      title: 'SQL Avançado: Window Functions e CTEs',
      description: 'Guia prático de funções de janela, expressões de tabela comuns e otimização de queries.',
      type: ResourceType.VIDEO,
      url: 'https://youtube.com/watch?v=exemplo-sql',
      summary: '• Window Functions: ROW_NUMBER, RANK, LAG e LEAD\n• CTEs recursivas para hierarquias e grafos no banco\n• Plano de execução e uso de índices compostos\n• Particionamento de tabelas para performance\n• Casos reais de otimização de 10x em queries lentas',
      status: ResourceStatus.APPROVED,
      userId: student2.id,
      disciplineId: disciplines[1].id,
      viewCount: 89,
      tags: { create: [{ tagId: tags[3].id }, { tagId: tags[4].id }] },
    },
  })

  const resource3 = await prisma.resource.create({
    data: {
      title: 'Clean Architecture com NestJS — Guia Completo',
      description: 'Implementação prática de Clean Architecture aplicada ao NestJS com exemplos reais.',
      type: ResourceType.LINK,
      url: 'https://dev.to/exemplo-clean-architecture',
      summary: '• Separação em camadas: Domain, Application, Infrastructure\n• Inversão de dependências com injeção no NestJS\n• Repository Pattern com Prisma ORM\n• Testes unitários isolados por camada\n• Migração gradual de código legado para Clean Arch',
      status: ResourceStatus.APPROVED,
      userId: student1.id,
      disciplineId: disciplines[2].id,
      viewCount: 203,
      tags: { create: [{ tagId: tags[6].id }, { tagId: tags[7].id }] },
    },
  })

  const resource4 = await prisma.resource.create({
    data: {
      title: 'Redes Neurais do Zero — Material da Disciplina',
      description: 'Apostila completa com teoria e implementação de redes neurais sem frameworks.',
      type: ResourceType.PDF,
      url: 'https://storage.example.com/pdfs/redes-neurais.pdf',
      fileSize: 5_100_000,
      status: ResourceStatus.PENDING,
      userId: student2.id,
      disciplineId: disciplines[3].id,
      viewCount: 0,
      tags: { create: [{ tagId: tags[0].id }, { tagId: tags[9].id }] },
    },
  })

  console.log('✅ Recursos criados')

  // --- Avaliações ---
  await prisma.rating.createMany({
    data: [
      { stars: 5, userId: student2.id, resourceId: resource1.id },
      { stars: 4, userId: moderator.id, resourceId: resource1.id },
      { stars: 5, userId: student1.id, resourceId: resource2.id },
      { stars: 3, userId: moderator.id, resourceId: resource2.id },
      { stars: 5, userId: student2.id, resourceId: resource3.id },
      { stars: 5, userId: moderator.id, resourceId: resource3.id },
    ],
  })

  console.log('✅ Avaliações criadas')

  // --- Comentários ---
  const comment1 = await prisma.comment.create({
    data: {
      body: 'Material excelente! A parte sobre Dijkstra ficou muito clara. Obrigado por compartilhar!',
      userId: student2.id,
      resourceId: resource1.id,
    },
  })

  await prisma.comment.create({
    data: {
      body: 'Concordo! Eu estava com dificuldade nesse tema e esse PDF resolveu minha dúvida completamente.',
      userId: moderator.id,
      resourceId: resource1.id,
      parentId: comment1.id,
    },
  })

  await prisma.comment.create({
    data: {
      body: 'Ótimo vídeo sobre Window Functions. Alguém tem exercícios práticos para complementar?',
      userId: student1.id,
      resourceId: resource2.id,
    },
  })

  console.log('✅ Comentários criados')

  // --- Moderação ---
  await prisma.moderation.createMany({
    data: [
      { resourceId: resource1.id, moderatorId: moderator.id, status: ResourceStatus.APPROVED, reviewedAt: new Date() },
      { resourceId: resource2.id, moderatorId: moderator.id, status: ResourceStatus.APPROVED, reviewedAt: new Date() },
      { resourceId: resource3.id, moderatorId: moderator.id, status: ResourceStatus.APPROVED, reviewedAt: new Date() },
      { resourceId: resource4.id, status: ResourceStatus.PENDING, aiFlags: [] },
    ],
  })

  console.log('✅ Moderações criadas')
  console.log('')
  console.log('🎉 Seed concluído com sucesso!')
  console.log('')
  console.log('👤 Credenciais de acesso:')
  console.log('   Admin:      admin@biblion.edu     / senha123')
  console.log('   Moderador:  moderador@biblion.edu / senha123')
  console.log('   Aluno 1:    joao@aluno.edu        / senha123')
  console.log('   Aluno 2:    maria@aluno.edu       / senha123')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
