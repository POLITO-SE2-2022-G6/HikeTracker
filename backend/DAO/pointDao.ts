import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export async function pointById(id: number) {
    return prisma.point.findUnique({ where: { id: id } })
}

export type newPoint = Prisma.PointCreateInput & {
    hut?: {
        description: string,
        altitude: number,
        beds: number,
        phone: string,
        email: string,
        website: string, 
        image?: string  
    },
    parkinglot?: {
        description: string,
        capacity: number,
    }
}

export async function createPoint(point: newPoint) {
    console.log(point)
    return prisma.point.create({
        data: {
            label: point.label || undefined,
            latitude: point.latitude,
            longitude: point.longitude,
            elevation: point.elevation,
            city: point.city,
            region: point.region,
            province: point.province,
            hut: point.hut ? {
                create: {
                    name: point.label,
                    description: point.hut.description,
                    altitude: point.hut.altitude,
                    beds: point.hut.beds,
                    phone: point.hut.phone,
                    email: point.hut.email,
                    website: point.hut.website,
                    image: point.hut.image
                }
            } : undefined,
            parkinglot: point.parkinglot ? {
                create: {
                    description: point.parkinglot.description,
                    capacity: point.parkinglot.capacity,
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
            label: point.label || undefined,
            latitude: point.latitude || undefined,
            longitude: point.longitude || undefined,
            elevation: point.elevation || undefined,
            city: point.city || undefined,
            region: point.region || undefined,
            province: point.province || undefined,
            hut: point.hut ? {
                update: {
                    description: point.hut.description
                }
            } : undefined,
            parkinglot: point.parkinglot ? {
                update: {
                    description: point.parkinglot.description
                }
            } : undefined
        }
    })
}

export type pointQuery = Prisma.PointCreateInput & { hut?: boolean, parkinglot?: boolean, hutdescription?: string, parkinglotdescription?: string, hutphone?: string, hutbeds?: number, hutemail?: string, hutaltitude?: number, hutwebsite?: string };
export async function fullList(fields: pointQuery) {
    return prisma.point.findMany({
        where: {
            label: fields.label && { startsWith: fields.label },
            latitude: fields.latitude && { lte: fields.latitude },
            longitude: fields.longitude && { lte: fields.longitude },
            elevation: fields.elevation && { lte: fields.elevation },
            city: fields.city && { startsWith: fields.city },
            region: fields.region && { startsWith: fields.region },
            province: fields.province && { startsWith: fields.province },
            hut: fields.hut && { 
                description: { contains: fields.hutdescription },
                phone: { contains: fields.hutphone },
                beds: { lte: fields.hutbeds },
                email: { contains: fields.hutemail },
                altitude: { lte: fields.hutaltitude },
                website: { contains: fields.hutwebsite }
         },
            parkinglot: fields.parkinglot && { description: { contains: fields.parkinglotdescription } }
        },
        include: {
            hut: (fields.hut || !(fields.parkinglot)) ? true : false,
            parkinglot: (fields.parkinglot || !(fields.hut)) ? true : false
        }
    })
}
