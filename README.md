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
