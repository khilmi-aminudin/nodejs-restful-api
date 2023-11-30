import constant from "../../constant/constant.js"
import contactService from "../service/contact-service.js"

const create = async (req, res, next) => {
    try {
        const user = req.user
        const request = req.body
        const result = await contactService.create(user, request)
        res.status(constant.HttpStatusCreated)
        .json({
            data: result
        })

    } catch(e) {
        next(e)
    }
}

export default{
    create
}