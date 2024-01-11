import constant from "../../constant/constant.js"
import addressService from "../service/address-service.js"

const create = async (req, res, next) => {
    try {
        const user = req.user
        const request = req.body
        const contactId = req.params.contactId

        const result = await addressService.create(user, contactId, request)

        res.status(constant.HttpStatusCreated).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const get = async (req, res, next) => {
    try {
        const user = req.user
        const contactId = req.params.contactId
        const addressId = req.params.addressId

        const result = await addressService.get(user, contactId, addressId)
        res.status(constant.HttpStatusOk).json({
            data : result
        })

    } catch (e) {
        next(e)
    }
}

export default {
    create,
    get
}