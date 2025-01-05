CREATE TABLE `notifications` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`description` text NOT NULL,
	`published_at` date DEFAULT '"2025-01-05T11:14:21.287Z"'
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`subject_banner` text NOT NULL,
	`freeware_banner` text NOT NULL,
	`published_at` date DEFAULT '"2025-01-05T11:14:21.287Z"',
	`photo_url` text,
	`author_id` integer NOT NULL,
	`description` text NOT NULL,
	`installation_links` text,
	`didactic_links` text,
	FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ratings` (
	`user_id` integer NOT NULL,
	`post_id` integer NOT NULL,
	`rating` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`nickname` text NOT NULL,
	`jmeno` text NOT NULL,
	`prijmeni` text NOT NULL,
	`datum_nar` date NOT NULL,
	`password_hash` text NOT NULL,
	`token` text,
	`token_expires` text,
	`is_email_verified` integer NOT NULL,
	`is_online` integer NOT NULL,
	`created_at` text NOT NULL,
	`update_at` text NOT NULL,
	`profile_image` text NOT NULL
);
