import { PrismaClient, Prisma } from "@prisma/client";
import request from 'supertest'
const prisma = new PrismaClient();
import { createHike, hikeById, hikesList, HikeQuery  } from "../DAO/hikeDao";
import * as expr from '../index'

const baseURL = "http://localhost:3001/api/";
const baseLoginURL = "http://localhost:3001/api/auth";

const hiketest : Prisma.HikeCreateInput = {
    Title : "test",
    Length : 10,
    Expected_time : 10,
    Ascent : 102,
    Difficulty : 10
    //add start and end point
}

const hikeFilter = {
    Length: 11
}
const hikeQuery : HikeQuery = {
    difficulty : 10,
    length : 10,
    ascent : 10,
    expected_time : 10
}

describe("Get List of hike", () => {
    test('Check filter of hikes', async () => {
        const agent = request.agent(baseURL); 
        await agent.post('auth/login').send({email: "Galeazzo_Abbrescia40@email.it", password: "Isa6"}).expect(200);
        const response = await agent.post("hike").send(hiketest).expect(201);

        const idResponse = await agent.get("hike").send(hikeFilter).expect(200);
        expect (idResponse.body).toMatchObject(response.body);
        
        await prisma.hike.delete({
            where: {
                id: response.body.id
            }
        })
        
    });
});

describe("Create hike", () => {
    test('check addition of hike from API', async () => {
        const agent = request.agent(baseURL); 
        await agent.post('auth/login').send({email: "Galeazzo_Abbrescia40@email.it", password: "Isa6"}).expect(200);
        const response = await agent.post("hike").send(hiketest).expect(201);

        const idResponse = await agent.get("hike/" + response.body.id).expect(200);
        expect (idResponse.body).toMatchObject(response.body);
        
        await prisma.hike.delete({
            where: {
                id: response.body.id
            }
        })
    });

    test('check addition of hike from DAO', async () => {
        const results = await hikesList({});
        const firstLength = results.length;
        const hikeAdded = await createHike(hiketest);
        const results2 = await hikesList({});
        const secondLength = results2.length;
        expect (secondLength).toBe(firstLength + 1);
        const hike = await hikeById(hikeAdded.id);  // returns hike and points
        expect(hike).toMatchObject(hikeAdded);

        await prisma.hike.delete({
            where: {
                id: hikeAdded.id
            }
        })
    });    
});

