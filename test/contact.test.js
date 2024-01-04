import supertest from "supertest"
import {web} from "../src/application/web.js"
import constant from "../constant/constant.js"
import {removeTestUser, removeAllTestContacts, createTestUserData, createTestContact, getTestContact, createManyTestContact} from "./test.utils.js"

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

describe('GET /api/contacts/:contactId', function () {
    beforeEach(async () => {
        await createTestUserData({
            username: username,
            password: password,
            name: name,
            token: token
        })
        await createTestContact({
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
        })
    })

    afterEach(async () => {
        await removeAllTestContacts(username)
        await removeTestUser(username)
    })


    it('should can get contact', async () => {
        const testContact = await getTestContact(username)

        const result = await supertest(web)
            .get(`/api/contacts/${testContact.id}`)
            .set(constant.RequestAthorizationKey, token)

        expect(result.status).toBe(constant.HttpStatusOk)
        expect(result.body.data.id).toBe(testContact.id)
        expect(result.body.data.first_name).toBe(testContact.first_name)
        expect(result.body.data.last_name).toBe(testContact.last_name)
        expect(result.body.data.email).toBe(testContact.email)
        expect(result.body.data.phone).toBe(testContact.phone)
    })

    it('should return 404 if id is not found', async () => {
        const testContact = await getTestContact(username)

        testContact.id += 2;
        const result = await supertest(web)
            .get("/api/contacts/"+testContact.id)
            .set(constant.RequestAthorizationKey, token)

        expect(result.status).toBe(constant.HttpStatusNotFound)
    })
})

describe('GET /api/contacts/:contactId', function () {
    beforeEach(async () => {
        await createTestUserData({
            username: username,
            password: password,
            name: name,
            token: token
        })
        await createTestContact({
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
        })
    })

    afterEach(async () => {
        await removeAllTestContacts(username)
        await removeTestUser(username)
    })

    const [newFirstName, newLastName, newEmail, newPhone] = ["first name", "last name", "test@mail.com", "6200011100"]

    it('should can be update existing contact', async () => {
        const testContact = await getTestContact(username)

        
        const result = await supertest(web)
            .put(`/api/contacts/${testContact.id}`)
            .set(constant.RequestAthorizationKey, token)
            .send({
                first_name : newFirstName,
                last_name : newLastName,
                email : newEmail,
                phone : newPhone
            })

        expect(result.status).toBe(constant.HttpStatusOk)
        expect(result.body.data.id).toBe(testContact.id)
        expect(result.body.data.first_name).toBe(newFirstName)
        expect(result.body.data.last_name).toBe(newLastName)
        expect(result.body.data.email).toBe(newEmail)
        expect(result.body.data.phone).toBe(newPhone)
    })

    it('should reject if request is invalid', async () => {
        const testContact = await getTestContact(username)

        const result = await supertest(web)
            .put(`/api/contacts/${testContact.id}`)
            .set(constant.RequestAthorizationKey, token)
            .send({
                first_name : "",
                last_name : "",
                email : "",
                phone : ""
            })
            
        expect(result.status).toBe(constant.HttpStatusBadRequest)
    })

    it('should be rejected contact not found', async () => {
        const testContact = await getTestContact(username)

        testContact.id += 2
        const result = await supertest(web)
            .put(`/api/contacts/${testContact.id}`)
            .set(constant.RequestAthorizationKey, token)
            .send({
                first_name : newFirstName,
                last_name : newLastName,
                email : newEmail,
                phone : newPhone
            })
            
        expect(result.status).toBe(constant.HttpStatusNotFound)
    })
})

describe('DELETE /api/contacts/:contactId', function () {
    beforeEach(async () => {
        await createTestUserData({
            username: username,
            password: password,
            name: name,
            token: token
        })
        await createTestContact({
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
        })
    })

    afterEach(async () => {
        await removeAllTestContacts(username)
        await removeTestUser(username)
    })

    it('should can be delete existing contact', async () => {
        const testContact = await getTestContact(username)
        
        const result = await supertest(web)
            .delete(`/api/contacts/${testContact.id}`)
            .set(constant.RequestAthorizationKey, token)
    
        expect(result.status).toBe(constant.HttpStatusOk)
        expect(result.body.data).toBe("OK")

        const newTestContact = await getTestContact(username)
        expect(newTestContact).toBeNull()
    })

    it('should be rejected contact not found', async () => {
        const testContact = await getTestContact(username)

        testContact.id += 2
        const result = await supertest(web)
            .delete(`/api/contacts/${testContact.id}`)
            .set(constant.RequestAthorizationKey, token)

            
        expect(result.status).toBe(constant.HttpStatusNotFound)
    })
})

describe('GET /api/contacts', function () {
    beforeEach(async () => {
        await createTestUserData({
            username: username,
            password: password,
            name: name,
            token: token
        })

        await createManyTestContact({
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone
        })
    })

    afterEach(async () => {
        await removeAllTestContacts(username)
        await removeTestUser(username)
    })

    it('should can search without parameters', async () => {
        const result = await supertest(web)
                .get(`/api/contacts`)
                .set(constant.RequestAthorizationKey, token)

        expect(result.status).toBe(constant.HttpStatusOk)
        expect(result.body.data.length).toBe(10)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.total_page).toBe(2)
        expect(result.body.paging.total_item).toBe(15)
    })

    it('should can search page 2', async () => {
        const result = await supertest(web)
                .get(`/api/contacts`)
                .query({ page: 2 })
                .set(constant.RequestAthorizationKey, token)

        expect(result.status).toBe(constant.HttpStatusOk)
        expect(result.body.data.length).toBe(5)
        expect(result.body.paging.page).toBe(2)
        expect(result.body.paging.total_page).toBe(2)
        expect(result.body.paging.total_item).toBe(15)
    })

    it('should can search using name', async () => {
        const result = await supertest(web)
                .get(`/api/contacts`)
                .query({ name: `${firstName} 1` })
                .set(constant.RequestAthorizationKey, token)
        
        expect(result.status).toBe(constant.HttpStatusOk)
        expect(result.body.data.length).toBe(6)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.total_page).toBe(1)
        expect(result.body.paging.total_item).toBe(6)
    })

    it('should can search using email', async () => {
        const result = await supertest(web)
                .get(`/api/contacts`)
                .query({ email: `1jhon` })
                .set(constant.RequestAthorizationKey, token)
        
        expect(result.status).toBe(constant.HttpStatusOk)
        expect(result.body.data.length).toBe(2)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.total_page).toBe(1)
        expect(result.body.paging.total_item).toBe(6)
    })

    it('should can search using phone', async () => {
        const result = await supertest(web)
                .get(`/api/contacts`)
                .query({ phone: `${phone}1` })
                .set(constant.RequestAthorizationKey, token)
        
        expect(result.status).toBe(constant.HttpStatusOk)
        expect(result.body.data.length).toBe(6)
        expect(result.body.paging.page).toBe(1)
        expect(result.body.paging.total_page).toBe(1)
        expect(result.body.paging.total_item).toBe(6)
    })
})