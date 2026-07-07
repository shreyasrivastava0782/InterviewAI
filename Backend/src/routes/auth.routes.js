const express=require("express");
const authController=require("../controllers/auth.controller")
const authMiddleware=require("../middlewares/auth.middleware")

const authRouter=express.Router();


/**@route POST /api/auth/register
 *@description register a new user
 *@access Public
 */
authRouter.post("/register", authController.registerUserController)

/**@route POST /api/auth/login
 *@description login an existing user
 *@access Public
 */
authRouter.post("/login", authController.loginUserController)

/**@route GET /api/auth/logout
 *@description logout an existing user
 *@access Public
 */
authRouter.get("/logout",authController.logoutUserController)

/**@route GET /api/auth/get-me
 *@description get user details of existing user
 *@access Private
 */
authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)



module.exports=authRouter;