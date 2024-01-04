import express from 'express'
import userController from "../controller/user-controller.js"
import contactController from '../controller/contact-controller.js'
import { authMiddleware } from '../middleware/auth-middleware.js'

const authRouter = new express.Router()

// use auth middleware
authRouter.use(authMiddleware)

// user api
authRouter.get('/api/users/current', userController.get)
authRouter.patch('/api/users/current', userController.update)
authRouter.delete('/api/users/logout', userController.logout)

// contact api
authRouter.post('/api/contacts', contactController.create)
authRouter.get('/api/contacts/:contactId', contactController.get)
authRouter.put('/api/contacts/:contactId', contactController.update)
authRouter.delete('/api/contacts/:contactId', contactController.remove)
authRouter.get('/api/contacts', contactController.search)

export {
    authRouter
}