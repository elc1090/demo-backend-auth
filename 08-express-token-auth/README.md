# 08 - Express token auth

Exemplo minimalista de autenticação com JWT.

- `POST /api/login` devolve um token.
- O cliente envia `Authorization: Bearer <token>`.
- O servidor verifica assinatura, expiração e claims.

Contas:
- `ana@example.com` / `ana12345` → `user`
- `admin@example.com` / `admin12345` → `admin`

O token fica apenas em uma variável JavaScript para tornar o fluxo visível. O exemplo não tenta modelar armazenamento/refresh de produção.
