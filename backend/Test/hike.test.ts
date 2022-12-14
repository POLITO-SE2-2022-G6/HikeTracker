import { Prisma } from "@prisma/client";
import request from 'supertest'
import { createHike, deleteHike, hikeById, hikesList  } from "../DAO/hikeDao";

const baseURL = "http://localhost:3001/api/";

const usr ={
    email: "guide@email.com", 
    password: "Isa6"
}

const hiketest : Prisma.HikeCreateInput = {
    title : "test",
    length : 10,
    expected_time : 10,
    ascent : 102,
    difficulty : 10
    //add start and end point
}

const hikeFilter = {
    length: 11
}
const hikeEdit  = {
    difficulty : 69
}

describe("Get List of hike", () => {
    test('Check filter of hikes', async () => {
        const agent = request.agent(baseURL); 
        await agent.post('auth/login').send(usr).expect(200);
        const response = await agent.post("hike").send(hiketest).expect(201);

        const idResponse = await agent.get("hike").send(hikeFilter).expect(200);
        expect (idResponse.body).toContainEqual(response.body);
        
        await agent.delete("hike/" + response.body.id).expect(204);        
    });
});

describe("Create hike", () => {
    test('check addition of hike from API', async () => {
        const agent = request.agent(baseURL); 
        await agent.post('auth/login').send(usr).expect(200);
        const response = await agent.post("hike").send(hiketest).expect(201);

        const idResponse = await agent.get("hike/" + response.body.id).expect(200);
        expect (idResponse.body).toMatchObject(response.body);
        
        await agent.delete("hike/" + response.body.id).expect(204);
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
        
        await deleteHike(hikeAdded.id);
    });    
});

describe("Edit Hike", () => {
    test("check edit of hike's difficulty from API", async () => {
        const agent = request.agent(baseURL);
        await agent.post('auth/login').send(usr).expect(200);
        const response = await agent.post("hike").send(hiketest).expect(201);
        const editResponse = await agent.put("hike/" + response.body.id).send(hikeEdit).expect(201);
        expect (editResponse.body).toMatchObject(hikeEdit);
        await agent.delete("hike/" + response.body.id).expect(204);
    });

    test("Check additions of points", async () => {
        const agent = request.agent(baseURL);
        await agent.post('auth/login').send(usr).expect(200);
        const response = await agent.post("hike").send(hiketest).expect(201);
        const stPoint = await agent.post("point").send({label: "starttest", latitude: 10, longitude: 10, elevation: 10}).expect(200);
        const enPoint = await agent.post("point").send({label: "endtest", latitude: 10, longitude: 10, elevation: 10}).expect(200);
        const editHike = {
            startpointid: stPoint.body.id,
            endpointid: enPoint.body.id,
            reference_points: {
                created: [stPoint.body, enPoint.body],
                deleted: [],
            }
        };
        const editHike4Check = {
            startpointid: stPoint.body.id,
            endpointid: enPoint.body.id,
            reference_points: [stPoint.body, enPoint.body],
        };
        const editResponse = await agent.put("hike/" + response.body.id).send(editHike).expect(201);
        expect (editResponse.body).toMatchObject(editHike4Check);

        await agent.delete("hike/" + response.body.id).expect(204);
        await agent.delete("point/" + stPoint.body.id).expect(204);
        await agent.delete("point/" + enPoint.body.id).expect(204);
    })

});
