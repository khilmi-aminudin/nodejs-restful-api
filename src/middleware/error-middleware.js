import { ResponseError } from "../error/response-error.js"
import httpConst from "../../constant/constant-http.js"

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
        res.status(httpConst.STATUS_INTERNAL_SERVER_ERROR).json({
            errors : err.message
        }).end()
    } 
}