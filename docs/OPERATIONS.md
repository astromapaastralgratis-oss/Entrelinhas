# Astral Content Studio - Operação e Deploy

## Variáveis obrigatórias

Configure no `.env.local` e na Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
IMAGE_GENERATION_API_KEY=
NEXT_PUBLIC_APP_URL=
```

Variáveis recomendadas:

```env
OPENAI_COPY_MODEL=gpt-5.2
GEMINI_COPY_MODEL=gemini-1.5-flash
IMAGE_GENERATION_PROVIDER=openai
IMAGE_GENERATION_MODEL=gpt-image-1
IMAGE_GENERATION_ESTIMATED_COST=0.04
AI_DAILY_COST_LIMIT_USD=1
NEXT_PUBLIC_AI_DAILY_TOKEN_LIMIT=10000
NEXT_PUBLIC_AI_WEEKLY_TOKEN_LIMIT=50000
```

Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no cliente. Use apenas em rotas server-side quando necessário.

## Supabase

1. Crie o projeto Supabase.
2. Ative Auth com e-mail/senha ou magic link.
3. Rode todas as migrations em `supabase/migrations`.
4. Confirme as tabelas:
   - `content_calendar`
   - `generated_posts`
   - `generated_post_images`
   - `generation_history`
   - `ai_generation_usage`
   - `automation_settings`
   - `generation_cache`
5. Confirme RLS ativo em todas as tabelas principais.
6. Confirme buckets de Storage:
   - `posts`
   - `stories`
   - `carousels`
   - `reels-covers`
   - `exports`
7. Faça login no app antes de testar salvamento real, porque as policies usam `auth.uid()`.

## Vercel

1. Suba o repositório para GitHub.
2. Importe o projeto na Vercel.
3. Framework: Next.js.
4. Build command: `npm run build`.
5. Configure todas as variáveis de ambiente.
6. Rode um Preview Deploy.
7. Teste:
   - geração de copy
   - geração de PNG
   - download individual
   - ZIP do dia
   - Performance Manual
8. Promova para Production.
9. Configure domínio e atualize `NEXT_PUBLIC_APP_URL`.

## IA de texto

O app usa prompt compacto e não envia branding completo em toda chamada.

Ordem de provedor:
1. `OPENAI_API_KEY`
2. `GEMINI_API_KEY`
3. fallback local

Se a IA falhar, o fluxo continua com copy de template e marca a origem como `fallback`.

## Geração de imagem

Configure:

```env
IMAGE_GENERATION_API_KEY=
IMAGE_GENERATION_PROVIDER=openai
IMAGE_GENERATION_MODEL=gpt-image-1
```

Cada card/story/capa é gerado separadamente. O prompt rejeita grid, colagem e múltiplas telas.

Sem chave válida, o app usa fallback PNG para manter o fluxo operacional.

## Fluxo diário

1. Abra “Conteúdos de Hoje”.
2. Clique em “Gerar conteúdos de hoje”.
3. Em cada conteúdo, clique em “Regenerar copy”.
4. Revise legenda, CTA, hashtags e comentário fixado.
5. Clique em “Gerar PNG” em cada imagem necessária.
6. Clique em “Aprovar”.
7. Abra “Pronto para postar”.
8. Baixe PNG, copie legenda/hashtags e publique manualmente.
9. Marque como publicado.
10. Registre performance em “Performance Manual”.

## Semana completa

1. Escolha modo econômico, padrão ou crescimento.
2. Opcionalmente trave temas da semana.
3. Clique em “Gerar semana”.
4. Revise o calendário semanal.
5. Gere copy e imagem apenas dos conteúdos que serão usados.

## Regeneração segura

Prefira regenerar apenas o item necessário:

- copy de um conteúdo
- prompt visual de um conteúdo
- PNG de um card/story específico

O app bloqueia ou alerta contra geração em massa sem confirmação operacional.

## Métricas

Em “Performance Manual”, registre:

- views
- likes
- comentários
- salvamentos
- compartilhamentos
- novos seguidores
- cliques na bio
- observação qualitativa

O app usa cálculo simples e transparente para recomendar formatos, temas, CTAs e horários melhores.

## Logs

A tela principal mostra logs recentes para:

- geração iniciada
- geração concluída
- erro de IA
- erro de imagem
- erro de Supabase
- custo estimado
- regeneração
- aprovação
- publicação

Também há logs estruturados no console com prefixo `[AstralContentStudio]`.

## Erros comuns

### IA indisponível
Verifique `OPENAI_API_KEY` ou `GEMINI_API_KEY`. O fallback local deve continuar funcionando.

### JSON inválido
O app rejeita a resposta e usa fallback. Tente regenerar somente o item.

### Storage indisponível
Confirme buckets, policies e login do usuário. Sem Storage, o app ainda mostra PNG fallback em data URL.

### RLS bloqueando escrita
Confirme que o usuário está autenticado e que `auth.uid()` corresponde ao `user_id`.

### Limite de custo atingido
Mude para modo econômico, reduza geração semanal ou regenere apenas um conteúdo.

### Conteúdo inválido
O validador bloqueia promessa absoluta, diagnóstico psicológico, copy genérica e texto longo demais.

## Checklist de produção

- `npm run typecheck`
- `npm run test:unit`
- `npm run lint`
- `npm run build`
- `npx playwright test`
- Supabase migrations aplicadas
- Buckets criados
- Variáveis na Vercel
- Preview deploy testado
- Production deploy promovido
