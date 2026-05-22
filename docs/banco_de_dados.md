# Banco de Dados — BibliON Campus

## Diagrama Entidade-Relacionamento (DER)

```mermaid
erDiagram
    USER {
        string id PK
        string name
        string email UK
        string password
        enum role
        string avatarUrl
        string institution
        string bio
        bool isActive
        datetime createdAt
        datetime updatedAt
    }

    REFRESH_TOKEN {
        string id PK
        string token UK
        string userId FK
        datetime expiresAt
        datetime createdAt
    }

    RESOURCE {
        string id PK
        string title
        string description
        enum type
        string url
        int fileSize
        string summary
        enum status
        int viewCount
        string userId FK
        string disciplineId FK
        datetime createdAt
        datetime updatedAt
    }

    DISCIPLINE {
        string id PK
        string name UK
        string slug UK
        string description
        string color
        datetime createdAt
    }

    TAG {
        string id PK
        string name UK
        string slug UK
        datetime createdAt
    }

    RESOURCE_TAG {
        string resourceId FK
        string tagId FK
    }

    RATING {
        string id PK
        int stars
        string userId FK
        string resourceId FK
        datetime createdAt
        datetime updatedAt
    }

    COMMENT {
        string id PK
        string body
        string userId FK
        string resourceId FK
        string parentId FK
        datetime createdAt
        datetime updatedAt
    }

    MODERATION {
        string id PK
        string resourceId FK UK
        string moderatorId FK
        enum status
        string reason
        string[] aiFlags
        datetime reviewedAt
        datetime createdAt
    }

    USER ||--o{ RESOURCE : "envia"
    USER ||--o{ RATING : "avalia"
    USER ||--o{ COMMENT : "comenta"
    USER ||--o{ REFRESH_TOKEN : "possui"
    USER ||--o{ MODERATION : "modera"
    RESOURCE }o--|| DISCIPLINE : "pertence"
    RESOURCE ||--o{ RESOURCE_TAG : "tem"
    TAG ||--o{ RESOURCE_TAG : "etiqueta"
    RESOURCE ||--o{ RATING : "recebe"
    RESOURCE ||--o{ COMMENT : "recebe"
    RESOURCE ||--o| MODERATION : "passa por"
    COMMENT ||--o{ COMMENT : "responde"
```

## Estratégia de Índices

```sql
-- Busca por status (query mais frequente)
CREATE INDEX idx_resources_status ON resources(status);

-- Filtro por tipo de recurso
CREATE INDEX idx_resources_type ON resources(type);

-- Recursos de um usuário
CREATE INDEX idx_resources_user_id ON resources(user_id);

-- Recursos por disciplina
CREATE INDEX idx_resources_discipline_id ON resources(discipline_id);

-- Paginação por data (decrescente)
CREATE INDEX idx_resources_created_at ON resources(created_at DESC);

-- Full-text search (criado separadamente para suporte a português)
CREATE INDEX idx_resources_fts ON resources
  USING GIN (to_tsvector('portuguese',
    title || ' ' || COALESCE(description, '') || ' ' || COALESCE(summary, '')
  ));

-- Comentários de um recurso
CREATE INDEX idx_comments_resource_id ON comments(resource_id);

-- Avaliação única por usuário/recurso (garantida pelo UNIQUE)
-- Já coberta pelo constraint UNIQUE(user_id, resource_id)
```

## Estratégia de Full-text Search

O PostgreSQL oferece full-text search nativo com suporte a idioma português, eliminando a necessidade de Elasticsearch para o volume deste projeto.

```sql
-- Exemplo de query com ranking por relevância
SELECT
  id, title,
  ts_rank(
    to_tsvector('portuguese', title || ' ' || COALESCE(description, '')),
    plainto_tsquery('portuguese', 'algoritmos grafos')
  ) AS relevance
FROM resources
WHERE
  status = 'APPROVED'
  AND to_tsvector('portuguese', title || ' ' || COALESCE(description, ''))
      @@ plainto_tsquery('portuguese', 'algoritmos grafos')
ORDER BY relevance DESC;
```

A função `plainto_tsquery` é mais tolerante que `to_tsquery` — aceita texto livre sem operadores booleanos, ideal para caixas de busca.

## Enum Strategy

Os enums são declarados no nível do banco (PostgreSQL native enums), não apenas na aplicação. Isso garante consistência mesmo com acesso direto ao banco.

```sql
CREATE TYPE "Role" AS ENUM ('STUDENT', 'MODERATOR', 'ADMIN');
CREATE TYPE "ResourceType" AS ENUM ('PDF', 'VIDEO', 'LINK', 'ARTICLE');
CREATE TYPE "ResourceStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
```

## Políticas de Soft Delete

Recursos rejeitados são mantidos no banco com `status = REJECTED` para fins de auditoria. Apenas admins podem deletar permanentemente. Usuários excluídos têm `isActive = false` (soft delete) preservando integridade referencial dos conteúdos publicados.

## Volumes e Estimativas

| Tabela | Linhas esperadas (1 ano) | Tamanho estimado |
|---|---|---|
| users | 5.000 | ~2 MB |
| resources | 20.000 | ~50 MB |
| tags | 500 | ~100 KB |
| ratings | 80.000 | ~10 MB |
| comments | 30.000 | ~20 MB |
| **Total** | | **~82 MB** |

Bem dentro do free tier do Supabase (500 MB) e Railway.
