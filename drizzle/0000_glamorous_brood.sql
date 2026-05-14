-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `carts` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT 'current_timestamp()'
);
--> statement-breakpoint
CREATE TABLE `cart_items` (
	`id` varchar(36) NOT NULL,
	`cart_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`quantity` int(11) NOT NULL DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`nom` varchar(255) DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`user_id` int(11) DEFAULT 'NULL',
	`total_price` int(11) DEFAULT 'NULL',
	`status` varchar(50) DEFAULT 'NULL',
	`created_at` timestamp NOT NULL DEFAULT 'current_timestamp()'
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`order_id` int(11) DEFAULT 'NULL',
	`product_id` int(11) DEFAULT 'NULL',
	`quantity` int(11) NOT NULL,
	`price` decimal(10,2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`order_id` int(11) DEFAULT 'NULL',
	`montant` decimal(10,2) DEFAULT 'NULL',
	`methode` varchar(50) DEFAULT 'NULL',
	`statut` varchar(50) DEFAULT 'NULL',
	`created_at` timestamp NOT NULL DEFAULT 'current_timestamp()'
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`name` varchar(255) DEFAULT 'NULL',
	`description` text DEFAULT 'NULL',
	`price` int(11) DEFAULT 'NULL',
	`image` varchar(255) DEFAULT 'NULL',
	`stock` int(11) DEFAULT 'NULL',
	`categorie_id` int(11) DEFAULT 'NULL',
	`created_at` timestamp NOT NULL DEFAULT 'current_timestamp()'
);
--> statement-breakpoint
CREATE TABLE `product_images` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`product_id` int(11) DEFAULT 'NULL',
	`image_url` varchar(255) DEFAULT 'NULL'
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int(11) AUTO_INCREMENT NOT NULL,
	`name` varchar(255) DEFAULT 'NULL',
	`email` varchar(255) DEFAULT 'NULL',
	`password` varchar(255) DEFAULT 'NULL',
	`adresse` text DEFAULT 'NULL',
	`role` varchar(50) NOT NULL DEFAULT '''user''',
	`created_at` timestamp NOT NULL DEFAULT 'current_timestamp()'
);
--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `fk_product_category` FOREIGN KEY (`categorie_id`) REFERENCES `categories`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
CREATE INDEX `user_id` ON `orders` (`user_id`);--> statement-breakpoint
CREATE INDEX `order_id` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE INDEX `product_id` ON `order_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `order_id` ON `payments` (`order_id`);--> statement-breakpoint
CREATE INDEX `product_id` ON `product_images` (`product_id`);
*/