# O Que Você Precisa Criar Fora do Código

Eu consigo preparar arquivos, comandos, migrations e documentação. Você precisa criar ou conceder acesso aos serviços externos abaixo.

## 1. Repositório GitHub

Crie um repositório chamado:

```text
entrelinhas
```

Depois me passe a URL HTTPS do repositório se quiser que eu conecte o remoto local.

## 2. Projeto Supabase

Crie um projeto chamado:

```text
Entrelinhas
```

Depois copie:

```text
Project URL
Anon public key
Service role key
```

A service role key é sensível. Só use em ambiente seguro e nunca exponha no front-end.

## 3. Projeto Vercel

Importe o repositório GitHub na Vercel.

Depois configure as variáveis em:

```text
Project Settings > Environment Variables
```

## 4. Chave OpenAI

Crie uma API key para o Entrelinhas.

Variável:

```text
OPENAI_API_KEY
```

## 5. Email de produto

Sugestões:

```text
contato@entrelinhas.com.br
suporte@entrelinhas.com.br
oi@entrelinhas.com.br
```

Para o MVP, pode começar com um email seu. Para produção, recomendo domínio próprio.

## 6. Domínio

Opcional no MVP, recomendado para produção:

```text
entrelinhas.com.br
app.entrelinhas.com.br
```

Configurar DNS na Vercel quando o domínio existir.
