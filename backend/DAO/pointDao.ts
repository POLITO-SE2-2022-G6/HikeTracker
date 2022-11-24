import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export async function pointById(id: number) {
    return prisma.point.findUnique({ where: { id: id } })
}

export type newPoint = Prisma.PointCreateInput & {
   Hut?: {
        Description: string,
    },
    ParkingLot?: {
        Description: string,
    }
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

export async function fullList(fields: newPoint) {
    return prisma.point.findMany({
        where: {
            Label: fields.Label && { startsWith: fields.Label },
            Latitude: fields.Latitude && { lte: fields.Latitude },
            Longitude: fields.Longitude && { lte: fields.Longitude },
            Elevation: fields.Elevation && { lte: fields.Elevation },
            City: fields.City && { startsWith: fields.City },
            Region: fields.Region && { startsWith: fields.Region },
            Province: fields.Province && { startsWith: fields.Province },
            Hut: (fields.Hut)? {
                Description: fields.Hut.Description && { contains: fields.Hut.Description } || undefined
            } : undefined,
        },
        include: {
            Hut: fields.Hut ? true : undefined,
            ParkingLot: fields.ParkingLot ? true : undefined
        }
    })
}
