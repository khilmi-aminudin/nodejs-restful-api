import supertest from "supertest"
import {web} from "../src/application/web.js"
import constant from "../constant/constant.js"
import {removeTestUser, removeAllTestContacts, createTestUserData} from "./test.utils.js"

const [username, password, name, token] = ['test', 'rahasia', 'test user', 'token']
const [firstName, lastName, email, phone] = ["Jhon", "Doe", "jhon@gmail.com", "082312345678"]

describe('POST /api/contacts', function () {
    beforeEach(async () => {
        await createTestUserData({
            username: username,
            password: password,
            name: name,
            token: token
        })
    })

    afterEach(async () => {
        await removeAllTestContacts(username)
        await removeTestUser(username)
    })

    it('should can create contacts', async () => {
        const result = await supertest(web).post("/api/contacts")
            .set(constant.RequestAthorizationKey, token)
            .send({
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: phone
            })
        
        expect(result.status).toBe(constant.HttpStatusCreated)
        expect(result.body.data.first_name).toBe(firstName)
        expect(result.body.data.last_name).toBe(lastName)
        expect(result.body.data.email).toBe(email)
        expect(result.body.data.phone).toBe(phone)
    })

    it('should reject if request not valid', async () => {
        const result = await supertest(web).post("/api/contacts")
            .set(constant.RequestAthorizationKey, token)
            .send({
                first_name: '',
                last_name: 'lastName',
                email: email,
                phone: "0909798786876876887979788"
            })
        
        expect(result.status).toBe(constant.HttpStatusBadRequest)
        expect(result.body.errors).toBeDefined()
    })

})