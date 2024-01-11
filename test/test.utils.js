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

export const createTestContact = async (req) => {
    await prismaClient.contact.create({
        data: {
            username: req.username,
            first_name: req.first_name,
            last_name: req.last_name,
            email: req.email,
            phone: req.phone,
        }
    })
}

export const createManyTestContact = async (req) => {
    for (let i = 0; i < 15; i++) {
        await prismaClient.contact.create({
            data: {
                username: req.username,
                first_name: `${req.first_name} ${i}`,
                last_name: `${req.last_name} ${i}`,
                email: `${i}${req.email}`,
                phone: `${req.phone}${i}`,
            }
        })
    }
}

export const getTestContact = async (username) => {
    return prismaClient.contact.findFirst({
        where: {
            username: username
        }
    })
}

export const removeAllTestAddresses = async (username) => {
    await prismaClient.address.deleteMany({
        where: {
            contact: {
                username: username
            }
        }
    })
}

export const createTestAddress = async (request) => {
    const contact = await getTestContact(request.username)
    await prismaClient.address.create({
        data: {
            contact_id: contact.id,
            street: request.street,
            city: request.city,
            province: request.province,
            country: request.country,
            postal_code: request.postal_code
        }
    })
}

export const getTestAddress = async (username) => {
    return prismaClient.address.findFirst({
        where: {
            contact : {
                username : username
            }
        }
    })
}