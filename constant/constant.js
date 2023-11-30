
const [
    HttpStatusOk,
    HttpStatusCreated,
    
    HttpStatusBadRequest,
    HttpStatusUnAuthorized,
    HttpStatusNotFound,
    
    HttpStatusInternalServerError
] = [
    200, //HttpStatusOk
    201, //HttpStatusCreated
    
    400, //HttpStatusBadRequest
    401, //HttpStatusUnAuthorized
    404, //HttpStatusNotFound
    
    500 //HttpStatusInternalServerError
]

const [
    RequestAthorizationKey
] = [
    'Authorization' //RequestAthorization
]

export default {
    HttpStatusOk,
    HttpStatusCreated,
    HttpStatusBadRequest,
    HttpStatusInternalServerError,
    HttpStatusUnAuthorized,
    HttpStatusNotFound,
    RequestAthorizationKey
}