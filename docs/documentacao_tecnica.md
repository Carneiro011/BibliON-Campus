# Documentação Técnica — BibliON Campus

## Stack Tecnológica

### Frontend
| Tecnologia | Versão | Função |
|---|---|---|
| Next.js | 14.2 | Framework React com App Router |
| TypeScript | 5.4 | Tipagem estática |
| TailwindCSS | 3.4 | Estilização utilitária |
| React Hook Form | 7.51 | Gerenciamento de formulários |
| Zod | 3.23 | Validação de schemas |
| Axios | 1.6 | Cliente HTTP com interceptores |
| Lucide React | 0.378 | Ícones SVG |
| Sonner | 1.4 | Toast notifications |
| React Dropzone | 14.2 | Upload drag-and-drop |

### Backend
| Tecnologia | Versão | Função |
|---|---|---|
| NestJS | 10 | Framework Node.js modular |
| Prisma ORM | 5.10 | Acesso ao banco com type-safety |
| PostgreSQL | 15 | Banco relacional principal |
| JWT / Passport | — | Autenticação e autorização |
| class-validator | 0.14 | Validação declarativa de DTOs |
| Groq SDK | 0.3 | Cliente da API de IA |
| Firebase Admin | 12 | Upload para Firebase Storage |
| pdf-parse | 1.1 | Extração de texto de PDFs |
| bcryptjs | 2.4 | Hash de senhas |

### Infraestrutura
| Serviço | Função | Custo |
|---|---|---|
| Docker + Compose | Containerização | Gratuito |
| Vercel | Deploy do frontend | Free tier |
| Railway | Deploy do backend | Free tier |
| Supabase / Railway | PostgreSQL | Free tier |
| Firebase Storage | Armazenamento de PDFs | Free tier (5GB) |
| Groq API | LLM Llama 3.1 70B | Free tier |
| Redis (Railway) | Cache e rate limit | Free tier |

---

## Estrutura de Diretórios

```
biblion-campus/
├── .env.example
├── docker-compose.yml
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma        ← Schema completo
│   │   └── seed/index.ts        ← Dados iniciais
│   └── src/
│       ├── main.ts              ← Entry point + Swagger
│       ├── app.module.ts        ← Módulo raiz
│       ├── prisma/              ← PrismaService (global)
│       ├── auth/                ← JWT + estratégias Passport
│       │   ├── auth.module.ts
│       │   ├── auth.service.ts
│       │   ├── auth.controller.ts
│       │   ├── dto/
│       │   └── strategies/
│       ├── users/               ← Perfil e gerenciamento
│       ├── resources/           ← CRUD + upload PDF
│       ├── search/              ← Full-text search
│       ├── ratings/             ← Sistema de estrelas
│       ├── comments/            ← Comentários aninhados
│       ├── moderation/          ← Fila de aprovação
│       ├── ai/                  ← Integração Groq
│       ├── storage/             ← Firebase Storage
│       └── common/
│           ├── decorators/      ← @CurrentUser, @Roles
│           ├── guards/          ← JwtAuthGuard, RolesGuard
│           ├── filters/         ← Global exception filter
│           ├── interceptors/    ← Logging, transform
│           └── pipes/           ← Custom validation pipes
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── app/                 ← App Router (Next.js 14)
│       │   ├── layout.tsx       ← Root layout
│       │   ├── page.tsx         ← Landing page
│       │   ├── globals.css      ← Estilos globais
│       │   ├── auth/
│       │   │   ├── login/page.tsx
│       │   │   └── register/page.tsx
│       │   └── dashboard/
│       │       ├── layout.tsx   ← Sidebar navigation
│       │       ├── page.tsx     ← Home do dashboard
│       │       ├── search/page.tsx
│       │       ├── my-resources/page.tsx
│       │       ├── resources/
│       │       │   ├── new/page.tsx    ← Upload + IA
│       │       │   └── [id]/page.tsx   ← Detalhe
│       │       └── admin/
│       │           └── moderation/page.tsx
│       ├── components/
│       │   ├── resources/
│       │   │   ├── ResourceCard.tsx
│       │   │   └── ResourceCardSkeleton.tsx
│       │   └── shared/
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   └── useResources.ts
│       ├── lib/
│       │   ├── api.ts           ← Axios + interceptores
│       │   └── utils.ts         ← Utilitários
│       └── types/
│           └── index.ts         ← Tipagens TypeScript
│
└── docs/
    ├── arquitetura.md
    ├── banco_de_dados.md
    ├── api.md
    ├── deploy.md
    ├── seguranca.md
    ├── integracao_ia.md
    ├── engenharia_prompt.md
    ├── documentacao_tecnica.md  ← Este arquivo
    └── relatorio_academico.md
```

---

## Fluxos Principais

### Fluxo de Upload de PDF
1. Usuário seleciona arquivo → validação client-side (tipo, tamanho)
2. Formulário submetido como `multipart/form-data`
3. Backend valida com `ParseFilePipe` (max 20MB, somente PDF)
4. Arquivo enviado ao Firebase Storage via Admin SDK
5. URL pública armazenada no banco com `status: PENDING`
6. Análise IA disparada de forma assíncrona (não bloqueia)
7. Entrada criada em `moderations` para revisão

### Fluxo de Busca
1. Usuário digita termo na caixa de busca
2. Frontend envia `GET /search?q=termo` com debounce de 300ms
3. Backend constrói `plainto_tsquery('portuguese', termo)` sanitizado
4. Query combina ts_vector search + fallback ILIKE
5. Resultados ordenados por `ts_rank` (relevância TF-IDF) + viewCount
6. Tags buscadas em consulta separada para evitar produto cartesiano

### Fluxo de Moderação
1. Recurso criado com `status: PENDING`
2. Moderador acessa `/admin/moderation` (lista pendentes)
3. Pode solicitar pré-análise IA (detecta spam/copyright)
4. Lê detalhes do recurso (link para página completa)
5. Aprova → `status: APPROVED` → visível para todos
6. Rejeita → `status: REJECTED` + motivo registrado

---

## Padrões de Código

### Nomenclatura
- **Arquivos**: `kebab-case` (ex: `auth.service.ts`)
- **Classes**: `PascalCase` (ex: `ResourcesService`)
- **Variáveis/funções**: `camelCase`
- **Constantes globais**: `UPPER_SNAKE_CASE`
- **Banco de dados**: `snake_case` (mapeado pelo Prisma `@map`)

### Princípios Aplicados
- **Single Responsibility**: cada serviço resolve um domínio
- **Dependency Injection**: NestJS injeta dependências automaticamente
- **DTO Validation**: todos os inputs validados antes de chegar ao service
- **Error Propagation**: services lançam exceções HTTP do NestJS (`NotFoundException`, etc.)
- **Type Safety**: `any` proibido exceto em casos de tipagem externa incompleta

---

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | ✅ | Connection string do PostgreSQL |
| `JWT_SECRET` | ✅ | Segredo para assinar access tokens |
| `JWT_REFRESH_SECRET` | ✅ | Segredo para refresh tokens (diferente!) |
| `JWT_EXPIRES_IN` | ❌ | Expiração do access token (default: 15m) |
| `JWT_REFRESH_EXPIRES_IN` | ❌ | Expiração do refresh (default: 7d) |
| `GROQ_API_KEY` | ✅ | Chave da Groq API |
| `FIREBASE_PROJECT_ID` | ✅ | ID do projeto Firebase |
| `FIREBASE_PRIVATE_KEY` | ✅ | Chave privada do service account |
| `FIREBASE_CLIENT_EMAIL` | ✅ | E-mail do service account |
| `FIREBASE_STORAGE_BUCKET` | ✅ | Nome do bucket Firebase Storage |
| `REDIS_URL` | ❌ | URL do Redis (default: redis://localhost:6379) |
| `PORT` | ❌ | Porta do backend (default: 3001) |
| `NEXT_PUBLIC_API_URL` | ✅ | URL base da API (frontend) |
