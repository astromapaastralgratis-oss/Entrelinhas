# Astral Content Studio - Operacao e Deploy

## Variaveis obrigatorias

Configure no `.env.local` e no Render:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
IMAGE_GENERATION_API_KEY=
NEXT_PUBLIC_APP_URL=
```

Variaveis recomendadas:

```env
AI_TEXT_PROVIDER=gemini
OPENAI_COPY_MODEL=gpt-5.2
GEMINI_COPY_MODEL=gemini-2.5-flash
IMAGE_GENERATION_PROVIDER=openai
IMAGE_GENERATION_MODEL=gpt-image-1
IMAGE_GENERATION_ESTIMATED_COST=0.04
AI_DAILY_COST_LIMIT_USD=1
NEXT_PUBLIC_AI_DAILY_TOKEN_LIMIT=10000
NEXT_PUBLIC_AI_WEEKLY_TOKEN_LIMIT=50000
```

Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no cliente. Use apenas em rotas server-side quando necessario.

## Supabase

1. Rode todas as migrations em `supabase/migrations`, incluindo a migration de hardening mais recente.
2. Confirme as tabelas principais: `content_calendar`, `generated_posts`, `generated_post_images`, `generation_history`, `ai_generation_usage`, `automation_settings`, `generation_cache`, `performance_metrics` e `operation_logs`.
3. Confirme RLS ativo nas tabelas.
4. Confirme os buckets de Storage: `posts`, `stories`, `carousels`, `reels-covers` e `exports`.
5. Faca login no app antes de testar salvamento real. As policies usam `auth.uid()`.
6. Em Auth URL Configuration, deixe `Site URL` igual ao dominio do Render e adicione o mesmo dominio em Redirect URLs.

## Render

1. Conecte o repositorio GitHub ao Render como Web Service.
2. Runtime: Node.
3. Branch: `main`.
4. Build command: `npm install; npm run build`.
5. Start command: `npm run start`.
6. Configure todas as variaveis de ambiente.
7. Clique em deploy e aguarde status `Deployed`.
8. Abra a URL `https://astral-content-studio.onrender.com`.
9. Atualize `NEXT_PUBLIC_APP_URL` com a URL final.

## Fluxo diario simples

1. Abra `Conteudos de Hoje`.
2. Clique em `Gerar conteudos de hoje`.
3. Em cada conteudo, clique em `Regenerar copy`.
4. Gere o PNG individual de cada card/story/capa.
5. Revise qualidade, CTA, legenda e comentario fixado.
6. Clique em `Aprovar` somente quando houver copy valida e imagem gerada.
7. Abra `Pronto para postar`.
8. Baixe PNG, copie legenda e publique manualmente.
9. Marque como `publicado`.
10. Registre os numeros em `Performance Manual`.

## Regras de seguranca operacional

- As rotas de IA exigem usuario autenticado.
- O `userId` nunca deve vir do navegador como fonte de verdade.
- O custo diario e calculado no servidor antes de chamar IA.
- O fallback de imagem deve produzir PNG valido.
- O ZIP deve incluir PNG seguro ou placeholder PNG valido.
- O status aprovado/publicado deve ser salvo no Supabase.

## Erros comuns

### IA indisponivel
Verifique `OPENAI_API_KEY` ou `GEMINI_API_KEY`. O fallback local deve continuar funcionando.

### Storage indisponivel
Confirme buckets, policies e login do usuario. Sem Storage, o app usa PNG fallback para manter o fluxo.

### RLS bloqueando escrita
Confirme que o usuario esta autenticado e que `auth.uid()` corresponde ao `user_id`.

### Limite de custo atingido
Mude para modo economico, reduza a geracao semanal ou regenere apenas um conteudo.

## Checklist de producao

- `npm run typecheck`
- `npm run test:unit`
- `npm run build`
- Supabase migrations aplicadas
- Buckets criados
- Variaveis no Render
- Auth URL do Supabase apontando para o Render
- Copy gerada
- PNG individual baixado e aberto
- Status aprovado/publicado persistindo apos reload
