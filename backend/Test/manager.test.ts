import { PrismaClient, Performance, User, Prisma } from "@prisma/client";
const prisma = new PrismaClient();
import request from 'supertest'

const baseURL = "http://localhost:3001/api/";

const mng= {
    email: "manager@email.com",
    password: "Isa6"
}// is the platform manager
const usr ={
    email: "guide@email.com", 
    password: "Isa6"
}
// is a user
const guide ={
    id: 13
}
// guide to validate

describe("Validate a local guide",()=>{
    test('check validation of a local guide',async()=>{
    const agent=request.agent(baseURL);
    await agent.post('auth/login').send(mng).expect(200);
    const response= await agent.put("manager/validate/"+guide.id).expect(201)
    expect (response.body.verified).toBe(true);
    })
})