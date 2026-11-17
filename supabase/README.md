# GymFlow — exercícios

## Rodar no Expo

1. Abra a pasta do projeto no VS Code. Crie um arquivo chamado `.env` ao lado do `package.json`, usando `.env.example` como modelo.
2. Copie a **Project URL** e a **Publishable key** do projeto GymFlow no Supabase, em **Connect**. Preencha `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_KEY` no `.env`.
3. No terminal, rode `npm ci` e `npx expo start`. Abra o app no celular e entre com o e-mail habilitado pela equipe.
4. Em **Exercícios → Novo**, cadastre um exercício com uma foto. Confirme o registro em **Table Editor → exercises** e o arquivo em **Storage → exercise-photos**.

O catálogo permite buscar por nome, filtrar por grupo muscular, favoritar, cadastrar, editar e excluir exercícios. Os detalhes dos favoritos ficam disponíveis offline no aparelho. Se o equipamento ficar em branco, o cadastro usa `Livre`.

## Banco da equipe

A migração `migrations/20261116170000_exercise_catalog.sql` complementa a tabela `public.exercises` do projeto. A tabela já tem `user_id` e uma política de acesso por proprietário. A migração cria o bucket privado de fotos e sua política de acesso por pasta de usuário. Use esse arquivo no **SQL Editor** em projetos onde a estrutura do catálogo ainda precise ser aplicada.
