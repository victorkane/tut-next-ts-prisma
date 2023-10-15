## Server actions, RSC, Prisma, and TypeScript in NextJs 13

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
