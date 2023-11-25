import { prismaClient } from "../src/application/database.js"
import bcrypt from "bcrypt"

export const removeTestUserData = async (username = "") => {
    await prismaClient.user.deleteMany({
        where : {
            username : username
        }
    })
}

export const createTestUserData = async (user) => {
    const password = await bcrypt.hash(user.password, 10)
    await prismaClient.user.create({
        data : {
            username : user.username,
            password : password,
            name : user.name,
            token : user.token
        }
    })
}