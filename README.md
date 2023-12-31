## Server actions, RSC, Prisma, and TypeScript in NextJs 13

- [YT Hamed Bahram 2023-05-28 Server actions, RSC, Prisma, and TypeScript in NextJs 13](https://youtu.be/8e35eo447Zw?si=RuvpkUrczzCDMWAl)

### Project and Prisma setup with SQLite instead of Postgres

- Working at `~Work/Learn/NextJS/NextJS-2023/HamedBahram/dev/next-ts-prisma`

```bash
victor@victorpc:next-ts-prisma$ pnpx create-next-app@latest .
victor@victorpc:next-ts-prisma$ pnpm add -D prettier prettier-plugin-tailwindcss
victor@victorpc:next-ts-prisma$ pnpm add -D prisma
victor@victorpc:next-ts-prisma$ pnpm add -D @prisma/client
Packages: +2
++
Progress: resolved 340, reused 330, downloaded 2, added 2, done
node_modules/.pnpm/@prisma+client@5.4.2_prisma@5.4.2/node_node_modules/.pnpm/@prisma+client@5.4.2_prisma@5.4.2/node_modules/@prisma/client: Running postinstall script, done in 518ms

devDependencies:
+ @prisma/client 5.4.2

Done in 5.5s
victor@victorpc:next-ts-prisma$ pnpm prisma init

✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

warn You already have a .gitignore file. Don't forget to add `.env` in it to not commit any private information.

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run prisma db pull to turn your database schema into a Prisma schema.
4. Run prisma generate to generate the Prisma Client. You can then start querying your database.

More information in our documentation:
https://pris.ly/d/getting-started
```

- setup `./prisma/schema.prisma`

```bash
victor@victorpc:next-ts-prisma$ cat ./prisma/schema.prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Todo {
  id        String   @id @default(uuid())
  title     String
  isCompleted  Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

victor@victorpc:next-ts-prisma$ tail -2 .env DATABASE_URL="file:./dev.db
```

- prisma tells us to put `.env` in `,gitignore`
  - Copy `.env.example` to `.env` and modify as per requirements

```bash
victor@victorpc:todo-tw-sqlite$ npx prisma migrate dev --name init

victor@victorpc:todo-tw-sqlite$ tree prisma
prisma
├── dev.db
├── dev.db-journal
├── migrations
│   ├── 20231015215957_init
│   │   └── migration.sql
│   └── migration_lock.toml
└── schema.prisma

victor@victorpc:next-ts-prisma$ pnpx prisma studio
Packages: +2
++
Progress: resolved 2, reused 2, downloaded 0, added 2, done
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Prisma Studio is up on http://localhost:5555
^C
```

- We need to put the database in `.gitignore`
- [Prisma Studio Docs](https://www.prisma.io/docs/concepts/components/prisma-studio)
- For Postgres see video

```bash
commit 054345019178be22c902c34ea1eeebae4a8155c9 (HEAD -> master)
Author: victorkane <victorkane@gmail.com>
Date:   Sun Oct 15 19:23:36 2023 -0300

    Project and Prisma setup with SQLite

 .env.example                          |   7 +
 .gitignore                            |   1 +
 .prettierrc                           |  11 ++
 .vscode/settings.json                 |   3 +
 README.md                             |  98 +++++++---
 app/globals.css                       |  24 ---
 app/page.tsx                          | 112 +-----------
 lib/prisma.ts                         |  11 ++
 lib/todos.ts                          |  10 +
 package.json                          |  14 +-
 pnpm-lock.yaml                        | 105 +++++++++++
 prisma/dev.db                         | Bin 0 -> 20480 bytes
 prisma/dev.db-journal                 | Bin 0 -> 8720 bytes
 .../20231015215957_init/migration.sql |   8 +
 prisma/migrations/migration_lock.toml |   3 +
 prisma/schema.prisma                  |  19 ++
 16 files changed, 267 insertions(+), 159 deletions(-)
```

### Fetch all todos from the db

- Go to Prisma Studio at `http://localhost:5555/` and create three todos
  manually

```bash
victor@victorpc:next-ts-prisma$ pnpx prisma studio
Packages: +2
++
Progress: resolved 2, reused 2, downloaded 0, added 2, done
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Prisma Studio is up on http://localhost:5555
```

We can now see the titles listed on home page at `http://localhost:3000/`

```bash
commit ba0c6d2295a94b13c2d8b72ef5704c1d84438589 (HEAD -> master)
Author: victorkane <victorkane@gmail.com>
Date:   Sun Oct 15 19:43:48 2023 -0300

    feat: fetch all todos entered manually via Prisma Studio into the database

 README.md             |  47 ++++++++++++++++++++++++++++
 app/page.tsx          |  17 ++++++++--
 prisma/dev.db         | Bin 20480 -> 20480 bytes
 prisma/dev.db-journal | Bin 8720 -> 0 bytes
 4 files changed, 61 insertions(+), 3 deletions(-)
```

- adding types for abstracted `TodoItem` component

```bash
commit a05db35c42fd853fecf91a239b4f39654d2daeaa (HEAD -> main, origin/main)
Author: victorkane <victorkane@gmail.com>
Date:   Mon Oct 16 04:03:20 2023 -0300

    chore: abstract out TodoItem component in true Next.js 13 fashion (adding types, working with types)

 app/components/TodoItem.tsx | 11 +++++++++++
 app/page.tsx                |  3 ++-
 tsconfig.json               |  3 ++-
 3 files changed, 15 insertions(+), 2 deletions(-)
```

### Server actions (create todo)

```bash
commit 29b6bd6069bbc4ce6beb7ec72ba7837f70ff8134 (HEAD -> main)
Author: victorkane <victorkane@gmail.com>
Date:   Mon Oct 16 06:43:13 2023 -0300

    chore: scaffold new todo form

 app/components/NewTodoForm.tsx | 11 +++++++++++
 app/page.tsx                   |  3 +++
 2 files changed, 14 insertions(+)
```

```bash
commit 956a62caf53ddfbc275a3aafda8456754dc93d01 (HEAD -> main, origin/main)
Author: victorkane <victorkane@gmail.com>
Date:   Mon Oct 16 06:52:30 2023 -0300

    style: create new todo form styling via tailwind classes

 app/components/NewTodoForm.tsx | 15 ++++++++++++---
 1 file changed, 12 insertions(+), 3 deletions(-)
```

- > Server actions (a la Next.js 13, that run on the server and can be called
  > from the client) instead of utilizing app api layer for `GET`, `POST`, etc.
  > to database
- Separate database model functions (`lib/todos.ts`) from server action
  functions (`app/_actions.ts`) which can be called directly from client-side
  components
- Configure app for server actions feature (see following error)

```text
./app/_actions.ts
Error:
  × To use Server Actions, please enable the feature flag in your Next.js config. Read more: https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations#convention
   ╭─[/home/victor/Work/Learn/NextJS/NextJS-2023/HamedBahram/dev/next-ts-prisma/app/_actions.ts:1:1]
 1 │ 'use server'
   · ────────────
 2 │
 3 │ import { createTodo } from '@/lib/todos'
```

- commit

```bash
commit edc194003e0dd1a3a4490072bf2304d6cf7bff42 (HEAD -> main, origin/main)
Author: victorkane <victorkane@gmail.com>
Date:   Mon Oct 16 07:30:16 2023 -0300

    feat(server actions): create todo

 README.md                      | 44 ++++++++++++++++++++
 app/_actions.ts                |  8 ++++
 app/components/NewTodoForm.tsx | 15 ++++++-
 lib/todos.ts                   |  9 ++++
 next.config.js                 |  6 ++-
 5 files changed, 80 insertions(+), 2 deletions(-)
```

- New todo doesn't appear in list right away

```bash
commit a58c80332ed30a19b46b88a915f31d2dfd109c65 (HEAD -> main, origin/main)
Author: victorkane <victorkane@gmail.com>
Date:   Mon Oct 16 07:36:56 2023 -0300

    fix(server actions): created todo appears directly on home page todo listing

 README.md       | 20 ++++++++++++++++++++
 app/_actions.ts |  1 +
 2 files changed, 21 insertions(+)
```

- Form input field needs to be reset

```bash
commit 20925d1b5c4ea1ff5dadf9007701507f2ff220e0 (HEAD -> main, origin/main)
Author: victorkane <victorkane@gmail.com>
Date:   Mon Oct 16 07:44:29 2023 -0300

    fix(server actions): reset the form title input field upon creating new todo

 app/components/NewTodoForm.tsx | 7 ++++++-
 1 file changed, 6 insertions(+), 1 deletion(-)
```
