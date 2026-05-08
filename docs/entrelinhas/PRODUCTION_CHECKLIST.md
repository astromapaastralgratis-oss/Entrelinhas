# Entrelinhas - Checklist de Produção

## Antes do deploy

- Confirmar que `npm run build` passa
- Confirmar que Supabase Auth está ativo
- Rodar migration `202605070001_create_entrelinhas_schema.sql`
- Configurar variáveis de ambiente na Vercel
- Configurar URL pública no Supabase Auth
- Testar cadastro, login, geração, salvar e histórico

## Vercel

Configuração recomendada:

```text
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: vazio
```

Variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=https://entrelinhas.vercel.app
OPENAI_API_KEY=
OPENAI_COPY_MODEL=gpt-5.2
```

## Supabase

Tabelas do MVP:

- `profiles`
- `generated_scripts`
- `saved_scripts`

RLS:

- Cada usuária acessa apenas os próprios dados
- Inserts precisam usar `auth.uid()`

## Email

Para MVP:

- Usar emails padrão do Supabase ou colar os templates da pasta `emails`

Para produção:

- Criar domínio ou subdomínio de envio, por exemplo `mail.entrelinhas.com.br`
- Configurar SPF, DKIM e DMARC no DNS
- Configurar SMTP/transacional no Supabase

## Teste final

Fluxo mínimo:

1. Abrir landing
2. Criar conta
3. Fazer login
4. Preencher perfil
5. Gerar script executivo
6. Copiar resposta
7. Salvar resposta
8. Ver histórico
