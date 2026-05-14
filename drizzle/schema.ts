import { mysqlTable, mysqlSchema, AnyMySqlColumn, varchar, timestamp, int, index, foreignKey, decimal, text } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const carts = mysqlTable("carts", {
	id: varchar({ length: 36 }).notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
});

export const cartItems = mysqlTable("cart_items", {
	id: varchar({ length: 36 }).notNull(),
	cartId: varchar("cart_id", { length: 36 }).notNull(),
	productId: varchar("product_id", { length: 36 }).notNull(),
	quantity: int().default(1).notNull(),
});

export const categories = mysqlTable("categories", {
	id: int().autoincrement().notNull(),
	nom: varchar({ length: 255 }).default('NULL'),
});

export const orders = mysqlTable("orders", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").default('NULL').references(() => users.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	totalPrice: int("total_price").default('NULL'),
	status: varchar({ length: 50 }).default('NULL'),
	createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
},
(table) => [
	index("user_id").on(table.userId),
]);

export const orderItems = mysqlTable("order_items", {
	id: int().autoincrement().notNull(),
	orderId: int("order_id").default('NULL').references(() => orders.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	productId: int("product_id").default('NULL').references(() => products.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	quantity: int().notNull(),
	price: decimal({ precision: 10, scale: 2 }).notNull(),
},
(table) => [
	index("order_id").on(table.orderId),
	index("product_id").on(table.productId),
]);

export const payments = mysqlTable("payments", {
	id: int().autoincrement().notNull(),
	orderId: int("order_id").default('NULL').references(() => orders.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	montant: decimal({ precision: 10, scale: 2 }).default('NULL'),
	methode: varchar({ length: 50 }).default('NULL'),
	statut: varchar({ length: 50 }).default('NULL'),
	createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
},
(table) => [
	index("order_id").on(table.orderId),
]);

export const products = mysqlTable("products", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).default('NULL'),
	description: text().default('NULL'),
	price: int().default('NULL'),
	image: varchar({ length: 255 }).default('NULL'),
	stock: int().default('NULL'),
	categorieId: int("categorie_id").default('NULL').references(() => categories.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
});

export const productImages = mysqlTable("product_images", {
	id: int().autoincrement().notNull(),
	productId: int("product_id").default('NULL').references(() => products.id, { onDelete: "restrict", onUpdate: "restrict" } ),
	imageUrl: varchar("image_url", { length: 255 }).default('NULL'),
},
(table) => [
	index("product_id").on(table.productId),
]);

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).default('NULL'),
	email: varchar({ length: 255 }).default('NULL'),
	password: varchar({ length: 255 }).default('NULL'),
	adresse: text().default('NULL'),
	role: varchar({ length: 50 }).default('\'user\'').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('current_timestamp()').notNull(),
});
