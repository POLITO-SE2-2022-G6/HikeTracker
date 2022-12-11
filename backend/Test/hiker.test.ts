import { Performance } from "@prisma/client";
import request from 'supertest'

const baseURL = "http://localhost:3001/api/";

const usr ={
    email: "hiker@email.com", 
    password: "Isa6"
} //is guide not hiker

const performance : Partial<Performance>= {
    length: 1000,
    duration: 300,
    altitude: 10,
    difficulty: 4
}

const modifiedPerformance : Partial<Performance>= {
    length: 700,
}



describe("Create performance", () => {
    test('check addition of performance from API', async () => {
        const agent = request.agent(baseURL); 
        await agent.post('auth/login').send(usr).expect(200);
        const response = await agent.post("hiker/performance").send(performance).expect(201);
        const idResponse = await agent.get("hiker/performance").expect(200);
        expect (idResponse.body).toMatchObject(response.body);
        await agent.delete("hiker/performance").expect(204);
    });
    
});

describe("Get list of hikes by perfomance", () => {
    test('check list of hikes by perfomance from API', async () => {
        const agent = request.agent(baseURL); 
        await agent.post('auth/login').send(usr).expect(200);
        const response = await agent.post("hiker/performance").send(performance).expect(201);
        const hikes = await agent.get("hiker/hikesByPerf").expect(200);


        //expect (hikes.body.length).toBe(1);

        await agent.delete("hiker/performance").expect(204);
              
    });
    
});

describe("check edit perfomance", () => {
    test('check edit of perfomance by user', async () => {
        const agent = request.agent(baseURL); 
        await agent.post('auth/login').send(usr).expect(200);
        await agent.post("hiker/performance").send(performance).expect(201);
        const response = await agent.put("hiker/performance").send(modifiedPerformance).expect(201);
        expect (response.body).toMatchObject(modifiedPerformance);
              
        await agent.delete("hiker/performance").expect(204);
    });
    
});




 
    

