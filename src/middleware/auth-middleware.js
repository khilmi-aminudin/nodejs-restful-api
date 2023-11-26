import constant from "../../constant/constant.js"
import { prismaClient } from "../application/database.js"

export const authMiddleware = async (req, res, next) => {
    const token = req.get(constant.RequestAthorizationKey)
    
    if (!token) {
        res.status(constant.HttpStatusUnAuthorized).json({
            errors: "unauthorized"
        }).end()
    } else {

        const user = await prismaClient.user.findFirst({
            where: {
                token: token
            }
        })
    
        if (!user) {
            res.status(constant.HttpStatusUnAuthorized).json({
                errors: "unauthorized"
            }).end()
        }else{
            req.user = user
            next()
        }
    }

}