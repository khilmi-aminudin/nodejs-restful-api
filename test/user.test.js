import supertest from "supertest"
import { web } from "../src/application/web.js"
import httpConst from "../constant/constant-http.js"
import constantHttp from "../constant/constant-http.js"
import { createTestUserData, removeTestUserData } from "./user.util.js"

const [username, password, name, token] = ['test', 'rahasia', 'test user', 'token']

describe('POST /api/users', function() {
    afterEach( async () => {
        await removeTestUserData(username)
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

describe('POST /api/users/login', function() {
    beforeEach(async () => {
        await createTestUserData({
            username: username,
            password: password,
            name: name,
            token: token
        })
    })

    afterEach(async () => {
        await removeTestUserData(username)
    })

    it('should can login', async () => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
            username: username,
            password: password
        })

        expect(result.status).toBe(httpConst.STATUS_OK)
        expect(result.body.data.token).toBeDefined()
        expect(result.body.data.token).not.toBe(token)
    })

    it('should be reject login if request invalid', async () => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
            username: '',
            password: ''
        })

        expect(result.status).toBe(httpConst.STATUS_BAD_REQUEST)
        expect(result.body.errors).toBeDefined()
    })


    it('should be reject login if username wrong', async () => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
            username: '',
            password: password
        })

        expect(result.status).toBe(httpConst.STATUS_BAD_REQUEST)
        expect(result.body.errors).toBeDefined()
    })


    it('should be reject login if password wrong', async () => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
            username: username,
            password: ''
        })

        expect(result.status).toBe(httpConst.STATUS_BAD_REQUEST)
        expect(result.body.errors).toBeDefined()
    })

})