# API REST — BibliON Campus

Base URL: `http://localhost:3001/api/v1`
Documentação interativa: `http://localhost:3001/api/docs` (Swagger)

## Autenticação

Todos os endpoints protegidos requerem o header:
```
Authorization: Bearer <accessToken>
```

---

## 🔐 Auth

### POST /auth/register
Cadastra novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@aluno.edu",
  "password": "senha123",
  "institution": "UFC"
}
```
**Response 201:**
```json
{
  "user": { "id": "...", "name": "João Silva", "email": "...", "role": "STUDENT" },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

---

### POST /auth/login
Autentica usuário existente.

**Body:** `{ "email": "...", "password": "..." }`

**Response 200:** igual ao register.

---

### POST /auth/refresh
Renova o access token.

**Body:** `{ "refreshToken": "eyJ..." }`

**Response 200:** `{ "accessToken": "...", "refreshToken": "..." }`

---

### POST /auth/logout
Invalida o refresh token.

**Body:** `{ "refreshToken": "eyJ..." }`

**Response 200:** `{ "message": "Logout realizado com sucesso" }`

---

## 📄 Resources

### GET /resources
Lista recursos aprovados com paginação.

**Query params:**
| Param | Tipo | Default | Descrição |
|---|---|---|---|
| page | number | 1 | Página atual |
| limit | number | 12 | Itens por página |
| type | string | — | PDF, VIDEO, LINK, ARTICLE |
| disciplineId | string | — | Filtrar por disciplina |

**Response 200:**
```json
{
  "data": [{
    "id": "cuid...",
    "title": "Introdução a Grafos",
    "type": "PDF",
    "url": "https://storage.googleapis.com/...",
    "summary": "• Tópico 1\n• Tópico 2",
    "status": "APPROVED",
    "viewCount": 127,
    "avgRating": 4.5,
    "ratingCount": 8,
    "createdAt": "2024-01-15T10:00:00Z",
    "user": { "id": "...", "name": "João Silva" },
    "discipline": { "id": "...", "name": "Algoritmos", "color": "#6366f1" },
    "tags": [{ "id": "...", "name": "grafos" }],
    "_count": { "comments": 3 }
  }],
  "meta": { "page": 1, "limit": 12, "total": 47, "pages": 4 }
}
```

---

### GET /resources/:id
Detalhe de um recurso (incrementa viewCount).

**Response 200:** objeto completo do recurso.

**Response 404:** `{ "message": "Recurso não encontrado" }`

---

### POST /resources *(auth)*
Cria novo recurso. Aceita `multipart/form-data` para upload de PDF.

**Form fields:**
| Campo | Obrigatório | Descrição |
|---|---|---|
| title | ✅ | Título do material |
| type | ✅ | PDF, VIDEO, LINK, ARTICLE |
| file | PDF | Arquivo PDF (quando type=PDF) |
| url | Não-PDF | URL do recurso externo |
| description | ❌ | Descrição opcional |
| summary | ❌ | Resumo (pode ser gerado pela IA) |
| disciplineId | ❌ | ID da disciplina |
| tags[] | ❌ | Array de tags |

**Response 201:** objeto do recurso criado com `status: "PENDING"`.

---

### PUT /resources/:id *(auth)*
Atualiza recurso (dono ou moderador/admin).

**Body:** campos opcionais: `title`, `description`, `summary`, `disciplineId`, `tags[]`

---

### DELETE /resources/:id *(auth)*
Remove recurso (dono ou moderador/admin).

---

### POST /resources/:id/ai-summary *(auth)*
Regenera resumo e tags via IA para um recurso existente.

---

## 🔍 Search

### GET /search?q=algoritmos
Busca full-text com ranking por relevância.

**Query params:**
| Param | Descrição |
|---|---|
| q | Termo de busca (obrigatório) |
| type | Filtro de tipo |
| disciplineId | Filtro de disciplina |
| page | Página |
| limit | Itens por página |

**Response 200:**
```json
{
  "data": [...],
  "meta": { "query": "algoritmos", "total": 12, "page": 1, "pages": 1 }
}
```

---

### GET /search/tags?q=algo
Autocomplete de tags.

**Response 200:** `[{ "id": "...", "name": "algoritmos", "slug": "algoritmos" }]`

---

### GET /search/disciplines
Lista todas as disciplinas com contagem de recursos.

---

## ⭐ Ratings

### GET /resources/:resourceId/ratings
Retorna média de avaliações.

**Response 200:** `{ "avg": 4.3, "total": 12 }`

---

### POST /resources/:resourceId/ratings *(auth)*
Avalia um recurso (upsert — uma avaliação por usuário).

**Body:** `{ "stars": 5 }`

---

### GET /resources/:resourceId/ratings/mine *(auth)*
Retorna minha avaliação para este recurso.

---

## 💬 Comments

### GET /resources/:resourceId/comments
Lista comentários com respostas aninhadas.

**Response 200:**
```json
[{
  "id": "...",
  "body": "Excelente material!",
  "createdAt": "...",
  "user": { "id": "...", "name": "Maria" },
  "replies": [{
    "id": "...",
    "body": "Concordo!",
    "user": { "name": "João" }
  }]
}]
```

---

### POST /resources/:resourceId/comments *(auth)*
Adiciona comentário.

**Body:** `{ "body": "Ótimo conteúdo!", "parentId": "opcional-para-resposta" }`

---

### DELETE /resources/:resourceId/comments/:id *(auth)*
Remove comentário (dono ou moderador).

---

## 🛡 Moderation *(MODERATOR/ADMIN)*

### GET /moderation/pending
Lista recursos aguardando moderação.

**Response 200:** lista paginada de recursos com status PENDING.

---

### GET /moderation/stats
Estatísticas de moderação.

**Response 200:** `{ "pending": 5, "approved": 89, "rejected": 12, "total": 106 }`

---

### POST /moderation/:id/approve
Aprova um recurso.

---

### POST /moderation/:id/reject
Rejeita um recurso.

**Body:** `{ "reason": "Conteúdo sem relação acadêmica" }`

---

### POST /moderation/:id/ai-check
Pré-moderação automática com IA.

**Response 200:** `{ "resourceId": "...", "flags": ["spam"] }` ou `{ "flags": [] }`

---

## 👤 Users

### GET /users/me *(auth)*
Perfil do usuário logado.

### PUT /users/me *(auth)*
Atualiza perfil. **Body:** `{ "name": "...", "bio": "...", "institution": "..." }`

### GET /users/me/resources *(auth)*
Recursos enviados pelo usuário logado (todos os status).

### GET /users/:id
Perfil público de um usuário.

### GET /users *(ADMIN)*
Lista todos os usuários.

### PATCH /users/:id/toggle-active *(ADMIN)*
Ativa/desativa usuário. **Body:** `{ "isActive": false }`

---

## 🤖 AI

### POST /ai/analyze *(auth)*
Analisa material e gera resumo + tags.

**Body:**
```json
{
  "title": "Introdução a Grafos",
  "type": "link",
  "description": "Material sobre teoria dos grafos"
}
```

**Response 200:**
```json
{
  "summary": "• Conceitos fundamentais de grafos\n• Algoritmos BFS e DFS\n...",
  "tags": ["grafos", "algoritmos", "bfs", "dfs", "teoria"]
}
```

---

## Códigos de Erro

| Código | Significado |
|---|---|
| 400 | Bad Request — dados inválidos |
| 401 | Unauthorized — token ausente ou expirado |
| 403 | Forbidden — sem permissão |
| 404 | Not Found — recurso não encontrado |
| 409 | Conflict — e-mail já cadastrado |
| 422 | Unprocessable Entity — validação falhou |
| 429 | Too Many Requests — rate limit excedido |
| 500 | Internal Server Error |
