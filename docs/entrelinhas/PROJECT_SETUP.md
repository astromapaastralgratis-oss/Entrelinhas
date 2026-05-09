# Entrelinhas - Setup de Projeto

## Identidade

- Nome do produto: Entrelinhas
- Categoria: mentora executiva com IA
- Público: jovens mulheres em ambiente corporativo
- Produto principal do MVP: gerador premium de scripts executivos

## Contas que precisam existir

Estas contas precisam ser criadas ou acessadas por você:

1. GitHub
   - Criar repositório: `entrelinhas`
   - Conectar o repositório local ao remoto

2. Vercel
   - Criar projeto a partir do GitHub
   - Framework: Next.js
   - Build command: `npm run build`
   - Install command: `npm install`

3. Supabase
   - Criar projeto do Entrelinhas
   - Rodar migrations em `supabase/migrations`
   - Configurar Auth com email e senha
   - Configurar URLs de redirect

4. OpenAI
   - Criar API key para geração real de scripts
   - Configurar `OPENAI_API_KEY` na Vercel

5. Email transacional ou SMTP
   - Para MVP, Supabase pode enviar com remetente padrão
   - Para produção, configurar domínio próprio e SMTP

## Variáveis de ambiente

Obrigatórias:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=
```

Para IA real:

```env
OPENAI_API_KEY=
OPENAI_COPY_MODEL=gpt-5.2
```

Para operações administrativas futuras:

```env
SUPABASE_SERVICE_ROLE_KEY=
```

## URLs de autenticação no Supabase

Local:

```text
http://localhost:3001/**
```

Produção:

```text
https://entrelinhas-eosin.vercel.app/**
```

Preview Vercel, se usar:

```text
https://*.vercel.app/**
```

Use wildcard de preview com cuidado.
