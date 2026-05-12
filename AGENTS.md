# Instrucoes Operacionais Do Projeto Entrelinhas

## Publicacao Obrigatoria

Toda alteracao solicitada pela usuaria deve ser tratada como alteracao para producao, salvo se ela disser explicitamente que e apenas rascunho, planejamento ou analise.

Ao concluir qualquer implementacao:

1. Rodar as validacoes relevantes, no minimo:
   - `npm.cmd run typecheck`
   - `npm.cmd run build`
   - `npm.cmd run lint`, quando disponivel
2. Corrigir erros bloqueantes antes de publicar.
3. Fazer commit das alteracoes.
4. Fazer push para `main`, para acionar o deploy automatico na Vercel.
5. Informar claramente o status do deploy/codigo enviado.

## Acoes Manuais

Se qualquer alteracao exigir acao manual da usuaria, especialmente no Supabase, Vercel, variaveis de ambiente, dominio, autenticacao ou painel externo:

1. Avisar no final da entrega, sem deixar implicito.
2. Explicar em formato ELI5, passo a passo.
3. Informar exatamente onde clicar, o que copiar/colar e o que confirmar.
4. Informar o que acontece se a acao manual nao for feita.

## Supabase

Quando houver migration, tabela, politica RLS, indice, funcao SQL ou mudanca de schema:

1. Criar o arquivo de migration no projeto.
2. Se nao for possivel aplicar automaticamente no Supabase, entregar o SQL completo.
3. Explicar o passo a passo ELI5 para aplicar no SQL Editor.
4. Nao considerar a feature finalizada em producao sem avisar se a migration ainda precisa ser aplicada.

## Vercel

O projeto usa deploy automatico pela branch `main`.

Depois de cada alteracao implementada e validada:

1. Fazer commit.
2. Fazer push para `main`.
3. Informar que a Vercel deve publicar automaticamente.
4. Se houver falha de build/deploy ou se a validacao publica nao puder ser confirmada, informar claramente.
