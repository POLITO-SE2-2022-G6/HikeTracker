import { PrismaClient, Performance, User, Prisma } from "@prisma/client";
const prisma = new PrismaClient();
import request from 'supertest'

const baseURL = "http://localhost:3001/api/";

const usr ={
    email: "hiker@email.com", 
    password: "Isa6"
} //is guide not hiker

const performance : Partial<Performance>= {
    length: 100,
    duration: 50,
    altitude: 10,
    difficulty: 10
}



describe("Create performance", () => {
    test('check addition of performance from API', async () => {
        const agent = request.agent(baseURL); 
        await agent.post('auth/login').send(usr).expect(200);
        const response = await agent.post("hiker/performance").send(performance).expect(201);
        const idResponse = await agent.get("hiker/performance").expect(200);
        const hikes = await agent.get("hiker/hikesByPerf");
        expect (idResponse.body).toMatchObject(response.body);
      
        
    });

    
});



 
    

