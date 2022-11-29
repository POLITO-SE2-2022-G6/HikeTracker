import { PrismaClient, Point  } from "@prisma/client"; 
const prisma = new PrismaClient(); 
import { pointById, createPoint, fullList, newPoint} from "../DAO/pointDao"; 
import request from 'supertest' 
 
const baseURL = "http://localhost:3001/api/";
 
const pointtest: newPoint = { 
    label : "pointtest", 
    latitude : 10, 
    longitude : 10, 
    elevation : 10, 
    hut: { 
        description:"suda"
    } 
}  

const newpointtest: newPoint = { 
    label : "pointtest", 
    latitude : 10, 
    longitude : 10, 
    elevation : 10
}  

const pointFilter={ 
    hut: true,
    hutdescription:"su" 
} 

const pointFilterEmpty={ 
    hut: true
} 

const pointEdit  = { 
    label : "pointedit" 
} 

 
describe("Get List of point", () => { 
    test('Check filter of points', async () => { 
        const agent = request.agent(baseURL);  
        await agent.post('auth/login').send({email: "Galeazzo_Abbrescia40@email.it", password: "Isa6"}).expect(200); 
        const response = await agent.post("point").send(newpointtest).expect(200); 
        const responseHut = await agent.post("point").send(pointtest).expect(200);  
        const idResponse = await agent.get("point").query(pointFilter).expect(200); 
        
        const resHut = idResponse.body.find((p: Point) => p.id === responseHut.body.id);
        const res = idResponse.body.find((p: Point) => p.id === response.body.id);

        expect(resHut).toMatchObject(pointtest);
        expect (res).toBeUndefined();
         
        prisma.point.delete({ 
            where: { 
                id: response.body.id 
            } 
        })   
    });

    test('Check filter of points with empty hut', async () => { 
        const agent = request.agent(baseURL);  
        await agent.post('auth/login').send({email: "Galeazzo_Abbrescia40@email.it", password: "Isa6"}).expect(200); 
        const response = await agent.post("point").send(newpointtest).expect(200); 
        const responseHut = await agent.post("point").send(pointtest).expect(200);  
        const idResponse = await agent.get("point").query(pointFilterEmpty).expect(200); 
        const resHut = idResponse.body.find((p: Point) => p.id === responseHut.body.id);
        const res = idResponse.body.find((p: Point) => p.id === response.body.id);

        expect(resHut).toMatchObject(pointtest);
        expect (res).toBeUndefined();
         
        prisma.point.delete({ 
            where: { 
                id: response.body.id 
            } 
        }) 
    });
    
    test('Check filter of points with no filters for hut and pl', async () => { 
        const agent = request.agent(baseURL);  
        await agent.post('auth/login').send({email: "Galeazzo_Abbrescia40@email.it", password: "Isa6"}).expect(200); 
        const response = await agent.post("point").send(newpointtest).expect(200); 
        const responseHut = await agent.post("point").send(pointtest).expect(200);  
        const idResponse = await agent.get("point").query(newpointtest).expect(200); 
        const resHut = idResponse.body.find((p: Point) => p.id === responseHut.body.id);
        const res = idResponse.body.find((p: Point) => p.id === response.body.id);
        
        expect(resHut).toMatchObject(pointtest);
        expect (res).toMatchObject(newpointtest);
         
        prisma.point.delete({ 
            where: { 
                id: response.body.id 
            } 
        });
        
        prisma.point.delete({ 
            where: { 
                id: responseHut.body.id 
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
         
        prisma.point.delete({ 
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
 
        prisma.point.delete({ 
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
        prisma.point.delete({ 
            where: { 
                id: response.body.id 
            } 
        }) 
    });  
});
