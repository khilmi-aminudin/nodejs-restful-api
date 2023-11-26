import userService from "../service/user-service.js"
import constant from "../../constant/constant.js"

const register = async (req, res, next) => {
    try {
        const result =  await userService.register(req.body)
        res.status(constant.HttpStatusOk).json({
            data: result
        })   
    } catch (e) {
        next(e)
    }
}

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body)
        res.status(constant.HttpStatusOk).json({
            data : result
        })
    } catch (e) {
        next(e)
    }
}

const get = async (req, res, next) => {
    try {
        const result = await userService.get(req.user.username)
        res.status(constant.HttpStatusOk).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

export default {
    register,
    login,
    get
}