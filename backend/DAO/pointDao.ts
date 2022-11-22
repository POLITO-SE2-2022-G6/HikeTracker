import { Point, PrismaClient, Prisma } from '@prisma/client'

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

type newPoint = Prisma.PointCreateInput & {
    Hut?: {
        Description: string,
        PointId: number
    },
    ParkingLot?: {
        Description: string,
        PointId: number
    },
}

export async function createPoint(point: newPoint) {
    return prisma.point.create({
        data: {
            Label: point.Label || undefined,
            Latitude: point.Latitude,
            Longitude: point.Longitude,
            Elevation: point.Elevation,
            City: point.City,
            Region: point.Region,
            Province: point.Province,
            Hut: point.Hut ? {
                create: {
                    Description: point.Hut.Description
                }
            } : undefined,
            ParkingLot: point.ParkingLot ? {
                create: {
                    Description: point.ParkingLot.Description,
                }
            } : undefined
        }
    })
}

export async function deletePoint(id: number) {
    return prisma.point.delete({ where: { id: id } })
}

//here should not be create
export async function editPoint(id: number, point: newPoint) {
    return prisma.point.update({
        where: { id: id }, data: {
            Label: point.Label || undefined,
            Latitude: point.Latitude || undefined,
            Longitude: point.Longitude || undefined,
            Elevation: point.Elevation || undefined,
            City: point.City || undefined,
            Region: point.Region || undefined,
            Province: point.Province || undefined,
            Hut: point.Hut ? {
                update: {
                    Description: point.Hut.Description
                }
            } : undefined,
            ParkingLot: point.ParkingLot ? {
                update: {
                    Description: point.ParkingLot.Description
                }
            } : undefined
        }
    })
}

export async function fullList(fields: PointQuery) {
    return prisma.point.findMany({
        where: {
            OR: [
                {
                    Hut: fields.hut ? {
                        isNot: null
                    } : undefined
                },
                {
                    ParkingLot: fields.parking_lot ? {
                        isNot: null
                    } : undefined
                }
            ],
            Label: fields.label && { startsWith: fields.label },
            Latitude: fields.latitude && { lt: fields.latitude },
            Longitude: fields.longitude && { lt: fields.longitude },
            Elevation: fields.elevation && { lt: fields.elevation },
            City: fields.city && { startsWith: fields.city },
            Region: fields.region && { startsWith: fields.region },
            Province: fields.province && { startsWith: fields.province },
            Hut: {
                Description: fields.description && { contains: fields.description }
            }
        }
    })
}
