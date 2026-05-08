# Entrelinhas - Operação e Deploy

Este projeto agora está orientado ao MVP do Entrelinhas: mentora executiva com IA para geração de scripts corporativos práticos.

## Stack atual

- Next.js
- React
- Tailwind CSS
- Supabase Auth
- Supabase Database
- OpenAI para geração de scripts
- Vercel como deploy recomendado

## Fluxo principal

1. Usuária cria conta ou entra
2. Preenche perfil profissional
3. Escolhe uma situação corporativa
4. Descreve contexto, resultado desejado, pessoas envolvidas e tom
5. Gera script executivo
6. Copia ou salva
7. Consulta histórico

## Variáveis obrigatórias

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=
```

## Variáveis recomendadas para IA real

```env
OPENAI_API_KEY=
OPENAI_COPY_MODEL=gpt-5.2
```

Sem `OPENAI_API_KEY`, a rota de geração usa fallback local para manter o MVP navegável.

## Supabase

Rodar a migration:

```text
supabase/migrations/202605070001_create_entrelinhas_schema.sql
```

Tabelas principais:

- `profiles`
- `generated_scripts`
- `saved_scripts`

RLS:

- Usuárias só podem acessar seus próprios perfis, scripts gerados e scripts salvos.

## Vercel

Configuração:

```text
Framework: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: vazio
```

Depois de configurar as variáveis, cada push na branch principal gera deploy automático.

## Emails

Templates base estão em:

```text
emails/
```

Para produção, configurar domínio próprio e SMTP/transacional no Supabase.

## Checklist de produção

- `npm run build`
- Supabase migrations aplicadas
- Supabase Auth URL configurada
- Vercel com variáveis de ambiente
- Cadastro testado
- Login testado
- Geração de script testada
- Histórico testado
- Perfil testado
