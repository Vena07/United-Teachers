CREATE TABLE `reports` (
	`id` integer PRIMARY KEY NOT NULL,
	`post_id` integer NOT NULL,
	`reporter_id` integer NOT NULL,
	`reported_at` date DEFAULT '"2025-01-05T11:25:13.411Z"',
	`reason` text NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reporter_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
/*
 SQLite does not support "Set default to column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE `user` ADD `report_points` integer DEFAULT 0 NOT NULL;