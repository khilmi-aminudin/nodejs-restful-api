import express from 'express'
import userController from "../controller/user-controller.js"
import httpConst from "../../constant/constant-http.js"

const publicRouter = new express.Router()

// healthcheck api
publicRouter.get('/health', (req, res) => {
    res.status(httpConst.STATUS_OK).json({
        "message" : "hello, i am okay!",
    })
})

// public user api
publicRouter.post('/api/users', userController.register)
publicRouter.post('/api/users/login', userController.login)

export {
    publicRouter
}