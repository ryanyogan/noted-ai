ALTER TABLE `notes` ADD `status` text DEFAULT 'inbox';--> statement-breakpoint
ALTER TABLE `notes` ADD `due_date` integer;--> statement-breakpoint
ALTER TABLE `notes` ADD `scheduled_date` integer;--> statement-breakpoint
ALTER TABLE `notes` ADD `completed_at` integer;--> statement-breakpoint
CREATE INDEX `notes_status_idx` ON `notes` (`user_id`,`status`);--> statement-breakpoint
CREATE INDEX `notes_due_idx` ON `notes` (`user_id`,`due_date`);--> statement-breakpoint
CREATE INDEX `notes_scheduled_idx` ON `notes` (`user_id`,`scheduled_date`);