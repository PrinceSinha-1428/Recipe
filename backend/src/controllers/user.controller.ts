import { Request, Response } from "express";
import { db } from "../config/db";
import { favoriteTable } from "../db/schema";
import { and, eq } from "drizzle-orm";

export const addToFavorite = async (req: Request, res: Response) => {
  try {
    const { userId, recipeId, cookTime, title, image, servings } = req.body;
    if(!userId || !recipeId || !title){
      return res.status(400).json({ message: 'Missing required fields'})
    }
   const newFavorite =  await db.insert(favoriteTable).values({
      userId, recipeId, title, image, cookTime, servings
    }).returning();
    return res.status(201).json(newFavorite[0]);
  } catch (error) {
    if(error instanceof Error){
      return res.status(500).json({ message : error.message });
    }
  }
}


export const deletefav = async (req: Request, res: Response) => {
  try {
    const { userId, recipeId } = req.params;
    if(!userId || !recipeId){
      return res.status(400).json({ message: 'Missing required fields'})
    }
    await db.delete(favoriteTable).where(
      and(eq(favoriteTable.userId, userId), eq(favoriteTable.recipeId, parseInt(recipeId)))
    )
    return res.status(200).json({ message: "Favorite removed succesfully"});
  } catch (error) {
    if(error instanceof Error){
      return res.status(500).json({ message : error.message });
    }
  }
}


export const getUserfav = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if(!userId){
      return res.status(400).json({ message: 'Missing required fields'})
    }
   const userFavorites = await db
      .select()
      .from(favoriteTable)
      .where(eq(favoriteTable.userId, userId))
    return res.status(200).json(userFavorites);
  } catch (error) {
    if(error instanceof Error){
      return res.status(500).json({ message : error.message });
    }
  }
}