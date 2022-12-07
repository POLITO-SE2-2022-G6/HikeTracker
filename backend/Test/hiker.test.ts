import { PrismaClient, Performance, User } from "@prisma/client";
const prisma = new PrismaClient();
import { PerformanceQuery } from "../API/hikerApi";
import request from 'supertest'

const baseURL = "http://localhost:3001/api/";

const usr ={
    email: "Ezio_DiMauro48@hotmail.com", 
    password: "Isa6"
} //is guide not hiker

const performance: PerformanceQuery = {
    length: 100,
    duration: 50,
    altitude: 10,
    difficulty: 10
}


async function setUp() { //change the pointquery to hikequery 
    const agent = request.agent(baseURL);
    await agent.post('auth/login').send(usr).expect(200); //login as hiker to succed
    const response = await agent.post("hiker").send(performance).expect(201);
    const idResponse = await agent.get("hiker/perfomance").expect(200);
   
}



 
    

