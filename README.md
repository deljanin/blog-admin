# My blog app

## TODO

- [x] Make it deploy
- [x] Scaffold basic ui with mock data

  - [x] Modify side nav (done for now)
  - [x] Modify top nav
  - [x] Post page
    - [x] Post content
    - [x] Comment section
  - [x] Topics page
  - [x] About page
  - [x] Topic/Search/Home page component with search feature

- [x] Setup database
- [x] Attach database to UI
- [x] Update dynamic breadcrumbs
- [ ] Add auth (clerk or next-auth)
- [x] Routing/post page (parallel route?)
- [ ] Error management (w/ Sentry)
- [ ] Analytics (posthog)
- [ ] Meta tags
- [ ] Update README
- [ ] Add a notification and a reply systems. So that an Admin can reply to other users and then they get an email notification so that they come and check the reply.
- [ ] Add footer

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

- To clone the repository run the following in your terminal:

```bash
git clone https://github.com/deljanin/blog.git
cd blog
```

- Then run:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

- Setup your postgres database. I used Vercel Serverless Postgres db.
- Copy the database environment variables to the .env.local file in this format:

```
POSTGRES_URL="SECRET_DATA"
POSTGRES_PRISMA_URL="SECRET_DATA"
POSTGRES_URL_NO_SSL="SECRET_DATA"
POSTGRES_URL_NON_POOLING="SECRET_DATA"
POSTGRES_USER="SECRET_DATA"
POSTGRES_HOST="SECRET_DATA"
POSTGRES_PASSWORD="SECRET_DATA"
POSTGRES_DATABASE="SECRET_DATA"
```

- You will need to to these steps to setup the database schema correctly as I use vectors to store embeddings of the posts.
- To copy the schema correctly to the database run this:

```bash
npx drizzle-kit generate --custom
```

- Then open the file listed in the terminal. (It should be in migrations/0000\_\*.sql)
- Paste this in it:

```sql
CREATE EXTENSION vector;
```

- Finally run this to copy the local schema to your database:

```bash
npm run db:push
or
drizzle-kit push
```

Now you can run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
