import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { createHike, hikeById, hikesList, HikeQuery  } from "../DAO/hikeDao";

const hiketest = {
    Title : "test",
    Length : "10",
    Expected_time : "10",
    Ascent : "102",
    Difficulty : "10"
    //add start and end point
}

const hikeQuery : HikeQuery = {
    difficulty : 10,
    length : 10,
    ascent : 10,
    expected_time : 10
}


describe(" hikeDao err tests", () => {
    beforeEach(async () => {
        await prisma.hike.deleteMany();
    });

    testCreateHike();
});



function testCreateHike() {
    test("create new Hike", async () => {
        let res;
        res = await createHike(hiketest); //maybe prisma.hike.create
        expect(res).toStrictEqual(hiketest);
    });
}

