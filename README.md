# 📚 BibliON Campus

> Plataforma colaborativa de materiais acadêmicos com Inteligência Artificial

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![NestJS](https://img.shields.io/badge/NestJS-10-e0234e?logo=nestjs)](https://nestjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://prisma.io)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)](https://docker.com)

## Visão Geral

O **BibliON Campus** é uma plataforma web colaborativa onde estudantes compartilham materiais acadêmicos — PDFs, vídeos e links — com geração automática de resumos e tags usando a API da Groq (modelo Llama 3.1 70B).

## ✨ Funcionalidades

| Feature | Status |
|---|---|
| Autenticação JWT com refresh token | ✅ |
| Upload de PDFs (Firebase Storage) | ✅ |
| Compartilhamento de links e vídeos | ✅ |
| Geração de resumo com IA (Llama 3) | ✅ |
| Geração de tags automáticas | ✅ |
| Busca full-text (PostgreSQL) | ✅ |
| Sistema de avaliações (estrelas) | ✅ |
| Comentários com respostas aninhadas | ✅ |
| Fluxo de moderação | ✅ |
| Pré-moderação por IA | ✅ |
| Organização por disciplinas | ✅ |
| Dashboard responsivo | ✅ |
| Swagger / OpenAPI | ✅ |
| Docker Compose | ✅ |

## 🏗 Arquitetura

```
biblion-campus/
├── frontend/          # Next.js 14 + TypeScript + TailwindCSS
├── backend/           # NestJS + Prisma + PostgreSQL
├── docs/              # Documentação completa
├── docker-compose.yml # Orquestração dos serviços
└── .env.example       # Variáveis de ambiente
```

**Stack completa:**
- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, React Hook Form, Zod
- **Backend:** NestJS, Prisma ORM, JWT, Passport, class-validator, Swagger
- **Banco:** PostgreSQL 15 com full-text search nativo
- **Storage:** Firebase Storage (PDFs)
- **IA:** Groq API — modelo `llama-3.1-70b-versatile`
- **Infra:** Docker, Docker Compose, Redis (cache)

## 🚀 Execução rápida (Docker)

### Pré-requisitos
- Docker e Docker Compose instalados
- Conta no [Groq Console](https://console.groq.com) (grátis)
- Projeto no [Firebase](https://console.firebase.google.com) (grátis)

### 1. Clone e configure
```bash
git clone https://github.com/seu-usuario/biblion-campus.git
cd biblion-campus
cp .env.example .env
# Edite o .env com suas chaves
```

### 2. Suba os serviços
```bash
docker compose up -d
```

### 3. Execute as migrations e seed
```bash
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npm run db:seed
```

### 4. Acesse
| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001/api/v1 |
| Swagger | http://localhost:3001/api/docs |

## 🖥 Execução local (sem Docker)

### Backend
```bash
cd backend
cp ../.env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 👤 Credenciais demo

| Perfil | E-mail | Senha |
|---|---|---|
| Admin | admin@biblion.edu | senha123 |
| Moderador | moderador@biblion.edu | senha123 |
| Aluno 1 | joao@aluno.edu | senha123 |
| Aluno 2 | maria@aluno.edu | senha123 |

## 📖 Documentação

| Documento | Descrição |
|---|---|
| [Arquitetura](docs/arquitetura.md) | Decisões e diagramas de arquitetura |
| [Banco de Dados](docs/banco_de_dados.md) | Schema, DER e modelagem |
| [API REST](docs/api.md) | Endpoints e contratos |
| [Integração IA](docs/integracao_ia.md) | Groq API e engenharia de prompt |
| [Segurança](docs/seguranca.md) | JWT, RBAC e boas práticas |
| [Deploy](docs/deploy.md) | Guia de produção |
| [Relatório Acadêmico](docs/relatorio_academico.md) | Relatório completo |

## 🔑 Variáveis de Ambiente

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
GROQ_API_KEY=gsk_...
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_STORAGE_BUCKET=...
```

## 📡 Endpoints principais

```
POST   /api/v1/auth/register         Cadastro
POST   /api/v1/auth/login            Login
POST   /api/v1/auth/refresh          Renovar token
GET    /api/v1/resources             Listar recursos
POST   /api/v1/resources             Criar recurso
GET    /api/v1/resources/:id         Detalhe
GET    /api/v1/search?q=...          Busca full-text
POST   /api/v1/ai/analyze            Analisar com IA
GET    /api/v1/moderation/pending    Fila de moderação
POST   /api/v1/moderation/:id/approve Aprovar
```

## 🧪 Testes

```bash
cd backend
npm run test          # Unit tests
npm run test:cov      # Com cobertura
```

## 📄 Licença

MIT — Projeto acadêmico de livre uso.
