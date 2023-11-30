import express from 'express'
import { publicRouter } from '../route/public-route.js'
import { errorMiddleware } from '../middleware/error-middleware.js'
import { authRouter} from '../route/api.js'

export const web = express()

web.use(express.json())

web.use(publicRouter)
web.use(authRouter)

web.use(errorMiddleware)