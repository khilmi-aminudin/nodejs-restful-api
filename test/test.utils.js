import { prismaClient } from "../src/application/database.js"
import bcrypt from "bcrypt"

export const removeTestUser = async (username = "") => {
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

export const getTestUser = async (username) =>      {
    return await prismaClient.user.findUnique({
        where: {
            username: username
        }
    })
}

export const removeAllTestContacts = async (username) => {
    await prismaClient.contact.deleteMany({
        where: {
            username: username
        }
    })
}