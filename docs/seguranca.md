# Segurança — BibliON Campus

## Autenticação (JWT Duplo Token)

```
Access Token  → 15 min → Stateless, rápido
Refresh Token → 7 dias → Armazenado no banco, rotativo
```

**Rotação de Refresh Token:** cada uso invalida o token atual e emite um novo. Se um token for roubado e usado, o legítimo será invalidado — detectando o comprometimento.

## RBAC (Role-Based Access Control)

| Recurso | STUDENT | MODERATOR | ADMIN |
|---|---|---|---|
| Ler recursos aprovados | ✅ | ✅ | ✅ |
| Enviar material | ✅ | ✅ | ✅ |
| Editar/deletar próprio | ✅ | ✅ | ✅ |
| Editar/deletar qualquer | ❌ | ✅ | ✅ |
| Moderar recursos | ❌ | ✅ | ✅ |
| Gerenciar usuários | ❌ | ❌ | ✅ |

## Proteção de Senhas

```typescript
// Hash com bcrypt, salt rounds=10
// Tempo de hash ~100ms — resiste a ataques de força bruta
const hash = await bcrypt.hash(password, 10)
```

## Prevenção de Injeção

Prisma usa **prepared statements** automaticamente — nenhuma query é concatenada como string. Campos de busca full-text são sanitizados antes de entrar no `plainto_tsquery`.

## Rate Limiting

```typescript
ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }])
// 100 requests por IP por minuto
// Protege contra DDoS e scraping
```

## Validação de Uploads

```typescript
new MaxFileSizeValidator({ maxSize: 20 * 1024 * 1024 }) // 20MB max
new FileTypeValidator({ fileType: 'application/pdf' })   // Somente PDF
```

## CORS Restrito

```typescript
app.enableCors({
  origin: process.env.NEXT_PUBLIC_APP_URL, // Apenas o domínio do frontend
  credentials: true,
})
```

## Variáveis de Ambiente

Nenhum segredo é hardcoded. O `.env` está no `.gitignore`. O `.env.example` contém apenas exemplos sem valores reais.
