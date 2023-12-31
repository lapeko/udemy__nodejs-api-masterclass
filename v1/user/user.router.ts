import {Router} from "express";

import {auth} from "../../middleware/auth";
import {
  changeDetails,
  changePassword,
  confirmResetPassword,
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  loginUser,
  logoutUser,
  resetPassword,
  updateUser,
  whoAmI
} from "./user.controller";
import {useAdvancedResults} from "../../middleware/use-advanced-results";
import {User} from "./user.model";

export const userRouter =  Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", auth(), logoutUser);
userRouter.get("/whoami", auth(), whoAmI);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/confirm-reset-password/:token", confirmResetPassword);
userRouter.post("/change-password", auth(), changePassword);
userRouter.patch("/change-details", auth(), changeDetails);

// admin routes
userRouter.get("/", auth("admin"), useAdvancedResults(User), getUsers);
userRouter.route("/:id")
  .get(auth("admin"), getUserById)
  .delete(auth(), deleteUser)
  .patch(auth(), updateUser);

userRouter.get("/:userId/reviews", (req, res) =>
  res.redirect(`/api/v1/review/${req.params.userId}/user-reviews`));

