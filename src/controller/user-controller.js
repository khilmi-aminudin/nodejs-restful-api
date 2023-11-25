import userService from "../service/user-service.js"
import httpConst from "../../constant/constant-http.js"

const register = async (req, res, next) => {
    try {
        const result =  await userService.register(req.body)
        res.status(httpConst.STATUS_OK).json({
            data: result
        })   
    } catch (e) {
        next(e)
    }
}

export default {
    register
}