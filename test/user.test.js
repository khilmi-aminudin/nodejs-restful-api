import supertest from "supertest"
import { web } from "../src/application/web.js"
import constant from "../constant/constant.js"
import { createTestUserData, getTestUser, removeTestUser } from "./test.utils.js"
import { logger } from "../src/application/logging.js"
import bcrypt from "bcrypt"

const [username, password, name, token] = ['test', 'rahasia', 'test user', 'token']

describe('POST /api/users', function() {
    afterEach( async () => {
        await removeTestUser(username)
    })

    it('it should can register new user', async () => {
        const result = await supertest(web)
        .post('/api/users')
        .send({
            username : username,
            password : password,
            name : name
        })

        expect(result.status).toBe(constant.HttpStatusCreated)
        expect(result.body.data.username).toBe(username)
        expect(result.body.data.name).toBe(name)
        expect(result.body.data.password).toBeUndefined()
    })

    it('it should be rejected if request invalid', async () => {
        const result = await supertest(web)
        .post('/api/users')
        .send({
            username : '',
            password : '',
            name : ''
        })

        expect(result.status).toBe(constant.HttpStatusBadRequest)
        expect(result.body.errors).toBeDefined()
    })


    it('it should be rejected if user already registered', async () => {
        let result = await supertest(web)
        .post('/api/users')
        .send({
            username : username,
            password : password,
            name : name
        })

        expect(result.status).toBe(constant.HttpStatusCreated)
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

        expect(result.status).toBe(constant.HttpStatusBadRequest)
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
        await removeTestUser(username)
    })

    it('should can login', async () => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
            username: username,
            password: password
        })

        expect(result.status).toBe(constant.HttpStatusOk)
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

        expect(result.status).toBe(constant.HttpStatusBadRequest)
        expect(result.body.errors).toBeDefined()
    })


    it('should be reject login if username wrong', async () => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
            username: '',
            password: password
        })

        expect(result.status).toBe(constant.HttpStatusBadRequest)
        expect(result.body.errors).toBeDefined()
    })


    it('should be reject login if password wrong', async () => {
        const result = await supertest(web)
        .post('/api/users/login')
        .send({
            username: username,
            password: ''
        })

        expect(result.status).toBe(constant.HttpStatusBadRequest)
        expect(result.body.errors).toBeDefined()
    })

})

describe('GET /api/users/current', function() {
    beforeEach(async () => {
        await createTestUserData({
            username: username,
            password: password,
            name: name,
            token: token
        })
    })

    afterEach(async () => {
        await removeTestUser(username)
    })

    it('should can get current user', async () => {
        const result = await supertest(web)
            .get("/api/users/current")
            .set(constant.RequestAthorizationKey, token)

            expect(result.status).toBe(constant.HttpStatusOk)
            expect(result.body.data.username).toBe(username)
            expect(result.body.data.name).toBe(name)
    })

    it('should be reject if token is invalid', async () => {
        const result = await supertest(web)
            .get("/api/users/current")
            .set(constant.RequestAthorizationKey, "salah")

            logger.info(result)
        
            expect(result.status).toBe(constant.HttpStatusUnAuthorized)
            expect(result.body.errors).toBeDefined()
    })
})

describe('PATCH /api/users/current', function () {
    beforeEach(async () => {
        await createTestUserData({
            username: username,
            password: password,
            name: name,
            token: token
        })
    })

    afterEach(async () => {
        await removeTestUser(username)
    })

    it('it should can update user', async () => {
        const [newName, newPassword] = ['new name', 'new password']
        const result = await supertest(web)
                .patch('/api/users/current')
                .set(constant.RequestAthorizationKey, token)
                .send({
                    name: newName,
                    password: newPassword
                })

        expect(result.status).toBe(constant.HttpStatusOk)
        expect(result.body.data.name).toBe(newName)

        const user = await getTestUser(username)
        var isValidPassword = await bcrypt.compare(newPassword, user.password)
        expect(isValidPassword).toBe(true)
    })


    it('it should can update user name', async () => {
        const [newName, newPassword] = ['new name', 'new password']
        const result = await supertest(web)
                .patch('/api/users/current')
                .set(constant.RequestAthorizationKey, token)
                .send({
                    name: newName
                })

        expect(result.status).toBe(constant.HttpStatusOk)
        expect(result.body.data.name).toBe(newName)
    })


    it('it should can update user password', async () => {
        const [newName, newPassword] = ['new name', 'new password']
        const result = await supertest(web)
                .patch('/api/users/current')
                .set(constant.RequestAthorizationKey, token)
                .send({
                    password: newPassword
                })

        expect(result.status).toBe(constant.HttpStatusOk)
        const user = await getTestUser(username)
        var isValidPassword = await bcrypt.compare(newPassword, user.password)
        expect(isValidPassword).toBe(true)
    })

    it('it should reject update user invalid request', async () => {
        const [newName, newPassword] = ['new name', 'new password']
        const result = await supertest(web)
                .patch('/api/users/current')
                .set(constant.RequestAthorizationKey, "tokensalah")
                .send({
                    password: newPassword
                })

        expect(result.status).toBe(constant.HttpStatusUnAuthorized)
    })
})

describe('DELETE /api/users/logout', function () {
    beforeEach(async () => {
        await createTestUserData({
            username: username,
            password: password,
            name: name,
            token: token
        })
    })

    afterEach(async () => {
        await removeTestUser(username)
    })


    it('should can logout', async ()=> {
        const result = await supertest(web)
                .delete('/api/users/logout')
                .set(constant.RequestAthorizationKey, token)
        
        expect(result.status).toBe(constant.HttpStatusOk)
        expect(result.body.data).toBe("ok")

        const user = await getTestUser(username)
        expect(user.token).toBeNull()
    })


    it('should reject logout invalid token', async ()=> {
        const result = await supertest(web)
                .delete('/api/users/logout')
                .set(constant.RequestAthorizationKey, "tokensalah")
        
        expect(result.status).toBe(constant.HttpStatusUnAuthorized)
    })
})