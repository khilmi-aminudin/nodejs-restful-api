import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response-error.js"
import { loginUserValidation, registerUserValidation } from "../validation/user-validation.js"
import { validate } from "../validation/validation.js"
import httpConst from "../../constant/constant-http.js"
import bcrypt from "bcrypt"
import {v4 as uuid} from "uuid"

const register = async (request) => {
    const user = validate(registerUserValidation,request)

    const countUser = await prismaClient.user.count({
        where: {
            username: user.username
        }
    })

    if (countUser === 1) {
        throw new ResponseError(httpConst.STATUS_BAD_REQUEST, 'username already exists')
    }

    user.password = await bcrypt.hash(user.password, 10)
    
    return prismaClient.user.create({
        data : user,
        select: {
            username: true,
            name: true
        }
    })
}

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request)

    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            username: true,
            password: true
        }
    })

    if (!user) {
        throw new ResponseError(httpConst.STATUS_UNAUTHORIZED, 'username or password wrong')
    }

    const isValidPassword = await bcrypt.compare(loginRequest.password, user.password)
    
    if (!isValidPassword) {
        throw new ResponseError(httpConst.STATUS_UNAUTHORIZED, 'username or password wrong')
    }

    const token = uuid().toString()

    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: {
            token: token
        },
        select: {
            token: true
        }
    })
}


export default {
    register,
    login
}