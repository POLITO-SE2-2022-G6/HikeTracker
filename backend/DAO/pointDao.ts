import { Point, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type PointQuery = {
    label?: string,
    latitude?: number,
    longitude?: number,
    elevation?: number,
    city?: string,
    region?: string,
    province?: string,
    description?: string,
    hut?: boolean,
    parking_lot?: boolean
}

export async function pointById(id: number) {
    return prisma.point.findUnique({ where: { id: id } })
}

export async function createPoint(point: Point) {
    return prisma.point.create({ data: point })
}

export async function deletePoint(id: number) {
    return prisma.point.delete({ where: { id: id } })
}

export async function editPoint(id: number, point: Point) {
    return prisma.point.update({ where: { id: id }, data: point })
}

export async function fullList(fields: PointQuery) {
    return prisma.point.findMany({
        where: {
                    /*Label: fields.label && { startsWith: fields.label },
                    Latitude: fields.latitude && { lt: fields.latitude },
                    Longitude: fields.longitude && { lt: fields.longitude },
                    Elevation: fields.elevation && { lt: fields.elevation },
                    City: fields.city && { startsWith: fields.city },
                    Region: fields.region && { startsWith: fields.region },
                    Province: fields.province && { startsWith: fields.province },*/
                    //Description: fields.description && { startsWith: fields.description },
                    /*HutId: fields.hut ? fields.hut : false,
                    Parking_lot: fields.parking_lot*/
                }
    })
}