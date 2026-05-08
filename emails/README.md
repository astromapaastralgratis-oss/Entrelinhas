# Emails do Entrelinhas

Templates para configurar em Supabase Auth ou em um provedor transacional futuro.

Para o MVP, o Supabase pode enviar emails com o remetente padrão. Em produção, recomendo configurar domínio próprio e SMTP/transacional para melhorar entrega.

Templates nesta pasta:
- `confirm-signup.html`: confirmação de cadastro
- `reset-password.html`: redefinição de senha
- `invite-user.html`: convite futuro, se houver beta fechado

Variáveis usadas pelo Supabase:
- `{{ .ConfirmationURL }}`
- `{{ .Email }}`
- `{{ .SiteURL }}`
