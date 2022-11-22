import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { pointById, createPoint, deletePoint, editPoint, fullList, PointQuery } from "../DAO/pointDao";
import request from 'supertest'

const baseURL = "http://localhost:3001/api/";

const pointtest = {
    Label : "pointtest",
    Latitude : 10,
    Longitude : 10,
    Elevation : 10
}

const huttest = {
    Label : "huttest",
    Latitude : 10,
    Longitude : 10,
    Elevation : 10,
    Hut : {
        Description: "huttest"
    }
}

const parkinglottest = {
    Label : "parkinglottest",
    Latitude : 10,
    Longitude : 10,
    Elevation : 10,
    ParkingLot : {
        Description: "parkinglottest"
    }
}

describe("Create point", () => {
    test("Add a new point", async() => {
        const point = await createPoint(pointtest);
        const reqPoint = await pointById(point.id);
        expect(reqPoint).toMatchObject(point);
        await deletePoint(point.id);
    })
})


