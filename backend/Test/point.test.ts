import { PrismaClient,Prisma, Point, PrismaPromise } from "@prisma/client"; 
const prisma = new PrismaClient(); 
import { pointById, createPoint, deletePoint, editPoint, fullList, newPoint} from "../DAO/pointDao"; 
import request from 'supertest' 
 
const baseURL = "http://localhost:3001/api/";
 
const pointtest: newPoint = { 
    Label : "pointtest", 
    Latitude : 10, 
    Longitude : 10, 
    Elevation : 10, 
    Hut: { 
        Description:"suda"
    } 
}  
const pointFilter={ 
    Hut: { 
        Description:"su" 
    } 
} 
 
const pointEdit  = { 
    Label : "pointedit" 
} 

 
describe("Get List of point", () => { 
    test('Check filter of points', async () => { 
        const agent = request.agent(baseURL);  
        await agent.post('auth/login').send({email: "Galeazzo_Abbrescia40@email.it", password: "Isa6"}).expect(200); 
        const response = await agent.post("point").send(pointtest).expect(200); 
 
        const idResponse = await agent.get("point").send(pointFilter).expect(200); 
        
        const prod = idResponse.body.find((p: Point) => p.Label !== "pointtest");
        const res = idResponse.body.find((p: Point) => p.id === response.body.id);
        expect (res).toMatchObject(pointtest);
         
        await prisma.point.delete({ 
            where: { 
                id: response.body.id 
            } 
        }) 
         
    }); 
}); 
 
describe("Create point", () => { 
    test('check addition of point from API', async () => { 
        const agent = request.agent(baseURL);  
        await agent.post('auth/login').send({email: "Galeazzo_Abbrescia40@email.it", password: "Isa6"}).expect(200); 
 
        const response = await agent.post("point").send(pointtest).expect(200); 
 
        const idResponse = await agent.get("point/" + response.body.id).expect(200); 
        expect (idResponse.body).toMatchObject(response.body); 
         
        await prisma.point.delete({ 
            where: { 
                id: response.body.id 
            } 
        }) 
    }); 
    test('check addition of a point from DAO', async () => { 
        const results = await fullList({});
        const firstLength = results.length; 
        const pointAdded = await createPoint(pointtest); 
        const results2 = await fullList({}); 
        const secondLength = results2.length; 
        expect (secondLength).toBe(firstLength + 1); 
        const point = await pointById(pointAdded.id); 
        expect(point).toMatchObject(pointAdded); 
 
        await prisma.point.delete({ 
            where: { 
                id: pointAdded.id 
            } 
        }) 
    });     
     
}); 
 
describe("Edit point", () => { 
    test("check edit of point's label from API", async () => { 
        const agent = request.agent(baseURL); 
        await agent.post('auth/login').send({email: "Galeazzo_Abbrescia40@email.it", password: "Isa6"}).expect(200); 
        const response = await agent.post("point").send(pointtest).expect(200); 
        const editResponse = await agent.put("point/" + response.body.id).send(pointEdit).expect(200); 
        expect (editResponse.body).toMatchObject(pointEdit); 
        await prisma.point.delete({ 
            where: { 
                id: response.body.id 
            } 
        }) 
    }); 
 
     
 
});

