import { text } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { serial } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const favoriteTable = pgTable("favorites", {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  recipeId: integer('recipe_id').notNull(),
  title: text('title').notNull(),
  image: text('image'),
  cookTime: text('cook_time'),
  servings: text('servings'),
  createdAt: timestamp('created_at').defaultNow()

})