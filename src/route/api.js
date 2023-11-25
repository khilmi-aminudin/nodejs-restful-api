import express from 'express'
import userController from "../controller/user-controller.js"
import { authMiddleware } from '../middleware/auth-middleware.js'

const userRouter = new express.Router()

// use auth middleware
userRouter.use(authMiddleware)

// user api
userRouter.get('/api/users/current', userController.get)

export {
    userRouter
}