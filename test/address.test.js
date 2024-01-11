import supertest from "supertest"
import { getTestContact, createTestContact, removeTestUser, removeAllTestContacts, removeAllTestAddresses, createTestUserData, createTestAddress, getTestAddress } from "./test.utils.js"
import { web } from "../src/application/web.js"
import constant from "../constant/constant.js"
import { response } from "express"

const [username, password, name, token] = ['test', 'rahasia', 'test user', 'token']
const [firstName, lastName, email, phone] = ["Jhon", "Doe", "jhon@gmail.com", "082312345678"]
const [street, city, province, country, postalCode] = ['jalan contoh test', 'kota test', 'provinsi test barat', 'wakanda', "12345"]

describe('POST /api/contacts/:contactId/addresses', function() {
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
        await removeAllTestAddresses(username)
        await removeAllTestContacts(username)
        await removeTestUser(username)
    })

    it('should can create new address', async () => {
        const testContact = await getTestContact(username)

        const result = await supertest(web)
            .post(`/api/contacts/${testContact.id}/addresses`)
            .set(constant.RequestAthorizationKey, token)
            .send({
                street: street,
                city: city,
                province: province,
                country: country,
                postal_code: postalCode
            })
        
        expect(result.status).toBe(constant.HttpStatusCreated)
        expect(result.body.data.id).toBeDefined()
        expect(result.body.data.street).toBe(street)
        expect(result.body.data.city).toBe(city)
        expect(result.body.data.province).toBe(province)
        expect(result.body.data.country).toBe(country)
        expect(result.body.data.postal_code).toBe(postalCode)
    })

    it('should rejected if create address request invalid', async () => {
        const testContact = await getTestContact(username)

        const result = await supertest(web)
            .post(`/api/contacts/${testContact.id}/addresses`)
            .set(constant.RequestAthorizationKey, token)
            .send({
                street: street,
                city: city,
                province: province,
                country: country,
                postal_code: 12345
            })
        
        expect(result.status).toBe(constant.HttpStatusBadRequest)
    })


    it('should rejected if contact not found', async () => {
        const testContact = await getTestContact(username)

        const result = await supertest(web)
            .post(`/api/contacts/${testContact.id+5}/addresses`)
            .set(constant.RequestAthorizationKey, token)
            .send({
                street: street,
                city: city,
                province: province,
                country: country,
                postal_code: 12345
            })
        
        expect(result.status).toBe(constant.HttpStatusNotFound)
    })

})

describe('GET /api/contacts/:contactId/addresses/:addressId', function() {
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

        await createTestAddress({
            username: username,
            street: street,
            city: city,
            province: province,
            country: country,
            postal_code: postalCode
        })
    })

    afterEach(async () => {
        await removeAllTestAddresses(username)
        await removeAllTestContacts(username)
        await removeTestUser(username)
    })

    it('should can get address', async() => {
        const contact = await getTestContact(username)
        const address = await getTestAddress(username)
        
        const result =  await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set(constant.RequestAthorizationKey, token);
        
        expect(result.status).toBe(constant.HttpStatusOk)
        expect(result.body.data.id).toBe(address.id)
        expect(result.body.data.street).toBe(street)
        expect(result.body.data.city).toBe(city)
        expect(result.body.data.province).toBe(province)
        expect(result.body.data.country).toBe(country)
        expect(result.body.data.postal_code).toBe(postalCode)
    })


    it('should failed get address contact not found', async() => {
        const contact = await getTestContact(username)
        const address = await getTestAddress(username)
        
        const result =  await supertest(web)
            .get(`/api/contacts/${contact.id+5}/addresses/${address.id}`)
            .set(constant.RequestAthorizationKey, token);
        
        expect(result.status).toBe(constant.HttpStatusNotFound)
        expect(result.body.errors).toBeDefined()
    })


    it('should failed get address address not found', async() => {
        const contact = await getTestContact(username)
        const address = await getTestAddress(username)
        
        const result =  await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses/${address.id+5}`)
            .set(constant.RequestAthorizationKey, token);
        
        expect(result.status).toBe(constant.HttpStatusNotFound)
        expect(result.body.errors).toBeDefined()
    })
})

describe('PUT /api/contacts/:contactId/addresses', function() {
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

        await createTestAddress({
            username: username,
            street: street,
            city: city,
            province: province,
            country: country,
            postal_code: postalCode
        })
    })

    afterEach(async () => {
        await removeAllTestAddresses(username)
        await removeAllTestContacts(username)
        await removeTestUser(username)
    })

    it('should can update address', async () => {
        const contact = await getTestContact(username)
        const address = await getTestAddress(username)

        const result = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set(constant.RequestAthorizationKey, token)
            .send({
                street: "street",
                city: "city",
                province: "province",
                country: "country",
                postal_code: "postalCode"
            })
        
        expect(result.status).toBe(constant.HttpStatusOk)
        expect(result.body.data.id).toBe(address.id)
        expect(result.body.data.street).toBe("street")
        expect(result.body.data.city).toBe("city")
        expect(result.body.data.province).toBe("province")
        expect(result.body.data.country).toBe("country")
        expect(result.body.data.postal_code).toBe("postalCode")
    })

    it('should rejected update address if request invalid', async () => {
        const contact = await getTestContact(username)
        const address = await getTestAddress(username)

        const result = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set(constant.RequestAthorizationKey, token)
            .send({
                street: street,
                city: city,
                province: province,
                country: country,
                postal_code: 12345
            })
        
        expect(result.status).toBe(constant.HttpStatusBadRequest)
        expect(result.body.errors).toBeDefined()
    })


    it('should rejected if contact not found', async () => {
        const contact = await getTestContact(username)
        const address = await getTestAddress(username)

        const result = await supertest(web)
            .put(`/api/contacts/${contact.id+5}/addresses/${address.id}`)
            .set(constant.RequestAthorizationKey, token)
            .send({
                street: street,
                city: city,
                province: province,
                country: country,
                postal_code: postalCode
            })
        
        expect(result.status).toBe(constant.HttpStatusNotFound)
        expect(result.body.errors).toBeDefined()
    })


    it('should rejected if address not found', async () => {
        const contact = await getTestContact(username)
        const address = await getTestAddress(username)

        const result = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id+5}`)
            .set(constant.RequestAthorizationKey, token)
            .send({
                street: street,
                city: city,
                province: province,
                country: country,
                postal_code: postalCode
            })
        
        expect(result.status).toBe(constant.HttpStatusNotFound)
        expect(result.body.errors).toBeDefined()
    })
})

describe('DELETE /api/contacts/:contactId/addresses/:addressId', function() {
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

        await createTestAddress({
            username: username,
            street: street,
            city: city,
            province: province,
            country: country,
            postal_code: postalCode
        })
    })

    afterEach(async () => {
        await removeAllTestAddresses(username)
        await removeAllTestContacts(username)
        await removeTestUser(username)
    })

    it('should can remove address', async () => {
        const contact = await getTestContact(username)
        const address = await getTestAddress(username)

        const result = await supertest(web)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set(constant.RequestAthorizationKey, token)

        expect(result.status).toBe(constant.HttpStatusOk)
        expect(result.body.data).toBe("OK")

        const newAddress = await getTestAddress(username)
        expect(newAddress).toBeNull()
    })

    it('should rejected if contact not found', async () => {
        const contact = await getTestContact(username)
        const address = await getTestAddress(username)

        const result = await supertest(web)
            .delete(`/api/contacts/${contact.id+5}/addresses/${address.id}`)
            .set(constant.RequestAthorizationKey, token)

        
        expect(result.status).toBe(constant.HttpStatusNotFound)
        expect(result.body.errors).toBeDefined()
    })


    it('should rejected if address not found', async () => {
        const contact = await getTestContact(username)
        const address = await getTestAddress(username)

        const result = await supertest(web)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id+5}`)
            .set(constant.RequestAthorizationKey, token)
        
        expect(result.status).toBe(constant.HttpStatusNotFound)
        expect(result.body.errors).toBeDefined()
    })
})