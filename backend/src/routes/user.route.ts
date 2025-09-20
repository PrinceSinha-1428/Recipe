import { Router } from "express";
import { addToFavorite, deletefav, getUserfav } from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/favorite", addToFavorite);
userRouter.delete("/favorite/:userId/:recipeId", deletefav);
userRouter.get("/favorite/:userId/", getUserfav);

export default userRouter;