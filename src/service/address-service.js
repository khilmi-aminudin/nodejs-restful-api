import { prismaClient } from "../application/database.js"
import { validate } from "../validation/validation.js"
import { getContactValidation } from "../validation/contact-validation.js"
import { ResponseError } from "../error/response-error.js"
import constant from "../../constant/constant.js"
import { createAddressValidation, getAddressValidation } from "../validation/address-validation.js"

const checkContactMustExists = async (user, contactId) => {
    contactId = validate(getContactValidation, contactId)

    const totalContactsInDatabase = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contactId
        }
    })

    if (totalContactsInDatabase !== 1) {
        throw new ResponseError(constant.HttpStatusNotFound, 'contact not found')
    }

    return contactId
}

const create = async (user, contactId, request) => {
    contactId = await checkContactMustExists(user, contactId)

    const address = validate(createAddressValidation, request)
    address.contact_id = contactId

    return prismaClient.address.create({
        data: address,
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country:true,
            postal_code: true
        }
    })
}

const get = async (user, contactId, addressId) => {
    contactId = await checkContactMustExists(user, contactId)
    addressId = validate(getAddressValidation, addressId)

    const address = await prismaClient.address.findFirst({
        where: {
            id: addressId,
            contact_id: contactId
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country:true,
            postal_code: true
        }
    })

    if (!address) {
        throw new ResponseError(constant.HttpStatusNotFound, "address not found")
    }

    return address

}

export default {
    create,
    get
}