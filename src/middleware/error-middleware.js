import { ResponseError } from "../error/response-error.js"
import constant from "../../constant/constant.js"

export const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next()
        return
    }

    if ( err instanceof ResponseError){
        res.status(err.status).json({
            errors : err.message
        }).end()
    } else {
        res.status(constant.HttpStatusInternalServerError).json({
            errors : err.message
        }).end()
    } 
}