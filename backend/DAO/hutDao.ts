import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function hutList() {
    return prisma.hut.findMany();
}

export async function hutByID(id:number) {
    return prisma.hut.findUnique({
        where: {id},
        include: { hikes: true }
    })
}