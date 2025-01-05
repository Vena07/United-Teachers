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
    admin: integer('admin'),
    profile_image: text('profile_image').notNull(),
    report_points: integer('report_points').notNull().default(1),

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
    active: integer('active').notNull().default(0)
});

// Tabulka pro hodnocení
export const ratings = sqliteTable("ratings", {
    user_id: integer("user_id").notNull().references(() => user.id),  
    post_id: integer("post_id").notNull().references(() => posts.id), 
    rating: integer("rating").notNull(),    
});

// Tbulka pro notifikace
export const notifications = sqliteTable('notifications', {
    id: integer('id', { mode: 'autoIncrement' }).primaryKey(),
    user_id: integer('user_id').notNull().references(() => user.id),
    description: text('description').notNull(),
    created_at: date("created_at").default(new Date()) 
});

// Tabulka pro nahlášení
export const reports = sqliteTable('reports', {
    id: integer('id', { mode: 'autoIncrement' }).primaryKey(),
    post_id: integer('post_id').notNull().references(() => posts.id), // Odkaz na posts
    reporter_id: integer('reporter_id').notNull().references(() => user.id), // Odkaz na user
    reported_at: date('reported_at').default(new Date()), // Doba nahlášení
    reason: text('reason').notNull(), // Důvod nahlášení
});
