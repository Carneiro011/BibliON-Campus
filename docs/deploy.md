# Deploy — BibliON Campus

## Opção 1: Docker Compose (Recomendado para demonstração)

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/biblion-campus.git
cd biblion-campus

# 2. Configure o ambiente
cp .env.example .env
# Edite .env com suas chaves

# 3. Suba todos os serviços
docker compose up -d

# 4. Execute migrations + seed
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npm run db:seed

# 5. Acesse
# Frontend: http://localhost:3000
# API:      http://localhost:3001/api/v1
# Swagger:  http://localhost:3001/api/docs
```

## Opção 2: Deploy Gratuito em Produção

### Frontend → Vercel
```bash
cd frontend
npx vercel deploy
# Adicione as variáveis de ambiente no painel da Vercel
```

### Backend → Railway
```bash
# 1. Crie um projeto no railway.app
# 2. Conecte o repositório GitHub
# 3. Configure as variáveis de ambiente
# 4. Railway detecta o Dockerfile automaticamente
```

### Banco → Railway PostgreSQL ou Supabase
```bash
# Supabase (recomendado para free tier generoso):
# 1. Crie projeto em supabase.com
# 2. Copie a connection string
# 3. Use como DATABASE_URL
```

### Redis → Railway ou Upstash
```bash
# Upstash Redis (free tier: 10.000 req/dia):
# 1. Crie conta em upstash.com
# 2. Crie um banco Redis
# 3. Copie o REDIS_URL
```

## Checklist de Produção

- [ ] JWT_SECRET com mínimo 32 caracteres aleatórios
- [ ] JWT_REFRESH_SECRET diferente do JWT_SECRET
- [ ] HTTPS habilitado (automático na Vercel e Railway)
- [ ] Variáveis de ambiente configuradas (nunca .env commitado)
- [ ] Migrations executadas antes do deploy
- [ ] Seed apenas em desenvolvimento
- [ ] CORS configurado para o domínio de produção
- [ ] Rate limiting habilitado
- [ ] Firebase Storage bucket configurado como privado (URLs assinadas)

## Monitoramento

Para produção, recomenda-se:
- **Logs**: Railway Logs nativo ou Papertrail (free tier)
- **Uptime**: UptimeRobot (free, 50 monitores)
- **Erros**: Sentry (free tier, 5.000 erros/mês)
