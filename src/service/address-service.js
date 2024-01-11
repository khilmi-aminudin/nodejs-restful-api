import { prismaClient } from "../application/database.js"
import { validate } from "../validation/validation.js"
import { getContactValidation } from "../validation/contact-validation.js"
import { ResponseError } from "../error/response-error.js"
import constant from "../../constant/constant.js"
import { createAddressValidation, getAddressValidation, updateAddressValidation } from "../validation/address-validation.js"

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

const update = async (user, contactId, request) => {
    contactId = await checkContactMustExists(user, contactId)
    const address = validate(updateAddressValidation, request)
    
    const totalAddressInDatabase = await prismaClient.address.count({
        where: {
            id: address.id,
            contact_id: contactId
        }
    })

    if (totalAddressInDatabase !== 1) {
        throw new ResponseError(constant.HttpStatusNotFound, "address not found")
    }

    return prismaClient.address.update({
        where: {
            id: address.id
        },
        data: {
            street: address.street,
            city: address.city,
            province: address.province,
            country: address.country,
            postal_code: address.postal_code
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
}

const remove = async (user, contactId, addressId) => {
    contactId = await checkContactMustExists(user, contactId)
    addressId = validate(getAddressValidation, addressId)
    
    const totalAddressInDatabase = await prismaClient.address.count({
        where: {
            id: addressId,
            contact_id: contactId
        }
    })

    if (totalAddressInDatabase !== 1) {
        throw new ResponseError(constant.HttpStatusNotFound, "address not found")
    }

    return prismaClient.address.delete({
        where: {
            id: addressId
        }
    })

}

export default {
    create,
    get,
    update,
    remove
}