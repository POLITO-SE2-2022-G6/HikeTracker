import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export async function pointById(id: number) {
    return prisma.point.findUnique({ where: { id: id } })
}

export type newPoint = Prisma.PointCreateInput & {
    hut?: {
        description: string,
    },
    parkinglot?: {
        description: string,
    }
}

export async function createPoint(point: newPoint) {
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
                    description: point.hut.description
                }
            } : undefined,
            parkinglot: point.parkinglot ? {
                create: {
                    description: point.parkinglot.description,
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

export async function fullList(fields: newPoint) {
    return prisma.point.findMany({
        where: {
            label: fields.label && { startsWith: fields.label },
            latitude: fields.latitude && { lte: fields.latitude },
            longitude: fields.longitude && { lte: fields.longitude },
            elevation: fields.elevation && { lte: fields.elevation },
            city: fields.city && { startsWith: fields.city },
            region: fields.region && { startsWith: fields.region },
            province: fields.province && { startsWith: fields.province },
            hut: (() => {
                if (fields.hut) {
                    if (fields.hut.description) {
                        return {
                            description: fields.hut.description && { contains: fields.hut.description }
                        }
                    }
                    else {
                        return {
                            isNot: null
                        }
                    }
                }
            })(),
            parkinglot: fields.parkinglot
        },
        include: {
            hut: fields.hut ? true : undefined,
            parkinglot: fields.parkinglot ? true : undefined
        }
    })
}
