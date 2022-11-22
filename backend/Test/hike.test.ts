import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { createHike, hikeById, hikesList, HikeQuery  } from "../DAO/hikeDao";

const hiketest = {
    title : "test",
    length : "10",
    expected_time : "10",
    ascent : "102",
    difficulty : "10"
    //add start and end point
}

const hikeQuery : HikeQuery = {
    difficulty : 10,
    length : 10,
    ascent : 10,
    expected_time : 10
}


describe("Create hike", () => {
    test('check addition of hike', async () => {
        const results = await hikesList({});
        const firstLength = results.length;
        const hikeAdded = await createHike(hiketest);
        const results2 = await hikesList({});
        const secondLength = results2.length;
        expect (secondLength).toBe(firstLength + 1);
        const hike = await hikeById(hikeAdded.id,{});
        expect(hike?.hike).toEqual(hikeAdded);

        await prisma.hike.delete({
            where: {
                id: hikeAdded.id
            }
        })
    });
});

