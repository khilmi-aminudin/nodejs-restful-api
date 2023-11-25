import supertest from "supertest"
import { web } from "../src/application/web.js"
import { prismaClient } from "../src/application/database"
import { logger } from "../src/application/logging.js"
import httpConst from "../constant/constant-http.js"
import constantHttp from "../constant/constant-http.js"

describe('POST /api/users', function() {
    const [username, name, password] = ['khilmi_a', 'khilmi aminudin', '12345678qwertyuiop']

    afterEach( async () => {
        await prismaClient.user.deleteMany({
            where : {
                username : username
            }
        })
    })

    it('it should can register new user', async () => {
        const result = await supertest(web)
        .post('/api/users')
        .send({
            username : username,
            password : password,
            name : name
        })

        expect(result.status).toBe(httpConst.STATUS_OK)
        expect(result.body.data.username).toBe(username)
        expect(result.body.data.name).toBe(name)
        expect(result.body.data.password).toBeUndefined()
    })

    it('it should rejected if request invalid', async () => {
        const result = await supertest(web)
        .post('/api/users')
        .send({
            username : '',
            password : '',
            name : ''
        })

        // logger.info(result.body)
        expect(result.status).toBe(httpConst.STATUS_BAD_REQUEST)
        expect(result.body.errors).toBeDefined()
    })


    it('it should be rejected because user already registered', async () => {
        let result = await supertest(web)
        .post('/api/users')
        .send({
            username : username,
            password : password,
            name : name
        })

        expect(result.status).toBe(httpConst.STATUS_OK)
        expect(result.body.data.username).toBe(username)
        expect(result.body.data.name).toBe(name)
        expect(result.body.data.password).toBeUndefined()

        result = await supertest(web)
        .post('/api/users')
        .send({
            username : username,
            password : password,
            name : name
        })

        expect(result.status).toBe(constantHttp.STATUS_BAD_REQUEST)
        expect(result.body.errors).toBeDefined()
    })
})