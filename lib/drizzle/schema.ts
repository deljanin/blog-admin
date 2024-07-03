import {
  integer,
  varchar,
  text,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  vector,
  real,
} from 'drizzle-orm/pg-core';

export const user = pgTable(
  'user',
  {
    id: serial('id').primaryKey(),

    email: varchar('email', { length: 255 }).notNull(),

    name: varchar('name', { length: 50 }).notNull(),

    avatarUrl: text('avatarUrl'),

    provider: varchar('provider', { length: 20 }).notNull(),

    providerId: varchar('providerId', { length: 50 }).notNull(),

    createdAt: timestamp('createdAt').defaultNow().notNull(),

    reputation: integer('reputation').default(0).notNull(),
  },
  (user) => {
    return {
      uniqueEmail: uniqueIndex('unique_email').on(user.email),
      uniqueProviderId: uniqueIndex('unique_provider_id').on(
        user.provider,
        user.providerId
      ),
    };
  }
);

export const topic = pgTable(
  'topic',
  {
    id: serial('id').primaryKey(),

    title: varchar('title', { length: 100 }).notNull(),

    createdAt: timestamp('createdAt').defaultNow().notNull(),

    icon: varchar('icon', { length: 30 }).notNull(),

    slug: varchar('slug', { length: 100 }).notNull().unique(),
  },
  (topic) => {
    return {
      uniqueIdx: uniqueIndex('unique_topic_idx').on(topic.slug),
    };
  }
);

export const thread = pgTable(
  'thread',
  {
    id: serial('id').primaryKey(),

    title: varchar('title', { length: 100 }).notNull(),

    description: text('description').notNull(),

    createdAt: timestamp('createdAt').defaultNow().notNull(),

    slug: varchar('slug', { length: 100 }).notNull().unique(),

    topicId: integer('topicId')
      .references(() => topic.id)
      .notNull(),
  },
  (thread) => {
    return {
      uniqueIdx: uniqueIndex('unique_thread_idx').on(thread.id),
    };
  }
);

export const post = pgTable(
  'post',
  {
    id: serial('id').primaryKey(),

    title: varchar('title', { length: 100 }).notNull(),

    content: text('content').notNull(),

    description: text('description').notNull(),

    embedding: vector('embedding', { dimensions: 768 }),

    slug: varchar('slug', { length: 100 }).notNull().unique(),

    createdAt: timestamp('createdAt').defaultNow().notNull(),

    topicId: integer('topicId')
      .references(() => topic.id)
      .notNull(),

    threadId: integer('threadId')
      .references(() => thread.id)
      .notNull(),
  },
  (post) => {
    return {
      uniqueIdx: uniqueIndex('unique_post_idx').on(post.id),
    };
  }
);

export const similarPost = pgTable(
  'similarPost',
  {
    id: serial('id').primaryKey(),

    postId: integer('postId')
      .references(() => post.id)
      .notNull(),

    similarPostId: integer('similarPostId')
      .references(() => post.id)
      .notNull(),

    similarity: real('similarity').notNull(),
  },
  (similarPost) => {
    return {
      uniqueIdx: uniqueIndex('unique_similarPost_idx').on(
        similarPost.postId,
        similarPost.similarPostId
      ),
    };
  }
);

export const comment = pgTable(
  'comment',
  {
    id: serial('id').primaryKey(),

    content: varchar('content', { length: 255 }).notNull(),

    createdAt: timestamp('createdAt').defaultNow().notNull(),

    likes: integer('likes').default(0).notNull(),

    postId: integer('postId')
      .references(() => post.id)
      .notNull(),

    userId: integer('userId')
      .references(() => user.id)
      .notNull(),
  },
  (comment) => {
    return {
      uniqueIdx: uniqueIndex('unique_comment_idx').on(comment.id),
    };
  }
);

export const image = pgTable(
  'image',
  {
    id: serial('id').primaryKey(),

    url: varchar('url', { length: 255 }).notNull(),

    postId: integer('postId')
      .references(() => post.id)
      .notNull(),
  },
  (image) => {
    return {
      uniqueIdx: uniqueIndex('unique_image_idx').on(image.id),
    };
  }
);
