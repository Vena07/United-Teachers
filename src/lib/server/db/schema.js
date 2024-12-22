import { date } from 'drizzle-orm/mysql-core';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Tabulka pro uživatele
export const user = sqliteTable('user', {
    id: integer('id', { mode: 'autoIncrement' }).primaryKey(),
    email: text('email').notNull(),
    nickname: text('nickname').notNull(),
    jmeno: text('jmeno').notNull(),
    prijmeni: text('prijmeni').notNull(),
    datum_nar: date('datum_nar').notNull(),
    password_hash: text('password_hash').notNull(),
    token: text('token'),
    token_expires: text('token_expires'),
    is_email_verified: integer('is_email_verified').notNull(),
    is_online: integer('is_online').notNull(),
    created_at: text('created_at').notNull(),
    update_at: text('update_at').notNull(),
    profile_image: text('profile_image').notNull(),
});

// Tabulka pro příspěvky
export const posts = sqliteTable("posts", {
    id: integer('id', { mode: 'autoIncrement' }).primaryKey(),
    title: text("title").notNull(),
    subject_banner: text("subject_banner").notNull(),
    freeware_banner: text("freeware_banner").notNull(),
    published_at: date("published_at").default(new Date()),
    photo_url: text("photo_url"),
    author_id: integer("author_id").notNull().references(() => user.id),
    description: text("description").notNull(),
    installation_links: text("installation_links"),
    didactic_links: text("didactic_links"),
});

// Tabulka pro hodnocení
export const ratings = sqliteTable("ratings", {
    user_id: integer("user_id").notNull().references(() => user.id),  
    post_id: integer("post_id").notNull().references(() => posts.id), 
    rating: integer("rating").notNull(),    
});
