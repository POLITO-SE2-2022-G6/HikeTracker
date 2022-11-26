import { PrismaClient, Prisma } from "@prisma/client";
import request from 'supertest'
const prisma = new PrismaClient();
import { createHike, hikeById, hikesList, HikeQuery  } from "../DAO/hikeDao";

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
const hikeEdit  = {
    Difficulty : 69
}

describe("Get List of hike", () => {
    test('Check filter of hikes', async () => {
        const agent = request.agent(baseURL); 
        await agent.post('auth/login').send({email: "Galeazzo_Abbrescia40@email.it", password: "Isa6"}).expect(200);
        const response = await agent.post("hike").send(hiketest).expect(201);

        const idResponse = await agent.get("hike").send(hikeFilter).expect(200);
        expect (idResponse.body).toContainEqual(response.body);
        
        prisma.hike.delete({
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
        
        prisma.hike.delete({
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
        const hike = await hikeById(hikeAdded.id);
        expect(hike).toMatchObject(hikeAdded);

        prisma.hike.delete({
            where: {
                id: hikeAdded.id
            }
        })
    });    
});

describe("Edit Hike", () => {
    test("check edit of hike's difficulty from API", async () => {
        const agent = request.agent(baseURL);
        await agent.post('auth/login').send({email: "Galeazzo_Abbrescia40@email.it", password: "Isa6"}).expect(200);
        const response = await agent.post("hike").send(hiketest).expect(201);
        const editResponse = await agent.put("hike/" + response.body.id).send(hikeEdit).expect(201);
        expect (editResponse.body).toMatchObject(hikeEdit);
        prisma.hike.delete({
            where: {
                id: response.body.id
            }
        })
    });

    test("Check additions of points", async () => {
        const agent = request.agent(baseURL);
        await agent.post('auth/login').send({email: "Galeazzo_Abbrescia40@email.it", password: "Isa6"}).expect(200);
        const response = await agent.post("hike").send(hiketest).expect(201);
        const stPoint = await agent.post("point").send({Label: "starttest", Latitude: 10, Longitude: 10, Elevation: 10}).expect(200);
        const enPoint = await agent.post("point").send({Label: "endtest", Latitude: 10, Longitude: 10, Elevation: 10}).expect(200);
        const editHike = {
            StartPointId: stPoint.body.id,
            EndPointId: enPoint.body.id,
            Reference_points: {
                created: [stPoint.body, enPoint.body],
                deleted: [],
            }
        };
        const editHike4Check = {
            StartPointId: stPoint.body.id,
            EndPointId: enPoint.body.id,
            Reference_points: [stPoint.body, enPoint.body],
        };
        const editResponse = await agent.put("hike/" + response.body.id).send(editHike).expect(201);
        expect (editResponse.body).toMatchObject(editHike4Check);
        prisma.hike.delete({
            where: {
                id: response.body.id
            }
        })
        prisma.point.delete({
            where: {
                id: stPoint.body.id
            }
        })
        prisma.point.delete({
            where: {
                id: enPoint.body.id
            }
        })
    })

});
