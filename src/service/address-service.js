import { prismaClient } from "../application/database.js"
import { validate } from "../validation/validation.js"
import { getContactValidation } from "../validation/contact-validation.js"
import { ResponseError } from "../error/response-error.js"
import constant from "../../constant/constant.js"
import { createAddressValidation } from "../validation/address-validation.js"

const create = async (user, contactId, request) => {
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
            contact_id: true,
            postal_code: true
        }
    })
}

export default {
    create
}