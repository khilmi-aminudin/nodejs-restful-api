import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response-error.js"
import { getUserValidation, loginUserValidation, registerUserValidation, updateUserValidation } from "../validation/user-validation.js"
import { validate } from "../validation/validation.js"
import constant from "../../constant/constant.js"
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
        throw new ResponseError(constant.HttpStatusBadRequest, 'username already exists')
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
        throw new ResponseError(constant.HttpStatusUnAuthorized, 'username or password wrong')
    }

    const isValidPassword = await bcrypt.compare(loginRequest.password, user.password)
    
    if (!isValidPassword) {
        throw new ResponseError(constant.HttpStatusUnAuthorized, 'username or password wrong')
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

const get = async (username) => {
    username = validate(getUserValidation, username)

    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        },
        select: {
            username: true,
            name: true
        }
    })

    if (!user) {
        throw new ResponseError(constant.HttpStatusNotFound, `user not found`)
    }

    return user
}

const update = async (request) => {
    const user = validate(updateUserValidation, request)

    const totalUserInDatabase = await prismaClient.user.count({
        where: {
            username: user.username
        }
    })

    if (totalUserInDatabase !== 1) {
        throw new ResponseError(constant.HttpStatusNotFound, 'user not found')
    }

    const data = {}
    if (user.name) {
        data.name = user.name
    }
    if(user.password){
        data.password = await bcrypt.hash(user.password, 10)
    }

    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: data,
        select: {
            username: true,
            name: true
        }
    })
}

export default {
    register,
    login,
    get,
    update
}